import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export async function POST(req: NextRequest) {
  try {
    const { name, email, password }: RegisterRequest = await req.json();
    
    if (!name || !email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create user
    await prisma.user.create({
      data: {
        name,
        email,
        password: hashed,
      },
    });

    return NextResponse.json({ message: "User registered successfully" });
  } catch (err) {
    console.error('Registration error:', err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
} 