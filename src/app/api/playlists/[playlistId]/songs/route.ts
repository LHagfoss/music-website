import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { playlistId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { songId } = await request.json();

  const playlist = await prisma.playlist.update({
    where: {
      id: params.playlistId,
      userId: session.user.id,
    },
    data: {
      songs: {
        connect: { id: songId },
      },
    },
  });

  return NextResponse.json(playlist);
}