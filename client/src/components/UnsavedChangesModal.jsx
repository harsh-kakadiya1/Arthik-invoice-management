import React, { useState, useEffect } from 'react';
import { FiAlertTriangle, FiX, FiArrowLeft } from 'react-icons/fi';

const UnsavedChangesModal = ({ 
  isOpen, 
  onConfirm, 
  onCancel, 
  title = "Unsaved Changes",
  message = "You have unsaved changes. Are you sure you want to leave? Your data will be lost."
}) => {
  const [canClose, setCanClose] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setCanClose(false);
      const timer = setTimeout(() => {
        setCanClose(true);
      }, 1000); // 1 second delay before modal can be closed
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Prevent modal from being dismissed by clicking outside or pressing escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  const handleCancel = () => {
    if (canClose) {
      onCancel();
    }
  };

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    // Prevent closing modal by clicking backdrop
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-all duration-300"
        onClick={handleBackdropClick}
      ></div>
      
      {/* Modal */}
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0 w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
              <FiAlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
          </div>
          <button
            onClick={handleCancel}
            className={`text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors ${!canClose ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!canClose}
          >
            <FiX className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
            {message}
          </p>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 rounded-b-lg">
          <button
            onClick={handleCancel}
            className={`px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md transition-colors duration-200 ${!canClose ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-600'}`}
            disabled={!canClose}
          >
            Stay on Page
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
          >
            Leave Anyway
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnsavedChangesModal;
