import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  color = 'cosmic-cyan',
  text 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-3">
      <div className={`animate-spin rounded-full border-2 border-galaxy-700 border-t-${color} ${sizeClasses[size]}`}></div>
      {text && (
        <p className="text-galaxy-300 text-sm animate-pulse">{text}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;