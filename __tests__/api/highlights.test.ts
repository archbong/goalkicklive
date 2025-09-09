// goalkicklive/__tests__/api/highlights.test.ts
import { NextRequest } from 'next/server';
import { GET as getHighlights } from '@/app/api/highlights/route';
import { GET as getFilterOptions } from '@/app/api/highlights/filters/route';
import { prisma } from '@/lib/prisma';
import { redis } from '@/lib/redis';

// Mock the database and redis modules
jest.mock('@/lib/prisma', () => ({
  prisma: {
    match: {
      count: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
    competition: {
      findMany: jest.fn(),
    },
    team: {
      findMany: jest.fn(),
    },
    video: {
      groupBy: jest.fn(),
    },
  },
}));

jest.mock('@/lib/redis', () => ({
  redis: {
    get: jest.fn(),
    setex: jest.fn(),
  },
}));

describe('Highlights API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/highlights', () => {
    it('should return highlights with pagination', async () => {
      const mockMatches = [
        {
          id: 1,
          title: 'Test Match',
          matchDate: new Date('2024-01-01'),
          homeTeam: { name: 'Team A' },
          awayTeam: { name: 'Team B' },
          competition: { name: 'Premier League' },
          videos: [
            {
              sourceUrl: 'https://example.com/video.mp4',
              thumbnailUrl: 'https://example.com/thumb.jpg',
              isActive: true,
              publishedAt: new Date(),
            },
          ],
        },
      ];

      (prisma.match.count as jest.Mock).mockResolvedValue(1);
      (prisma.match.findMany as jest.Mock).mockResolvedValue(mockMatches);
      (redis.get as jest.Mock).mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/highlights?page=1&pageSize=20');
      const response = await getHighlights(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        highlights: [
          {
            id: '1',
            title: 'Test Match',
            thumbnail: 'https://example.com/thumb.jpg',
            videoUrl: 'https://example.com/video.mp4',
            date: expect.any(String),
            competition: 'Premier League',
            teams: { home: 'Team A', away: 'Team B' },
            score: null,
          },
        ],
        totalCount: 1,
        page: 1,
        pageSize: 20,
        hasMore: false,
      });
    });

    it('should filter by competition', async () => {
      (prisma.match.count as jest.Mock).mockResolvedValue(1);
      (prisma.match.findMany as jest.Mock).mockResolvedValue([]);
      (redis.get as jest.Mock).mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/highlights?competition=premier-league');
      await getHighlights(request);

      expect(prisma.match.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            competition: { slug: 'premier-league' },
          }),
        })
      );
    });

    it('should filter by team', async () => {
      (prisma.match.count as jest.Mock).mockResolvedValue(1);
      (prisma.match.findMany as jest.Mock).mockResolvedValue([]);
      (redis.get as jest.Mock).mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/highlights?team=team-a');
      await getHighlights(request);

      expect(prisma.match.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: [{ homeTeam: { slug: 'team-a' } }, { awayTeam: { slug: 'team-a' } }],
          }),
        })
      );
    });

    it('should filter by date', async () => {
      (prisma.match.count as jest.Mock).mockResolvedValue(1);
      (prisma.match.findMany as jest.Mock).mockResolvedValue([]);
      (redis.get as jest.Mock).mockResolvedValue(null);

      const request = new NextRequest('http://localhost:3000/api/highlights?date=2024-01-01');
      await getHighlights(request);

      expect(prisma.match.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            matchDate: expect.objectContaining({
              gte: new Date('2024-01-01'),
              lt: new Date('2024-01-02'),
            }),
          }),
        })
      );
    });

    it('should return cached response when available', async () => {
      const cachedResponse = {
        highlights: [],
        totalCount: 0,
        page: 1,
        pageSize: 20,
        hasMore: false,
      };

      (redis.get as jest.Mock).mockResolvedValue(JSON.stringify(cachedResponse));

      const request = new NextRequest('http://localhost:3000/api/highlights');
      const response = await getHighlights(request);
      const data = await response.json();

      expect(data).toEqual(cachedResponse);
      expect(prisma.match.count).not.toHaveBeenCalled();
      expect(prisma.match.findMany).not.toHaveBeenCalled();
    });

    it('should handle validation errors', async () => {
      const request = new NextRequest('http://localhost:3000/api/highlights?page=invalid');
      const response = await getHighlights(request);
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to fetch highlights');
    });
  });

  describe('GET /api/highlights/filters', () => {
    it('should return filter options', async () => {
      const mockCompetitions = [{ name: 'Premier League', slug: 'premier-league', country: 'England' }];
      const mockTeams = [{ name: 'Team A', slug: 'team-a', country: 'England' }];
      const mockDateRange = [{ matchDate: new Date('2024-01-01') }];
      const mockProviderCounts = [{ provider: 'supersport', _count: { id: 5 } }];

      (prisma.competition.findMany as jest.Mock).mockResolvedValue(mockCompetitions);
      (prisma.team.findMany as jest.Mock).mockResolvedValue(mockTeams);
      (prisma.match.findMany as jest.Mock)
        .mockResolvedValueOnce(mockDateRange) // oldest date
        .mockResolvedValueOnce(mockDateRange); // latest date
      (prisma.video.groupBy as jest.Mock).mockResolvedValue(mockProviderCounts);
      (redis.get as jest.Mock).mockResolvedValue(null);

      const response = await getFilterOptions();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual({
        competitions: [{ value: 'premier-league', label: 'Premier League', country: 'England' }],
        teams: [{ value: 'team-a', label: 'Team A', country: 'England' }],
        dateRange: {
          min: expect.any(String),
          max: expect.any(String),
        },
        providers: [{ id: 'supersport', name: 'supersport', count: 5 }],
      });
    });

    it('should return cached filter options when available', async () => {
      const cachedFilters = {
        competitions: [],
        teams: [],
        dateRange: { min: new Date(), max: new Date() },
        providers: [],
      };

      (redis.get as jest.Mock).mockResolvedValue(JSON.stringify(cachedFilters));

      const response = await getFilterOptions();
      const data = await response.json();

      expect(data).toEqual(cachedFilters);
      expect(prisma.competition.findMany).not.toHaveBeenCalled();
      expect(prisma.team.findMany).not.toHaveBeenCalled();
    });

    it('should handle errors when fetching filter options', async () => {
      (prisma.competition.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));
      (redis.get as jest.Mock).mockResolvedValue(null);

      const response = await getFilterOptions();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to fetch filter options');
    });
  });
});
