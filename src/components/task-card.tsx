'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';

type Recipe = { id: number; nameEn: string; nameHi?: string };

type Task = {
  id: number;
  recipeId: number;
  totalServings: number;
  status: string;
  clientNames: string[];
  prepStartedAt?: string;
  cookStartedAt?: string;
};

type Props = {
  task: Task;
  recipe?: Recipe;
  onAdvance: (id: number, newStatus: string) => void;
};

const STATUS_STYLES: Record<string, { bg: string; border: string; text: string }> = {
  not_started: { bg: 'bg-gray-50', border: 'border-l-status-not-started', text: 'text-gray-500' },
  prepping: { bg: 'bg-blue-50/50', border: 'border-l-status-prepping', text: 'text-blue-700' },
  cooking: { bg: 'bg-amber-50/50', border: 'border-l-status-cooking', text: 'text-amber-700' },
  done: { bg: 'bg-green-50/50', border: 'border-l-status-done', text: 'text-green-700' },
};

const NEXT_STATUS: Record<string, string> = {
  not_started: 'prepping',
  prepping: 'cooking',
  cooking: 'done',
};

const ACTION_KEY: Record<string, string> = {
  not_started: 'startPrep',
  prepping: 'startCook',
  cooking: 'markDone',
};

const ACTION_COLORS: Record<string, string> = {
  not_started: 'bg-status-prepping hover:bg-blue-600',
  prepping: 'bg-status-cooking hover:bg-amber-600',
  cooking: 'bg-status-done hover:bg-green-600',
};

export function TaskCard({ task, recipe, onAdvance }: Props) {
  const t = useTranslations('kitchen');
  const tStatus = useTranslations('status');
  const locale = useLocale();

  const style = STATUS_STYLES[task.status] || STATUS_STYLES.not_started;
  const name = recipe
    ? (locale === 'hi' && recipe.nameHi ? recipe.nameHi : recipe.nameEn)
    : `Recipe #${task.recipeId}`;

  const nextStatus = NEXT_STATUS[task.status];
  const actionKey = ACTION_KEY[task.status];

  return (
    <div className={`rounded-2xl border-l-4 ${style.border} ${style.bg} p-5 shadow-sm transition hover:shadow-md`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="text-4xl">🍽️</span>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{name}</h3>
            <p className="text-sm text-gray-500">
              {task.clientNames.join(', ')} — {task.totalServings} {t('scaledFor')}
            </p>
          </div>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${style.text} ${style.bg}`}>
          {tStatus(task.status as any)}
        </span>
      </div>

      {nextStatus && (
        <button
          onClick={() => onAdvance(task.id, nextStatus)}
          className={`mt-4 w-full rounded-xl py-4 text-lg font-bold text-white shadow-lg transition ${ACTION_COLORS[task.status]}`}
        >
          {t(actionKey as any)}
        </button>
      )}

      {task.status === 'done' && (
        <div className="mt-4 rounded-xl bg-green-100 py-3 text-center text-lg font-bold text-green-700">
          ✓ {tStatus('done')}
        </div>
      )}
    </div>
  );
}
