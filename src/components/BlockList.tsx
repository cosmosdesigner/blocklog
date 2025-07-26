import React, { useMemo, useState } from "react";
import { Block, BlockStatus, Tag } from "../../types";
import { BlockCard } from "./BlockCard";
import { calculateDuration } from "../lib/utils";
import { FilterControls } from "./FilterControls";

interface BlockListProps {
  blocks: Block[];
  onResolve: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (block: Block) => void;
  allUniqueTags: Tag[];
}

export const BlockList: React.FC<BlockListProps> = ({
  blocks,
  onResolve,
  onDelete,
  onEdit,
  allUniqueTags,
}) => {
  const [filterStatus, setFilterStatus] = useState<BlockStatus | "all">("all");
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [sortBy, setSortBy] = useState("startDate-desc");

  const displayedBlocks = useMemo(() => {
    let result = [...blocks];

    // 1. Filter by status
    if (filterStatus !== "all") {
      result = result.filter((b) => {
        const sts = !b.resolved ? BlockStatus.ONGOING : BlockStatus.RESOLVED;
        return sts === filterStatus;
      });
    }

    // 2. Filter by tags
    if (selectedTags.length > 0) {
      result = result.filter((b) =>
        selectedTags.every((tag) => (b.tags || []).includes(tag))
      );
    }

    // 3. Sort
    result.sort((a, b) => {
      const [key, direction] = sortBy.split("-");
      const dir = direction === "asc" ? 1 : -1;

      switch (key) {
        case "startDate": {
          const valA = new Date(a.created).getTime();
          const valB = new Date(b.created).getTime();
          return (valA - valB) * dir;
        }
        case "title": {
          return a.title.localeCompare(b.title) * dir;
        }
        case "duration": {
          const valA = calculateDuration(a.created, a.resolved).totalMinutes;
          const valB = calculateDuration(b.created, b.resolved).totalMinutes;
          return (valA - valB) * dir;
        }
        default:
          return 0;
      }
    });

    return result;
  }, [blocks, filterStatus, selectedTags, sortBy]);

  const clearFilters = () => {
    setFilterStatus("all");
    setSelectedTags([]);
  };

  const hasActiveFilters = filterStatus !== "all" || selectedTags.length > 0;

  return (
    <section>
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold text-white whitespace-nowrap">
          Block History
        </h2>
        <FilterControls
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          allTags={allUniqueTags}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onClearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </div>
      {displayedBlocks.length === 0 ? (
        <div className="text-center py-10 bg-slate-800 rounded-lg border border-slate-700">
          <p className="text-slate-400">
            No blocks logged yet. Click "Log New Block" to get started!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayedBlocks.map((block) => (
            <BlockCard
              key={block.id}
              block={block}
              onResolve={onResolve}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </div>
      )}
    </section>
  );
};
