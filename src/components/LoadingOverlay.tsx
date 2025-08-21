import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  spinnerType?: 'spinner' | 'dots' | 'pulse';
  spinnerSize?: 'sm' | 'md' | 'lg';
  spinnerColor?: 'primary' | 'secondary' | 'accent' | 'light' | 'dark';
  fullScreen?: boolean;
  transparent?: boolean;
  children?: React.ReactNode;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  message = 'Memuat...',
  spinnerType = 'spinner',
  spinnerSize = 'md',
  spinnerColor = 'primary',
  fullScreen = false,
  transparent = false,
  children
}) => {
  if (!isLoading) return <>{children}</>;

  const overlayClasses = `
    flex flex-col items-center justify-center
    ${fullScreen ? 'fixed inset-0 z-50' : 'absolute inset-0 z-10'}
    ${transparent ? 'bg-white/70 dark:bg-dark/70 backdrop-blur-sm' : 'bg-white dark:bg-dark'}
    transition-all duration-300
  `;

  return (
    <div className="relative">
      {children}
      
      <div className={overlayClasses}>
        <LoadingSpinner 
          type={spinnerType} 
          size={spinnerSize} 
          color={spinnerColor} 
        />
        
        {message && (
          <p className="mt-4 text-dark dark:text-light font-medium animate-pulse">
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default LoadingOverlay;