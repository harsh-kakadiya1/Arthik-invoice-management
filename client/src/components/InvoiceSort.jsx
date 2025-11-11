import React, { useState } from 'react';
import { FiChevronDown, FiArrowUp, FiArrowDown } from 'react-icons/fi';

const InvoiceSort = ({ sortBy, sortOrder, onSortChange }) => {
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const sortOptions = [
    { value: 'createdAt', label: 'Date Created', icon: '📅' },
    { value: 'invoiceDate', label: 'Invoice Date', icon: '📄' },
    { value: 'dueDate', label: 'Due Date', icon: '⏰' },
    { value: 'amount', label: 'Amount', icon: '💰' },
    { value: 'status', label: 'Status', icon: '📊' },
    { value: 'client', label: 'Client Name', icon: '👤' },
  ];

  const handleSortChange = (field) => {
    const newSortOrder = sortBy === field && sortOrder === 'asc' ? 'desc' : 'asc';
    onSortChange(field, newSortOrder);
    setShowSortDropdown(false);
  };

  const getCurrentSortLabel = () => {
    const currentOption = sortOptions.find(option => option.value === sortBy);
    return currentOption ? currentOption.label : 'Date Created';
  };

  const getSortIcon = () => {
    if (sortOrder === 'asc') return <FiArrowUp className="h-4 w-4" />;
    return <FiArrowDown className="h-4 w-4" />;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowSortDropdown(!showSortDropdown)}
        className="flex items-center space-x-2 px-4 py-2 bg-bg-secondary border border-border-primary rounded-lg hover:bg-bg-primary transition-colors duration-300"
      >
        <span className="text-text-primary">Sort by: {getCurrentSortLabel()}</span>
        {getSortIcon()}
        <FiChevronDown className="h-4 w-4 text-text-secondary" />
      </button>

      {showSortDropdown && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-bg-secondary border border-border-primary rounded-lg shadow-xl z-50">
          <div className="py-2">
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSortChange(option.value)}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-bg-primary transition-colors flex items-center space-x-3 ${
                  sortBy === option.value
                    ? 'bg-brand-primary bg-opacity-10 text-brand-primary font-medium'
                    : 'text-text-primary'
                }`}
              >
                <span>{option.icon}</span>
                <span>{option.label}</span>
                {sortBy === option.value && getSortIcon()}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {showSortDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowSortDropdown(false)}
        />
      )}
    </div>
  );
};

export default InvoiceSort;
