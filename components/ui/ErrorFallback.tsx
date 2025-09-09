import React from "react";
import { Button } from "@/components/ui/Button";

interface ErrorFallbackProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorFallback({
  message = "Something went wrong. Please try again.",
  onRetry,
}: ErrorFallbackProps) {
  return (
    <div className="flex flex-col items-center justify-center p-6 bg-red-50 rounded-md border border-red-200">
      <p className="text-red-600 mb-4 text-center">{message}</p>
      {onRetry && (
        <Button variant="default" size="sm" onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}
