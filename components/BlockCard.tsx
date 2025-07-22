import React, { useState, useEffect } from "react";
import { Block, BlockStatus } from "../types";
import {
  calculateDuration,
  formatDuration,
  formatDate,
  formatTotalDuration,
} from "../lib/utils";
import { Button } from "./Button";

interface BlockCardProps {
  block: Block;
  onResolve: (id: string) => void;
  onDelete: (id: string) => void;
}

const TrashIcon = () => (
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
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    <line x1="10" y1="11" x2="10" y2="17"></line>
    <line x1="14" y1="11" x2="14" y2="17"></line>
  </svg>
);

const CheckIcon = () => (
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
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

export const BlockCard: React.FC<BlockCardProps> = ({
  block,
  onResolve,
  onDelete,
}) => {
  const [duration, setDuration] = useState(
    calculateDuration(block.startDate, block.endDate)
  );

  useEffect(() => {
    if (block.status === BlockStatus.ONGOING) {
      const timer = setInterval(() => {
        setDuration(calculateDuration(block.startDate));
      }, 1000); // update every second
      return () => clearInterval(timer);
    }
  }, [block.status, block.startDate]);

  const statusColor =
    block.status === BlockStatus.RESOLVED
      ? "bg-emerald-500/20 text-emerald-400"
      : "bg-amber-500/20 text-amber-400";

  return (
    <div className="bg-slate-800 rounded-lg shadow-lg border border-slate-700 p-5 transition-all hover:border-brand-primary/50 hover:shadow-brand-primary/10">
      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
        <div className="flex-grow">
          <div className="flex items-center gap-3 mb-2">
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColor}`}
            >
              {block.status}
            </span>
            <h3 className="text-xl font-bold text-white">{block.title}</h3>
          </div>
          <p className="text-slate-400 mb-4">{block.reason}</p>
          <div className="flex flex-col sm:flex-row sm:items-center text-sm text-slate-500 gap-x-4 gap-y-1">
            <span>Started: {formatDate(block.startDate)}</span>
            {block.endDate && (
              <span>Resolved: {formatDate(block.endDate)}</span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-start sm:items-end gap-3 flex-shrink-0">
          <div className="text-right">
            <p className="text-slate-400 text-sm">Duration</p>
            <p className="text-2xl font-semibold text-white">
              {formatDuration(duration)}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {formatTotalDuration(duration)}
            </p>
          </div>
          <div className="flex gap-2">
            {block.status === BlockStatus.ONGOING && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onResolve(block.id)}
              >
                <CheckIcon />
                Mark as Resolved
              </Button>
            )}
            <Button
              variant="danger"
              size="sm"
              onClick={() => onDelete(block.id)}
            >
              <TrashIcon />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
