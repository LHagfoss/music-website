import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as File;
    const coverFile = formData.get('cover') as File;
    const title = formData.get('title') as string;
    const artist = formData.get('artist') as string;
    const album = formData.get('album') as string;

    if (!audioFile || !title || !artist) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadsDir, { recursive: true });

    // Generate unique filenames
    const audioFileName = `${uuidv4()}-${audioFile.name}`;
    const audioPath = path.join('uploads', audioFileName);
    const audioBuffer = Buffer.from(await audioFile.arrayBuffer());
    await writeFile(path.join(process.cwd(), 'public', audioPath), audioBuffer);

    let coverPath = null;
    if (coverFile) {
      const coverFileName = `${uuidv4()}-${coverFile.name}`;
      coverPath = path.join('uploads', coverFileName);
      const coverBuffer = Buffer.from(await coverFile.arrayBuffer());
      await writeFile(path.join(process.cwd(), 'public', coverPath), coverBuffer);
    }

    // Get user from database using session email
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email
      }
    });

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // Create song record in database
    const song = await prisma.song.create({
      data: {
        title,
        artist,
        album: album || null,
        audioUrl: `/${audioPath.replace(/\\/g, '/')}`,
        coverUrl: coverPath ? `/${coverPath.replace(/\\/g, '/')}` : null,
        userId: user.id
      }
    });

    return NextResponse.json({ success: true, data: song });
  } catch (error) {
    console.error('Upload error:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        { success: false, error: `Upload failed: ${error.message}` },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Internal server error during upload' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';