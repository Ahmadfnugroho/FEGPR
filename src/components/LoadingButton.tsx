import React from 'react';
import LoadingSpinner from './LoadingSpinner';

interface LoadingButtonProps {
  isLoading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  rounded?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading = false,
  disabled = false,
  type = 'button',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  rounded = false,
  onClick,
  children,
  className = ''
}) => {
  // Base classes
  const baseClasses = 'relative font-medium shadow transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Size classes
  const sizeClasses = {
    sm: 'py-1 px-3 text-xs',
    md: 'py-2 px-4 text-sm',
    lg: 'py-3 px-6 text-base'
  };
  
  // Variant classes - updated for new navy blue palette
  const variantClasses = {
    primary: 'bg-pop-primary text-navy-blue-50 hover:bg-pop-hover focus:ring-navy-blue-800/50',
    secondary: 'bg-navy-blue-500 text-navy-blue-50 hover:bg-navy-blue-600 focus:ring-navy-blue-500/50',
    accent: 'bg-navy-blue-800 text-navy-blue-50 hover:bg-navy-blue-950 focus:ring-navy-blue-800/50',
    outline: 'bg-transparent border border-navy-blue-800 text-navy-blue-800 hover:bg-navy-blue-800/10 focus:ring-navy-blue-800/30',
    ghost: 'bg-transparent hover:bg-navy-blue-50 text-navy-blue-950 hover:text-navy-blue-800 focus:ring-navy-blue-800/20 dark:text-navy-blue-50 dark:hover:bg-navy-blue-900/60 dark:hover:text-navy-blue-50'
  };
  
  // Width and rounded classes
  const widthClass = fullWidth ? 'w-full' : '';
  const roundedClass = rounded ? 'rounded-full' : 'rounded-lg';
  
  // Disabled classes
  const disabledClasses = (disabled || isLoading) ? 'opacity-70 cursor-not-allowed' : 'hover:translate-y-[-2px] hover:shadow-md';
  
  // Combine all classes
  const buttonClasses = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${widthClass}
    ${roundedClass}
    ${disabledClasses}
    ${className}
  `;
  
  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <>
          <span className="opacity-0">{children}</span>
          <span className="absolute inset-0 flex items-center justify-center">
            <LoadingSpinner 
              type="spinner" 
              size="sm" 
              color={variant === 'outline' || variant === 'ghost' ? 'primary' : 'light'} 
            />
          </span>
        </>
      ) : children}
    </button>
  );
};

export default LoadingButton;