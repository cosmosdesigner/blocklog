import React from "react";
import { Link } from "@tanstack/react-router";
import { Button } from "./Button";

interface HeaderProps {
  onLogNewBlock: () => void;
}

const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="mr-2"
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const navItems = [
  { id: "blocks", label: "Blocks", to: "/" },
  { id: "dashboard", label: "Dashboard", to: "/dashboard" },
  { id: "data", label: "Data", to: "/data" },
];

export const Header: React.FC<HeaderProps> = ({ onLogNewBlock }) => {
  return (
    <header className="bg-slate-900/70 backdrop-blur-sm sticky top-0 z-10 border-b border-slate-800">
      <div className="container mx-auto flex items-center justify-between p-4">
        <div className="flex items-center space-x-8">
          <div className="flex items-center space-x-2 flex-shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-brand-primary"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="12" y1="8" x2="12" y2="16"></line>
              <line x1="8" y1="12" x2="16" y2="12"></line>
            </svg>
            <h1 className="text-2xl font-bold text-white">Blocklog</h1>
          </div>
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.to}
                className="px-3 py-2 text-sm font-medium rounded-md transition-colors text-slate-400 hover:bg-slate-700/50 hover:text-white"
                activeProps={{
                  className: "bg-slate-700 text-white",
                }}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <Button onClick={onLogNewBlock}>
          <PlusIcon />
          <span className="hidden sm:inline">Log New Block</span>
          <span className="sm:hidden">New</span>
        </Button>
      </div>
    </header>
  );
};
