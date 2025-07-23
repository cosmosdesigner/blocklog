
import React from 'react';
import { Block } from '../types';
import { BlockCard } from './BlockCard';

interface BlockListProps {
  blocks: Block[];
  onResolve: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (block: Block) => void;
}

export const BlockList: React.FC<BlockListProps> = ({ blocks, onResolve, onDelete, onEdit }) => {
  return (
    <section>
      <h2 className="text-3xl font-bold text-white mb-6">Block History</h2>
      {blocks.length === 0 ? (
        <div className="text-center py-10 bg-slate-800 rounded-lg border border-slate-700">
          <p className="text-slate-400">No blocks logged yet. Click "Log New Block" to get started!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {blocks.map(block => (
            <BlockCard key={block.id} block={block} onResolve={onResolve} onDelete={onDelete} onEdit={onEdit} />
          ))}
        </div>
      )}
    </section>
  );
};
