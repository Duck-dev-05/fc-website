import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getCachedData, setCachedData, deleteCachedData } from '@/lib/redis';

const prisma = new PrismaClient();
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
    console.error('Failed to fetch news:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news articles' },
      { status: 500 }
    );
  }
}

// Add POST handler for creating news
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const article = await prisma.news.create({
      data: {
        title: body.title,
        content: body.content,
        imageUrl: body.imageUrl,
        author: body.author,
        category: body.category,
      },
    });

    // Invalidate the cache when new article is added
    await deleteCachedData(CACHE_KEY);

    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error('Failed to create news:', error);
    return NextResponse.json(
      { error: 'Failed to create news article' },
      { status: 500 }
    );
  }
} 