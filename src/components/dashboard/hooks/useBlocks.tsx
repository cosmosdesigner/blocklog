import { Block, Tag } from "@/types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { blocksAPI, tagsAPI, getToken } from "../../../services/api";
import { mapBackendBlockToFrontend, mapBackendTagToFrontend, prepareBlockForAPI, BackendTag } from "../../../services/dataMapping";
import { calculateDuration } from "@/src/lib/utils";

export default function useBlocks() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [backendTags, setBackendTags] = useState<BackendTag[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<Block | null>(null);
  const [viewingBlock, setViewingBlock] = useState<Block | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status
  useEffect(() => {
    const token = getToken();
    setIsAuthenticated(!!token);
  }, []);

  // Load data from API
  const loadData = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      
      // Load blocks and tags in parallel
      const [blocksResponse, tagsResponse] = await Promise.all([
        blocksAPI.getAll(),
        tagsAPI.getAll()
      ]);
      
      // Map backend data to frontend format
      const mappedBlocks = blocksResponse.data.map(mapBackendBlockToFrontend);
      const mappedTags = tagsResponse;
      
      setBlocks(mappedBlocks);
      setBackendTags(mappedTags);
    } catch (error) {
      console.error('Failed to load data:', error);
      // If unauthorized, clear auth state
      if (error.message === 'Unauthorized') {
        setIsAuthenticated(false);
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated, loadData]);

  const handleOpenModal = useCallback(() => {
    setEditingBlock(null);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingBlock(null);
  }, []);

  const handleSaveBlock = useCallback(
    async (blockData: Omit<Block, "id" | "resolved">) => {
      try {
        if (editingBlock) {
          // Update existing block
          const preparedData = prepareBlockForAPI(blockData, backendTags);
          await blocksAPI.update(editingBlock.id, preparedData);
        } else {
          // Create new block
          const preparedData = prepareBlockForAPI(blockData, backendTags);
          await blocksAPI.create(preparedData);
        }
        
        // Reload data to get updated list
        await loadData();
        handleCloseModal();
      } catch (error) {
        console.error('Failed to save block:', error);
        // Handle error - could show toast notification
      }
    },
    [editingBlock, backendTags, loadData, handleCloseModal]
  );

  const handleResolveBlock = useCallback(
    async (id: string) => {
      try {
        await blocksAPI.resolve(id);
        // Update local state immediately for better UX
        setBlocks((prev) =>
          prev.map((b) =>
            b.id === id
              ? {
                  ...b,
                  resolved: new Date().toISOString(),
                }
              : b
          )
        );
      } catch (error) {
        console.error('Failed to resolve block:', error);
        // Reload data to sync with server
        loadData();
      }
    },
    [loadData]
  );

  const handleDeleteBlock = useCallback(
    async (id: string) => {
      try {
        await blocksAPI.delete(id);
        // Update local state immediately
        setBlocks((prev) => prev.filter((b) => b.id !== id));
      } catch (error) {
        console.error('Failed to delete block:', error);
        // Reload data to sync with server
        loadData();
      }
    },
    [loadData]
  );

  const handleEditBlock = useCallback((block: Block) => {
    setEditingBlock(block);
    setIsModalOpen(true);
  }, []);

  const handleViewBlockDetails = useCallback((block: Block | null) => {
    setViewingBlock(block);
  }, []);

  const handleCloseDetailsModal = useCallback(() => {
    setViewingBlock(null);
  }, []);

  const handleLogin = useCallback(() => {
    setIsAuthenticated(true);
  }, []);

  const stats = useMemo(() => {
    const totalBlockedHours = blocks.reduce(
      (acc, block) =>
        acc + calculateDuration(block.created, block.resolved).totalHours,
      0
    );
    const longestBlock = blocks.reduce(
      (max, block) =>
        Math.max(
          max,
          calculateDuration(block.created, block.resolved).totalHours
        ),
      0
    );
    return {
      totalBlocks: blocks.length,
      ongoingBlocks: blocks.filter((b) => !b.resolved).length,
      totalBlockedHours: Math.round(totalBlockedHours),
      longestBlock: Math.round(longestBlock),
    };
  }, [blocks]);

  const allUniqueTags = useMemo(() => {
    const tagSet = new Set<Tag>();
    blocks.forEach((block) => {
      (block.tags || []).forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [blocks]);

  return {
    blocks,
    isModalOpen,
    viewingBlock,
    editingBlock,
    loading,
    isAuthenticated,
    setBlocks,
    handleOpenModal,
    handleCloseModal,
    handleSaveBlock,
    handleResolveBlock,
    handleDeleteBlock,
    handleViewBlockDetails,
    handleCloseDetailsModal,
    handleEditBlock,
    handleLogin,
    stats,
    allUniqueTags,
  };
}
