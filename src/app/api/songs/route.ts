import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const songs = await prisma.song.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      }
    });

    const formattedSongs = songs.map(song => ({
      ...song,
      uploader: song.user ? {
        id: song.user.id,
        name: song.user.name || 'Anonymous',
        image: song.user.image
      } : null,
      user: undefined 
    }));

    return new NextResponse(JSON.stringify(formattedSongs), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  } catch (error) {
    console.error('Error fetching songs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch songs' },
      { status: 500 }
    );
  }
}