// goalkicklive/app/api/analytics/web-vitals/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the web vitals data
    const { name, value, rating, id, page, timestamp } = body;

    if (!name || value === undefined || !rating || !id) {
      return NextResponse.json(
        { error: 'Invalid web vitals data' },
        { status: 400 }
      );
    }

    // Store the web vital metric in the database
    await prisma.webVitalMetric.create({
      data: {
        name,
        value: Math.round(value),
        rating,
        metricId: id,
        page: page || 'unknown',
        timestamp: new Date(timestamp || Date.now()),
        userAgent: request.headers.get('user-agent') || 'unknown',
        connectionType: request.headers.get('sec-ch-ua-mobile') === '?1' ? 'mobile' : 'desktop',
        // Additional context from headers
        referrer: request.headers.get('referer') || 'direct',
        language: request.headers.get('accept-language') || 'unknown',
      },
    });

    // Log poor metrics for monitoring
    if (rating === 'poor') {
      console.warn(`Poor Web Vital: ${name} = ${value} on page: ${page}`);

      // Here you could integrate with your error tracking service
      // For example, send to Sentry, Datadog, or other monitoring tools
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing web vitals:', error);

    // Don't fail the request - web vitals are best effort
    return NextResponse.json({ success: true });
  }
}

export async function GET() {
  // Return basic statistics about web vitals
  const stats = await prisma.webVitalMetric.groupBy({
    by: ['name', 'rating'],
    _count: {
      id: true,
    },
    _avg: {
      value: true,
    },
    where: {
      timestamp: {
        gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
      },
    },
  });

  return NextResponse.json({ stats });
}
