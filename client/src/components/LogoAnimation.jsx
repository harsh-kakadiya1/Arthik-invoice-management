import React, { useState, useEffect } from 'react';

const LogoAnimation = ({ onAnimationComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [animationPhase, setAnimationPhase] = useState('initial'); // 'initial', 'zoom', 'fade'

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setAnimationPhase('zoom');
    }, 300); // Start fade in after 300ms

    const timer2 = setTimeout(() => {
      setAnimationPhase('fade');
    }, 2000); // Start fade out after 2 seconds

    const timer3 = setTimeout(() => {
      setIsVisible(false);
      onAnimationComplete();
    }, 3000); // Complete animation after 3 seconds

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onAnimationComplete]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-all duration-500">
      <div 
        className={`transition-all duration-1000 ease-out ${
          animationPhase === 'initial' 
            ? 'scale-100 opacity-0' 
            : animationPhase === 'zoom'
            ? 'scale-100 opacity-100'
            : 'scale-100 opacity-0'
        }`}
        style={{
          filter: animationPhase === 'zoom' ? 'drop-shadow(0 10px 20px rgba(0,0,0,0.2))' : 'none'
        }}
      >
        <img 
          src="/Arthiik_logo.png" 
          alt="Arthik Logo" 
          className="h-40 w-auto"
        />
      </div>
      
      {/* Optional: Add a subtle loading text */}
      {animationPhase === 'zoom' && (
        <div className="absolute bottom-20 text-gray-600 dark:text-gray-300 text-lg font-medium animate-pulse">
          Loading...
        </div>
      )}
    </div>
  );
};

export default LogoAnimation;
