
import React, { useState, useEffect } from 'react';
import { Block } from '../types';
import { Button } from './Button';

interface BlockFormProps {
  onSave: (blockData: Omit<Block, 'id' | 'status'>) => void;
  onClose: () => void;
  existingBlock?: Block | null;
}

export const BlockForm: React.FC<BlockFormProps> = ({ onSave, onClose, existingBlock }) => {
  const [title, setTitle] = useState('');
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (existingBlock) {
      setTitle(existingBlock.title);
      setReason(existingBlock.reason);
    } else {
        setTitle('');
        setReason('');
    }
  }, [existingBlock]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !reason.trim()) {
        alert('Title and reason are required.');
        return;
    }
    onSave({
      title,
      reason,
      startDate: existingBlock ? existingBlock.startDate : new Date().toISOString(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-2">
      <h2 className="text-2xl font-bold text-white mb-6">{existingBlock ? 'Edit Block' : 'Log New Block'}</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-1">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
            placeholder="e.g., Staging Environment Down"
            required
          />
        </div>
        <div>
          <label htmlFor="reason" className="block text-sm font-medium text-slate-300 mb-1">Reason / Blocker</label>
          <textarea
            id="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
            placeholder="Describe the cause of the block..."
            rows={4}
            required
          />
        </div>
      </div>
      <div className="flex justify-end gap-3 mt-8">
        <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
        <Button type="submit">{existingBlock ? 'Save Changes' : 'Create Block'}</Button>
      </div>
    </form>
  );
};
