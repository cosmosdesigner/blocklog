import { rootRoute, useAppContext } from "@/Routes";
import { createRoute } from "@tanstack/react-router";
import { Dashboard } from "../components/dashboard/Dashboard";

export const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: function DashboardView() {
    const { blocks, handleViewBlockDetails, setBlocks } = useAppContext();
    return (
      <>
        <h2 className="text-3xl font-bold text-white mb-6">
          Analytics Dashboard
        </h2>
        <Dashboard
          blocks={blocks}
          onViewBlockDetails={handleViewBlockDetails}
          onImport={setBlocks}
        />
      </>
    );
  },
});
