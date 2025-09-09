"use client";

import useRTL from "@/hooks/useRTL";

import { Component, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

interface Props {
  children: ReactNode;
  onRetry?: () => void;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class HighlightsGridErrorBoundary extends Component<
  Props,
  State
> {
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
    console.error("HighlightsGrid Error:", error, errorInfo);

    // Log to error monitoring service if available
    if (typeof window !== "undefined" && (window as any).Sentry) {
      (window as any).Sentry.captureException(error, {
        extra: errorInfo,
        tags: { component: "HighlightsGrid" },
      });
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: undefined,
    });
    this.props.onRetry?.();
  };

  render() {
    const { isRTL, direction } = useRTL();

    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          className="flex flex-col items-center justify-center py-16 px-4 text-center"
          dir={direction}
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>

          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {isRTL ? "فشل تحميل أبرز المباريات" : "Failed to load highlights"}
          </h3>

          <p className="text-gray-600 mb-6 max-w-md">
            {isRTL
              ? "واجهنا مشكلة أثناء تحميل أبرز المباريات. قد تكون هذه مشكلة مؤقتة."
              : "We encountered a problem while loading the match highlights. This might be a temporary issue."}
          </p>

          <button
            onClick={this.handleRetry}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            {isRTL ? "حاول مرة أخرى" : "Try Again"}
          </button>

          {process.env.NODE_ENV === "development" && this.state.error && (
            <details className="mt-6 text-left w-full max-w-md">
              <summary className="cursor-pointer text-sm text-gray-500 font-medium">
                Error Details (Development)
              </summary>
              <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto mt-2">
                {this.state.error.toString()}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
