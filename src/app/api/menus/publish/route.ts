import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { dailyMenus, shiftTasks, recipes, clients } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

const MEAL_TO_SHIFT: Record<string, string> = {
  breakfast: 'shift_4am',
  lunch: 'shift_6am',
  dinner: 'shift_6pm',
};

export async function POST(req: NextRequest) {
  const { date } = await req.json();
  if (!date) return NextResponse.json({ error: 'date required' }, { status: 400 });

  const menus = await db.select().from(dailyMenus)
    .where(and(eq(dailyMenus.date, date), eq(dailyMenus.status, 'draft'))).all();

  if (menus.length === 0) {
    return NextResponse.json({ error: 'No draft menus for this date' }, { status: 400 });
  }

  db.delete(shiftTasks).where(eq(shiftTasks.date, date)).run();

  const taskMap = new Map<string, {
    recipeId: number;
    shiftType: string;
    totalServings: number;
    clientNames: string[];
  }>();

  for (const menu of menus) {
    const client = await db.query.clients.findFirst({
      where: eq(clients.id, menu.clientId),
    });
    const clientName = client?.name || 'Unknown';
    const shift = MEAL_TO_SHIFT[menu.mealType] || 'shift_6am';
    const dishes = (menu.dishes as any[]) || [];

    for (const dish of dishes) {
      const key = `${dish.recipeId}-${shift}`;
      const existing = taskMap.get(key);
      if (existing) {
        existing.totalServings += dish.servings;
        if (!existing.clientNames.includes(clientName)) {
          existing.clientNames.push(clientName);
        }
      } else {
        taskMap.set(key, {
          recipeId: dish.recipeId,
          shiftType: shift,
          totalServings: dish.servings,
          clientNames: [clientName],
        });
      }
    }
  }

  for (const task of taskMap.values()) {
    db.insert(shiftTasks).values({
      date,
      recipeId: task.recipeId,
      shiftType: task.shiftType as any,
      totalServings: task.totalServings,
      clientNames: task.clientNames,
      status: 'not_started',
    }).run();
  }

  for (const menu of menus) {
    db.update(dailyMenus).set({
      status: 'published',
      publishedAt: new Date(),
    }).where(eq(dailyMenus.id, menu.id)).run();
  }

  return NextResponse.json({
    published: menus.length,
    tasksCreated: taskMap.size,
  });
}
