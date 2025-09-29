import React, { createContext, useContext, useEffect, useCallback, useRef } from 'react';
import { useAuth } from './AuthContext';

const AutosaveContext = createContext();

export const useAutosave = () => {
  const context = useContext(AutosaveContext);
  if (!context) {
    throw new Error('useAutosave must be used within an AutosaveProvider');
  }
  return context;
};

export const AutosaveProvider = ({ children }) => {
  const { user } = useAuth();
  const autosaveTimeoutRef = useRef(null);
  const lastSavedDataRef = useRef(null);

  // Debounced autosave function
  const autosaveInvoice = useCallback((invoiceData, isDraft = true, isEditMode = false, invoiceId = null) => {
    if (!user || !invoiceData) return;

    // Clear existing timeout
    if (autosaveTimeoutRef.current) {
      clearTimeout(autosaveTimeoutRef.current);
    }

    // Set new timeout for autosave
    autosaveTimeoutRef.current = setTimeout(async () => {
      try {
        // For edit mode, don't create drafts - just update the existing invoice
        if (isEditMode && invoiceId) {
          // Update the existing invoice in the database
          // This will be handled by the API call in the component
          console.log('Invoice updated in-place:', invoiceId);
          return;
        }

        // For create mode, save as draft
        const draftData = {
          ...invoiceData,
          isDraft,
          lastModified: new Date().toISOString(),
          userId: user.id
        };

        // Save to localStorage
        const existingDrafts = JSON.parse(localStorage.getItem('invoiceDrafts') || '[]');
        const draftIndex = existingDrafts.findIndex(draft => draft.invoiceNumber === invoiceData.invoiceNumber);
        
        if (draftIndex >= 0) {
          existingDrafts[draftIndex] = draftData;
        } else {
          existingDrafts.push(draftData);
        }
        
        localStorage.setItem('invoiceDrafts', JSON.stringify(existingDrafts));
        lastSavedDataRef.current = draftData;
        
        console.log('Invoice autosaved as draft:', draftData.invoiceNumber);
      } catch (error) {
        console.error('Error autosaving invoice:', error);
      }
    }, 2000); // 2 second delay
  }, [user]);

  // Get all draft invoices
  const getDraftInvoices = useCallback(() => {
    if (!user) return [];
    
    try {
      const drafts = JSON.parse(localStorage.getItem('invoiceDrafts') || '[]');
      return drafts.filter(draft => draft.userId === user.id);
    } catch (error) {
      console.error('Error getting draft invoices:', error);
      return [];
    }
  }, [user]);

  // Get specific draft invoice
  const getDraftInvoice = useCallback((invoiceNumber) => {
    if (!user) return null;
    
    try {
      const drafts = JSON.parse(localStorage.getItem('invoiceDrafts') || '[]');
      return drafts.find(draft => 
        draft.invoiceNumber === invoiceNumber && draft.userId === user.id
      );
    } catch (error) {
      console.error('Error getting draft invoice:', error);
      return null;
    }
  }, [user]);

  // Delete draft invoice
  const deleteDraftInvoice = useCallback((invoiceNumber) => {
    if (!user) return;
    
    try {
      const drafts = JSON.parse(localStorage.getItem('invoiceDrafts') || '[]');
      const filteredDrafts = drafts.filter(draft => 
        !(draft.invoiceNumber === invoiceNumber && draft.userId === user.id)
      );
      localStorage.setItem('invoiceDrafts', JSON.stringify(filteredDrafts));
    } catch (error) {
      console.error('Error deleting draft invoice:', error);
    }
  }, [user]);

  // Clear all drafts for current user
  const clearAllDrafts = useCallback(() => {
    if (!user) return;
    
    try {
      const drafts = JSON.parse(localStorage.getItem('invoiceDrafts') || '[]');
      const filteredDrafts = drafts.filter(draft => draft.userId !== user.id);
      localStorage.setItem('invoiceDrafts', JSON.stringify(filteredDrafts));
    } catch (error) {
      console.error('Error clearing all drafts:', error);
    }
  }, [user]);

  // Update existing invoice in-place (for edit mode)
  const updateInvoiceInPlace = useCallback(async (invoiceId, invoiceData) => {
    if (!user || !invoiceId) return;
    
    try {
      // This will be called from the component that handles the API call
      console.log('Updating invoice in-place:', invoiceId, invoiceData);
      // The actual API call will be handled by the component
    } catch (error) {
      console.error('Error updating invoice in-place:', error);
    }
  }, [user]);

  // Check if invoice has unsaved changes
  const hasUnsavedChanges = useCallback((currentData) => {
    if (!lastSavedDataRef.current) return true;
    
    return JSON.stringify(currentData) !== JSON.stringify(lastSavedDataRef.current);
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (autosaveTimeoutRef.current) {
        clearTimeout(autosaveTimeoutRef.current);
      }
    };
  }, []);

  const value = {
    autosaveInvoice,
    getDraftInvoices,
    getDraftInvoice,
    deleteDraftInvoice,
    clearAllDrafts,
    updateInvoiceInPlace,
    hasUnsavedChanges
  };

  return (
    <AutosaveContext.Provider value={value}>
      {children}
    </AutosaveContext.Provider>
  );
};
