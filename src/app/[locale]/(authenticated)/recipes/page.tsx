'use client';

import { useTranslations } from 'next-intl';
import { useState, useEffect, useCallback } from 'react';
import { RecipeCard } from '@/components/recipe-card';
import { RecipeForm } from '@/components/recipe-form';

type Recipe = {
  id: number;
  nameEn: string;
  nameHi?: string;
  photoUrl?: string;
  categories: string[];
  baseServings: number;
  prepTimeMinutes?: number;
  cookTimeMinutes?: number;
  ingredients: any[];
  steps: any[];
};

export default function RecipesPage() {
  const t = useTranslations('recipes');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [editing, setEditing] = useState<Recipe | null>(null);
  const [showForm, setShowForm] = useState(false);

  const loadRecipes = useCallback(async () => {
    const res = await fetch('/api/recipes');
    setRecipes(await res.json());
  }, []);

  useEffect(() => { loadRecipes(); }, [loadRecipes]);

  async function handleSave(data: any) {
    const method = data.id ? 'PUT' : 'POST';
    await fetch('/api/recipes', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    setShowForm(false);
    setEditing(null);
    loadRecipes();
  }

  async function handleDelete(id: number) {
    if (!confirm(t('deleteConfirm'))) return;
    await fetch(`/api/recipes?id=${id}`, { method: 'DELETE' });
    loadRecipes();
  }

  if (showForm || editing) {
    return (
      <RecipeForm
        recipe={editing}
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
          + {t('addRecipe')}
        </button>
      </div>

      {recipes.length === 0 ? (
        <p className="mt-12 text-center text-gray-400">{t('noRecipes')}</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {recipes.map((r) => (
            <RecipeCard
              key={r.id}
              recipe={r}
              onEdit={() => setEditing(r)}
              onDelete={() => handleDelete(r.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
