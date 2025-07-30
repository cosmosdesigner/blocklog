import { rootRoute } from "@/Routes";
import { createRoute } from "@tanstack/react-router";

export const dataRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/data",
  component: function DataView() {
    return (
      <div className="text-center py-20 bg-slate-800 rounded-lg border border-slate-700">
        <h2 className="text-3xl font-bold text-white mb-4">Data Management</h2>
        <p className="text-slate-400">This feature is coming soon.</p>
      </div>
    );
  },
});
