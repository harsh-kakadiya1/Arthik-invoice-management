import React, { createContext, useContext, useState, useRef } from 'react';

const NavigationContext = createContext();

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

export const NavigationProvider = ({ children }) => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);
  const [modalPersistent, setModalPersistent] = useState(false);
  const navigateRef = useRef(null);
  const pathRef = useRef(null);

  const showWarning = (message = 'You have unsaved changes. Are you sure you want to leave?') => {
    setWarningMessage(message);
    setHasUnsavedChanges(true);
  };

  const hideWarning = () => {
    setHasUnsavedChanges(false);
    setWarningMessage('');
    setShowModal(false);
    setPendingNavigation(null);
    setModalPersistent(false);
  };

  const showWarningModal = (navigate, path) => {
    // Prevent multiple modals from being shown
    if (showModal) {
      return;
    }
    
    // Use setTimeout to ensure state updates are processed
    setTimeout(() => {
      navigateRef.current = navigate;
      pathRef.current = path;
      setPendingNavigation({ navigate, path });
      setModalPersistent(true);
      setShowModal(true);
    }, 0);
  };

  const confirmNavigation = () => {
    hideWarning();
    if (navigateRef.current && pathRef.current) {
      navigateRef.current(pathRef.current);
    }
  };

  const cancelNavigation = () => {
    setShowModal(false);
    setPendingNavigation(null);
    setModalPersistent(false);
    navigateRef.current = null;
    pathRef.current = null;
  };

  const forceHideModal = () => {
    setShowModal(false);
    setModalPersistent(false);
  };

  const navigateWithWarning = (navigate, path) => {
    if (hasUnsavedChanges) {
      showWarningModal(navigate, path);
    } else {
      navigate(path);
    }
  };

  const value = {
    hasUnsavedChanges,
    warningMessage,
    showWarning,
    hideWarning,
    navigateWithWarning,
    showModal,
    modalPersistent,
    confirmNavigation,
    cancelNavigation,
    forceHideModal,
    pendingNavigation
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
};
