import React, { useState, useEffect } from "react";
import { Block } from "../../types";
import { calculateDuration, formatDuration, formatDate } from "../lib/utils";
import { Button } from "./Button";
import { Trash2, Check, Edit } from "lucide-react";

interface BlockCardProps {
  block: Block;
  onResolve: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (block: Block) => void;
}

export const BlockCard: React.FC<BlockCardProps> = ({
  block,
  onResolve,
  onDelete,
  onEdit,
}) => {
  const [duration, setDuration] = useState(
    calculateDuration(block.created, block.resolved)
  );

  useEffect(() => {
    if (!block.resolved) {
      setDuration(calculateDuration(block.created));
      const timer = setInterval(() => {
        setDuration(calculateDuration(block.created));
      }, 1000); // update every minute
      return () => clearInterval(timer);
    }
  }, [block.resolved, block.created]);
  const isResolved = !!block.resolved;
  const statusText = isResolved ? "Resolved" : "Ongoing";
  const statusColor = isResolved
    ? "bg-emerald-500/20 text-emerald-400"
    : "bg-amber-500/20 text-amber-400";

  const DetailItem = ({ label, value }: { label: string; value: string }) =>
    value ? (
      <div>
        <dt className="text-sm font-medium text-slate-400">{label}</dt>
        <dd className="mt-1 text-slate-200">{value}</dd>
      </div>
    ) : null;

  return (
    <div className="bg-slate-800 rounded-lg shadow-lg border border-slate-700 p-5 transition-all hover:border-brand-primary/50 hover:shadow-brand-primary/10">
      <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-4">
        <div className="flex-grow">
          <div className="flex items-center gap-3 mb-3">
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColor}`}
            >
              {statusText}
            </span>
            <h3 className="text-xl font-bold text-white">{block.title}</h3>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            {(block.tags || []).map((tag, index) => (
              <span
                key={index}
                className={`bg-[${tag.color}] text-slate-300 text-xs font-medium px-2.5 py-1 rounded-full`}
              >
                {tag.title}
              </span>
            ))}
          </div>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 mb-4">
            <div>
              <dt className="text-sm font-medium text-slate-400">Problem</dt>
              <dd className="mt-1 text-slate-300 whitespace-pre-wrap">
                {block.problem}
              </dd>
            </div>
            {block.action && (
              <div>
                <dt className="text-sm font-medium text-slate-400">Action</dt>
                <dd className="mt-1 text-slate-300 whitespace-pre-wrap">
                  {block.action}
                </dd>
              </div>
            )}
            <DetailItem label="Environment" value={block.environment} />
            <DetailItem
              label="Communication Channel"
              value={block.communicationChannel}
            />
            <DetailItem label="Created By" value={block.createdBy} />
          </dl>

          <div className="flex flex-col sm:flex-row sm:items-center text-sm text-slate-500 gap-x-4 gap-y-1 pt-2 border-t border-slate-700/50">
            <span>Created: {formatDate(block.created)}</span>
            {block.resolved && (
              <span>Resolved: {formatDate(block.resolved)}</span>
            )}
          </div>
        </div>
        <div className="flex flex-col items-start sm:items-end gap-3 flex-shrink-0">
          <div className="text-right">
            <p className="text-slate-400 text-sm">Duration</p>
            <p className="text-2xl font-semibold text-white">
              {formatDuration(duration)}
            </p>
          </div>
          <div className="flex gap-2">
            {!isResolved && (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => onResolve(block.id)}
              >
                <Check size={16} />
                Mark as Resolved
              </Button>
            )}
            <Button variant="secondary" size="sm" onClick={() => onEdit(block)}>
              <Edit size={16} />
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={() => onDelete(block.id)}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
