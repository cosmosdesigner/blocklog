import { Block } from "@/types";
import { useCallback, useState } from "react";
import { useLocalStorage } from "./useLocalStorage";

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
          resolved: '',
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
    handleEditBlock
  };
}
