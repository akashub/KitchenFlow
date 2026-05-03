import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { clients } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  const all = await db.query.clients.findMany({
    orderBy: (c, { asc }) => [asc(c.name)],
  });
  return NextResponse.json(all);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = db.insert(clients).values({
    name: body.name,
    contactPerson: body.contactPerson || null,
    contactPhone: body.contactPhone || null,
    headcount: body.headcount,
    meals: body.meals,
    deliveryAddress: body.deliveryAddress || null,
    deliveryTimes: body.deliveryTimes || {},
    preferences: body.preferences || null,
  }).returning().get();
  return NextResponse.json(result, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  if (!body.id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  const result = db.update(clients).set({
    name: body.name,
    contactPerson: body.contactPerson,
    contactPhone: body.contactPhone,
    headcount: body.headcount,
    meals: body.meals,
    deliveryAddress: body.deliveryAddress,
    deliveryTimes: body.deliveryTimes,
    preferences: body.preferences,
    updatedAt: new Date(),
  }).where(eq(clients.id, body.id)).returning().get();
  return NextResponse.json(result);
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  db.delete(clients).where(eq(clients.id, Number(id))).run();
  return NextResponse.json({ ok: true });
}
