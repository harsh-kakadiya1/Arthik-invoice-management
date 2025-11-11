import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCheck, FiFileText, FiUsers, FiDownload, FiZap, FiShield, FiTrendingUp, FiMenu, FiX } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';

const LandingPage = () => {
  const { theme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: <FiFileText className="w-6 h-6" />,
      title: "Professional Templates",
      description: "Choose from 4 beautifully designed invoice templates"
    },
    {
      icon: <FiUsers className="w-6 h-6" />,
      title: "Client Management",
      description: "Store and manage all your client information in one place"
    },
    {
      icon: <FiDownload className="w-6 h-6" />,
      title: "Instant PDF Download",
      description: "Generate and download professional PDFs instantly"
    },
    {
      icon: <FiZap className="w-6 h-6" />,
      title: "Smart Calculations",
      description: "Auto-calculate GST, discounts, and shipping charges"
    },
    {
      icon: <FiShield className="w-6 h-6" />,
      title: "Secure & Private",
      description: "Your data is encrypted and completely secure"
    },
    {
      icon: <FiTrendingUp className="w-6 h-6" />,
      title: "Track & Manage",
      description: "Monitor invoice status from draft to paid"
    }
  ];

  const templates = [
    { id: 1, name: "Classic Blue", color: "bg-blue-500" },
    { id: 2, name: "Modern Minimal", color: "bg-gray-500" },
    { id: 3, name: "Corporate", color: "bg-indigo-500" },
    { id: 4, name: "Dark Sidebar", color: "bg-gray-800" }
  ];

  const stats = [
    { number: "4", label: "Professional Templates" },
    { number: "50+", label: "Features Included" },
    { number: "100%", label: "Free to Use" },
    { number: "∞", label: "Unlimited Invoices" }
  ];

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 ${theme === 'dark' ? 'bg-gray-900/95' : 'bg-white/95'} backdrop-blur-sm border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <FiFileText className="w-5 h-5 text-white" />
                </div>
                <span className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Arthik
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className={`${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'} transition-colors`}>
                Features
              </a>
              <a href="#templates" className={`${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'} transition-colors`}>
                Templates
              </a>
              <a href="#pricing" className={`${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'} transition-colors`}>
                Pricing
              </a>
              <Link to="/register" className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                Get Started
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {mobileMenuOpen ? (
                <FiX className={`w-6 h-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} />
              ) : (
                <FiMenu className={`w-6 h-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`} />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className={`md:hidden ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'} border-t ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className={`block ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Features</a>
              <a href="#templates" className={`block ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Templates</a>
              <a href="#pricing" className={`block ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Pricing</a>
              <Link to="/register" className="block w-full px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg text-center">
                Get Started
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-full mb-6">
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                ✨ Professional Invoice Management System
              </span>
            </div>
            
            <h1 className={`text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Create Beautiful
              <span className="bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent"> Invoices </span>
              in Seconds
            </h1>
            
            <p className={`text-xl mb-10 max-w-3xl mx-auto ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              The easiest way to create, manage, and send professional invoices. 
              Built for Indian businesses with GST support, multiple templates, and instant PDF generation.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link 
                to="/register" 
                className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-xl hover:shadow-2xl flex items-center justify-center space-x-2 text-lg font-semibold"
              >
                <span>Try Now - It's Free</span>
                <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link 
                to="/login"
                className={`px-8 py-4 ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-900'} rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 text-lg font-semibold`}
              >
                <span>Sign In</span>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
                  <div className={`text-4xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {stat.number}
                  </div>
                  <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className={`py-20 ${theme === 'dark' ? 'bg-gray-800/30' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Everything You Need
            </h2>
            <p className={`text-xl ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Powerful features to streamline your invoicing workflow
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`p-8 rounded-2xl ${theme === 'dark' ? 'bg-gray-800/50 hover:bg-gray-800' : 'bg-white hover:shadow-xl'} transition-all duration-200 border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white mb-4">
                  {feature.icon}
                </div>
                <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {feature.title}
                </h3>
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Section */}
      <section id="templates" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Beautiful Templates
            </h2>
            <p className={`text-xl ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Choose from professionally designed invoice templates
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {templates.map((template) => (
              <div 
                key={template.id}
                className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-gray-800/50 hover:bg-gray-800' : 'bg-gray-50 hover:bg-white hover:shadow-xl'} transition-all duration-200 border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} cursor-pointer`}
              >
                <div className={`${template.color} h-48 rounded-xl mb-4 flex items-center justify-center text-white font-semibold`}>
                  Template {template.id}
                </div>
                <h3 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  {template.name}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className={`py-20 ${theme === 'dark' ? 'bg-gray-800/30' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className={`text-4xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Why Choose Arthik?
              </h2>
              <div className="space-y-4">
                {[
                  'Create unlimited invoices for free',
                  'GST/Tax calculations built-in',
                  'Client database management',
                  'Multiple currency support (INR)',
                  'Signature support (draw or type)',
                  'Dark mode for comfortable viewing',
                  'Mobile responsive design',
                  'Secure and private data storage'
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <FiCheck className="w-4 h-4 text-white" />
                    </div>
                    <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} text-lg`}>
                      {benefit}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className={`p-8 rounded-3xl ${theme === 'dark' ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-50'}`}>
              <div className="space-y-6">
                <div className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white'}`}>
                  <h3 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    🚀 Quick Setup
                  </h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Register and start creating invoices in under 2 minutes
                  </p>
                </div>
                <div className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white'}`}>
                  <h3 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    💼 Professional Output
                  </h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Generate PDF invoices that look professionally designed
                  </p>
                </div>
                <div className={`p-6 rounded-2xl ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white'}`}>
                  <h3 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    📊 Complete Control
                  </h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    Track invoice status from draft to payment received
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Simple, Transparent Pricing
            </h2>
            <p className={`text-xl ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Everything you need, completely free
            </p>
          </div>

          <div className="max-w-lg mx-auto">
            <div className={`p-8 rounded-3xl ${theme === 'dark' ? 'bg-gradient-to-br from-gray-800 to-gray-900' : 'bg-gradient-to-br from-blue-500 to-indigo-600'} text-white relative overflow-hidden`}>
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
              <div className="relative">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold mb-2">Free Forever</h3>
                  <div className="text-5xl font-bold mb-2">₹0</div>
                  <p className="text-blue-100">No hidden charges, ever</p>
                </div>
                <div className="space-y-4 mb-8">
                  {[
                    'Unlimited invoices',
                    'All 4 templates',
                    'Client management',
                    'PDF generation',
                    'GST calculations',
                    'Signature support',
                    'Dark/Light theme',
                    'Mobile responsive'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <FiCheck className="w-5 h-5 flex-shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                <Link 
                  to="/register" 
                  className="block w-full py-4 bg-white text-blue-600 rounded-xl text-center font-semibold hover:bg-gray-100 transition-colors"
                >
                  Start Creating Invoices
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-20 ${theme === 'dark' ? 'bg-gray-800/30' : 'bg-gray-50'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className={`text-4xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Ready to Get Started?
          </h2>
          <p className={`text-xl mb-10 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            Join thousands of businesses creating professional invoices with Arthik
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register" 
              className="group px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-xl hover:shadow-2xl flex items-center justify-center space-x-2 text-lg font-semibold"
            >
              <span>Create Your First Invoice</span>
              <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 ${theme === 'dark' ? 'bg-gray-900 border-t border-gray-800' : 'bg-white border-t border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <FiFileText className="w-5 h-5 text-white" />
              </div>
              <span className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Arthik
              </span>
            </div>
            <div className={`text-center md:text-right ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              <p>&copy; 2024 Arthik Invoice Management. All rights reserved.</p>
              <p className="text-sm mt-1">Made with ❤️ for Indian Businesses</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

