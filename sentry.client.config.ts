// goalkicklive/sentry.client.config.ts
import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn: SENTRY_DSN,
  environment: process.env.NODE_ENV,
  enabled: process.env.NODE_ENV === "production",

  // Performance Monitoring
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],

  // Tracing
  tracesSampleRate: 0.1,

  // Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  // Filter out common noise
  beforeSend(event, hint) {
    const error = hint?.originalException;

    // Ignore specific errors
    if (error instanceof Error) {
      // Ignore network errors
      if (
        error.message.includes("Network Error") ||
        error.message.includes("Failed to fetch")
      ) {
        return null;
      }

      // Ignore common browser-specific errors
      if (
        error.message.includes("ResizeObserver") ||
        error.message.includes("canceled")
      ) {
        return null;
      }
    }

    return event;
  },

  // Ignore URLs
  denyUrls: [
    // Chrome extensions
    /extensions\//i,
    /^chrome:\/\//i,
    // Browser extensions
    /^moz-extension:\/\//i,
  ],
});
