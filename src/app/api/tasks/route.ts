import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { shiftTasks } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date');
  const shift = searchParams.get('shift');

  let conditions = [];
  if (date) conditions.push(eq(shiftTasks.date, date));
  if (shift) conditions.push(eq(shiftTasks.shiftType, shift as any));

  const tasks = conditions.length > 0
    ? await db.select().from(shiftTasks).where(and(...conditions)).all()
    : await db.select().from(shiftTasks).all();

  return NextResponse.json(tasks);
}

export async function PUT(req: NextRequest) {
  const { id, status } = await req.json();
  if (!id || !status) {
    return NextResponse.json({ error: 'id and status required' }, { status: 400 });
  }

  const now = new Date();
  const updates: any = { status };

  if (status === 'prepping') updates.prepStartedAt = now;
  if (status === 'cooking') updates.cookStartedAt = now;
  if (status === 'done') updates.completedAt = now;

  const result = db.update(shiftTasks)
    .set(updates)
    .where(eq(shiftTasks.id, id))
    .returning().get();

  return NextResponse.json(result);
}
