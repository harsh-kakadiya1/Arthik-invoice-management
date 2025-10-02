import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiLogOut, FiUser, FiUsers, FiSettings, FiHome, FiFileText } from 'react-icons/fi';
import ThemeToggle from '../ThemeToggle';

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: FiHome },
    { path: '/create-invoice', label: 'Create Invoice', icon: FiFileText },
    { path: '/clients', label: 'Clients', icon: FiUsers },
    { path: '/profile', label: 'Profile', icon: FiSettings }
  ];

  return (
    <header className="bg-bg-secondary border-b border-border-primary transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center">
            <img 
              src="/logo.png" 
              alt="Arthik Logo" 
              className="h-8 w-auto mr-3"
            />
            <h1 className="text-xl font-bold text-brand-primary transition-colors duration-300">Arthik</h1>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 ${
                    isActive
                      ? 'text-white bg-brand-primary'
                      : 'text-text-secondary hover:text-white hover:bg-brand-primary'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Info and Actions */}
          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 text-text-primary">
              <FiUser className="h-4 w-4" />
              <span className="text-sm font-medium">Welcome, {user?.name}</span>
            </div>
            
            {/* Theme Toggle */}
            <ThemeToggle />
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-text-secondary hover:text-text-primary transition-colors duration-300"
            >
              <FiLogOut className="h-4 w-4" />
              <span className="hidden sm:inline text-sm">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
