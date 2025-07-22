
import React, { useMemo } from 'react';
import { Block, BlockStatus } from '../types';
import { calculateDuration } from '../lib/utils';
import { StatCard } from './StatCard';
import { BlockChart } from './BlockChart';

interface DashboardProps {
  blocks: Block[];
}

export const Dashboard: React.FC<DashboardProps> = ({ blocks }) => {
  const stats = useMemo(() => {
    const totalBlocks = blocks.length;
    const ongoingBlocks = blocks.filter(b => b.status === BlockStatus.ONGOING).length;
    
    const totalBlockedHours = blocks.reduce((acc, block) => {
      return acc + calculateDuration(block.startDate, block.endDate).totalHours;
    }, 0);

    const longestBlock = blocks.reduce((max, block) => {
        const duration = calculateDuration(block.startDate, block.endDate).totalHours;
        return duration > max ? duration : max;
    }, 0);

    return {
      totalBlocks,
      ongoingBlocks,
      totalBlockedHours: Math.round(totalBlockedHours),
      longestBlock: Math.round(longestBlock)
    };
  }, [blocks]);

  return (
    <section className="mb-8">
      <h2 className="text-3xl font-bold text-white mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Blocks" value={stats.totalBlocks} />
        <StatCard title="Ongoing Blocks" value={stats.ongoingBlocks} />
        <StatCard title="Total Time Blocked" value={`${stats.totalBlockedHours}h`} />
        <StatCard title="Longest Block" value={`${stats.longestBlock}h`} />
      </div>
      <div className="bg-slate-800 p-4 sm:p-6 rounded-lg shadow-lg border border-slate-700">
        <h3 className="text-xl font-semibold text-white mb-4">Block Duration Overview (Hours)</h3>
        <BlockChart blocks={blocks} />
      </div>
    </section>
  );
};
