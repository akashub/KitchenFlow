'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

type Ingredient = { nameEn: string; nameHi?: string; quantity: number; unit: string };
type Step = { order: number; descriptionEn: string; descriptionHi?: string };

type Props = {
  recipe?: any | null;
  onSave: (data: any) => void;
  onCancel: () => void;
};

const CATEGORIES = [
  'breakfast', 'lunch', 'dinner', 'veg', 'non-veg',
  'rice', 'bread', 'curry', 'dessert', 'beverage',
];

export function RecipeForm({ recipe, onSave, onCancel }: Props) {
  const t = useTranslations('recipes');
  const tc = useTranslations('common');

  const [nameEn, setNameEn] = useState(recipe?.nameEn || '');
  const [nameHi, setNameHi] = useState(recipe?.nameHi || '');
  const [baseServings, setBaseServings] = useState(recipe?.baseServings || 1);
  const [prepTime, setPrepTime] = useState(recipe?.prepTimeMinutes || '');
  const [cookTime, setCookTime] = useState(recipe?.cookTimeMinutes || '');
  const [categories, setCategories] = useState<string[]>(recipe?.categories || []);
  const [ingredients, setIngredients] = useState<Ingredient[]>(recipe?.ingredients || []);
  const [steps, setSteps] = useState<Step[]>(recipe?.steps || []);

  function toggleCategory(cat: string) {
    setCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }

  function addIngredient() {
    setIngredients([...ingredients, { nameEn: '', quantity: 0, unit: '' }]);
  }

  function updateIngredient(i: number, field: string, value: any) {
    const updated = [...ingredients];
    (updated[i] as any)[field] = value;
    setIngredients(updated);
  }

  function removeIngredient(i: number) {
    setIngredients(ingredients.filter((_, idx) => idx !== i));
  }

  function addStep() {
    setSteps([...steps, { order: steps.length + 1, descriptionEn: '' }]);
  }

  function updateStep(i: number, field: string, value: string) {
    const updated = [...steps];
    (updated[i] as any)[field] = value;
    setSteps(updated);
  }

  function removeStep(i: number) {
    setSteps(steps.filter((_, idx) => idx !== i).map((s, idx) => ({ ...s, order: idx + 1 })));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      ...(recipe?.id ? { id: recipe.id } : {}),
      nameEn, nameHi: nameHi || null,
      baseServings, categories,
      prepTimeMinutes: prepTime ? Number(prepTime) : null,
      cookTimeMinutes: cookTime ? Number(cookTime) : null,
      ingredients: ingredients.filter((ing) => ing.nameEn),
      steps: steps.filter((s) => s.descriptionEn),
    });
  }

  const inputClass = 'w-full rounded-xl border border-border bg-gray-50/50 px-4 py-2.5 text-sm transition focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20';

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-2xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          {recipe ? t('editRecipe') : t('addRecipe')}
        </h1>
        <div className="flex gap-2">
          <button type="button" onClick={onCancel}
            className="rounded-xl border border-border px-5 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50">
            {tc('cancel')}
          </button>
          <button type="submit"
            className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition hover:bg-primary-light">
            {tc('save')}
          </button>
        </div>
      </div>

      <div className="space-y-6 rounded-2xl border border-border bg-white p-6 shadow-sm">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">{t('nameEn')} *</label>
            <input value={nameEn} onChange={(e) => setNameEn(e.target.value)} required className={inputClass} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">{t('nameHi')}</label>
            <input value={nameHi} onChange={(e) => setNameHi(e.target.value)} className={inputClass} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">{t('baseServings')}</label>
            <input type="number" min="1" value={baseServings} onChange={(e) => setBaseServings(Number(e.target.value))} className={inputClass} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">{t('prepTime')}</label>
            <input type="number" min="0" value={prepTime} onChange={(e) => setPrepTime(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-gray-700">{t('cookTime')}</label>
            <input type="number" min="0" value={cookTime} onChange={(e) => setCookTime(e.target.value)} className={inputClass} />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">{t('categories')}</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button key={cat} type="button" onClick={() => toggleCategory(cat)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  categories.includes(cat) ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">{t('ingredients')}</label>
            <button type="button" onClick={addIngredient}
              className="text-xs font-medium text-primary hover:text-primary-light">
              + {t('addIngredient')}
            </button>
          </div>
          <div className="space-y-2">
            {ingredients.map((ing, i) => (
              <div key={i} className="flex gap-2">
                <input placeholder={t('ingredientName')} value={ing.nameEn}
                  onChange={(e) => updateIngredient(i, 'nameEn', e.target.value)} className={`flex-1 ${inputClass}`} />
                <input placeholder={t('ingredientNameHi')} value={ing.nameHi || ''}
                  onChange={(e) => updateIngredient(i, 'nameHi', e.target.value)} className={`flex-1 ${inputClass}`} />
                <input type="number" placeholder={t('quantity')} value={ing.quantity || ''}
                  onChange={(e) => updateIngredient(i, 'quantity', Number(e.target.value))} className={`w-20 ${inputClass}`} />
                <input placeholder={t('unit')} value={ing.unit}
                  onChange={(e) => updateIngredient(i, 'unit', e.target.value)} className={`w-20 ${inputClass}`} />
                <button type="button" onClick={() => removeIngredient(i)}
                  className="text-gray-400 hover:text-danger">✕</button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">{t('steps')}</label>
            <button type="button" onClick={addStep}
              className="text-xs font-medium text-primary hover:text-primary-light">
              + {t('addStep')}
            </button>
          </div>
          <div className="space-y-2">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-2">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {i + 1}
                </span>
                <input placeholder={t('stepDescription')} value={step.descriptionEn}
                  onChange={(e) => updateStep(i, 'descriptionEn', e.target.value)} className={`flex-1 ${inputClass}`} />
                <input placeholder={t('stepDescriptionHi')} value={step.descriptionHi || ''}
                  onChange={(e) => updateStep(i, 'descriptionHi', e.target.value)} className={`flex-1 ${inputClass}`} />
                <button type="button" onClick={() => removeStep(i)}
                  className="text-gray-400 hover:text-danger">✕</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </form>
  );
}
