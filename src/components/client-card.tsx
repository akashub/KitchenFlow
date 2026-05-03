'use client';

import { useTranslations } from 'next-intl';

type Props = {
  client: {
    id: number;
    name: string;
    contactPerson?: string;
    headcount: number;
    meals: string[];
  };
  onEdit: () => void;
  onDelete: () => void;
};

const MEAL_EMOJI: Record<string, string> = {
  breakfast: '🌅', lunch: '☀️', dinner: '🌙',
};

export function ClientCard({ client, onEdit, onDelete }: Props) {
  const t = useTranslations('clients');

  return (
    <div className="group relative rounded-2xl border border-border bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="absolute right-3 top-3 flex gap-1 opacity-0 transition group-hover:opacity-100">
        <button onClick={onEdit}
          className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200">
          {t('editClient')}
        </button>
        <button onClick={onDelete}
          className="rounded-lg bg-red-50 px-2.5 py-1 text-xs font-medium text-danger hover:bg-red-100">
          ✕
        </button>
      </div>

      <div className="mb-1 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary">
          {client.name.charAt(0)}
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-900">{client.name}</h3>
          {client.contactPerson && (
            <p className="text-xs text-gray-500">{client.contactPerson}</p>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">
          {client.headcount} {t('people')}
        </span>
        <div className="flex gap-1">
          {client.meals.map((meal) => (
            <span key={meal} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">
              {MEAL_EMOJI[meal] || ''} {t(meal as any)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
