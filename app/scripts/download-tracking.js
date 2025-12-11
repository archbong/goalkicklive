// goalkicklive/app/scripts/download-tracking.js

/**
 * Download Tracking Script for Goalkick Live
 * Tracks app download conversions and user engagement
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    trackingEndpoint: 'https://api.goalkicklive.com/track',
    localStorageKey: 'goalkick_download_tracking',
    sessionStorageKey: 'goalkick_session',
    debug: process.env.NODE_ENV === 'development'
  };

  // Event Types
  const EVENT_TYPES = {
    PAGE_VIEW: 'page_view',
    DOWNLOAD_CLICK: 'download_click',
    APP_STORE_REDIRECT: 'app_store_redirect',
    PLAY_STORE_REDIRECT: 'play_store_redirect',
    INSTALL_SUCCESS: 'install_success',
    FIRST_OPEN: 'first_open',
    MATCH_WATCH_START: 'match_watch_start',
    MATCH_WATCH_COMPLETE: 'match_watch_complete',
    SUBSCRIPTION_START: 'subscription_start'
  };

  // Initialize tracking
  function initTracking() {
    // Generate session ID if not exists
    let sessionId = sessionStorage.getItem(CONFIG.sessionStorageKey);
    if (!sessionId) {
      sessionId = generateUUID();
      sessionStorage.setItem(CONFIG.sessionStorageKey, sessionId);
    }

    // Generate user ID if not exists
    let userId = localStorage.getItem(`${CONFIG.localStorageKey}_user_id`);
    if (!userId) {
      userId = generateUUID();
      localStorage.setItem(`${CONFIG.localStorageKey}_user_id`, userId);
    }

    // Track page view
    trackEvent(EVENT_TYPES.PAGE_VIEW, {
      page_url: window.location.href,
      page_title: document.title,
      referrer: document.referrer,
      user_agent: navigator.userAgent,
      screen_resolution: `${window.screen.width}x${window.screen.height}`,
      language: navigator.language,
      is_mobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    });

    // Set up download button tracking
    setupDownloadTracking();

    // Set up app store redirect tracking
    setupAppStoreTracking();

    // Check for deep links from app
    checkAppDeepLink();
  }

  // Generate UUID v4
  function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  // Track event
  function trackEvent(eventType, eventData = {}) {
    const event = {
      event_id: generateUUID(),
      event_type: eventType,
      timestamp: new Date().toISOString(),
      session_id: sessionStorage.getItem(CONFIG.sessionStorageKey),
      user_id: localStorage.getItem(`${CONFIG.localStorageKey}_user_id`),
      ...eventData
    };

    // Store event locally
    storeEventLocally(event);

    // Send to server (in production)
    if (!CONFIG.debug) {
      sendEventToServer(event);
    }

    // Log in debug mode
    if (CONFIG.debug) {
      console.log('[Goalkick Tracking]', eventType, event);
    }

    return event;
  }

  // Store event locally
  function storeEventLocally(event) {
    try {
      const storedEvents = JSON.parse(localStorage.getItem(CONFIG.localStorageKey) || '[]');
      storedEvents.push(event);

      // Keep only last 100 events
      if (storedEvents.length > 100) {
        storedEvents.splice(0, storedEvents.length - 100);
      }

      localStorage.setItem(CONFIG.localStorageKey, JSON.stringify(storedEvents));
    } catch (error) {
      console.error('Error storing event locally:', error);
    }
  }

  // Send event to server
  function sendEventToServer(event) {
    // Use beacon API for better reliability
    if (navigator.sendBeacon) {
      const blob = new Blob([JSON.stringify(event)], { type: 'application/json' });
      navigator.sendBeacon(CONFIG.trackingEndpoint, blob);
    } else {
      // Fallback to fetch
      fetch(CONFIG.trackingEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
        keepalive: true // Keep request alive after page unload
      }).catch(error => {
        console.error('Error sending tracking event:', error);
      });
    }
  }

  // Set up download button tracking
  function setupDownloadTracking() {
    // Track all download buttons
    document.addEventListener('click', function(event) {
      const target = event.target;
      const downloadButton = target.closest('[data-track-download]');

      if (downloadButton) {
        const platform = downloadButton.getAttribute('data-track-platform') || 'unknown';
        const location = downloadButton.getAttribute('data-track-location') || 'unknown';

        trackEvent(EVENT_TYPES.DOWNLOAD_CLICK, {
          platform: platform,
          button_location: location,
          button_text: downloadButton.textContent.trim(),
          page_section: getPageSection(downloadButton)
        });
      }
    });
  }

  // Set up app store redirect tracking
  function setupAppStoreTracking() {
    // Intercept app store links
    document.addEventListener('click', function(event) {
      const target = event.target;
      const link = target.closest('a[href*="apps.apple.com"], a[href*="play.google.com"]');

      if (link) {
        event.preventDefault();

        const isAppStore = link.href.includes('apps.apple.com');
        const eventType = isAppStore ? EVENT_TYPES.APP_STORE_REDIRECT : EVENT_TYPES.PLAY_STORE_REDIRECT;

        trackEvent(eventType, {
          store_url: link.href,
          referrer: window.location.href
        }).then(() => {
          // Redirect after tracking
          window.location.href = link.href;
        });
      }
    }, true);
  }

  // Check for app deep link
  function checkAppDeepLink() {
    // Check URL for deep link parameters
    const urlParams = new URLSearchParams(window.location.search);
    const installSource = urlParams.get('install_source');
    const campaign = urlParams.get('utm_campaign');

    if (installSource === 'app_store' || installSource === 'play_store') {
      trackEvent(EVENT_TYPES.INSTALL_SUCCESS, {
        install_source: installSource,
        campaign: campaign,
        landing_page: document.referrer
      });

      // Clean URL
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }

  // Get page section from element
  function getPageSection(element) {
    let current = element;
    while (current) {
      if (current.getAttribute('data-page-section')) {
        return current.getAttribute('data-page-section');
      }
      current = current.parentElement;
    }

    // Fallback to section detection
    const sections = ['hero', 'features', 'matches', 'testimonials', 'faq', 'cta'];
    for (const section of sections) {
      if (element.closest(`[id*="${section}"], [class*="${section}"]`)) {
        return section;
      }
    }

    return 'unknown';
  }

  // Expose public API
  window.GoalkickTracking = {
    trackEvent: trackEvent,
    trackDownloadClick: function(platform, location) {
      return trackEvent(EVENT_TYPES.DOWNLOAD_CLICK, {
        platform: platform,
        button_location: location
      });
    },
    trackAppOpen: function() {
      return trackEvent(EVENT_TYPES.FIRST_OPEN, {
        app_version: '1.0.0',
        os: getOS(),
        device_model: getDeviceModel()
      });
    },
    trackMatchWatch: function(matchId, league, duration) {
      return trackEvent(EVENT_TYPES.MATCH_WATCH_START, {
        match_id: matchId,
        league: league,
        watch_duration: duration
      });
    },
    getSessionId: function() {
      return sessionStorage.getItem(CONFIG.sessionStorageKey);
    },
    getUserId: function() {
      return localStorage.getItem(`${CONFIG.localStorageKey}_user_id`);
    },
    clearData: function() {
      localStorage.removeItem(CONFIG.localStorageKey);
      localStorage.removeItem(`${CONFIG.localStorageKey}_user_id`);
      sessionStorage.removeItem(CONFIG.sessionStorageKey);
    }
  };

  // Helper functions
  function getOS() {
    const userAgent = navigator.userAgent;
    if (/iPhone|iPad|iPod/i.test(userAgent)) return 'iOS';
    if (/Android/i.test(userAgent)) return 'Android';
    if (/Windows/i.test(userAgent)) return 'Windows';
    if (/Mac/i.test(userAgent)) return 'macOS';
    if (/Linux/i.test(userAgent)) return 'Linux';
    return 'Unknown';
  }

  function getDeviceModel() {
    const userAgent = navigator.userAgent;
    if (/iPhone/i.test(userAgent)) return 'iPhone';
    if (/iPad/i.test(userAgent)) return 'iPad';
    if (/Android/i.test(userAgent)) {
      // Extract Android device model
      const match = userAgent.match(/Android.*;\s([^;]+)\sBuild/i);
      return match ? match[1] : 'Android Device';
    }
    return 'Unknown';
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTracking);
  } else {
    initTracking();
  }

})();
