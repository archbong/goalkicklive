"use client";

import useRTL from "@/hooks/useRTL";

import { Component, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import Link from "next/link";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onReset?: () => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: any;
}

export default class HighlightsErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error(
      "Highlights Error Boundary caught an error:",
      error,
      errorInfo,
    );
    this.setState({
      error,
      errorInfo,
    });

    // Log error to monitoring service (optional)
    if (typeof window !== "undefined" && (window as any).Sentry) {
      (window as any).Sentry.captureException(error, { extra: errorInfo });
    }
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
    });
    this.props.onReset?.();
  };

  render() {
    const { isRTL, direction } = useRTL();

    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          className="min-h-screen bg-gray-50 flex items-center justify-center px-4"
          dir={direction}
        >
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Something went wrong
            </h2>

            <p className="text-gray-600 mb-6">
              We encountered an unexpected error while loading the highlights.
              Please try refreshing the page or contact support if the problem
              persists.
            </p>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 font-medium mb-2">
                  Error Details (Development)
                </summary>
                <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.resetError}
                className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <RefreshCw className="w-4 h-4" />
                Try Again
              </button>

              <Link
                href="/"
                className="flex items-center justify-center gap-2 bg-gray-200 text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                <Home className="w-4 h-4" />
                Go Home
              </Link>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Need help?{" "}
                <Link
                  href="/contact"
                  className="text-blue-600 hover:text-blue-700 underline"
                >
                  Contact support
                </Link>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
