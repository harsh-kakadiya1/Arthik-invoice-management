import React from 'react';
import { useNavigation } from '../context/NavigationContext';
import UnsavedChangesModal from './UnsavedChangesModal';

const NavigationWrapper = ({ children }) => {
  const { showModal, confirmNavigation, cancelNavigation, warningMessage } = useNavigation();

  return (
    <>
      {children}
      <UnsavedChangesModal
        isOpen={showModal}
        onConfirm={confirmNavigation}
        onCancel={cancelNavigation}
        message={warningMessage}
      />
    </>
  );
};

export default NavigationWrapper;
