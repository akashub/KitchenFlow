'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect, useCallback } from 'react';
import { DashboardStatCard } from '@/components/dashboard-stat-card';
import { DashboardAlertList } from '@/components/dashboard-alert-list';
import { DashboardClientStatus } from '@/components/dashboard-client-status';
import { DashboardTaskList } from '@/components/dashboard-task-list';

type DashboardData = {
  totalServings: number;
  clientCount: number;
  activeShift: string;
  progressPct: number;
  doneTasks: number;
  totalTasks: number;
  clientStatus: { id: number; name: string; done: number; total: number; status: string }[];
  alerts: { severity: 'critical' | 'warning' | 'info'; message: string }[];
  tasks: { id: number; recipeId: number; totalServings: number; status: string; recipeName: string; shiftType: string }[];
};

export default function DashboardPage() {
  const t = useTranslations('dashboard');
  const tShifts = useTranslations('shifts');
  const [data, setData] = useState<DashboardData | null>(null);
  const [date] = useState(new Date().toISOString().split('T')[0]);

  const load = useCallback(async () => {
    const res = await fetch(`/api/dashboard?date=${date}`);
    setData(await res.json());
  }, [date]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => {
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, [load]);

  if (!data) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  const shiftLabel = tShifts(data.activeShift as any);
  const alertCount = data.alerts.length;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">{t('title')}</h1>
        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">{date}</span>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <DashboardStatCard
          label={t('todayOrders')}
          value={data.totalServings.toLocaleString()}
          subtitle={t('servingsAcross', { count: data.clientCount })}
          accent="blue"
        />
        <DashboardStatCard
          label={t('activeShift')}
          value={shiftLabel}
          accent="amber"
        />
        <DashboardStatCard
          label={t('overallProgress')}
          value={`${data.progressPct}%`}
          subtitle={`${data.doneTasks}/${data.totalTasks} tasks`}
          accent="green"
        />
        <DashboardStatCard
          label={t('alerts')}
          value={alertCount}
          subtitle={alertCount > 0 ? `${data.alerts.filter((a) => a.severity === 'critical').length} critical` : t('noAlerts')}
          accent={alertCount > 0 ? 'red' : 'green'}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardAlertList alerts={data.alerts} />
        <DashboardTaskList tasks={data.tasks} />
      </div>

      <div className="mt-6">
        <DashboardClientStatus clients={data.clientStatus} />
      </div>
    </div>
  );
}
