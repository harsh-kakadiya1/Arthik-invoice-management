import React, { useState } from 'react';
import { FiFilter, FiX, FiCalendar, FiDollarSign, FiUser, FiHash } from 'react-icons/fi';

const InvoiceFilters = ({ filters, onFiltersChange, onClearFilters }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [localFilters, setLocalFilters] = useState(filters);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    const clearedFilters = {};
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
    onClearFilters();
  };

  const getActiveFiltersCount = () => {
    return Object.values(filters).filter(value => 
      value !== '' && value !== null && value !== undefined
    ).length;
  };

  const getQuickFilterLabel = () => {
    if (filters.paid === 'true') return 'Paid';
    if (filters.unpaid === 'true') return 'Unpaid';
    if (filters.overdue === 'true') return 'Overdue';
    if (filters.status) return filters.status.charAt(0).toUpperCase() + filters.status.slice(1);
    return null;
  };

  return (
    <div className="relative">
      {/* Filter Toggle Button */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center space-x-2 px-4 py-2 bg-bg-secondary border border-border-primary rounded-lg hover:bg-bg-primary transition-colors duration-300"
        >
          <FiFilter className="h-4 w-4 text-text-secondary" />
          <span className="text-text-primary">Filters</span>
          {getActiveFiltersCount() > 0 && (
            <span className="bg-brand-primary text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
              {getActiveFiltersCount()}
            </span>
          )}
        </button>

        {/* Quick Filter Pills */}
        {getQuickFilterLabel() && (
          <div className="flex items-center space-x-2">
            <span className="text-text-secondary text-sm">Active:</span>
            <span className="bg-brand-primary bg-opacity-10 text-brand-primary px-3 py-1 rounded-full text-sm font-medium">
              {getQuickFilterLabel()}
            </span>
            <button
              onClick={handleClearFilters}
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              <FiX className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Filter Dropdown */}
      {showFilters && (
        <div className="absolute top-full left-0 mt-2 w-96 bg-bg-secondary border border-border-primary rounded-lg shadow-xl z-50 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text-primary">Filter Invoices</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              <FiX className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Payment Status Filters */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-3">
                Payment Status
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleFilterChange('paid', localFilters.paid === 'true' ? '' : 'true')}
                  className={`p-3 rounded-lg border text-left transition-colors ${
                    localFilters.paid === 'true'
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                      : 'border-border-primary hover:bg-bg-primary'
                  }`}
                >
                  <div className="font-medium">Paid</div>
                  <div className="text-xs text-text-secondary">All paid invoices</div>
                </button>
                <button
                  onClick={() => handleFilterChange('unpaid', localFilters.unpaid === 'true' ? '' : 'true')}
                  className={`p-3 rounded-lg border text-left transition-colors ${
                    localFilters.unpaid === 'true'
                      ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300'
                      : 'border-border-primary hover:bg-bg-primary'
                  }`}
                >
                  <div className="font-medium">Unpaid</div>
                  <div className="text-xs text-text-secondary">Draft, sent, overdue</div>
                </button>
                <button
                  onClick={() => handleFilterChange('overdue', localFilters.overdue === 'true' ? '' : 'true')}
                  className={`p-3 rounded-lg border text-left transition-colors ${
                    localFilters.overdue === 'true'
                      ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                      : 'border-border-primary hover:bg-bg-primary'
                  }`}
                >
                  <div className="font-medium">Overdue</div>
                  <div className="text-xs text-text-secondary">Past due date</div>
                </button>
                <button
                  onClick={() => handleFilterChange('status', localFilters.status === 'draft' ? '' : 'draft')}
                  className={`p-3 rounded-lg border text-left transition-colors ${
                    localFilters.status === 'draft'
                      ? 'border-gray-500 bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300'
                      : 'border-border-primary hover:bg-bg-primary'
                  }`}
                >
                  <div className="font-medium">Draft</div>
                  <div className="text-xs text-text-secondary">Not sent yet</div>
                </button>
              </div>
            </div>

            {/* Date Range Filters */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-3 flex items-center">
                <FiCalendar className="h-4 w-4 mr-2" />
                Date Range
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-text-secondary mb-1">From Date</label>
                  <input
                    type="date"
                    value={localFilters.startDate || ''}
                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                    className="w-full px-3 py-2 border border-border-primary rounded-lg bg-bg-primary text-text-primary focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-text-secondary mb-1">To Date</label>
                  <input
                    type="date"
                    value={localFilters.endDate || ''}
                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                    className="w-full px-3 py-2 border border-border-primary rounded-lg bg-bg-primary text-text-primary focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Quick Date Filters */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-3">
                Quick Filters
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    const today = new Date();
                    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                    handleFilterChange('startDate', weekAgo.toISOString().split('T')[0]);
                    handleFilterChange('endDate', today.toISOString().split('T')[0]);
                  }}
                  className="px-3 py-2 text-sm border border-border-primary rounded-lg hover:bg-bg-primary transition-colors"
                >
                  Last 7 days
                </button>
                <button
                  onClick={() => {
                    const today = new Date();
                    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                    handleFilterChange('startDate', monthAgo.toISOString().split('T')[0]);
                    handleFilterChange('endDate', today.toISOString().split('T')[0]);
                  }}
                  className="px-3 py-2 text-sm border border-border-primary rounded-lg hover:bg-bg-primary transition-colors"
                >
                  Last 30 days
                </button>
                <button
                  onClick={() => {
                    const today = new Date();
                    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
                    handleFilterChange('startDate', startOfMonth.toISOString().split('T')[0]);
                    handleFilterChange('endDate', today.toISOString().split('T')[0]);
                  }}
                  className="px-3 py-2 text-sm border border-border-primary rounded-lg hover:bg-bg-primary transition-colors"
                >
                  This month
                </button>
                <button
                  onClick={() => {
                    const today = new Date();
                    const startOfYear = new Date(today.getFullYear(), 0, 1);
                    handleFilterChange('startDate', startOfYear.toISOString().split('T')[0]);
                    handleFilterChange('endDate', today.toISOString().split('T')[0]);
                  }}
                  className="px-3 py-2 text-sm border border-border-primary rounded-lg hover:bg-bg-primary transition-colors"
                >
                  This year
                </button>
              </div>
            </div>

            {/* Amount Range */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-3 flex items-center">
                <FiDollarSign className="h-4 w-4 mr-2" />
                Amount Range
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-text-secondary mb-1">Min Amount</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={localFilters.minAmount || ''}
                    onChange={(e) => handleFilterChange('minAmount', e.target.value)}
                    className="w-full px-3 py-2 border border-border-primary rounded-lg bg-bg-primary text-text-primary focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-text-secondary mb-1">Max Amount</label>
                  <input
                    type="number"
                    placeholder="10000"
                    value={localFilters.maxAmount || ''}
                    onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
                    className="w-full px-3 py-2 border border-border-primary rounded-lg bg-bg-primary text-text-primary focus:ring-2 focus:ring-brand-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Client Name */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-3 flex items-center">
                <FiUser className="h-4 w-4 mr-2" />
                Client Name
              </label>
              <input
                type="text"
                placeholder="Search by client name..."
                value={localFilters.clientName || ''}
                onChange={(e) => handleFilterChange('clientName', e.target.value)}
                className="w-full px-3 py-2 border border-border-primary rounded-lg bg-bg-primary text-text-primary focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              />
            </div>

            {/* Invoice Number */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-3 flex items-center">
                <FiHash className="h-4 w-4 mr-2" />
                Invoice Number
              </label>
              <input
                type="text"
                placeholder="Search by invoice number..."
                value={localFilters.invoiceNumber || ''}
                onChange={(e) => handleFilterChange('invoiceNumber', e.target.value)}
                className="w-full px-3 py-2 border border-border-primary rounded-lg bg-bg-primary text-text-primary focus:ring-2 focus:ring-brand-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-border-primary">
            <button
              onClick={handleClearFilters}
              className="text-text-secondary hover:text-text-primary transition-colors text-sm"
            >
              Clear all filters
            </button>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowFilters(false)}
                className="px-4 py-2 text-text-secondary hover:text-text-primary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyFilters}
                className="px-4 py-2 bg-brand-primary text-white rounded-lg hover:bg-opacity-90 transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceFilters;
