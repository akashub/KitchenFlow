'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { signOut } from 'next-auth/react';
import { LocaleSwitcher } from './locale-switcher';

const NAV_ITEMS = [
  { key: 'dashboard', href: '/dashboard', icon: '📊', roles: ['owner', 'head_chef'] },
  { key: 'recipes', href: '/recipes', icon: '📖', roles: ['owner', 'head_chef'] },
  { key: 'menu', href: '/menu', icon: '📋', roles: ['owner', 'head_chef'] },
  { key: 'kitchen', href: '/kitchen', icon: '🍳', roles: ['owner', 'head_chef', 'supervisor', 'worker'] },
  { key: 'clients', href: '/clients', icon: '🏢', roles: ['owner'] },
] as const;

export function Sidebar({ role, userName }: { role: string; userName: string }) {
  const t = useTranslations('nav');
  const tAuth = useTranslations('auth');
  const tRoles = useTranslations('roles');
  const locale = useLocale();
  const pathname = usePathname();

  const visibleItems = NAV_ITEMS.filter((item) =>
    item.roles.includes(role as any)
  );

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border bg-white">
      <div className="border-b border-border p-5">
        <h1 className="text-xl font-bold tracking-tight text-primary">
          KitchenFlow
        </h1>
        <div className="mt-2 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
            {userName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{userName}</p>
            <p className="text-xs text-gray-500">{tRoles(role as any)}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {visibleItems.map((item) => {
          const href = `/${locale}${item.href}`;
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={item.key}
              href={href}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? 'bg-primary/10 text-primary shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {t(item.key)}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-2 border-t border-border p-3">
        <LocaleSwitcher />
        <button
          onClick={() => signOut({ callbackUrl: `/${locale}/login` })}
          className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-500 transition hover:bg-gray-50 hover:text-gray-700"
        >
          {tAuth('logout')}
        </button>
      </div>
    </aside>
  );
}
