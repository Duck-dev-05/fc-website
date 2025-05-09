import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { sendMail } from '@/lib/mailer';

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
    let finalUsername = username || email.split('@')[0];
    let counter = 1;
    while (await prisma.user.findFirst({ where: { username: finalUsername } })) {
      finalUsername = `${email.split('@')[0]}${counter}`;
      counter++;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        roles: ['user'],
        profileInitialized: false,
        username: finalUsername,
        lastLogin: null,
      },
    });

    // Send welcome email
    await sendMail({
      to: email,
      subject: 'Welcome to FC ESCUELA!',
      html: `<h2>Welcome, ${name}!</h2><p>Your account has been created successfully at FC ESCUELA.</p><p>Thank you for joining us!</p>`
    });

    return NextResponse.json({ message: 'Registration successful' }, { status: 201 });
  } catch (error: any) {
    console.error('Registration error:', error);
    const isDev = process.env.NODE_ENV !== 'production';
    return NextResponse.json({ error: isDev && error.message ? error.message : 'Internal server error' }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";

