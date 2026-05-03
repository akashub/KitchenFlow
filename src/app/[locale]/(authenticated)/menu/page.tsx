import { useTranslations } from 'next-intl';

export default function MenuPage() {
  const t = useTranslations('nav');
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">{t('menu')}</h1>
      <p className="mt-2 text-gray-500">Menu planning coming soon</p>
    </div>
  );
}
