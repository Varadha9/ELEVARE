// Component — React class component base (ErrorBoundary must be a class component)
// Functional components cannot catch render errors, so a class is required here
import { Component } from 'react';
// AlertCircle — error icon shown in the fallback UI
import { AlertCircle, RefreshCw } from 'lucide-react';
// Button — reusable button for the "Refresh Page" action
import { Button } from './Button';

// ErrorBoundary — catches unhandled JavaScript errors in any child component tree
// Prevents the entire app from crashing by showing a friendly fallback UI instead
// Wraps every page in App.jsx so errors are isolated per route
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    // hasError — controls whether to show the fallback UI or the normal children
    // error — stores the caught error for potential logging
    this.state = { hasError: false, error: null };
  }

  // getDerivedStateFromError — React lifecycle called when a child throws
  // Returns new state to trigger the fallback UI render
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  // componentDidCatch — called after getDerivedStateFromError
  // Used for logging the error to the console (or an error tracking service)
  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    // If an error was caught, show the fallback UI instead of the broken component
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Oops! Something went wrong
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              We encountered an unexpected error. Please try refreshing the page.
            </p>
            {/* Full page reload resets the React component tree and clears the error */}
            <Button
              onClick={() => window.location.reload()}
              className="w-full flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Page
            </Button>
          </div>
        </div>
      );
    }

    // No error — render children normally
    return this.props.children;
  }
}
