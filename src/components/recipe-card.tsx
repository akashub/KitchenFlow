'use client';

import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';

type Props = {
  recipe: {
    id: number;
    nameEn: string;
    nameHi?: string;
    categories: string[];
    baseServings: number;
    prepTimeMinutes?: number;
    cookTimeMinutes?: number;
  };
  onEdit: () => void;
  onDelete: () => void;
};

const CATEGORY_EMOJI: Record<string, string> = {
  breakfast: '🌅', lunch: '☀️', dinner: '🌙',
  veg: '🥬', 'non-veg': '🍗',
  rice: '🍚', bread: '🫓', curry: '🍛', dessert: '🍮', beverage: '☕',
};

export function RecipeCard({ recipe, onEdit, onDelete }: Props) {
  const t = useTranslations('recipes');
  const locale = useLocale();
  const name = locale === 'hi' && recipe.nameHi ? recipe.nameHi : recipe.nameEn;

  return (
    <div className="group relative rounded-2xl border border-border bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="absolute right-3 top-3 flex gap-1 opacity-0 transition group-hover:opacity-100">
        <button
          onClick={onEdit}
          className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 hover:bg-gray-200"
        >
          {t('editRecipe')}
        </button>
        <button
          onClick={onDelete}
          className="rounded-lg bg-red-50 px-2.5 py-1 text-xs font-medium text-danger hover:bg-red-100"
        >
          ✕
        </button>
      </div>

      <div className="mb-3 text-3xl">
        {recipe.categories.length > 0
          ? CATEGORY_EMOJI[recipe.categories[0]] || '🍽️'
          : '🍽️'}
      </div>

      <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
      {locale === 'en' && recipe.nameHi && (
        <p className="text-sm text-gray-400">{recipe.nameHi}</p>
      )}

      <div className="mt-3 flex flex-wrap gap-1.5">
        {recipe.categories.map((cat) => (
          <span
            key={cat}
            className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600"
          >
            {CATEGORY_EMOJI[cat] || ''} {cat}
          </span>
        ))}
      </div>

      <div className="mt-4 flex gap-4 text-xs text-gray-500">
        <span>{recipe.baseServings} {t('servings')}</span>
        {recipe.prepTimeMinutes && <span>{recipe.prepTimeMinutes} {t('min')} prep</span>}
        {recipe.cookTimeMinutes && <span>{recipe.cookTimeMinutes} {t('min')} cook</span>}
      </div>
    </div>
  );
}
