import { NextRequest, NextResponse } from 'next/server';
import { db, isDbAvailable } from '@/db';
import { dailyMenus } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  if (!isDbAvailable()) return NextResponse.json([]);
  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date');
  const clientId = searchParams.get('clientId');

  let conditions = [];
  if (date) conditions.push(eq(dailyMenus.date, date));
  if (clientId) conditions.push(eq(dailyMenus.clientId, Number(clientId)));

  const menus = conditions.length > 0
    ? await db.select().from(dailyMenus).where(and(...conditions)).all()
    : await db.select().from(dailyMenus).all();

  return NextResponse.json(menus);
}

export async function POST(req: NextRequest) {
  if (!isDbAvailable()) return NextResponse.json({ error: 'Demo mode' }, { status: 403 });
  const body = await req.json();
  const existing = await db.select().from(dailyMenus).where(
    and(
      eq(dailyMenus.date, body.date),
      eq(dailyMenus.clientId, body.clientId),
      eq(dailyMenus.mealType, body.mealType),
    )
  ).get();

  if (existing) {
    const result = db.update(dailyMenus).set({
      dishes: body.dishes,
      status: 'draft',
    }).where(eq(dailyMenus.id, existing.id)).returning().get();
    return NextResponse.json(result);
  }

  const result = db.insert(dailyMenus).values({
    date: body.date,
    clientId: body.clientId,
    mealType: body.mealType,
    dishes: body.dishes || [],
    status: 'draft',
  }).returning().get();
  return NextResponse.json(result, { status: 201 });
}
