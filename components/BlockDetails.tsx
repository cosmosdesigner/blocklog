import React, { useState, useEffect } from "react";
import { Block } from "../types";
import { calculateDuration, formatDuration, formatDate } from "../lib/utils";
import { Button } from "./Button";

interface BlockDetailsProps {
  block: Block;
  onClose: () => void;
}

export const BlockDetails: React.FC<BlockDetailsProps> = ({
  block,
  onClose,
}) => {
  const [duration, setDuration] = useState(
    calculateDuration(block.created, block.resolved)
  );

  useEffect(() => {
    if (!block.resolved) {
      const timer = setInterval(() => {
        setDuration(calculateDuration(block.created));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [block.resolved, block.created]);

  const statusColor =
    block.resolved
      ? "bg-emerald-500/20 text-emerald-400"
      : "bg-amber-500/20 text-amber-400";

  return (
    <div className="p-2 text-white">
      <h2 className="text-2xl font-bold mb-4">{block.title}</h2>

      <div className="mb-4">
        <span
          className={`px-3 py-1 text-sm font-semibold rounded-full ${statusColor}`}
        >
          {block.resolved}
        </span>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-300 mb-2">Reason</h3>
        <p className="bg-slate-700/50 p-3 rounded-md text-slate-300">
          {block.problem}
        </p>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-300 mb-2">Duration</h3>
        <p className="text-3xl font-bold">{formatDuration(duration)}</p>
      </div>

      <div className="text-sm text-slate-400 space-y-1">
        <p>
          <strong>Started:</strong> {formatDate(block.created)}
        </p>
        {block.resolved && (
          <p>
            <strong>Resolved:</strong> {formatDate(block.resolved)}
          </p>
        )}
      </div>

      <div className="flex justify-end mt-8">
        <Button onClick={onClose} variant="secondary">
          Close
        </Button>
      </div>
    </div>
  );
};
