import React from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/Layout/MainLayout';
import { useInvoice } from '../context/InvoiceContext';
import { FiCheck, FiArrowLeft } from 'react-icons/fi';
import InvoicePreview from '../components/InvoicePreview';
import FromToStep from '../components/FormSteps/FromToStep';
import InvoiceDetailsStep from '../components/FormSteps/InvoiceDetailsStep';
import LineItemsStep from '../components/FormSteps/LineItemsStep';
import PaymentInfoStep from '../components/FormSteps/PaymentInfoStep';
import SummaryStep from '../components/FormSteps/SummaryStep';

const CreateInvoicePage = ({ isEditMode = false, invoiceId = null }) => {
  const { currentStep, setCurrentStep } = useInvoice();
  const navigate = useNavigate();

  const steps = [
    { id: 0, name: 'From & To', description: 'Sender and receiver information' },
    { id: 1, name: 'Invoice Details', description: 'Invoice number, dates, and currency' },
    { id: 2, name: 'Line Items', description: 'Products or services' },
    { id: 3, name: 'Payment Info', description: 'Payment terms and bank details' },
    { id: 4, name: 'Summary', description: 'Review and save' }
  ];

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
              <h1 className="text-3xl font-bold text-light-text-primary">
                {isEditMode ? 'Edit Invoice' : 'Create Invoice'}
              </h1>
              <p className="text-light-text-secondary mt-1">
                {isEditMode ? 'Update your invoice details' : 'Follow the steps to create your invoice'}
              </p>
            </div>
            {isEditMode && (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => navigate('/')}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <FiArrowLeft className="h-4 w-4" />
                  <span>Back</span>
                </button>
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
              </div>
            )}
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
                <h3 className="text-lg font-semibold text-light-text-primary mb-4">Live Preview</h3>
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
