'use client';

import { useTranslations } from 'next-intl';

type ClientStatus = { id: number; name: string; done: number; total: number; status: string };
type Props = { clients: ClientStatus[] };

const STATUS_BADGE: Record<string, { bg: string; text: string }> = {
  onTrack: { bg: 'bg-green-100', text: 'text-green-700' },
  delayed: { bg: 'bg-red-100', text: 'text-red-700' },
  inProgress: { bg: 'bg-blue-100', text: 'text-blue-700' },
};

export function DashboardClientStatus({ clients }: Props) {
  const t = useTranslations('dashboard');

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">{t('clientStatus')}</h2>
      {clients.length === 0 ? (
        <p className="py-6 text-center text-sm text-gray-400">{t('noAlerts')}</p>
      ) : (
        <div className="space-y-3">
          {clients.map((c) => {
            const pct = c.total > 0 ? Math.round((c.done / c.total) * 100) : 0;
            const badge = STATUS_BADGE[c.status] || STATUS_BADGE.inProgress;
            return (
              <div key={c.id} className="rounded-xl border border-border p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                      {c.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{c.name}</p>
                      <p className="text-xs text-gray-500">{c.done}/{c.total} tasks</p>
                    </div>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${badge.bg} ${badge.text}`}>
                    {t(c.status as any)}
                  </span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
