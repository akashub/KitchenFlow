import { useTranslations } from 'next-intl';

export default function KitchenPage() {
  const t = useTranslations('nav');
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">{t('kitchen')}</h1>
      <p className="mt-2 text-gray-500">Kitchen task board coming soon</p>
    </div>
  );
}
