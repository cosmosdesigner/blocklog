import { Header } from "./Header";
import { Outlet, useNavigate } from "@tanstack/react-router";
import { Modal } from "./Modal";
import { BlockForm } from "./BlockForm";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { AppContext, rootRoute, useAppContext } from "@/Routes";
import useBlocks from "./dashboard/hooks/useBlocks";
import { AppContextType } from "@/types";
import { LoginForm } from "./auth/LoginForm";

const RootComponent = () => {
  const navigate = useNavigate();
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
    stats,
    allUniqueTags,
    loading,
    isAuthenticated,
    handleLogin,
  } = useBlocks();

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <LoginForm 
        onSuccess={handleLogin}
        onSwitchToRegister={() => navigate({ to: "/register" })}
      />
    );
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  const appContextValue: AppContextType = {
    blocks,
    allUniqueTags,
    stats,
    isModalOpen,
    editingBlock,
    handleOpenModal,
    handleCloseModal,
    handleSaveBlock,
    handleResolveBlock,
    handleDeleteBlock,
    viewingBlock,
    setBlocks,
    handleEditBlock,
    handleCloseDetailsModal,
    handleViewBlockDetails,
  };
  
  return (
    <AppContext.Provider value={appContextValue}>
      <div className="min-h-screen bg-slate-900 font-sans">
        <Header onLogNewBlock={handleOpenModal} />
        <main className="container mx-auto p-4 md:p-8">
          <Outlet />
        </main>
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <BlockForm
            onSave={handleSaveBlock}
            onClose={handleCloseModal}
            existingBlock={editingBlock}
            allTags={allUniqueTags}
          />
        </Modal>
        <TanStackRouterDevtools />
      </div>
    </AppContext.Provider>
  );
};

export default RootComponent;
