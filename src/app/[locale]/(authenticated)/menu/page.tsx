'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect, useCallback } from 'react';
import { MealCard } from '@/components/menu-meal-card';

type Client = { id: number; name: string; headcount: number; meals: string[] };
type Recipe = { id: number; nameEn: string; nameHi?: string };
type Menu = { id: number; clientId: number; mealType: string; dishes: any[]; status: string };

export default function MenuPage() {
  const t = useTranslations('menu');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [clients, setClients] = useState<Client[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [activeClient, setActiveClient] = useState<number | null>(null);

  const load = useCallback(async () => {
    const [cRes, rRes, mRes] = await Promise.all([
      fetch('/api/clients'), fetch('/api/recipes'), fetch(`/api/menus?date=${date}`),
    ]);
    const c = await cRes.json(); const r = await rRes.json(); const m = await mRes.json();
    setClients(c); setRecipes(r); setMenus(m);
    if (c.length > 0 && !activeClient) setActiveClient(c[0].id);
  }, [date, activeClient]);

  useEffect(() => { load(); }, [load]);

  async function saveMenu(clientId: number, mealType: string, dishes: any[]) {
    await fetch('/api/menus', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date, clientId, mealType, dishes }),
    });
    load();
  }

  async function publishAll() {
    if (!confirm(t('publishConfirm'))) return;
    const res = await fetch('/api/menus/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date }),
    });
    if (res.ok) { alert(t('publishSuccess')); load(); }
  }

  async function copyYesterday() {
    const yesterday = new Date(date);
    yesterday.setDate(yesterday.getDate() - 1);
    const yDate = yesterday.toISOString().split('T')[0];
    const res = await fetch(`/api/menus?date=${yDate}`);
    const yMenus: Menu[] = await res.json();
    for (const m of yMenus) {
      await fetch('/api/menus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, clientId: m.clientId, mealType: m.mealType, dishes: m.dishes }),
      });
    }
    load();
  }

  const current = clients.find((c) => c.id === activeClient);
  const hasDrafts = menus.some((m) => m.status === 'draft');

  function getStatus(clientId: number): 'allSet' | 'partial' | 'notSet' {
    const client = clients.find((c) => c.id === clientId);
    if (!client) return 'notSet';
    const clientMenus = menus.filter((m) => m.clientId === clientId);
    if (clientMenus.length === 0) return 'notSet';
    if (clientMenus.length >= client.meals.length) return 'allSet';
    return 'partial';
  }

  const statusColors = { allSet: 'bg-green-100 text-green-700', partial: 'bg-yellow-100 text-yellow-700', notSet: 'bg-gray-100 text-gray-500' };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">{t('title')}</h1>
        <div className="flex items-center gap-3">
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)}
            className="rounded-xl border border-border px-4 py-2 text-sm" />
          <button onClick={copyYesterday}
            className="rounded-xl border border-border px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50">
            {t('copyYesterday')}
          </button>
          {hasDrafts && (
            <button onClick={publishAll}
              className="rounded-xl bg-secondary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-secondary/25 hover:opacity-90">
              {t('publishAll')}
            </button>
          )}
        </div>
      </div>

      {clients.length === 0 ? (
        <p className="mt-12 text-center text-gray-400">{t('noMenus')}</p>
      ) : (
        <>
          <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
            {clients.map((c) => {
              const status = getStatus(c.id);
              return (
                <button key={c.id} onClick={() => setActiveClient(c.id)}
                  className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition ${
                    activeClient === c.id
                      ? 'bg-primary text-white shadow-lg shadow-primary/25'
                      : 'border border-border bg-white text-gray-700 hover:bg-gray-50'
                  }`}>
                  {c.name}
                  <span className={`rounded-full px-2 py-0.5 text-xs ${
                    activeClient === c.id ? 'bg-white/20 text-white' : statusColors[status]
                  }`}>
                    {c.headcount}
                  </span>
                </button>
              );
            })}
          </div>

          {current && (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {current.meals.map((meal) => (
                <MealCard
                  key={meal}
                  mealType={meal}
                  menu={menus.find((m) => m.clientId === current.id && m.mealType === meal)}
                  recipes={recipes}
                  headcount={current.headcount}
                  onSave={(dishes) => saveMenu(current.id, meal, dishes)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
