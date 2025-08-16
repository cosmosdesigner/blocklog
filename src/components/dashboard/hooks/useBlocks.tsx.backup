import { Block, Tag } from "@/types";
import { useCallback, useMemo, useState } from "react";
import { useLocalStorage } from "../../../hooks/useLocalStorage";
import { calculateDuration } from "@/src/lib/utils";

export default function useBlocks() {
  const [blocks, setBlocks] = useLocalStorage<Block[]>("blocks", []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlock, setEditingBlock] = useState<Block | null>(null);
  const [viewingBlock, setViewingBlock] = useState<Block | null>(null);

  const handleOpenModal = useCallback(() => {
    setEditingBlock(null);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingBlock(null);
  }, []);

  const handleSaveBlock = useCallback(
    (blockData: Omit<Block, "id" | "resolved">) => {
      if (editingBlock) {
        setBlocks((prev) =>
          prev.map((b) =>
            b.id === editingBlock.id ? { ...editingBlock, ...blockData } : b
          )
        );
      } else {
        const newBlock: Block = {
          id: Date.now().toString(),
          ...blockData,
          resolved: "",
        };
        setBlocks((prev) => [newBlock, ...prev]);
      }
      handleCloseModal();
    },
    [editingBlock, setBlocks, handleCloseModal]
  );

  const handleResolveBlock = useCallback(
    (id: string) => {
      setBlocks((prev) =>
        prev.map((b) =>
          b.id === id
            ? {
                ...b,
                resolved: new Date().toISOString(),
                endDate: new Date().toISOString(),
              }
            : b
        )
      );
    },
    [setBlocks]
  );

  const handleDeleteBlock = useCallback(
    (id: string) => {
      setBlocks((prev) => prev.filter((b) => b.id !== id));
    },
    [setBlocks]
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
    setBlocks,
    handleOpenModal,
    handleCloseModal,
    handleSaveBlock,
    handleResolveBlock,
    handleDeleteBlock,
    handleViewBlockDetails,
    handleCloseDetailsModal,
    handleEditBlock,
    stats,
    allUniqueTags,
  };
}
