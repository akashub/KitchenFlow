'use client';

import { useTranslations } from 'next-intl';

type Task = {
  id: number;
  recipeId: number;
  totalServings: number;
  status: string;
  recipeName: string;
  shiftType: string;
};

type Props = { tasks: Task[] };

const STATUS_DOT: Record<string, string> = {
  not_started: 'bg-status-not-started',
  prepping: 'bg-status-prepping',
  cooking: 'bg-status-cooking',
  done: 'bg-status-done',
};

const STATUS_ROW: Record<string, string> = {
  not_started: '',
  prepping: 'bg-blue-50/30',
  cooking: 'bg-amber-50/30',
  done: 'bg-green-50/30',
};

export function DashboardTaskList({ tasks }: Props) {
  const t = useTranslations('dashboard');
  const tStatus = useTranslations('status');

  const sorted = [...tasks].sort((a, b) => {
    const order: Record<string, number> = { cooking: 0, prepping: 1, not_started: 2, done: 3 };
    return (order[a.status] ?? 4) - (order[b.status] ?? 4);
  });

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">{t('shiftTimeline')}</h2>
      {sorted.length === 0 ? (
        <p className="py-6 text-center text-sm text-gray-400">No tasks today</p>
      ) : (
        <div className="space-y-1.5">
          {sorted.map((task) => (
            <div key={task.id} className={`flex items-center gap-3 rounded-xl px-4 py-3 ${STATUS_ROW[task.status] || ''}`}>
              <span className={`h-3 w-3 shrink-0 rounded-full ${STATUS_DOT[task.status] || 'bg-gray-300'}`} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">{task.recipeName}</p>
                <p className="text-xs text-gray-500">{task.totalServings} servings</p>
              </div>
              <span className="shrink-0 rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                {tStatus(task.status as any)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
