import React, { useState, useEffect } from 'react';
import { Block } from '../types';
import { Button } from './Button';

interface BlockFormProps {
  onSave: (blockData: Omit<Block, 'id' | 'resolved'>) => void;
  onClose: () => void;
  existingBlock?: Block | null;
}

export const BlockForm: React.FC<BlockFormProps> = ({ onSave, onClose, existingBlock }) => {
  const [title, setTitle] = useState('');
  const [environment, setEnvironment] = useState('');
  const [problem, setProblem] = useState('');
  const [action, setAction] = useState('');
  const [communicationChannel, setCommunicationChannel] = useState('');
  const [createdBy, setCreatedBy] = useState('');

  useEffect(() => {
    if (existingBlock) {
      setTitle(existingBlock.title);
      setEnvironment(existingBlock.environment || '');
      setProblem(existingBlock.problem);
      setAction(existingBlock.action || '');
      setCommunicationChannel(existingBlock.communicationChannel || '');
      setCreatedBy(existingBlock.createdBy || '');
    } else {
        setTitle('');
        setEnvironment('');
        setProblem('');
        setAction('');
        setCommunicationChannel('');
        setCreatedBy('');
    }
  }, [existingBlock]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !problem.trim() || !createdBy.trim() || !environment.trim()) {
        alert('Title, Environment, Problem, and Created By are required.');
        return;
    }
    onSave({
      title,
      environment,
      problem,
      action,
      communicationChannel,
      createdBy,
      created: existingBlock ? existingBlock.created : new Date().toISOString(),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-2">
      <h2 className="text-2xl font-bold text-white mb-6">{existingBlock ? 'Edit Block' : 'Log New Block'}</h2>
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-300 mb-1">Title <span className="text-red-400">*</span></label>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label htmlFor="environment" className="block text-sm font-medium text-slate-300 mb-1">Environment <span className="text-red-400">*</span></label>
                <input
                    id="environment"
                    type="text"
                    value={environment}
                    onChange={(e) => setEnvironment(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                    placeholder="e.g., Production, Staging"
                    required
                />
            </div>
            <div>
                <label htmlFor="createdBy" className="block text-sm font-medium text-slate-300 mb-1">Created By <span className="text-red-400">*</span></label>
                <input
                    id="createdBy"
                    type="text"
                    value={createdBy}
                    onChange={(e) => setCreatedBy(e.target.value)}
                    className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                    placeholder="e.g., Jane Doe"
                    required
                />
            </div>
        </div>
        <div>
          <label htmlFor="problem" className="block text-sm font-medium text-slate-300 mb-1">Problem <span className="text-red-400">*</span></label>
          <textarea
            id="problem"
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
            placeholder="Describe the cause of the block..."
            rows={5}
            required
          />
        </div>
        <div>
          <label htmlFor="action" className="block text-sm font-medium text-slate-300 mb-1">Action</label>
          <textarea
            id="action"
            value={action}
            onChange={(e) => setAction(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
            placeholder="Describe the action being taken to resolve it..."
            rows={3}
          />
        </div>
         <div>
            <label htmlFor="communicationChannel" className="block text-sm font-medium text-slate-300 mb-1">Communication Channel</label>
            <input
                id="communicationChannel"
                type="text"
                value={communicationChannel}
                onChange={(e) => setCommunicationChannel(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-md p-2 text-white focus:ring-2 focus:ring-brand-primary focus:border-brand-primary"
                placeholder="e.g., #ops-incident Slack channel"
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
