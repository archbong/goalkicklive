# API Implementation Plan: Supersport & Scorebat Integration

## Phase 1: Environment Setup & Configuration (Day 1-2)

### 1.1 Environment Variables Setup
```bash
# Create .env.local with API configuration
SCOREBAT_API_KEY=your_production_api_key_here
SUPERSPORT_API_ENABLED=true
REDIS_URL=redis://localhost:6379
API_RATE_LIMIT=100
CACHE_TTL=300
NODE_ENV=development
```

### 1.2 Package Dependencies Installation
```bash
# Install required packages
npm install @upstash/redis @upstash/ratelimit axios
npm install -D @types/node @types/axios
```

### 1.3 Redis Configuration
```typescript
// lib/redis.ts
import { Redis } from '@upstash/redis';

export const redis = new Redis({
  url: process.env.REDIS_URL!,
  token: process.env.REDIS_TOKEN!,
});
```

## Phase 2: Core Type Definitions (Day 2)

### 2.1 Unified Data Models
```typescript
// types/highlight.ts
export interface UnifiedHighlight {
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

export interface HighlightFilters {
  competition?: string;
  team?: string;
  date?: string;
  page?: number;
  pageSize?: number;
  provider?: 'all' | 'supersport' | 'scorebat';
}

export interface HighlightsResponse {
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

### 2.2 Provider Interface
```typescript
// types/provider.ts
export interface VideoProvider {
  getHighlights(filters?: HighlightFilters): Promise<UnifiedHighlight[]>;
  getLiveMatches(): Promise<any[]>;
  getCompetitions(): Promise<string[]>;
  getTeams(): Promise<string[]>;
  getProviderName(): string;
}
```

## Phase 3: Provider Adapters Implementation (Day 3-5)

### 3.1 Supersport Adapter
```typescript
// lib/providers/supersport-adapter.ts
import { VideoProvider, UnifiedHighlight, HighlightFilters } from '@/types/provider';

export class SupersportAdapter implements VideoProvider {
  private baseUrl = 'https://supersport.com/apix';
  private readonly providerName = 'supersport';

  async getHighlights(filters?: HighlightFilters): Promise<UnifiedHighlight[]> {
    try {
      const response = await fetch(`${this.baseUrl}/guide/v5.3/livenow`, {
        headers: this.getHeaders(),
      });
      
      if (!response.ok) {
        throw new Error(`Supersport API error: ${response.status}`);
      }
      
      const data = await response.json();
      return this.transformData(data, filters);
    } catch (error) {
      console.error('Supersport API failed:', error);
      return [];
    }
  }

  private transformData(data: any, filters?: HighlightFilters): UnifiedHighlight[] {
    // Implementation for transforming Supersport data to unified format
    return data.items?.map((item: any) => ({
      id: `supersport_${item.id}`,
      title: item.title,
      description: item.description || '',
      thumbnailUrl: item.thumbnail || '/images/default-thumbnail.jpg',
      videoUrl: item.videoUrl || '',
      duration: item.duration || 0,
      competition: item.competition || 'Unknown',
      teams: {
        home: item.homeTeam || 'Home Team',
        away: item.awayTeam || 'Away Team',
      },
      score: item.score ? {
        home: item.score.home,
        away: item.score.away,
      } : undefined,
      matchDate: new Date(item.date || Date.now()),
      views: item.views || 0,
      likes: item.likes || 0,
      provider: 'supersport',
      providerId: item.id,
      metadata: {
        quality: item.quality || 'hd',
        language: item.language,
        commentators: item.commentators,
        tags: item.tags || [],
      },
    })) || [];
  }

  getProviderName(): string {
    return this.providerName;
  }

  // Other methods will throw NotImplementedError initially
  async getLiveMatches(): Promise<any[]> {
    throw new Error('Method not implemented');
  }

  async getCompetitions(): Promise<string[]> {
    throw new Error('Method not implemented');
  }

  async getTeams(): Promise<string[]> {
    throw new Error('Method not implemented');
  }

  private getHeaders() {
    return {
      'Content-Type': 'application/json',
      'User-Agent': 'Football-Highlights-Platform/1.0',
    };
  }
}
```

### 3.2 Scorebat Adapter
```typescript
// lib/providers/scorebat-adapter.ts
import { VideoProvider, UnifiedHighlight, HighlightFilters } from '@/types/provider';

export class ScorebatAdapter implements VideoProvider {
  private baseUrl = 'https://www.scorebat.com/video-api';
  private readonly providerName = 'scorebat';
  private apiKey: string;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('Scorebat API key is required');
    }
    this.apiKey = apiKey;
  }

  async getHighlights(filters?: HighlightFilters): Promise<UnifiedHighlight[]> {
    try {
      const response = await fetch(this.baseUrl, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Scorebat API error: ${response.status}`);
      }
      
      const data = await response.json();
      return this.transformData(data, filters);
    } catch (error) {
      console.error('Scorebat API failed:', error);
      return [];
    }
  }

  private transformData(data: any, filters?: HighlightFilters): UnifiedHighlight[] {
    // Implementation for transforming Scorebat data to unified format
    return data.map((item: any, index: number) => ({
      id: `scorebat_${item.title?.replace(/\s+/g, '_').toLowerCase()}_${index}`,
      title: item.title || 'Unknown Match',
      description: item.description || '',
      thumbnailUrl: item.thumbnail || '/images/default-thumbnail.jpg',
      videoUrl: item.videoUrl || '',
      embedUrl: item.embed || '',
      duration: this.calculateDuration(item),
      competition: item.competition?.name || 'Unknown Competition',
      teams: this.extractTeams(item),
      score: this.extractScore(item),
      matchDate: new Date(item.date || Date.now()),
      views: item.views || 0,
      likes: item.likes || 0,
      provider: 'scorebat',
      providerId: item.id || index.toString(),
      metadata: {
        quality: 'hd',
        language: 'en',
        commentators: [],
        tags: item.tags || [],
      },
    }));
  }

  private calculateDuration(item: any): number {
    // Estimate duration based on available data
    return 180; // Default 3 minutes
  }

  private extractTeams(item: any): { home: string; away: string } {
    // Extract team names from Scorebat data
    return {
      home: item.side1?.name || 'Home Team',
      away: item.side2?.name || 'Away Team',
    };
  }

  private extractScore(item: any): { home: number; away: number } | undefined {
    // Extract score from Scorebat data
    return undefined; // Implement based on actual API response
  }

  getProviderName(): string {
    return this.providerName;
  }

  // Other methods will throw NotImplementedError initially
  async getLiveMatches(): Promise<any[]> {
    throw new Error('Method not implemented');
  }

  async getCompetitions(): Promise<string[]> {
    throw new Error('Method not implemented');
  }

  async getTeams(): Promise<string[]> {
    throw new Error('Method not implemented');
  }
}
```

## Phase 4: Unified Service Implementation (Day 5-6)

### 4.1 Service Factory
```typescript
// lib/services/api-service-factory.ts
import { VideoProvider } from '@/types/provider';
import { SupersportAdapter } from '@/lib/providers/supersport-adapter';
import { ScorebatAdapter } from '@/lib/providers/scorebat-adapter';

export class APIServiceFactory {
  static createVideoService(): VideoProvider[] {
    const providers: VideoProvider[] = [];
    
    // Add Supersport provider if enabled
    if (process.env.SUPERSPORT_API_ENABLED === 'true') {
      providers.push(new SupersportAdapter());
    }
    
    // Add Scorebat provider if API key is available
    if (process.env.SCOREBAT_API_KEY) {
      try {
        providers.push(new ScorebatAdapter(process.env.SCOREBAT_API_KEY));
      } catch (error) {
        console.error('Failed to create Scorebat adapter:', error);
      }
    }
    
    if (providers.length === 0) {
      console.warn('No video providers available. Using mock data fallback.');
    }
    
    return providers;
  }
}
```

### 4.2 Unified Video Service
```typescript
// lib/services/unified-video-service.ts
import { VideoProvider, UnifiedHighlight, HighlightFilters } from '@/types/provider';
import { redis } from '@/lib/redis';

export class UnifiedVideoService {
  private providers: VideoProvider[];
  
  constructor(providers: VideoProvider[]) {
    this.providers = providers;
  }

  async getHighlights(filters: HighlightFilters = {}): Promise<UnifiedHighlight[]> {
    const cacheKey = this.generateCacheKey(filters);
    
    // Try to get from cache first
    try {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (error) {
      console.warn('Redis cache unavailable, proceeding without cache');
    }
    
    // Fetch from providers
    let allHighlights: UnifiedHighlight[] = [];
    
    for (const provider of this.providers) {
      try {
        const providerHighlights = await provider.getHighlights(filters);
        allHighlights = [...allHighlights, ...providerHighlights];
        
        // If we have enough results, break early
        if (filters.pageSize && allHighlights.length >= filters.pageSize) {
          break;
        }
      } catch (error) {
        console.warn(`Provider ${provider.getProviderName()} failed:`, error);
      }
    }
    
    // Apply additional filtering and sorting
    const filteredHighlights = this.applyFilters(allHighlights, filters);
    
    // Cache the results
    try {
      await redis.setex(cacheKey, parseInt(process.env.CACHE_TTL || '300'), JSON.stringify(filteredHighlights));
    } catch (error) {
      console.warn('Failed to cache results:', error);
    }
    
    return filteredHighlights;
  }

  private generateCacheKey(filters: HighlightFilters): string {
    const filterString = JSON.stringify(filters);
    return `highlights:${filterString}`;
  }

  private applyFilters(highlights: UnifiedHighlight[], filters: HighlightFilters): UnifiedHighlight[] {
    let filtered = highlights;
    
    // Apply competition filter
    if (filters.competition) {
      filtered = filtered.filter(h => 
        h.competition.toLowerCase().includes(filters.competition!.toLowerCase())
      );
    }
    
    // Apply team filter
    if (filters.team) {
      filtered = filtered.filter(h =>
        h.teams.home.toLowerCase().includes(filters.team!.toLowerCase()) ||
        h.teams.away.toLowerCase().includes(filters.team!.toLowerCase())
      );
    }
    
    // Apply date filter
    if (filters.date) {
      const filterDate = new Date(filters.date);
      filtered = filtered.filter(h =>
        h.matchDate.toDateString() === filterDate.toDateString()
      );
    }
    
    // Sort by date (newest first)
    filtered.sort((a, b) => b.matchDate.getTime() - a.matchDate.getTime());
    
    // Apply pagination
    if (filters.page && filters.pageSize) {
      const start = (filters.page - 1) * filters.pageSize;
      const end = start + filters.pageSize;
      filtered = filtered.slice(start, end);
    }
    
    return filtered;
  }

  async getAvailableProviders(): Promise<string[]> {
    return this.providers.map(p => p.getProviderName());
  }
}
```

## Phase 5: API Routes Implementation (Day 6-7)

### 5.1 Unified Highlights Endpoint
```typescript
// app/api/v1/highlights/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { UnifiedVideoService } from '@/lib/services/unified-video-service';
import { APIServiceFactory } from '@/lib/services/api-service-factory';
import { rateLimitRequest } from '@/lib/rate-limit';
import { validateHighlightQuery } from '@/lib/validators/highlight-validator';

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const clientIp = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
    const rateLimited = await rateLimitRequest(clientIp);
    
    if (!rateLimited) {
      return NextResponse.json(
        { error: 'Rate limit exceeded' },
        { status: 429 }
      );
    }
    
    // Validate query parameters
    const searchParams = request.nextUrl.searchParams;
    const filters = validateHighlightQuery(searchParams);
    
    // Get highlights from unified service
    const providers = APIServiceFactory.createVideoService();
    const videoService = new UnifiedVideoService(providers);
    const highlights = await videoService.getHighlights(filters);
    
    // Prepare response
    const response: any = {
      highlights,
      totalCount: highlights.length,
      page: filters.page || 1,
      pageSize: filters.pageSize || 20,
      hasMore: false, // Will be implemented with proper pagination
      providers: {
        supersport: highlights.filter(h => h.provider === 'supersport').length,
        scorebat: highlights.filter(h => h.provider === 'scorebat').length,
      },
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Highlights API error:', error);
    
    if (error instanceof Error && error.message.includes('Validation')) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### 5.2 Health Check Endpoint
```typescript
// app/api/v1/health/route.ts
import { NextResponse } from 'next/server';
import { APIServiceFactory } from '@/lib/services/api-service-factory';

export async function GET() {
  const providers = APIServiceFactory.createVideoService();
  const availableProviders = providers.map(p => p.getProviderName());
  
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    providers: availableProviders,
    environment: process.env.NODE_ENV,
  });
}
```

## Phase 6: Rate Limiting & Validation (Day 7)

### 6.1 Rate Limiting Service
```typescript
// lib/rate-limit.ts
import { Ratelimit } from '@upstash/ratelimit';
import { redis } from '@/lib/redis';

export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(
    parseInt(process.env.API_RATE_LIMIT || '100'),
    '60 s'
  ),
});

export async function rateLimitRequest(identifier: string): Promise<boolean> {
  if (process.env.NODE_ENV === 'development') {
    return true; // Disable rate limiting in development
  }
  
  try {
    const { success } = await ratelimit.limit(identifier);
    return success;
  } catch (error) {
    console.error('Rate limiting error:', error);
    return true; // Fail open if rate limiting service is down
  }
}
```

### 6.2 Validation Schema
```typescript
// lib/validators/highlight-validator.ts
import { z } from 'zod';

const highlightQuerySchema = z.object({
  competition: z.string().optional(),
  team: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  page: z.coerce.number().int().positive().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  provider: z.enum(['all', 'supersport', 'scorebat']).default('all'),
});

export function validateHighlightQuery(searchParams: URLSearchParams) {
  const params = Object.fromEntries(searchParams);
  return highlightQuerySchema.parse(params);
}
```

## Phase 7: Testing & Documentation (Day 8-10)

### 7.1 Test Files Structure
```
__tests__/
  ├── api/
  │   ├── v1/
  │   │   ├── highlights.test.ts
  │   │   └── health.test.ts
  ├── lib/
  │   ├── providers/
  │   │   ├── supersport-adapter.test.ts
  │   │   └── scorebat-adapter.test.ts
  │   ├── services/
  │   │   ├── unified-video-service.test.ts
  │   │   └── api-service-factory.test.ts
  └── utils/
      ├── rate-limit.test.ts
      └── validators.test.ts
```

### 7.2 API Documentation
```markdown
# API Documentation - v1

## GET /api/v1/highlights
Fetch football highlights from multiple providers.

### Query Parameters:
- `competition` (optional): Filter by competition name
- `team` (optional): Filter by team name
- `date` (optional): Filter by date (YYYY-MM-DD format)
- `page` (optional): Page number (default: 1)
- `pageSize` (optional): Results per page (default: 20, max: 100)
- `provider` (optional): Filter by provider: 'all', 'supersport', 'scorebat'

### Response:
```json
{
  "highlights": [...],
  "totalCount": 100,
  "page": 1,
  "pageSize": 20,
  "hasMore": true,
  "providers": {
    "supersport": 15,
    "scorebat": 5
  }
}
```

## GET /api/v1/health
Check API health and available providers.

### Response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "providers": ["supersport", "scorebat"],
  "environment": "production"
}
```
```

## Phase 8: Deployment & Monitoring (Day 11-14)

### 8.1 Docker Configuration
```dockerfile
# Dockerfile.api
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

CMD ["npm", "run", "start"]
```

### 8.2 Environment Configuration
```yaml
# docker-compose.prod.yml
version: '3.8'
services:
  api:
    build:
      context: .
      dockerfile: Dockerfile.api
    environment:
      - NODE_ENV=production
      - SCOREBAT_API_KEY=${SCOREBAT_API_KEY}
      - SUPERSPORT_API_ENABLED=true
      - REDIS_URL=redis://redis:6379
      - API_RATE_LIMIT=1000
    depends_on:
      - redis
    ports:
      - "3000:3000"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
```

### 8.3 Monitoring Setup
```typescript
// lib/monitoring.ts
export function trackAPIMetrics(metrics: {
  endpoint: string;
  responseTime: number;
  statusCode: number;
  provider?: string;
}) {
  // Integrate with monitoring service (Datadog, Prometheus, etc.)
  console.log('API Metrics:', metrics);
}
```

## Implementation Timeline

- **Day 1-2**: Environment setup and configuration
- **Day 3-5**: Provider adapters implementation
- **Day 6-7**: Unified service and API routes
- **Day 8-10**: Testing and documentation
- **Day 11-14**: Deployment and monitoring

## Success Criteria

1. ✅ Both Supersport and Scorebat APIs integrated
2. ✅ Unified response format for web and mobile
3. ✅ Proper error handling and fallback mechanisms
4. ✅ Rate limiting and caching implemented
5. ✅ Comprehensive test coverage
6. ✅ Production-ready deployment configuration
7. ✅ API documentation complete
8. ✅ Monitoring and logging setup

This implementation plan provides a complete roadmap for integrating both API providers while maintaining a consistent interface for both web and mobile applications.