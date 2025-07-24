import React, { useState, useEffect } from "react";
import { Block } from "../types";
import { calculateDuration, formatDuration, formatDate } from "../lib/utils";
import { Button } from "./Button";

interface BlockCardProps {
  block: Block;
  onResolve: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (block: Block) => void;
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

const EditIcon = () => (
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
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
  </svg>
);

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
                <CheckIcon />
                Mark as Resolved
              </Button>
            )}
            <Button variant="secondary" size="sm" onClick={() => onEdit(block)}>
              <EditIcon />
            </Button>
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
