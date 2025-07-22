
import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value }) => {
  return (
    <div className="bg-slate-800 p-6 rounded-lg shadow-lg border border-slate-700 transition-transform hover:scale-105 hover:border-brand-primary">
      <h4 className="text-sm font-medium text-slate-400 mb-2">{title}</h4>
      <p className="text-4xl font-bold text-white">{value}</p>
    </div>
  );
};
