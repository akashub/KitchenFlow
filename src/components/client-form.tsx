'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

type Props = {
  client?: any | null;
  onSave: (data: any) => void;
  onCancel: () => void;
};

const MEAL_OPTIONS = ['breakfast', 'lunch', 'dinner'] as const;

export function ClientForm({ client, onSave, onCancel }: Props) {
  const t = useTranslations('clients');
  const tc = useTranslations('common');

  const [name, setName] = useState(client?.name || '');
  const [contactPerson, setContactPerson] = useState(client?.contactPerson || '');
  const [contactPhone, setContactPhone] = useState(client?.contactPhone || '');
  const [headcount, setHeadcount] = useState(client?.headcount || 100);
  const [meals, setMeals] = useState<string[]>(client?.meals || ['lunch']);
  const [deliveryAddress, setDeliveryAddress] = useState(client?.deliveryAddress || '');
  const [preferences, setPreferences] = useState(client?.preferences || '');

  function toggleMeal(meal: string) {
    setMeals((prev) =>
      prev.includes(meal) ? prev.filter((m) => m !== meal) : [...prev, meal]
    );
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      ...(client?.id ? { id: client.id } : {}),
      name, contactPerson: contactPerson || null,
      contactPhone: contactPhone || null,
      headcount, meals,
      deliveryAddress: deliveryAddress || null,
      preferences: preferences || null,
    });
  }

  const inputClass = 'w-full rounded-xl border border-border bg-gray-50/50 px-4 py-2.5 text-sm transition focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20';

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          {client ? t('editClient') : t('addClient')}
        </h1>
        <div className="flex gap-2">
          <button type="button" onClick={onCancel}
            className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50">
            {tc('cancel')}
          </button>
          <button type="submit"
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 hover:bg-primary-light">
            {tc('save')}
          </button>
        </div>
      </div>

      <div className="space-y-5 rounded-2xl border border-border bg-white p-6 shadow-sm">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">{t('clientName')} *</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required className={inputClass} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">{t('contactPerson')}</label>
            <input value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">{t('contactPhone')}</label>
            <input type="tel" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} className={inputClass} />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">{t('headcount')} *</label>
          <input type="number" min="1" value={headcount} onChange={(e) => setHeadcount(Number(e.target.value))} className={inputClass} />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">{t('meals')} *</label>
          <div className="flex gap-3">
            {MEAL_OPTIONS.map((meal) => (
              <button key={meal} type="button" onClick={() => toggleMeal(meal)}
                className={`flex-1 rounded-xl py-3 text-sm font-semibold transition ${
                  meals.includes(meal)
                    ? 'bg-primary text-white shadow-lg shadow-primary/25'
                    : 'border border-border bg-gray-50 text-gray-500 hover:bg-gray-100'
                }`}>
                {meal === 'breakfast' ? '🌅' : meal === 'lunch' ? '☀️' : '🌙'} {t(meal)}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">{t('deliveryAddress')}</label>
          <input value={deliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} className={inputClass} />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">{t('preferences')}</label>
          <textarea value={preferences} onChange={(e) => setPreferences(e.target.value)} rows={3}
            className={`${inputClass} resize-none`} />
        </div>
      </div>
    </form>
  );
}
