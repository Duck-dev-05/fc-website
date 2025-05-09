import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { sendMail } from '@/lib/mailer';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Always return success to prevent email enumeration
      return NextResponse.json({ message: 'If this email exists, a reset link has been sent.' });
    }
    // Generate token
    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1 hour
    // Save token to user (or a separate table if you prefer)
    await prisma.user.update({
      where: { email },
      data: {
        resetToken: token,
        resetTokenExpiry: expires,
      },
    });
    const resetLink = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/auth/reset-password?token=${token}`;

    // Use the mailer utility
    await sendMail({
      to: email,
      subject: 'Reset your FC ESCUELA password',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; border: 1px solid #e0e7ef; border-radius: 8px; padding: 24px; background: #f9fbfd;">
          <h2 style="color: #2563eb;">Password Reset Request</h2>
          <p>Hello,</p>
          <p>We received a request to reset your password for your FC ESCUELA account. Click the button below to set a new password:</p>
          <div style="text-align: center; margin: 24px 0;">
            <a href="${resetLink}" style="display: inline-block; padding: 12px 24px; background: #2563eb; color: #fff; border-radius: 4px; text-decoration: none; font-weight: bold;">Reset Password</a>
          </div>
          <p>If you did not request this, you can safely ignore this email.</p>
          <p style="color: #64748b; font-size: 13px;">This link will expire in 1 hour.</p>
          <p style="margin-top: 32px; color: #64748b; font-size: 13px;">Thanks,<br/>FC ESCUELA Team</p>
        </div>
      `,
    });

    return NextResponse.json({ message: 'If this email exists, a reset link has been sent.' });
  } catch (error: any) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
} 