import React, { Component, ErrorInfo, ReactNode } from 'react';
import { 
  ExclamationTriangleIcon,
  ArrowPathIcon,
  HomeIcon,
  ChatBubbleLeftRightIcon,
  ClipboardDocumentIcon
} from '@heroicons/react/24/outline';

interface Props {
  children: ReactNode;
  fallbackComponent?: React.ComponentType<ErrorFallbackProps>;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  isolate?: boolean;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
  retryCount: number;
}

interface ErrorFallbackProps {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
  retryCount: number;
  onRetry: () => void;
  onReport: () => void;
}

class ErrorBoundary extends Component<Props, State> {
  private retryTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Generate unique error ID for tracking
    const errorId = `err_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    return {
      hasError: true,
      error,
      errorId
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details
    console.group('🚨 React Error Boundary Caught Error');
    console.error('Error:', error);
    console.error('Error Info:', errorInfo);
    console.error('Component Stack:', errorInfo.componentStack);
    console.error('Error ID:', this.state.errorId);
    console.groupEnd();

    // Update state with error info
    this.setState({ errorInfo });

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Report to error tracking service
    this.reportError(error, errorInfo);
  }

  private reportError = async (error: Error, errorInfo: ErrorInfo) => {
    const errorReport = {
      errorId: this.state.errorId,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      url: window.location.href
    };

    try {
      console.log('Error report prepared:', errorReport);
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  };

  private handleRetry = () => {
    const { retryCount } = this.state;
    const maxRetries = 3;
    
    if (retryCount >= maxRetries) {
      alert('Maksimal percobaan ulang tercapai. Silakan refresh halaman.');
      return;
    }

    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }

    const delay = Math.pow(2, retryCount) * 1000;

    this.retryTimeoutId = setTimeout(() => {
      this.setState({
        hasError: false,
        error: null,
        errorInfo: null,
        retryCount: retryCount + 1
      });
    }, delay);
  };

  private handleReport = () => {
    const { error, errorInfo, errorId } = this.state;
    
    const reportText = `
Error ID: ${errorId}
Time: ${new Date().toLocaleString('id-ID')}
URL: ${window.location.href}

Error Message: ${error?.message || 'Unknown error'}

Component Stack:
${errorInfo?.componentStack || 'No component stack available'}
    `.trim();

    if (navigator.clipboard) {
      navigator.clipboard.writeText(reportText).then(() => {
        alert('Laporan error telah disalin ke clipboard.');
      });
    }
  };

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  render() {
    if (this.state.hasError) {
      const { fallbackComponent: FallbackComponent } = this.props;
      
      if (FallbackComponent) {
        return (
          <FallbackComponent
            error={this.state.error}
            errorInfo={this.state.errorInfo}
            errorId={this.state.errorId}
            retryCount={this.state.retryCount}
            onRetry={this.handleRetry}
            onReport={this.handleReport}
          />
        );
      }

      return (
        <DefaultErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          errorId={this.state.errorId}
          retryCount={this.state.retryCount}
          onRetry={this.handleRetry}
          onReport={this.handleReport}
        />
      );
    }

    return this.props.children;
  }
}

// Default Error Fallback Component
const DefaultErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  errorId,
  retryCount,
  onRetry,
  onReport
}) => {
  const maxRetries = 3;
  const canRetry = retryCount < maxRetries;

  return (
    <div className="min-h-[400px] bg-gray-50 flex flex-col justify-center py-12 px-4">
      <div className="mx-auto max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-lg">
          {/* Error Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <ExclamationTriangleIcon className="w-8 h-8 text-red-600" />
            </div>
          </div>

          {/* Error Title */}
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold text-gray-900 mb-2">
              Oops! Ada yang tidak beres
            </h1>
            <p className="text-gray-600">
              Terjadi kesalahan pada aplikasi.
            </p>
          </div>

          {/* Error ID */}
          <div className="mb-6 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-600">
              <span className="font-medium">ID Error:</span> {errorId}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {canRetry ? (
              <button
                onClick={onRetry}
                className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md text-white bg-navy-blue-600 hover:bg-navy-blue-700 transition-colors"
              >
                <ArrowPathIcon className="w-4 h-4 mr-2" />
                Coba Lagi ({maxRetries - retryCount} tersisa)
              </button>
            ) : (
              <button
                onClick={() => window.location.reload()}
                className="w-full flex items-center justify-center px-4 py-2 text-sm font-medium rounded-md text-white bg-navy-blue-600 hover:bg-navy-blue-700 transition-colors"
              >
                <ArrowPathIcon className="w-4 h-4 mr-2" />
                Refresh Halaman
              </button>
            )}

            <button
              onClick={() => window.location.href = '/'}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <HomeIcon className="w-4 h-4 mr-2" />
              Kembali ke Beranda
            </button>

            <button
              onClick={onReport}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <ClipboardDocumentIcon className="w-4 h-4 mr-2" />
              Salin Laporan Error
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Hook for handling async errors in components
export const useErrorHandler = () => {
  const handleError = React.useCallback((error: Error, context?: string) => {
    console.error(`Error in ${context || 'component'}:`, error);
    throw error;
  }, []);

  return handleError;
};

export default ErrorBoundary;
