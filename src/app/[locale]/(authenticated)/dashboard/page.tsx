import { useTranslations } from 'next-intl';

export default function DashboardPage() {
  const t = useTranslations('nav');
  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight">{t('dashboard')}</h1>
      <p className="mt-2 text-gray-500">Real-time kitchen monitoring coming soon</p>
    </div>
  );
}
