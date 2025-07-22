
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Block } from '../types';
import { calculateDuration } from '../lib/utils';

interface BlockChartProps {
  blocks: Block[];
}

export const BlockChart: React.FC<BlockChartProps> = ({ blocks }) => {
  const chartData = useMemo(() => {
    return blocks.map(block => ({
      name: block.title.length > 15 ? `${block.title.substring(0, 15)}...` : block.title,
      duration: Math.round(calculateDuration(block.startDate, block.endDate).totalHours * 10) / 10,
    })).slice(0, 15).reverse(); // show latest 15 blocks
  }, [blocks]);

  if (blocks.length === 0) {
    return (
        <div className="flex items-center justify-center h-80 text-slate-400">
            <p>No block data to display. Log a new block to see the chart.</p>
        </div>
    );
  }

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 20,
            left: -10,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#475569" />
          <XAxis dataKey="name" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip 
            contentStyle={{ 
                backgroundColor: '#1e293b', // slate-800
                borderColor: '#334155', // slate-700
                color: '#f1f5f9' // slate-100
            }} 
            cursor={{ fill: '#334155' }}
          />
          <Legend wrapperStyle={{ color: '#f1f5f9' }} />
          <Bar dataKey="duration" fill="#0ea5e9" name="Duration (hours)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
