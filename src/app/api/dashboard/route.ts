import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { shiftTasks, dailyMenus, clients, recipes } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

type Alert = { severity: 'critical' | 'warning' | 'info'; message: string };

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date') || new Date().toISOString().split('T')[0];

  const tasks = await db.select().from(shiftTasks).where(eq(shiftTasks.date, date)).all();
  const menus = await db.select().from(dailyMenus).where(eq(dailyMenus.date, date)).all();
  const allClients = await db.select().from(clients).all();
  const allRecipes = await db.select().from(recipes).all();

  const totalServings = tasks.reduce((sum, t) => sum + t.totalServings, 0);
  const doneTasks = tasks.filter((t) => t.status === 'done').length;
  const totalTasks = tasks.length;
  const progressPct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  const now = new Date();
  const hour = now.getHours();
  let activeShift = 'shift_6pm';
  if (hour < 6) activeShift = 'shift_4am';
  else if (hour < 18) activeShift = 'shift_6am';

  const clientStatus = allClients.map((client) => {
    const clientMenus = menus.filter((m) => m.clientId === client.id);
    const clientDishes = clientMenus.flatMap((m) => (m.dishes as any[]) || []);
    const clientRecipeIds = clientDishes.map((d: any) => d.recipeId);
    const clientTasks = tasks.filter((t) => clientRecipeIds.includes(t.recipeId));
    const clientDone = clientTasks.filter((t) => t.status === 'done').length;
    const clientTotal = clientTasks.length;
    const delayed = clientTasks.some((t) => t.status === 'not_started' && t.expectedStartBy && new Date(t.expectedStartBy) < now);
    return {
      id: client.id,
      name: client.name,
      done: clientDone,
      total: clientTotal,
      status: delayed ? 'delayed' : clientDone === clientTotal && clientTotal > 0 ? 'onTrack' : 'inProgress',
    };
  }).filter((c) => c.total > 0);

  const alerts: Alert[] = [];
  for (const task of tasks) {
    const recipe = allRecipes.find((r) => r.id === task.recipeId);
    const recipeName = recipe?.nameEn || `Recipe #${task.recipeId}`;
    if (task.status === 'not_started' && task.expectedStartBy && new Date(task.expectedStartBy) < now) {
      alerts.push({ severity: 'critical', message: `${recipeName} should have started` });
    } else if (task.status === 'prepping' && task.expectedDoneBy && new Date(task.expectedDoneBy) < now) {
      alerts.push({ severity: 'warning', message: `${recipeName} running behind schedule` });
    }
  }

  const taskDetails = tasks.map((t) => {
    const recipe = allRecipes.find((r) => r.id === t.recipeId);
    return { ...t, recipeName: recipe?.nameEn || `Recipe #${t.recipeId}` };
  });

  return NextResponse.json({
    totalServings,
    clientCount: clientStatus.length,
    activeShift,
    progressPct,
    doneTasks,
    totalTasks,
    clientStatus,
    alerts,
    tasks: taskDetails,
  });
}
