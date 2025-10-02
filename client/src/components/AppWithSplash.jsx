import React, { useState } from 'react';
import LogoAnimation from './LogoAnimation';

const AppWithSplash = ({ children }) => {
  const [showMainContent, setShowMainContent] = useState(false);
  const [isAnimating, setIsAnimating] = useState(true);

  const handleAnimationComplete = () => {
    setIsAnimating(false);
    // Small delay to ensure smooth transition
    setTimeout(() => {
      setShowMainContent(true);
    }, 100);
  };

  return (
    <>
      {isAnimating && (
        <LogoAnimation onAnimationComplete={handleAnimationComplete} />
      )}
      {showMainContent && (
        <div className="animate-fadeIn">
          {children}
        </div>
      )}
    </>
  );
};

export default AppWithSplash;
