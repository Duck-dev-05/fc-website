import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  // Optionally, only allow admins:
  // if (!session.user?.roles?.includes('admin')) {
  //   return NextResponse.json({ error: 'Forbidden: Admins only' }, { status: 403 });
  // }

  try {
    const formData = await req.formData();
    const file = formData.get('image') as File;
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }
    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 });
    }
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    // Create unique filename
    const uniqueId = uuidv4();
    const extension = file.name.split('.').pop();
    const filename = `${uniqueId}.${extension}`;
    // Save to public directory
    const publicDir = join(process.cwd(), 'public', 'uploads');
    const filepath = join(publicDir, filename);
    await writeFile(filepath, buffer);
    // Return the URL
    const url = `/uploads/${filename}`;
    return NextResponse.json({ url });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
} 