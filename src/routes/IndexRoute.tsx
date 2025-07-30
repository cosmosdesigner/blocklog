import { createRoute } from "@tanstack/react-router";
import { StatCard } from "../components/dashboard/components/StatCard";
import { BlockList } from "../components/BlockList";
import { rootRoute, useAppContext } from "@/Routes";

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: function BlocksView() {
    const {
      stats,
      blocks,
      handleResolveBlock,
      handleDeleteBlock,
      allUniqueTags,
      handleEditBlock,
    } = useAppContext();
    return (
      <>
        <section className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-6">Overview</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard title="Total Blocks" value={stats.totalBlocks} />
            <StatCard title="Ongoing Blocks" value={stats.ongoingBlocks} />
            <StatCard
              title="Total Time Blocked"
              value={`${stats.totalBlockedHours}h`}
            />
            <StatCard title="Longest Block" value={`${stats.longestBlock}h`} />
          </div>
        </section>
        <BlockList
          blocks={blocks}
          onResolve={handleResolveBlock}
          onDelete={handleDeleteBlock}
          onEdit={handleEditBlock}
          allUniqueTags={allUniqueTags}
        />
      </>
    );
  },
});
