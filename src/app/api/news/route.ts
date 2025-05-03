import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const articles = await prisma.news.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

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
    return NextResponse.json(article, { status: 201 });
  } catch (error) {
    console.error('Failed to create news:', error);
    return NextResponse.json(
      { error: 'Failed to create news article' },
      { status: 500 }
    );
  }
} 