import { useTranslations } from 'next-intl';

export default function RecipesPage() {
  const t = useTranslations('nav');
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">{t('recipes')}</h1>
      <p className="mt-2 text-gray-500">Recipe library coming soon</p>
    </div>
  );
}
