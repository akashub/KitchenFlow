import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { recipes } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  const all = await db.query.recipes.findMany({
    orderBy: (r, { desc }) => [desc(r.createdAt)],
  });
  return NextResponse.json(all);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const result = db.insert(recipes).values({
    nameEn: body.nameEn,
    nameHi: body.nameHi || null,
    photoUrl: body.photoUrl || null,
    categories: body.categories || [],
    baseServings: body.baseServings || 1,
    prepTimeMinutes: body.prepTimeMinutes || null,
    cookTimeMinutes: body.cookTimeMinutes || null,
    ingredients: body.ingredients || [],
    steps: body.steps || [],
  }).returning().get();
  return NextResponse.json(result, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  if (!body.id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  const result = db.update(recipes).set({
    nameEn: body.nameEn,
    nameHi: body.nameHi,
    photoUrl: body.photoUrl,
    categories: body.categories,
    baseServings: body.baseServings,
    prepTimeMinutes: body.prepTimeMinutes,
    cookTimeMinutes: body.cookTimeMinutes,
    ingredients: body.ingredients,
    steps: body.steps,
    updatedAt: new Date(),
  }).where(eq(recipes.id, body.id)).returning().get();
  return NextResponse.json(result);
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });
  db.delete(recipes).where(eq(recipes.id, Number(id))).run();
  return NextResponse.json({ ok: true });
}
