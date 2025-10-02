import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import MainLayout from '../components/Layout/MainLayout';
import { useInvoice } from '../context/InvoiceContext';
import { useNavigation } from '../context/NavigationContext';
import { FiCheck, FiArrowLeft, FiSave } from 'react-icons/fi';
import InvoicePreview from '../components/InvoicePreview';
import FromToStep from '../components/FormSteps/FromToStep';
import InvoiceDetailsStep from '../components/FormSteps/InvoiceDetailsStep';
import LineItemsStep from '../components/FormSteps/LineItemsStep';
import PaymentInfoStep from '../components/FormSteps/PaymentInfoStep';
import SummaryStep from '../components/FormSteps/SummaryStep';

const CreateInvoicePage = ({ isEditMode = false, invoiceId = null }) => {
  const { currentStep, setCurrentStep, invoiceData } = useInvoice();
  const { showWarning, hideWarning, navigateWithWarning, forceHideModal } = useNavigation();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [mouseLeftPage, setMouseLeftPage] = useState(false);

  const steps = [
    { id: 0, name: 'From & To', description: 'Sender and receiver information' },
    { id: 1, name: 'Invoice Details', description: 'Invoice number, dates, and currency' },
    { id: 2, name: 'Line Items', description: 'Products or services' },
    { id: 3, name: 'Payment Info', description: 'Payment terms and bank details' },
    { id: 4, name: 'Summary', description: 'Review and save' }
  ];

  // Check if there are unsaved changes (only for create mode)
  useEffect(() => {
    if (!isEditMode) {
      const hasData = invoiceData && (
        (invoiceData.sender && (invoiceData.sender.name || invoiceData.sender.email)) ||
        (invoiceData.receiver && (invoiceData.receiver.name || invoiceData.receiver.email)) ||
        (invoiceData.details && invoiceData.details.items && invoiceData.details.items.length > 0 && 
         invoiceData.details.items.some(item => item.name || item.description))
      );
      setHasUnsavedChanges(hasData);
      
      if (hasData) {
        showWarning('You have unsaved changes. Are you sure you want to leave? Your data will be lost.');
      } else {
        hideWarning();
      }
    } else {
      hideWarning();
    }
  }, [invoiceData, isEditMode, showWarning, hideWarning]);

  // Detect mouse leaving page and keyboard navigation (only for create mode)
  useEffect(() => {
    if (!isEditMode && hasUnsavedChanges) {
      let mouseTimeout;
      let isMouseOutside = false;

      const handleMouseLeave = (e) => {
        // Check if mouse is leaving the browser window
        if (e.clientY <= 0 || e.clientX <= 0 || 
            e.clientX >= window.innerWidth || e.clientY >= window.innerHeight) {
          isMouseOutside = true;
          setMouseLeftPage(true);
          mouseTimeout = setTimeout(() => {
            if (isMouseOutside) {
              navigateWithWarning(navigate, '/');
            }
          }, 2000); // 2 second delay before showing warning
        }
      };

      const handleMouseEnter = () => {
        isMouseOutside = false;
        setMouseLeftPage(false);
        if (mouseTimeout) {
          clearTimeout(mouseTimeout);
        }
      };

      const handleKeyDown = (e) => {
        // Detect Alt + Left Arrow (browser back) or Alt + Right Arrow (browser forward)
        if (e.altKey && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) {
          e.preventDefault();
          navigateWithWarning(navigate, '/');
        }
        // Detect Ctrl + R (refresh) or F5
        if ((e.ctrlKey && e.key === 'r') || e.key === 'F5') {
          e.preventDefault();
          navigateWithWarning(navigate, '/');
        }
        // Detect Ctrl + W (close tab)
        if (e.ctrlKey && e.key === 'w') {
          e.preventDefault();
          navigateWithWarning(navigate, '/');
        }
      };

      // Handle browser back/forward button
      const handleBeforeUnload = (e) => {
        e.preventDefault();
        e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
        return 'You have unsaved changes. Are you sure you want to leave?';
      };

      const handlePopState = (e) => {
        e.preventDefault();
        // Push the current state back to prevent navigation
        window.history.pushState(null, '', location.pathname);
        // Show warning modal
        navigateWithWarning(navigate, '/');
      };

      // Push a state to detect back button usage
      window.history.pushState(null, '', location.pathname);

      // Add event listeners
      document.addEventListener('mouseleave', handleMouseLeave);
      document.addEventListener('mouseenter', handleMouseEnter);
      document.addEventListener('keydown', handleKeyDown);
      window.addEventListener('beforeunload', handleBeforeUnload);
      window.addEventListener('popstate', handlePopState);

      return () => {
        document.removeEventListener('mouseleave', handleMouseLeave);
        document.removeEventListener('mouseenter', handleMouseEnter);
        document.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('beforeunload', handleBeforeUnload);
        window.removeEventListener('popstate', handlePopState);
        if (mouseTimeout) {
          clearTimeout(mouseTimeout);
        }
      };
    }
  }, [hasUnsavedChanges, isEditMode, location.pathname, navigateWithWarning, navigate]);

  // Cleanup warning when component unmounts
  useEffect(() => {
    return () => {
      forceHideModal();
    };
  }, []); // Empty dependency array - only run on unmount

  // Custom navigation function with warning
  const handleNavigate = (path) => {
    if (!isEditMode && hasUnsavedChanges) {
      navigateWithWarning(navigate, path);
    } else {
      navigate(path);
    }
  };


  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <FromToStep />;
      case 1:
        return <InvoiceDetailsStep />;
      case 2:
        return <LineItemsStep />;
      case 3:
        return <PaymentInfoStep />;
      case 4:
        return <SummaryStep isEditMode={isEditMode} invoiceId={invoiceId} />;
      default:
        return <FromToStep />;
    }
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-text-primary transition-colors duration-300">
                {isEditMode ? 'Edit Invoice' : 'Create Invoice'}
              </h1>
              <p className="text-text-secondary mt-1 transition-colors duration-300">
                {isEditMode ? 'Update your invoice details' : 'Follow the steps to create your invoice'}
              </p>
              {!isEditMode && hasUnsavedChanges && (
                <div className="flex items-center mt-2 text-sm text-orange-600 dark:text-orange-400">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-2"></div>
                  <span>You have unsaved changes</span>
                  {mouseLeftPage && (
                    <span className="ml-2 text-xs text-red-600 dark:text-red-400">
                      (Mouse left page - warning will appear if you don't return)
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleNavigate('/')}
                className="btn-secondary flex items-center space-x-2"
              >
                <FiArrowLeft className="h-4 w-4" />
                <span>Back</span>
              </button>
              {isEditMode && (
                <button
                  onClick={() => {
                    // This will trigger the update in SummaryStep
                    setCurrentStep(4);
                  }}
                  className="btn-primary flex items-center space-x-2"
                >
                  <FiCheck className="h-4 w-4" />
                  <span>Update Invoice</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium cursor-pointer transition-all ${
                      currentStep > step.id
                        ? 'bg-brand-teal text-white'
                        : currentStep === step.id
                        ? 'bg-brand-teal text-white'
                        : 'bg-dark-bg-secondary text-light-text-secondary border border-dark-border hover:border-brand-teal'
                    }`}
                    onClick={() => setCurrentStep(step.id)}
                  >
                    {currentStep > step.id ? (
                      <FiCheck className="h-5 w-5" />
                    ) : (
                      step.id + 1
                    )}
                  </div>
                  <div className="ml-3 hidden sm:block">
                    <div
                      className={`text-sm font-medium ${
                        currentStep >= step.id ? 'text-light-text-primary' : 'text-light-text-secondary'
                      }`}
                    >
                      {step.name}
                    </div>
                    <div className="text-xs text-light-text-secondary">{step.description}</div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`hidden sm:block w-16 h-0.5 ml-4 ${
                      currentStep > step.id ? 'bg-brand-teal' : 'bg-dark-border'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {renderStepContent()}
              
              {/* Navigation Buttons */}
              {currentStep < 4 && (
                <div className="flex justify-between">
                  <button
                    onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                    disabled={currentStep === 0}
                    className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentStep(Math.min(steps.length - 1, currentStep + 1))}
                    className="btn-primary"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Preview Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="card">
                <h3 className="text-lg font-semibold text-text-primary mb-4 transition-colors duration-300">Live Preview</h3>
                <div className="bg-white rounded-lg overflow-hidden">
                  <InvoicePreview />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CreateInvoicePage;
