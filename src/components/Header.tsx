import React, { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "./Button";
import { authAPI } from "../services/api";

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

const LogoutIcon = () => (
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
    className="mr-2"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16,17 21,12 16,7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

const UserIcon = () => (
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
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const ChevronDownIcon = () => (
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
    className="ml-1"
  >
    <polyline points="6,9 12,15 18,9"></polyline>
  </svg>
);

const navItems = [
  { id: "blocks", label: "Blocks", to: "/" },
  { id: "dashboard", label: "Dashboard", to: "/dashboard" },
  { id: "data", label: "Data", to: "/data" },
];

export const Header: React.FC<HeaderProps> = ({ onLogNewBlock }) => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await authAPI.logout();
      // Reload the page to reset authentication state
      window.location.reload();
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout API fails, clear local state
      window.location.reload();
    }
  };

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

        <div className="flex items-center space-x-3">
          <Button onClick={onLogNewBlock}>
            <PlusIcon />
            <span className="hidden sm:inline">Log New Block</span>
            <span className="sm:hidden">New</span>
          </Button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-md transition-colors"
            >
              <UserIcon />
              <span className="hidden sm:inline ml-1">Account</span>
              <ChevronDownIcon />
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <>
                {/* Backdrop to close menu */}
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setIsUserMenuOpen(false)}
                />
                
                <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-md shadow-lg z-20">
                  <div className="py-1">
                    <button
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="flex items-center w-full px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors disabled:opacity-50"
                    >
                      <LogoutIcon />
                      {isLoggingOut ? 'Logging out...' : 'Logout'}
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
