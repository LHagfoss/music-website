import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    if (!params || !params.id) {
      return NextResponse.json({ error: 'Invalid song ID' }, { status: 400 });
    }

    // Find the song first to get its file path
    const song = await prisma.song.findUnique({
      where: { id: params.id },
      select: { audioUrl: true, coverUrl: true }
    });

    if (!song) {
      return NextResponse.json({ error: 'Song not found' }, { status: 404 });
    }

    if (song.audioUrl) {
      const audioPath = path.join(process.cwd(), 'public', (song.audioUrl as string).replace(/^\//, ''));
      if (fs.existsSync(audioPath)) {
        fs.unlinkSync(audioPath);
      }
    }

    if (song.coverUrl) {
      const coverPath = path.join(process.cwd(), 'public', (song.coverUrl as string).replace(/^\//, ''));
      if (fs.existsSync(coverPath)) {
        fs.unlinkSync(coverPath);
      }
    }

    await prisma.song.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'Song deleted successfully' });
  } catch (error) {
    console.error('Error deleting song:', error);
    return NextResponse.json(
      { error: 'Failed to delete song' },
      { status: 500 }
    );
  }
}