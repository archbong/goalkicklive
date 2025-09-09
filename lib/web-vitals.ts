// goalkicklive/lib/web-vitals.ts
import { ReportHandler, Metric } from 'web-vitals';

interface WebVitalsOptions {
  onReport?: (metric: Metric) => void;
  analyticsId?: string;
  sampleRate?: number;
}

class WebVitalsMonitor {
  private options: WebVitalsOptions;
  private isMonitoring = false;

  constructor(options: WebVitalsOptions = {}) {
    this.options = {
      sampleRate: 1.0,
      ...options,
    };
  }

  startMonitoring() {
    if (this.isMonitoring || typeof window === 'undefined') {
      return;
    }

    this.isMonitoring = true;

    // Only monitor a sample of users based on sampleRate
    if (Math.random() > (this.options.sampleRate || 1.0)) {
      return;
    }

    import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB, onINP }) => {
      const reportHandler: ReportHandler = (metric) => {
        this.handleMetric(metric);
        this.options.onReport?.(metric);
      };

      // Core Web Vitals
      onCLS(reportHandler);
      onFID(reportHandler);
      onLCP(reportHandler);

      // Additional metrics
      onFCP(reportHandler);
      onTTFB(reportHandler);
      onINP(reportHandler);

      console.log('📊 Web Vitals monitoring started');
    }).catch((error) => {
      console.warn('Failed to load web-vitals:', error);
      this.isMonitoring = false;
    });
  }

  private handleMetric(metric: Metric) {
    const { name, value, rating } = metric;

    // Send to analytics if configured
    if (this.options.analyticsId) {
      this.sendToAnalytics(metric);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`📈 ${name}:`, value, `(${rating})`);
    }

    // Track poor metrics for alerting
    if (rating === 'poor') {
      this.trackPoorMetric(metric);
    }
  }

  private sendToAnalytics(metric: Metric) {
    const { name, value, rating, id } = metric;

    // Use navigator.sendBeacon for reliable delivery
    const data = {
      v: 1,
      name,
      value: Math.round(value),
      rating,
      id,
      page: window.location.pathname,
      timestamp: Date.now(),
    };

    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
      navigator.sendBeacon(`/api/analytics/web-vitals`, blob);
    } else {
      // Fallback to fetch
      fetch('/api/analytics/web-vitals', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
      }).catch(() => {
        // Silent fail for analytics
      });
    }
  }

  private trackPoorMetric(metric: Metric) {
    // Send poor metrics to error tracking service
    const poorMetricEvent = {
      type: 'web_vital_poor',
      metric: metric.name,
      value: metric.value,
      rating: metric.rating,
      page: window.location.pathname,
      userAgent: navigator.userAgent,
      connection: (navigator as any).connection?.effectiveType,
    };

    // Send to error tracking (Sentry, etc.)
    if (typeof window !== 'undefined' && (window as any).Sentry) {
      (window as any).Sentry.captureMessage(`Poor Web Vital: ${metric.name}`, {
        level: 'warning',
        extra: poorMetricEvent,
      });
    }
  }

  getMetricsSummary(): Promise<Record<string, number>> {
    return import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB, getINP }) => {
      return Promise.all([
        getCLS({}, true),
        getFID({}, true),
        getFCP({}, true),
        getLCP({}, true),
        getTTFB({}, true),
        getINP({}, true),
      ]).then(([cls, fid, fcp, lcp, ttfb, inp]) => ({
        CLS: cls.value,
        FID: fid.value,
        FCP: fcp.value,
        LCP: lcp.value,
        TTFB: ttfb.value,
        INP: inp.value,
      }));
    });
  }

  stopMonitoring() {
    this.isMonitoring = false;
  }
}

// Singleton instance
let webVitalsMonitor: WebVitalsMonitor | null = null;

export function initWebVitals(options?: WebVitalsOptions): WebVitalsMonitor {
  if (!webVitalsMonitor) {
    webVitalsMonitor = new WebVitalsMonitor(options);
  }
  return webVitalsMonitor;
}

export function getWebVitalsMonitor(): WebVitalsMonitor | null {
  return webVitalsMonitor;
}

// Default export for easy use
export default WebVitalsMonitor;

// Utility function to start monitoring with default options
export function startWebVitalsMonitoring(options?: WebVitalsOptions) {
  const monitor = initWebVitals(options);
  monitor.startMonitoring();
  return monitor;
}

// Type exports
export type { WebVitalsOptions };
