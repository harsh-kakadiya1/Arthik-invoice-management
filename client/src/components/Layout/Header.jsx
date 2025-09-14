import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiLogOut, FiUser } from 'react-icons/fi';

const Header = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-dark-bg-secondary border-b border-dark-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <img 
              src="/logo.png" 
              alt="Arthik Logo" 
              className="h-8 w-auto mr-3"
            />
            <h1 className="text-xl font-bold text-brand-teal">Arthik</h1>
          </div>

          {/* User Info and Actions */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-light-text-primary">
              <FiUser className="h-4 w-4" />
              <span className="text-sm font-medium">Welcome, {user?.name}</span>
            </div>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-light-text-secondary hover:text-light-text-primary transition-colors duration-200"
            >
              <FiLogOut className="h-4 w-4" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
