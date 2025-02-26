import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: { playlistId: string; songId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  const playlist = await prisma.playlist.update({
    where: {
      id: params.playlistId,
      userId: session.user.id,
    },
    data: {
      songs: {
        disconnect: { id: params.songId },
      },
    },
  });

  return NextResponse.json(playlist);
}