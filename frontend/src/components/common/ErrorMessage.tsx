import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ 
  message, 
  onRetry, 
  showRetry = true 
}) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8 bg-galaxy-800/50 rounded-2xl border border-galaxy-700/50">
      <div className="p-3 bg-error-500/20 rounded-full">
        <AlertTriangle className="h-8 w-8 text-error-400" />
      </div>
      
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold text-white">Something went wrong</h3>
        <p className="text-galaxy-300 max-w-md">{message}</p>
      </div>

      {showRetry && onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center space-x-2 px-4 py-2 bg-cosmic-purple hover:bg-cosmic-purple/80 text-white rounded-lg transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Try Again</span>
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;