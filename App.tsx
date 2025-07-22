import React from "react";
import { Header } from "./components/Header";
import { Dashboard } from "./components/Dashboard";
import { BlockList } from "./components/BlockList";
import { Modal } from "./components/Modal";
import { BlockForm } from "./components/BlockForm";
import { BlockDetails } from "./components/BlockDetails";
import useBlocks from "./hooks/useBlocks";

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
  } = useBlocks();

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
