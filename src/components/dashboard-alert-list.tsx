'use client';

import { useTranslations } from 'next-intl';

type Alert = { severity: 'critical' | 'warning' | 'info'; message: string };
type Props = { alerts: Alert[] };

const SEVERITY_STYLES: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  critical: { bg: 'bg-red-50', border: 'border-l-red-500', text: 'text-red-800', dot: 'bg-red-500' },
  warning: { bg: 'bg-amber-50', border: 'border-l-amber-500', text: 'text-amber-800', dot: 'bg-amber-500' },
  info: { bg: 'bg-blue-50', border: 'border-l-blue-500', text: 'text-blue-800', dot: 'bg-blue-500' },
};

export function DashboardAlertList({ alerts }: Props) {
  const t = useTranslations('dashboard');

  if (alerts.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">{t('alerts')}</h2>
        <div className="flex items-center justify-center py-6 text-sm text-gray-400">
          {t('noAlerts')}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold text-gray-900">
        {t('alerts')}
        <span className="ml-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-600">
          {alerts.length}
        </span>
      </h2>
      <div className="space-y-2">
        {alerts.map((alert, i) => {
          const s = SEVERITY_STYLES[alert.severity] || SEVERITY_STYLES.info;
          return (
            <div key={i} className={`flex items-center gap-3 rounded-xl border-l-4 ${s.border} ${s.bg} px-4 py-3`}>
              <span className={`h-2 w-2 shrink-0 rounded-full ${s.dot}`} />
              <div>
                <span className={`text-xs font-semibold uppercase ${s.text}`}>
                  {t(alert.severity as any)}
                </span>
                <p className={`text-sm font-medium ${s.text}`}>{alert.message}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
