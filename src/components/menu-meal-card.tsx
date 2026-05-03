'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { useState } from 'react';

type Recipe = { id: number; nameEn: string; nameHi?: string };
type Dish = { recipeId: number; servings: number };

type Props = {
  mealType: string;
  menu?: { dishes: Dish[]; status: string } | null;
  recipes: Recipe[];
  headcount: number;
  onSave: (dishes: Dish[]) => void;
};

const MEAL_GRADIENT: Record<string, string> = {
  breakfast: 'from-amber-50 to-orange-50 border-amber-200',
  lunch: 'from-sky-50 to-blue-50 border-sky-200',
  dinner: 'from-indigo-50 to-purple-50 border-indigo-200',
};

const MEAL_EMOJI: Record<string, string> = {
  breakfast: '🌅', lunch: '☀️', dinner: '🌙',
};

export function MealCard({ mealType, menu, recipes, headcount, onSave }: Props) {
  const t = useTranslations('menu');
  const locale = useLocale();
  const [showPicker, setShowPicker] = useState(false);
  const dishes: Dish[] = (menu?.dishes as Dish[]) || [];
  const isPublished = menu?.status === 'published';

  function addDish(recipeId: number) {
    const updated = [...dishes, { recipeId, servings: headcount }];
    onSave(updated);
    setShowPicker(false);
  }

  function removeDish(index: number) {
    onSave(dishes.filter((_, i) => i !== index));
  }

  function updateServings(index: number, servings: number) {
    const updated = [...dishes];
    updated[index] = { ...updated[index], servings };
    onSave(updated);
  }

  function getRecipeName(id: number) {
    const r = recipes.find((r) => r.id === id);
    if (!r) return 'Unknown';
    return locale === 'hi' && r.nameHi ? r.nameHi : r.nameEn;
  }

  const usedIds = dishes.map((d) => d.recipeId);
  const available = recipes.filter((r) => !usedIds.includes(r.id));

  return (
    <div className={`rounded-2xl border bg-gradient-to-br p-5 ${MEAL_GRADIENT[mealType] || 'border-border'}`}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {MEAL_EMOJI[mealType]} {t(mealType === 'breakfast' ? 'addDish' : mealType as any).includes('Add') ? mealType.charAt(0).toUpperCase() + mealType.slice(1) : mealType.charAt(0).toUpperCase() + mealType.slice(1)}
        </h3>
        {isPublished && (
          <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
            {t('published')}
          </span>
        )}
      </div>

      <div className="space-y-2">
        {dishes.map((dish, i) => (
          <div key={i} className="flex items-center gap-2 rounded-xl bg-white/80 px-3 py-2 shadow-sm">
            <span className="flex-1 text-sm font-medium">{getRecipeName(dish.recipeId)}</span>
            <input type="number" min="1" value={dish.servings}
              onChange={(e) => updateServings(i, Number(e.target.value))}
              className="w-20 rounded-lg border border-border bg-white px-2 py-1 text-center text-xs"
              disabled={isPublished} />
            {!isPublished && (
              <button onClick={() => removeDish(i)} className="text-sm text-gray-400 hover:text-danger">✕</button>
            )}
          </div>
        ))}
      </div>

      {!isPublished && (
        <div className="mt-3">
          {showPicker ? (
            <div className="max-h-40 space-y-1 overflow-y-auto rounded-xl bg-white p-2 shadow-md">
              {available.length === 0 ? (
                <p className="px-2 py-1 text-xs text-gray-400">No more recipes</p>
              ) : (
                available.map((r) => (
                  <button key={r.id} onClick={() => addDish(r.id)}
                    className="w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-gray-50">
                    {locale === 'hi' && r.nameHi ? r.nameHi : r.nameEn}
                  </button>
                ))
              )}
              <button onClick={() => setShowPicker(false)}
                className="mt-1 w-full text-center text-xs text-gray-400">
                close
              </button>
            </div>
          ) : (
            <button onClick={() => setShowPicker(true)}
              className="w-full rounded-xl border border-dashed border-gray-300 py-2.5 text-sm font-medium text-gray-500 transition hover:border-primary hover:text-primary">
              + {t('addDish')}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
