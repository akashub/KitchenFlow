import { useTranslations } from 'next-intl';

export default function ClientsPage() {
  const t = useTranslations('nav');
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">{t('clients')}</h1>
      <p className="mt-2 text-gray-500">Client management coming soon</p>
    </div>
  );
}
