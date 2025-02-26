// Update the parameter name from [id] to [playlistId]
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { playlistId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const playlist = await prisma.playlist.findUnique({
    where: {
      id: params.playlistId,
      userId: session.user.id,
    },
    include: {
      songs: true,
    },
  });

  return NextResponse.json(playlist);
}

export async function PATCH(
  request: Request,
  { params }: { params: { playlistId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { name } = await request.json();
  const playlist = await prisma.playlist.update({
    where: {
      id: params.playlistId,
      userId: session.user.id,
    },
    data: { name },
  });

  return NextResponse.json(playlist);
}
export async function DELETE(
  request: Request,
  { params }: { params: { playlistId: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await prisma.playlist.delete({
    where: {
      id: params.playlistId,
      userId: session.user.id,
    },
  });

  return NextResponse.json({ success: true });
}