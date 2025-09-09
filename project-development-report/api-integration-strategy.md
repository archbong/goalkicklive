# API Integration Strategy: Supersport & Scorebat APIs

## Overview
This document outlines the comprehensive strategy for integrating both Supersport (public) and Scorebat (paid) APIs into the football highlights platform. The integration will serve both the web application (Next.js) and mobile application (Flutter) through unified API endpoints.

## API Provider Analysis

### 1. Supersport API (Public)
**Base URL:** `https://supersport.com/apix/`
**Key Endpoints:**
- `/guide/v5.3/livenow` - Live matches and highlights
- `/guide/v5.3/livenow?countryCode=de&live=true` - Country-specific live content
- `/content/v5/countries` - Available countries and regions

**Features:**
- Free access
- Live match data
- Country-specific content
- Basic match information
- Limited video content (mostly metadata)

### 2. Scorebat API (Paid)
**Base URL:** `https://www.scorebat.com/video-api/`
**Key Features:**
- Comprehensive video highlights
- Multiple competition coverage
- High-quality video streams
- Detailed match metadata
- Embeddable video content

**Pricing Model:**
- Subscription-based (requires API key)
- Rate limits based on plan
- Commercial use licensing

## Architecture Design

### Unified API Layer
```
Web App (Next.js) → Unified API Endpoints → API Gateway → Provider Adapters → External APIs
Mobile App (Flutter) ↗
```

### Provider Adapter Pattern
```typescript
interface VideoProvider {
  getHighlights(filters?: HighlightFilters): Promise<Highlight[]>;
  getLiveMatches(): Promise<LiveMatch[]>;
  getCompetitions(): Promise<Competition[]>;
  getTeams(): Promise<Team[]>;
}

class SupersportAdapter implements VideoProvider {
  // Implementation for Supersport API
}

class ScorebatAdapter implements VideoProvider {
  // Implementation for Scorebat API
}

class UnifiedVideoService {
  private providers: VideoProvider[];
  
  async getHighlights(filters: HighlightFilters): Promise<Highlight[]> {
    // Aggregate results from all providers
    // Implement fallback logic
    // Handle rate limiting and errors
  }
}
```

## API Endpoint Design

### Unified Endpoints for Web & Mobile

#### 1. GET /api/v1/highlights
**Purpose:** Fetch highlights from all available providers
**Query Parameters:**
```typescript
interface HighlightsQuery {
  competition?: string;
  team?: string;
  date?: string; // ISO date
  page?: number;
  pageSize?: number;
  provider?: 'all' | 'supersport' | 'scorebat';
}
```

**Response:**
```typescript
interface HighlightsResponse {
  highlights: UnifiedHighlight[];
  totalCount: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
  providers: {
    supersport: number;
    scorebat: number;
  };
}
```

#### 2. GET /api/v1/highlights/filters
**Purpose:** Get available filter options across providers
**Response:**
```typescript
interface FilterOptions {
  competitions: string[];
  teams: string[];
  dateRange: {
    min: Date;
    max: Date;
  };
  providers: Array<{
    id: string;
    name: string;
    count: number;
  }>;
}
```

#### 3. GET /api/v1/highlights/[id]
**Purpose:** Get detailed highlight information
**Response:** `UnifiedHighlight`

#### 4. GET /api/v1/live
**Purpose:** Get live matches (primarily from Supersport)
**Response:** `LiveMatch[]`

#### 5. GET /api/v1/competitions
**Purpose:** Get available competitions
**Response:** `Competition[]`

## Data Models

### Unified Highlight Interface
```typescript
interface UnifiedHighlight {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  embedUrl?: string;
  duration: number;
  competition: string;
  teams: {
    home: string;
    away: string;
  };
  score?: {
    home: number;
    away: number;
  };
  matchDate: Date;
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

### Provider-Specific Adapters

#### Supersport Adapter Implementation
```typescript
class SupersportAdapter {
  private baseUrl = 'https://supersport.com/apix';
  private apiKey?: string;

  async getHighlights(filters: HighlightFilters): Promise<Highlight[]> {
    try {
      const response = await fetch(`${this.baseUrl}/guide/v5.3/livenow`, {
        headers: this.getHeaders(),
      });
      
      const data = await response.json();
      return this.transformSupersportData(data);
    } catch (error) {
      console.error('Supersport API error:', error);
      return [];
    }
  }

  private transformSupersportData(data: any): Highlight[] {
    // Transform Supersport-specific format to unified format
    return data.items.map((item: any) => ({
      id: `supersport_${item.id}`,
      title: item.title,
      // ... other transformations
    }));
  }
}
```

#### Scorebat Adapter Implementation
```typescript
class ScorebatAdapter {
  private baseUrl = 'https://www.scorebat.com/video-api';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getHighlights(filters: HighlightFilters): Promise<Highlight[]> {
    try {
      const response = await fetch(this.baseUrl, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      return this.transformScorebatData(data);
    } catch (error) {
      console.error('Scorebat API error:', error);
      return [];
    }
  }

  private transformScorebatData(data: any): Highlight[] {
    // Transform Scorebat-specific format to unified format
    return data.map((item: any) => ({
      id: `scorebat_${item.title.replace(/\s+/g, '_').toLowerCase()}`,
      title: item.title,
      // ... other transformations
    }));
  }
}
```

## Implementation Strategy

### Phase 1: Foundation Setup
1. **Environment Configuration**
   ```bash
   # .env.local
   SCOREBAT_API_KEY=your_scorebat_api_key
   SUPERSPORT_API_ENABLED=true
   API_RATE_LIMIT=100
   ```
2. **API Service Factory**
   ```typescript
   class APIServiceFactory {
     static createVideoService(): VideoService {
       const providers: VideoProvider[] = [];
       
       if (process.env.SUPERSPORT_API_ENABLED === 'true') {
         providers.push(new SupersportAdapter());
       }
       
       if (process.env.SCOREBAT_API_KEY) {
         providers.push(new ScorebatAdapter(process.env.SCOREBAT_API_KEY));
       }
       
       return new UnifiedVideoService(providers);
     }
   }
   ```

### Phase 2: Core Integration
1. **API Route Implementation**
   ```typescript
   // app/api/v1/highlights/route.ts
   export async function GET(request: Request) {
     const { searchParams } = new URL(request.url);
     const filters = parseFilters(searchParams);
     
     const videoService = APIServiceFactory.createVideoService();
     const highlights = await videoService.getHighlights(filters);
     
     return NextResponse.json({
       highlights,
       totalCount: highlights.length,
       page: 1,
       pageSize: highlights.length,
       hasMore: false,
     });
   }
   ```

2. **Rate Limiting & Caching**
   ```typescript
   import { rateLimit } from '@/lib/rate-limit';
   import { cache } from 'react';
   
   export const getHighlights = cache(async (filters: HighlightFilters) => {
     // Implement caching with Redis
   });
   ```

### Phase 3: Advanced Features
1. **Fallback Mechanism**
   ```typescript
   class UnifiedVideoService {
     async getHighlights(filters: HighlightFilters): Promise<Highlight[]> {
       let results: Highlight[] = [];
       
       for (const provider of this.providers) {
         try {
           const providerResults = await provider.getHighlights(filters);
           results = [...results, ...providerResults];
           
           if (results.length >= filters.pageSize) {
             break; // Stop if we have enough results
           }
         } catch (error) {
           console.warn(`Provider ${provider.constructor.name} failed:`, error);
           // Continue to next provider
         }
       }
       
       return this.deduplicateAndSort(results);
     }
   }
   ```

2. **Provider Prioritization**
   ```typescript
   const providerPriority = {
     scorebat: 1, // Highest priority (paid, better quality)
     supersport: 2, // Lower priority (free, basic content)
   };
   ```

## Mobile App Integration (Flutter)

### API Client Design
```dart
class HighlightsApiClient {
  final String baseUrl;
  final String? apiKey;

  Future<HighlightsResponse> getHighlights({
    String? competition,
    String? team,
    DateTime? date,
    int page = 1,
    int pageSize = 20,
  }) async {
    final response = await http.get(
      Uri.parse('$baseUrl/api/v1/highlights'),
      headers: {
        if (apiKey != null) 'Authorization': 'Bearer $apiKey',
        'Content-Type': 'application/json',
      },
    );
    
    return HighlightsResponse.fromJson(jsonDecode(response.body));
  }
}
```

### Response Handling
```dart
class HighlightsResponse {
  final List<Highlight> highlights;
  final int totalCount;
  final int page;
  final int pageSize;
  final bool hasMore;

  factory HighlightsResponse.fromJson(Map<String, dynamic> json) {
    return HighlightsResponse(
      highlights: (json['highlights'] as List)
          .map((highlight) => Highlight.fromJson(highlight))
          .toList(),
      totalCount: json['totalCount'],
      page: json['page'],
      pageSize: json['pageSize'],
      hasMore: json['hasMore'],
    );
  }
}
```

## Performance Optimization

### 1. Caching Strategy
```typescript
// Redis caching implementation
const redis = new Redis(process.env.REDIS_URL);

const CACHE_TTL = 300; // 5 minutes
const CACHE_PREFIX = 'highlights:';

async function getCachedHighlights(filters: HighlightFilters) {
  const cacheKey = `${CACHE_PREFIX}${JSON.stringify(filters)}`;
  const cached = await redis.get(cacheKey);
  
  if (cached) {
    return JSON.parse(cached);
  }
  
  const results = await fetchFromProviders(filters);
  await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(results));
  return results;
}
```

### 2. Rate Limiting
```typescript
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, '60 s'), // 100 requests per minute
});

export async function rateLimitRequest(identifier: string) {
  const { success } = await ratelimit.limit(identifier);
  return success;
}
```

## Error Handling & Monitoring

### 1. Comprehensive Error Handling
```typescript
class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public provider?: string
  ) {
    super(message);
  }
}

// Global error handler
export async function handleApiError(error: unknown) {
  if (error instanceof APIError) {
    return NextResponse.json(
      { error: error.message, provider: error.provider },
      { status: error.statusCode }
    );
  }
  
  return NextResponse.json(
    { error: 'Internal server error' },
    { status: 500 }
  );
}
```

### 2. Monitoring & Analytics
```typescript
// Track API usage and performance
interface APIMetrics {
  provider: string;
  responseTime: number;
  success: boolean;
  resultCount: number;
}

function trackAPIMetrics(metrics: APIMetrics) {
  // Send to analytics service (e.g., Mixpanel, Google Analytics)
  console.log('API Metrics:', metrics);
}
```

## Security Considerations

### 1. API Key Management
```typescript
// Secure API key storage and rotation
class APIKeyManager {
  private static keys: Map<string, string> = new Map();
  
  static getKey(provider: string): string | undefined {
    return this.keys.get(provider);
  }
  
  static rotateKey(provider: string, newKey: string) {
    this.keys.set(provider, newKey);
  }
}
```

### 2. Input Validation
```typescript
import { z } from 'zod';

const highlightsQuerySchema = z.object({
  competition: z.string().optional(),
  team: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

function validateQueryParams(searchParams: URLSearchParams) {
  return highlightsQuerySchema.parse(Object.fromEntries(searchParams));
}
```

## Deployment Strategy

### 1. Staging Environment
```yaml
# docker-compose.staging.yml
environment:
  - SCOREBAT_API_KEY=staging_key
  - SUPERSPORT_API_ENABLED=true
  - REDIS_URL=redis://redis:6379
```

### 2. Production Environment
```yaml
# docker-compose.production.yml
environment:
  - SCOREBAT_API_KEY=production_key
  - SUPERSPORT_API_ENABLED=true
  - REDIS_URL=redis://redis:6379
  - RATE_LIMIT_ENABLED=true
```

## Testing Strategy

### 1. Unit Tests
```typescript
// __tests__/adapters/SupersportAdapter.test.ts
describe('SupersportAdapter', () => {
  it('should transform API response correctly', async () => {
    const adapter = new SupersportAdapter();
    const mockData = { /* mock API response */ };
    const result = adapter.transformSupersportData(mockData);
    
    expect(result).toHaveLength(1);
    expect(result[0].provider).toBe('supersport');
  });
});
```

### 2. Integration Tests
```typescript
// __tests__/api/highlights.test.ts
describe('GET /api/v1/highlights', () => {
  it('should return highlights from multiple providers', async () => {
    const response = await fetch('/api/v1/highlights');
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.highlights).toBeInstanceOf(Array);
  });
});
```

## Next Steps

1. **Immediate Actions:**
   - Set up environment variables for API keys
   - Implement Supersport adapter
   - Configure Scorebat API access
   - Create unified API endpoints

2. **Priority Tasks:**
   - Implement caching with Redis
   - Add rate limiting
   - Create comprehensive error handling
   - Set up monitoring

3. **Future Enhancements:**
   - Real-time WebSocket updates for live matches
   - User preference-based provider selection
   - Advanced video quality selection
   - Offline caching for mobile app

This integration strategy provides a robust foundation for leveraging both free and paid API providers while maintaining a consistent interface for both web and mobile applications.