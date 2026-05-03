'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect, useCallback } from 'react';
import { TaskCard } from '@/components/task-card';

type Task = {
  id: number; recipeId: number; totalServings: number;
  status: string; clientNames: string[];
  prepStartedAt?: string; cookStartedAt?: string;
};
type Recipe = { id: number; nameEn: string; nameHi?: string };

const SHIFTS = ['shift_4am', 'shift_6am', 'shift_6pm'] as const;

export default function KitchenPage() {
  const t = useTranslations('kitchen');
  const tShifts = useTranslations('shifts');
  const [date] = useState(new Date().toISOString().split('T')[0]);
  const [activeShift, setActiveShift] = useState<string>('shift_6am');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  const load = useCallback(async () => {
    const [tRes, rRes] = await Promise.all([
      fetch(`/api/tasks?date=${date}&shift=${activeShift}`),
      fetch('/api/recipes'),
    ]);
    setTasks(await tRes.json());
    setRecipes(await rRes.json());
  }, [date, activeShift]);

  useEffect(() => { load(); }, [load]);

  async function advanceTask(id: number, status: string) {
    await fetch('/api/tasks', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    load();
  }

  const done = tasks.filter((t) => t.status === 'done').length;
  const total = tasks.length;
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  const sorted = [...tasks].sort((a, b) => {
    const order = { not_started: 2, prepping: 1, cooking: 0, done: 3 };
    return (order[a.status as keyof typeof order] ?? 4) - (order[b.status as keyof typeof order] ?? 4);
  });

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold tracking-tight">{t('title')}</h1>

      <div className="mb-6 flex gap-2">
        {SHIFTS.map((shift) => (
          <button key={shift} onClick={() => setActiveShift(shift)}
            className={`flex-1 rounded-xl py-3.5 text-base font-semibold transition ${
              activeShift === shift
                ? 'bg-primary text-white shadow-lg shadow-primary/25'
                : 'border border-border bg-white text-gray-600 hover:bg-gray-50'
            }`}>
            {tShifts(shift)}
          </button>
        ))}
      </div>

      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-medium text-gray-700">{t('progress')}</span>
          <span className="font-bold text-primary">{done}/{total} ({pct}%)</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {sorted.length === 0 ? (
        <p className="mt-12 text-center text-lg text-gray-400">{t('noTasks')}</p>
      ) : (
        <div className="space-y-4">
          {sorted.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              recipe={recipes.find((r) => r.id === task.recipeId)}
              onAdvance={advanceTask}
            />
          ))}
        </div>
      )}
    </div>
  );
}
