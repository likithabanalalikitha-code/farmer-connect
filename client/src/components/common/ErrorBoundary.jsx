import React from 'react';
import { AlertOctagon, RefreshCw } from 'lucide-react';
import Button from './Button';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-earth-50 dark:bg-earth-950 text-earth-900 dark:text-earth-100">
          <div className="max-w-md w-full bg-white dark:bg-earth-900 rounded-3xl p-8 border border-earth-200 dark:border-earth-800 shadow-xl text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-950/60 text-red-600 flex items-center justify-center mx-auto mb-5">
              <AlertOctagon className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
            <p className="text-sm text-earth-500 dark:text-earth-400 mb-6">
              An unexpected interface error occurred. You can safely try reloading the page to restore your session.
            </p>
            <Button
              onClick={this.handleReset}
              variant="primary"
              size="md"
              icon={RefreshCw}
              className="w-full"
            >
              Try Again
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
