import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { name, email, password, username } = await request.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Generate username if not provided
    let finalUsername = username;
    if (!finalUsername) {
      finalUsername = email.split('@')[0];
      let counter = 1;
      while (await prisma.user.findFirst({ where: { username: finalUsername } })) {
        finalUsername = `${email.split('@')[0]}${counter}`;
        counter++;
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'user',
        profileInitialized: false,
        username: finalUsername,
      },
    });

    return NextResponse.json({ message: 'Registration successful' }, { status: 201 });
  } catch (error: any) {
    console.error('Registration error:', error);
    // Provide more detailed error in development
    const isDev = process.env.NODE_ENV !== 'production';
    return NextResponse.json({ error: isDev && error.message ? error.message : 'Internal server error' }, { status: 500 });
  }
} 