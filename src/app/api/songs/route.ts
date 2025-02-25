import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Fetch songs from database with user information
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

    // Transform the data to include uploader information
    const formattedSongs = songs.map(song => ({
      ...song,
      uploader: song.user ? {
        id: song.user.id,
        name: song.user.name || 'Anonymous',
        image: song.user.image
      } : null,
      user: undefined // Remove the user object from the response
    }));

    // Set cache control headers for SWR
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