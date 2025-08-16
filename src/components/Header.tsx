import React, { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Button } from "./Button";
import { authAPI } from "../services/api";
import { Plus, LogOut, User, ChevronDown, SquarePlus } from "lucide-react";

interface HeaderProps {
  onLogNewBlock: () => void;
}

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
            <SquarePlus size={28} className="text-brand-primary" />
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
            <Plus size={20} className="mr-2" />
            <span className="hidden sm:inline">Log New Block</span>
            <span className="sm:hidden">New</span>
          </Button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-md transition-colors"
            >
              <User size={20} />
              <span className="hidden sm:inline ml-1">Account</span>
              <ChevronDown size={16} className="ml-1" />
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
                      <LogOut size={16} className="mr-2" />
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
