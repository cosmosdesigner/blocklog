import React, { useState, useCallback } from "react";
import { Header } from "./components/Header";
import { Dashboard } from "./components/Dashboard";
import { BlockList } from "./components/BlockList";
import { Modal } from "./components/Modal";
import { BlockForm } from "./components/BlockForm";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { Block, BlockStatus } from "./types";
import { BlockDetails } from "./components/BlockDetails";

const App: React.FC = () => {
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
    (blockData: Omit<Block, "id" | "status">) => {
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
          status: BlockStatus.ONGOING,
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
                status: BlockStatus.RESOLVED,
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

  const handleViewBlockDetails = useCallback((block: Block | null) => {
    setViewingBlock(block);
  }, []);

  const handleCloseDetailsModal = useCallback(() => {
    setViewingBlock(null);
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 font-sans">
      <Header onLogNewBlock={handleOpenModal} />
      <main className="container mx-auto p-4 md:p-8">
        <Dashboard
          blocks={blocks}
          onViewBlockDetails={handleViewBlockDetails}
        />
        <BlockList
          blocks={blocks}
          onResolve={handleResolveBlock}
          onDelete={handleDeleteBlock}
        />
      </main>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <BlockForm
          onSave={handleSaveBlock}
          onClose={handleCloseModal}
          existingBlock={editingBlock}
        />
      </Modal>

      <Modal isOpen={!!viewingBlock} onClose={handleCloseDetailsModal}>
        {viewingBlock && (
          <BlockDetails
            block={viewingBlock}
            onClose={handleCloseDetailsModal}
          />
        )}
      </Modal>
    </div>
  );
};

export default App;
