export const dynamic = "force-dynamic";
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getCachedData, setCachedData, deleteCachedData } from '@/lib/redis';

const CACHE_KEY = 'news:all';

export async function GET() {
  try {
    // Try to get cached data first
    const cachedArticles = await getCachedData(CACHE_KEY);
    if (cachedArticles) {
      return NextResponse.json(cachedArticles);
    }

    // If no cache, fetch from database
    const articles = await prisma.news.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Cache the results for 1 hour
    await setCachedData(CACHE_KEY, articles, 3600);

    return NextResponse.json(articles);
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    );
  }
}

// Add POST handler for creating news
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const news = await prisma.news.create({
      data: {
        title: body.title,
        content: body.content,
        imageUrl: body.imageUrl,
      },
    });

    // Invalidate the cache when new article is added
    await deleteCachedData(CACHE_KEY);

    return NextResponse.json(news);
  } catch (error) {
    console.error('Error creating news:', error);
    return NextResponse.json(
      { error: 'Failed to create news' },
      { status: 500 }
    );
  }
} 