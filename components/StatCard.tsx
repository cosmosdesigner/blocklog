import React from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  onClick,
}) => {
  const isClickable = !!onClick;

  const cardClasses = [
    "bg-slate-800",
    "p-6",
    "rounded-lg",
    "shadow-lg",
    "border",
    "border-slate-700",
    "transition-transform",
    "hover:scale-105",
    isClickable && "cursor-pointer",
    isClickable && "hover:border-brand-primary",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cardClasses} onClick={onClick}>
      <h4 className="text-sm font-medium text-slate-400 mb-2">{title}</h4>
      <p className="text-4xl font-bold text-white">{value}</p>
    </div>
  );
};
