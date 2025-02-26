import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const users = await prisma.user.findMany({
    where: {
      NOT: { id: session.user.id }
    },
    select: {
      id: true,
      name: true,
      image: true,
      _count: {
        select: {
          followers: true,
          following: true
        }
      }
    }
  });

  return NextResponse.json(users);
}