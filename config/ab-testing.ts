// goalkicklive/config/ab-testing.ts

/**
 * A/B Testing Configuration for Goalkick Live
 * Optimizes download button text and placement for maximum conversions
 */

export interface ABTestVariant {
  id: string;
  name: string;
  weight: number; // Percentage (0-100)
  enabled: boolean;
  changes: {
    buttonText?: string;
    buttonColor?: string;
    buttonSize?: 'sm' | 'md' | 'lg' | 'xl';
    buttonPosition?: 'sticky' | 'inline' | 'floating';
    ctaMessage?: string;
    valueProp?: string;
    socialProof?: boolean;
    urgency?: boolean;
  };
}

export interface ABTest {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  startDate: string;
  endDate?: string;
  targetAudience: {
    platforms: ('web' | 'mobile' | 'tablet')[];
    locations: string[];
    newUsersOnly: boolean;
    returningUsersOnly: boolean;
  };
  variants: ABTestVariant[];
  metrics: {
    primary: string;
    secondary: string[];
  };
}

// Current active A/B tests
export const ACTIVE_AB_TESTS: ABTest[] = [
  {
    id: 'download-cta-2024-q1',
    name: 'Download Button CTA Optimization',
    description: 'Test different call-to-action texts for download buttons',
    enabled: true,
    startDate: '2024-01-01',
    targetAudience: {
      platforms: ['web', 'mobile', 'tablet'],
      locations: ['global'],
      newUsersOnly: true,
      returningUsersOnly: false,
    },
    variants: [
      {
        id: 'control',
        name: 'Control (Current)',
        weight: 25,
        enabled: true,
        changes: {
          buttonText: 'DOWNLOAD APP',
          buttonColor: 'green',
          buttonSize: 'lg',
        },
      },
      {
        id: 'watch-free',
        name: 'Watch Free Variant',
        weight: 25,
        enabled: true,
        changes: {
          buttonText: 'WATCH FREE',
          buttonColor: 'green',
          buttonSize: 'lg',
          ctaMessage: '7-day free trial',
          valueProp: 'No credit card required',
        },
      },
      {
        id: 'get-app',
        name: 'Get App Variant',
        weight: 25,
        enabled: true,
        changes: {
          buttonText: 'GET THE APP',
          buttonColor: 'blue',
          buttonSize: 'lg',
          ctaMessage: '5M+ downloads',
          socialProof: true,
        },
      },
      {
        id: 'stream-now',
        name: 'Stream Now Variant',
        weight: 25,
        enabled: true,
        changes: {
          buttonText: 'STREAM NOW',
          buttonColor: 'purple',
          buttonSize: 'lg',
          urgency: true,
          valueProp: 'Live matches streaming',
        },
      },
    ],
    metrics: {
      primary: 'download_button_clicks',
      secondary: ['app_store_redirects', 'install_success', 'first_open'],
    },
  },
  {
    id: 'hero-cta-placement',
    name: 'Hero CTA Placement Test',
    description: 'Test different CTA placements in hero section',
    enabled: true,
    startDate: '2024-01-15',
    targetAudience: {
      platforms: ['mobile'],
      locations: ['global'],
      newUsersOnly: false,
      returningUsersOnly: false,
    },
    variants: [
      {
        id: 'control',
        name: 'Control (Inline)',
        weight: 50,
        enabled: true,
        changes: {
          buttonPosition: 'inline',
          buttonText: 'DOWNLOAD & WATCH FREE',
        },
      },
      {
        id: 'sticky-bottom',
        name: 'Sticky Bottom',
        weight: 50,
        enabled: true,
        changes: {
          buttonPosition: 'sticky',
          buttonText: 'WATCH LIVE MATCHES',
          buttonColor: 'gradient',
          urgency: true,
        },
      },
    ],
    metrics: {
      primary: 'hero_cta_clicks',
      secondary: ['scroll_depth', 'time_on_page', 'download_conversion'],
    },
  },
  {
    id: 'value-prop-test',
    name: 'Value Proposition Test',
    description: 'Test different value propositions for football fans',
    enabled: true,
    startDate: '2024-02-01',
    targetAudience: {
      platforms: ['web', 'mobile'],
      locations: ['europe', 'north-america'],
      newUsersOnly: true,
      returningUsersOnly: false,
    },
    variants: [
      {
        id: 'control',
        name: 'Control - Never Miss a Goal',
        weight: 34,
        enabled: true,
        changes: {
          valueProp: 'Never miss a goal again',
          ctaMessage: 'Stream every match live',
        },
      },
      {
        id: 'anywhere',
        name: 'Watch Anywhere',
        weight: 33,
        enabled: true,
        changes: {
          valueProp: 'Watch football anywhere, anytime',
          ctaMessage: 'Perfect for fans on the move',
        },
      },
      {
        id: 'all-leagues',
        name: 'All Leagues',
        weight: 33,
        enabled: true,
        changes: {
          valueProp: 'Every league, every match',
          ctaMessage: '50+ leagues worldwide',
          socialProof: true,
        },
      },
    ],
    metrics: {
      primary: 'value_prop_engagement',
      secondary: ['download_clicks', 'page_shares', 'email_signups'],
    },
  },
];

// Helper function to get variant for a user
export function getVariantForUser(
  testId: string,
  userId: string,
  sessionId: string
): ABTestVariant | null {
  const test = ACTIVE_AB_TESTS.find(t => t.id === testId && t.enabled);

  if (!test) {
    return null;
  }

  // Simple deterministic variant assignment based on user ID
  const hash = simpleHash(userId + testId);
  const randomValue = hash % 100;

  let cumulativeWeight = 0;
  for (const variant of test.variants) {
    if (!variant.enabled) continue;

    cumulativeWeight += variant.weight;
    if (randomValue < cumulativeWeight) {
      return variant;
    }
  }

  // Fallback to first enabled variant
  return test.variants.find(v => v.enabled) || null;
}

// Helper function to get all active tests for a user
export function getActiveTestsForUser(
  userId: string,
  sessionId: string,
  userProperties: {
    isNewUser: boolean;
    isReturningUser: boolean;
    platform: 'web' | 'mobile' | 'tablet';
    location: string;
  }
): Array<{ test: ABTest; variant: ABTestVariant }> {
  const activeTests: Array<{ test: ABTest; variant: ABTestVariant }> = [];

  for (const test of ACTIVE_AB_TESTS) {
    if (!test.enabled) continue;

    // Check if user matches target audience
    const { targetAudience } = test;

    // Check platform
    if (!targetAudience.platforms.includes(userProperties.platform)) {
      continue;
    }

    // Check location (global or specific)
    if (targetAudience.locations[0] !== 'global' &&
        !targetAudience.locations.includes(userProperties.location)) {
      continue;
    }

    // Check user type
    if (targetAudience.newUsersOnly && !userProperties.isNewUser) {
      continue;
    }

    if (targetAudience.returningUsersOnly && !userProperties.isReturningUser) {
      continue;
    }

    // Get variant for this user
    const variant = getVariantForUser(test.id, userId, sessionId);
    if (variant) {
      activeTests.push({ test, variant });
    }
  }

  return activeTests;
}

// Simple hash function for deterministic variant assignment
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

// Tracking events for A/B tests
export interface ABTestEvent {
  testId: string;
  variantId: string;
  eventType: 'impression' | 'click' | 'conversion' | 'engagement';
  eventData: Record<string, any>;
  timestamp: string;
  userId: string;
  sessionId: string;
}

// Utility to track A/B test events
export function trackABTestEvent(event: Omit<ABTestEvent, 'timestamp'>): void {
  const fullEvent: ABTestEvent = {
    ...event,
    timestamp: new Date().toISOString(),
  };

  // In production, send to analytics service
  if (typeof window !== 'undefined' && (window as any).GoalkickTracking) {
    (window as any).GoalkickTracking.trackEvent('ab_test_event', fullEvent);
  }

  // Also log for debugging
  if (process.env.NODE_ENV === 'development') {
    console.log('[A/B Test Event]', fullEvent);
  }
}

// Get optimized CTA text based on A/B tests
export function getOptimizedCTAText(
  userId: string,
  sessionId: string,
  location: string,
  defaultText: string
): string {
  const tests = getActiveTestsForUser(userId, sessionId, {
    isNewUser: true, // You would determine this from user data
    isReturningUser: false,
    platform: 'web', // You would detect this
    location: 'global',
  });

  // Find download CTA test
  const downloadTest = tests.find(t => t.test.id === 'download-cta-2024-q1');

  if (downloadTest && downloadTest.variant.changes.buttonText) {
    return downloadTest.variant.changes.buttonText;
  }

  return defaultText;
}

// Get optimized button color
export function getOptimizedButtonColor(
  userId: string,
  sessionId: string,
  defaultColor: string
): string {
  const tests = getActiveTestsForUser(userId, sessionId, {
    isNewUser: true,
    isReturningUser: false,
    platform: 'web',
    location: 'global',
  });

  const downloadTest = tests.find(t => t.test.id === 'download-cta-2024-q1');

  if (downloadTest && downloadTest.variant.changes.buttonColor) {
    return downloadTest.variant.changes.buttonColor;
  }

  return defaultColor;
}

// Export configuration for different page sections
export const PAGE_SECTIONS = {
  HERO: 'hero',
  LIVE_MATCHES: 'live_matches',
  HOW_IT_WORKS: 'how_it_works',
  FEATURES: 'features',
  FAQ: 'faq',
  TESTIMONIALS: 'testimonials',
  FOOTER: 'footer',
} as const;

export type PageSection = typeof PAGE_SECTIONS[keyof typeof PAGE_SECTIONS];

// Get optimized configuration for a page section
export function getSectionOptimization(
  section: PageSection,
  userId: string,
  sessionId: string
): Record<string, any> {
  const optimizations: Record<string, any> = {};
  const tests = getActiveTestsForUser(userId, sessionId, {
    isNewUser: true,
    isReturningUser: false,
    platform: 'web',
    location: 'global',
  });

  // Apply optimizations based on active tests
  tests.forEach(({ test, variant }) => {
    if (test.id === 'hero-cta-placement' && section === PAGE_SECTIONS.HERO) {
      Object.assign(optimizations, variant.changes);
    }

    if (test.id === 'value-prop-test' && section === PAGE_SECTIONS.HERO) {
      optimizations.valueProp = variant.changes.valueProp;
      optimizations.ctaMessage = variant.changes.ctaMessage;
    }
  });

  return optimizations;
}

// Feature flag system for gradual rollouts
export interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  rolloutPercentage: number; // 0-100
  targetAudience: {
    platforms: ('web' | 'mobile' | 'tablet')[];
    locations: string[];
    userSegments: ('new' | 'returning' | 'premium')[];
  };
}

export const FEATURE_FLAGS: FeatureFlag[] = [
  {
    id: 'live-match-notifications',
    name: 'Live Match Notifications',
    description: 'Push notifications for match events',
    enabled: true,
    rolloutPercentage: 50,
    targetAudience: {
      platforms: ['mobile'],
      locations: ['global'],
      userSegments: ['new', 'returning'],
    },
  },
  {
    id: 'multi-angle-streaming',
    name: 'Multi-Angle Streaming',
    description: 'Switch between different camera angles',
    enabled: false,
    rolloutPercentage: 10,
    targetAudience: {
      platforms: ['web', 'mobile'],
      locations: ['europe', 'north-america'],
      userSegments: ['premium'],
    },
  },
  {
    id: 'watch-party',
    name: 'Watch Party Feature',
    description: 'Watch matches with friends virtually',
    enabled: true,
    rolloutPercentage: 30,
    targetAudience: {
      platforms: ['web', 'mobile'],
      locations: ['global'],
      userSegments: ['new', 'returning'],
    },
  },
];

// Check if feature is enabled for user
export function isFeatureEnabled(
  featureId: string,
  userId: string,
  userProperties: {
    platform: 'web' | 'mobile' | 'tablet';
    location: string;
    userSegment: 'new' | 'returning' | 'premium';
  }
): boolean {
  const feature = FEATURE_FLAGS.find(f => f.id === featureId);

  if (!feature || !feature.enabled) {
    return false;
  }

  // Check target audience
  const { targetAudience } = feature;

  if (!targetAudience.platforms.includes(userProperties.platform)) {
    return false;
  }

  if (!targetAudience.locations.includes(userProperties.location)) {
    return false;
  }

  if (!targetAudience.userSegments.includes(userProperties.userSegment)) {
    return false;
  }

  // Check rollout percentage
  const hash = simpleHash(userId + featureId);
  const randomValue = hash % 100;

  return randomValue < feature.rolloutPercentage;
}
