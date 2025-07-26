import React, { useState, useRef } from "react";

import { Button } from "./Button";
import { useOnClickOutside } from "../hooks/UseOnClickOutside";
import { BlockStatus, Tag } from "@/types";

const ChevronDownIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
      clipRule="evenodd"
    />
  </svg>
);

const FilterIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
  </svg>
);

const XCircleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="15" y1="9" x2="9" y2="15"></line>
    <line x1="9" y1="9" x2="15" y2="15"></line>
  </svg>
);

const sortOptions = [
  { value: "startDate-desc", label: "Start Date (Newest)" },
  { value: "startDate-asc", label: "Start Date (Oldest)" },
  { value: "duration-desc", label: "Duration (Longest)" },
  { value: "duration-asc", label: "Duration (Shortest)" },
  { value: "title-asc", label: "Title (A-Z)" },
  { value: "title-desc", label: "Title (Z-A)" },
];

const statusOptions = [
  { value: "all", label: "All Statuses" },
  { value: BlockStatus.ONGOING, label: "Ongoing" },
  { value: BlockStatus.RESOLVED, label: "Resolved" },
];

interface FilterControlsProps {
  filterStatus: BlockStatus | "all";
  setFilterStatus: (status: BlockStatus | "all") => void;
  selectedTags: Tag[];
  setSelectedTags: (tags: Tag[]) => void;
  allTags: Tag[];
  sortBy: string;
  setSortBy: (sort: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export const FilterControls: React.FC<FilterControlsProps> = ({
  filterStatus,
  setFilterStatus,
  selectedTags,
  setSelectedTags,
  allTags,
  sortBy,
  setSortBy,
  onClearFilters,
  hasActiveFilters,
}) => {
  const [isSortOpen, setSortOpen] = useState(false);
  const [isStatusOpen, setStatusOpen] = useState(false);
  const [isTagsOpen, setTagsOpen] = useState(false);

  const sortRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(sortRef, () => setSortOpen(false));
  useOnClickOutside(statusRef, () => setStatusOpen(false));
  useOnClickOutside(tagsRef, () => setTagsOpen(false));

  const handleTagToggle = (tag: Tag) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newTags);
  };

  const getSelectedSortLabel = () =>
    sortOptions.find((o) => o.value === sortBy)?.label || "Sort By";
  const getSelectedStatusLabel = () =>
    statusOptions.find((o) => o.value === filterStatus)?.label || "Status";

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
      {/* Sort Dropdown */}
      <div className="relative" ref={sortRef}>
        <button
          onClick={() => setSortOpen(!isSortOpen)}
          className="w-full sm:w-auto flex items-center justify-between bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-brand-primary"
        >
          <span>{getSelectedSortLabel()}</span>
          <ChevronDownIcon
            className={`ml-2 h-5 w-5 transition-transform ${
              isSortOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        {isSortOpen && (
          <div className="absolute right-0 z-30 mt-2 w-full sm:w-56 rounded-md shadow-lg bg-slate-800 ring-1 ring-slate-700 focus:outline-none">
            <div className="py-1">
              {sortOptions.map((option) => (
                <a
                  key={option.value}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setSortBy(option.value);
                    setSortOpen(false);
                  }}
                  className={`block px-4 py-2 text-sm ${
                    sortBy === option.value
                      ? "bg-brand-primary/20 text-white"
                      : "text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {option.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Status Filter Dropdown */}
      <div className="relative" ref={statusRef}>
        <button
          onClick={() => setStatusOpen(!isStatusOpen)}
          className="w-full sm:w-auto flex items-center justify-between bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-brand-primary"
        >
          <span>{getSelectedStatusLabel()}</span>
          <ChevronDownIcon
            className={`ml-2 h-5 w-5 transition-transform ${
              isStatusOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        {isStatusOpen && (
          <div className="absolute right-0 z-30 mt-2 w-full sm:w-48 rounded-md shadow-lg bg-slate-800 ring-1 ring-slate-700 focus:outline-none">
            <div className="py-1">
              {statusOptions.map((option) => (
                <a
                  key={option.value}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setFilterStatus(option.value as any);
                    setStatusOpen(false);
                  }}
                  className={`block px-4 py-2 text-sm ${
                    filterStatus === option.value
                      ? "bg-brand-primary/20 text-white"
                      : "text-slate-300 hover:bg-slate-700"
                  }`}
                >
                  {option.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tags Filter Dropdown */}
      <div className="relative" ref={tagsRef}>
        <button
          onClick={() => setTagsOpen(!isTagsOpen)}
          className="w-full sm:w-auto flex items-center justify-between bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-brand-primary"
        >
          <FilterIcon />
          <span className="ml-2">
            {selectedTags.length > 0
              ? `Tags (${selectedTags.length})`
              : "Filter by Tags"}
          </span>
          <ChevronDownIcon
            className={`ml-2 h-5 w-5 transition-transform ${
              isTagsOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        {isTagsOpen && (
          <div className="absolute right-0 z-30 mt-2 w-full sm:w-64 rounded-md shadow-lg bg-slate-800 ring-1 ring-slate-700 focus:outline-none max-h-60 overflow-y-auto">
            <div className="p-2">
              {allTags.length > 0 ? (
                allTags.map((tag) => (
                  <label
                    key={tag.title}
                    className="flex items-center space-x-3 px-2 py-1.5 text-slate-300 hover:bg-slate-700/50 rounded-md cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedTags.includes(tag)}
                      onChange={() => handleTagToggle(tag)}
                      className="h-4 w-4 rounded bg-slate-600 border-slate-500 text-brand-primary focus:ring-brand-primary"
                    />
                    <span>{tag.title}</span>
                  </label>
                ))
              ) : (
                <span className="block text-center text-sm text-slate-400 py-2">
                  No tags available
                </span>
              )}
            </div>
          </div>
        )}
      </div>
      {hasActiveFilters && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onClearFilters}
          className="bg-transparent hover:bg-slate-700 text-slate-400 border border-slate-600"
        >
          <XCircleIcon /> <span className="ml-1.5">Clear</span>
        </Button>
      )}
    </div>
  );
};
