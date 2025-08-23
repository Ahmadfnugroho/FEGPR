import React from 'react';

interface AnimatedPulseBorderProps {
  isLoading: boolean;
  children: React.ReactNode;
  className?: string;
}

const AnimatedPulseBorder: React.FC<AnimatedPulseBorderProps> = ({ 
  isLoading, 
  children, 
  className = '' 
}) => {
  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 rounded-lg border-4 border-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-pulse opacity-50">
          <div className="absolute inset-0 animate-spin">
            <div className="absolute inset-0 rounded-lg border-4 border-transparent bg-gradient-to-r from-blue-500 to-transparent"></div>
          </div>
        </div>
      )}
      <div className={`relative z-10 ${isLoading ? 'opacity-70' : ''}`}>
        {children}
      </div>
    </div>
  );
};

export default AnimatedPulseBorder;
