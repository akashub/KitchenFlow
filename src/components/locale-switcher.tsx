'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';

export function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function switchLocale() {
    const newLocale = locale === 'en' ? 'hi' : 'en';
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  }

  return (
    <button
      onClick={switchLocale}
      className="w-full rounded-lg border border-border px-3 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
    >
      {locale === 'en' ? 'हिंदी' : 'English'}
    </button>
  );
}
