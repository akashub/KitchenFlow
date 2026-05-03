'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect, useCallback } from 'react';
import { ClientCard } from '@/components/client-card';
import { ClientForm } from '@/components/client-form';

type Client = {
  id: number;
  name: string;
  contactPerson?: string;
  contactPhone?: string;
  headcount: number;
  meals: string[];
  deliveryAddress?: string;
  preferences?: string;
};

export default function ClientsPage() {
  const t = useTranslations('clients');
  const [clients, setClients] = useState<Client[]>([]);
  const [editing, setEditing] = useState<Client | null>(null);
  const [showForm, setShowForm] = useState(false);

  const loadClients = useCallback(async () => {
    const res = await fetch('/api/clients');
    setClients(await res.json());
  }, []);

  useEffect(() => { loadClients(); }, [loadClients]);

  async function handleSave(data: any) {
    const method = data.id ? 'PUT' : 'POST';
    await fetch('/api/clients', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    setShowForm(false);
    setEditing(null);
    loadClients();
  }

  async function handleDelete(id: number) {
    if (!confirm(t('deleteConfirm'))) return;
    await fetch(`/api/clients?id=${id}`, { method: 'DELETE' });
    loadClients();
  }

  if (showForm || editing) {
    return (
      <ClientForm
        client={editing}
        onSave={handleSave}
        onCancel={() => { setShowForm(false); setEditing(null); }}
      />
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">{t('title')}</h1>
        <button
          onClick={() => setShowForm(true)}
          className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition hover:bg-primary-light"
        >
          + {t('addClient')}
        </button>
      </div>

      {clients.length === 0 ? (
        <p className="mt-12 text-center text-gray-400">{t('noClients')}</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {clients.map((c) => (
            <ClientCard
              key={c.id}
              client={c}
              onEdit={() => setEditing(c)}
              onDelete={() => handleDelete(c.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
