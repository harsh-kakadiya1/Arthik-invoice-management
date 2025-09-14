import React from 'react';
import Header from './Header';

const MainLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-dark-bg-primary">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
