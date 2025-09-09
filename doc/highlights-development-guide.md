# Highlights Feature Development Guide

**Last Updated**: September 9, 2025
**Version**: 2.0

## Overview

The Highlights feature is the core functionality of the Football Highlight platform, providing users with the ability to browse, filter, and watch football match highlights. This guide covers the architecture, components, and best practices for developing and maintaining this feature.

## 🏗️ Architecture

### Frontend Components
```
goalkicklive/components/highlights/
├── HighlightsFilter.tsx      # Filter controls (competition, team, date)
├── HighlightsGrid.tsx        # Responsive grid layout with loading states
├── EnhancedVideoPlayer.tsx   # Custom video player with controls
├── HighlightsErrorBoundary.tsx      # Global error boundary
└── HighlightsGridErrorBoundary.tsx  # Component-level error boundary
```
```
goalkicklive/components/highlights/
├── HighlightsFilter.tsx      # Filter controls (competition, team, date)
├── HighlightsGrid.tsx        # Responsive grid layout with loading states
└── EnhancedVideoPlayer.tsx   # Custom video player with controls
```

### API Endpoints
```
goalkicklive/app/api/highlights/
├── route.ts                  # Main highlights endpoint with filtering + Redis caching
└── filters/
    └── route.ts             # Available filter options endpoint + Redis caching
```
```
goalkicklive/app/api/highlights/
├── route.ts                  # Main highlights endpoint with filtering
└── filters/
    └── route.ts             # Available filter options endpoint
```

### Data Layer
```
goalkicklive/lib/
├── getHighlights.ts         # Data fetching function with caching
├── redis.ts                 # Redis client configuration
├── validators/
│   └── highlight-validator.ts # Zod validation schemas
├── types/
│   └── highlight.ts         # TypeScript interfaces
└── hooks/
    └── useRTL.ts           # RTL layout hook
```
```
goalkicklive/lib/
├── getHighlights.ts         # Data fetching function with caching
├── validators/
│   └── highlight-validator.ts # Zod validation schemas
└── types/
    └── highlight.ts         # TypeScript interfaces
```

## 🎯 Key Components

### HighlightsFilter Component
```typescript
interface HighlightsFilterProps {
  filterOptions: FilterOptions;
  locale: string;
}
```

**Features:**
- Competition dropdown with search
- Team selection filter
- Date range picker
- URL parameter synchronization
- Active filter indicators
- Clear all functionality
- **RTL layout support** for Arabic/Hebrew
- **Locale-aware text direction**
- **Dynamic text alignment** based on locale
```typescript
interface HighlightsFilterProps {
  filterOptions: FilterOptions;
  locale: string;
}
```

**Features:**
- Competition dropdown with search
- Team selection filter
- Date range picker
- URL parameter synchronization
- Active filter indicators
- Clear all functionality

### HighlightsGrid Component
```typescript
interface HighlightsGridProps {
  highlights: UnifiedHighlight[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  locale: string;
}
```

**Features:**
- Responsive grid layout (1-4 columns)
- Loading skeletons
- Error states with retry
- Empty state handling
- Image error fallbacks
- Performance optimizations
- **Wrapped in error boundary**
- **RTL layout support**
- **Dynamic text alignment**
```typescript
interface HighlightsGridProps {
  highlights: UnifiedHighlight[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  locale: string;
}
```

**Features:**
- Responsive grid layout (1-4 columns)
- Loading skeletons
- Error states with retry
- Empty state handling
- Image error fallbacks
- Performance optimizations

### EnhancedVideoPlayer Component
```typescript
interface EnhancedVideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  className?: string;
}
```

**Features:**
- Custom playback controls
- Keyboard shortcuts (Space, K, M, F, Arrows)
- Loading and error states
- Fullscreen support
- Volume control
- Progress bar with seeking
- Accessibility features
- **RTL layout support**
- **Dynamic control positioning**
```typescript
interface EnhancedVideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  className?: string;
}
```

**Features:**
- Custom playback controls
- Keyboard shortcuts (Space, K, M, F, Arrows)
- Loading and error states
- Fullscreen support
- Volume control
- Progress bar with seeking
- Accessibility features

## 🌐 API Endpoints

### GET /api/highlights
**Features:**
- ✅ **Redis caching** (5-minute TTL)
- ✅ Query parameter validation
- ✅ Database query optimization
- ✅ Pagination support
- ✅ Error handling

**Query Parameters:**
- `competition`: Filter by competition slug
- `team`: Filter by team slug  
- `date`: Filter by specific date (YYYY-MM-DD)
- `page`: Pagination page number
- `pageSize`: Number of items per page
**Query Parameters:**
- `competition`: Filter by competition slug
- `team`: Filter by team slug  
- `date`: Filter by specific date (YYYY-MM-DD)
- `page`: Pagination page number
- `pageSize`: Number of items per page

**Response:**
```typescript
{
  highlights: UnifiedHighlight[];
  totalCount: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
```

### GET /api/highlights/filters
**Features:**
- ✅ **Redis caching** (1-hour TTL)
- ✅ Database-driven filter options
- ✅ Error handling
- ✅ Performance optimized

**Response:**
```typescript
{
  competitions: Array<{ value: string; label: string; country: string | null }>;
  teams: Array<{ value: string; label: string; country: string | null }>;
  dateRange: { min: Date; max: Date };
  providers: Array<{ id: string; name: string; count: number }>;
}
```
**Response:**
```typescript
{
  competitions: Array<{ value: string; label: string; country: string | null }>;
  teams: Array<{ value: string; label: string; country: string | null }>;
  dateRange: { min: Date; max: Date };
  providers: Array<{ id: string; name: string; count: number }>;
}
```

## 📊 Data Types

### UnifiedHighlight Interface
```typescript
interface UnifiedHighlight {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: number;
  competition: string;
  teams: { home: string; away: string };
  score?: { home: number; away: number };
  matchDate: Date;
  date?: string; // ISO string for compatibility
  views: number;
  likes: number;
  provider: 'supersport' | 'scorebat';
  providerId: string;
  metadata: {
    quality: string;
    language?: string;
    commentators?: string[];
    tags: string[];
  };
}
```
```typescript
interface UnifiedHighlight {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: number;
  competition: string;
  teams: { home: string; away: string };
  score?: { home: number; away: number };
  matchDate: Date;
  date?: string; // ISO string for compatibility
  views: number;
  likes: number;
  provider: 'supersport' | 'scorebat';
  providerId: string;
  metadata: {
    quality: string;
    language?: string;
    commentators?: string[];
    tags: string[];
  };
}
```

## 🛠️ Development Best Practices

### 1. Performance Optimization
- Use React Cache (`'use cache'`) for data fetching
- Implement **Redis caching** for API responses (5 minutes for highlights, 1 hour for filters)
- Use lazy loading for images and components
- Optimize database queries with proper indexing
- Implement cache invalidation strategies
- Use React Cache (`'use cache'`) for data fetching
- Implement lazy loading for images and components
- Optimize database queries with proper indexing
- Use Redis caching for frequent queries

### 2. Error Handling
- Implement comprehensive **error boundaries** at component and global levels
- Provide meaningful error messages with retry functionality
- Include proper error logging for monitoring and debugging
- Use React Error Boundaries for component-level error isolation
- Implement comprehensive error boundaries
- Provide meaningful error messages
- Include retry functionality for failed operations
- Log errors for monitoring and debugging

### 3. Accessibility
- Use semantic HTML elements
- Provide ARIA labels for interactive elements
- Support keyboard navigation
- Ensure proper color contrast
- Test with screen readers
- **Support RTL layouts** for Arabic/Hebrew languages
- Use semantic HTML elements
- Provide ARIA labels for interactive elements
- Support keyboard navigation
- Ensure proper color contrast
- Test with screen readers

### 4. Internationalization
- Use locale-aware date formatting
- **Support RTL layouts** for Arabic/Hebrew
- Provide translations for all UI elements
- Handle locale-specific number formatting
- Use the `useRTL` hook for dynamic layout direction
- Use locale-aware date formatting
- Support RTL layouts for Arabic/Hebrew
- Provide translations for all UI elements
- Handle locale-specific number formatting

### 5. Testing
- Write unit tests for components
- Test API endpoints with various query parameters
- Perform cross-browser testing
- Test responsive design on multiple devices
- Conduct accessibility audits
- Test **RTL layout** functionality
- Test **Redis caching** behavior
- Write unit tests for components
- Test API endpoints with various query parameters
- Perform cross-browser testing
- Test responsive design on multiple devices
- Conduct accessibility audits

## 🔧 Common Tasks

### Adding a New Filter
1. Update `HighlightFilters` interface
2. Modify API endpoint to handle new parameter
3. Update validation schema
4. Add filter control to `HighlightsFilter` component
5. Update database query logic
6. **Update Redis cache key generation**
1. Update `HighlightFilters` interface
2. Modify API endpoint to handle new parameter
3. Update validation schema
4. Add filter control to `HighlightsFilter` component
5. Update database query logic

### Implementing Caching
1. Use React Cache for client-side caching
2. Implement **Redis caching** for API responses with appropriate TTL
3. Set cache TTL values based on data volatility
4. Implement cache invalidation strategies
5. Handle cache misses gracefully
1. Use React Cache for client-side caching
2. Implement Redis caching for API responses
3. Set appropriate cache TTL values
4. Implement cache invalidation strategies

### Adding RTL Support to Components
1. Import and use the `useRTL` hook
2. Apply `dir={direction}` to container elements
3. Use conditional classes for RTL/LTR styling
4. Test with both LTR and RTL locales
5. Ensure proper text alignment and positioning
1. Create provider adapter implementing `VideoProvider` interface
2. Register provider in `APIServiceFactory`
3. Update type definitions if needed
4. Test data transformation and error handling

## 🐛 Troubleshooting

### Common Issues
1. **TypeScript errors**: Ensure all interfaces are properly defined
2. **API validation failures**: Check Zod validation schemas
3. **Performance issues**: Optimize database queries and implement caching
4. **Video playback problems**: Verify video URLs and CORS settings
5. **Redis connection issues**: Check REDIS_URL environment variable
6. **RTL layout issues**: Verify `dir` attribute and text alignment
1. **TypeScript errors**: Ensure all interfaces are properly defined
2. **API validation failures**: Check Zod validation schemas
3. **Performance issues**: Optimize database queries and implement caching
4. **Video playback problems**: Verify video URLs and CORS settings

### Debugging Tips
- Use browser DevTools to inspect network requests
- Check server logs for API errors
- Test with different query parameters
- Verify database connectivity and query performance
- **Test Redis connectivity** with test scripts
- **Verify RTL layout** with test pages
- Check environment variable configuration
- Use browser DevTools to inspect network requests
- Check server logs for API errors
- Test with different query parameters
- Verify database connectivity and query performance

## 🚀 Deployment Checklist

- [ ] Test all API endpoints with Redis caching
- [ ] Verify responsive design on mobile devices
- [ ] Check accessibility compliance including RTL support
- [ ] Test video playback on different browsers
- [ ] Verify Redis caching strategies and TTL values
- [ ] Monitor performance metrics
- [ ] Set up error tracking and monitoring

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Redis Documentation](https://redis.io/docs/)
- [RTL Styling Guide](https://rtlstyling.com/)
- [Zod Validation](https://zod.dev)
- [React Error Boundaries](https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary)
- [Prisma ORM Documentation](https://www.prisma.io/docs)
- [Zod Validation](https://zod.dev)
- [React Query](https://tanstack.com/query/latest)
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/standards-guidelines/wcag/)
- [Internationalization Best Practices](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl)