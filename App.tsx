import React, { useMemo } from "react";
import { Header } from "./src/components/Header";
import { Dashboard } from "./src/components/dashboard/Dashboard";
import { BlockList } from "./src/components/BlockList";
import { Modal } from "./src/components/Modal";
import { BlockForm } from "./src/components/BlockForm";
import { BlockDetails } from "./src/components/BlockDetails";
import useBlocks from "./src/components/dashboard/hooks/useBlocks";
import { Tag } from "./types";

const App: React.FC = () => {
  const {
    blocks,
    handleCloseDetailsModal,
    handleDeleteBlock,
    handleOpenModal,
    handleResolveBlock,
    handleSaveBlock,
    handleViewBlockDetails,
    isModalOpen,
    viewingBlock,
    editingBlock,
    handleCloseModal,
    setBlocks,
    handleEditBlock,
  } = useBlocks();

  const allUniqueTags = useMemo(() => {
    const tagSet = new Set<Tag>();
    blocks.forEach((block) => {
      (block.tags || []).forEach((tag) => tagSet.add(tag));
    });
    return Array.from(tagSet).sort();
  }, [blocks]);

  return (
    <div className="min-h-screen bg-slate-900 font-sans">
      <Header onLogNewBlock={handleOpenModal} />
      <main className="container mx-auto p-4 md:p-8">
        <Dashboard
          blocks={blocks}
          onViewBlockDetails={handleViewBlockDetails}
          onImport={setBlocks}
        />
        <BlockList
          blocks={blocks}
          onResolve={handleResolveBlock}
          onDelete={handleDeleteBlock}
          onEdit={handleEditBlock}
          allUniqueTags={allUniqueTags}
        />
      </main>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <BlockForm
          onSave={handleSaveBlock}
          onClose={handleCloseModal}
          existingBlock={editingBlock}
          allTags={allUniqueTags}
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
