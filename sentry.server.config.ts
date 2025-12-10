// goalkicklive/sentry.server.config.ts
import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.SENTRY_DSN;

Sentry.init({
  dsn: SENTRY_DSN,
  environment: process.env.NODE_ENV,
  enabled: process.env.NODE_ENV === "production",

  // Performance Monitoring
  integrations: [
    Sentry.httpIntegration(),
    Sentry.prismaIntegration(),
    Sentry.redisIntegration(),
  ],

  // Tracing
  tracesSampleRate: 0.1,

  // Filter out common noise
  beforeSend(event, hint) {
    const error = hint?.originalException;

    // Ignore specific errors
    if (error instanceof Error) {
      // Ignore database connection errors (handled by retry logic)
      if (
        error.message.includes("database") ||
        error.message.includes("connection")
      ) {
        return null;
      }

      // Ignore Redis connection errors
      if (
        error.message.includes("redis") ||
        error.message.includes("ECONNREFUSED")
      ) {
        return null;
      }

      // Ignore validation errors (already handled by the application)
      if (
        error.message.includes("validation") ||
        error.message.includes("Validation")
      ) {
        return null;
      }
    }

    return event;
  },

  // Add custom tags for server context
  initialScope: (scope) => {
    scope.setTag("runtime", "node");
    scope.setTag("region", process.env.AWS_REGION || "unknown");
    scope.setTag("service", "goalkicklive-api");
    return scope;
  },
});
