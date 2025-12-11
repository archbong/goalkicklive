// Global type declarations for the GoalkickLive application

interface GoalkickTracking {
  getUserId(): string;
  getSessionId(): string;
  trackDownloadClick(platform: string, location: string): void;
  trackEvent(eventName: string, eventData: Record<string, any>): void;
}

// Extend the Window interface to include GoalkickTracking
interface Window {
  GoalkickTracking?: GoalkickTracking;
}
