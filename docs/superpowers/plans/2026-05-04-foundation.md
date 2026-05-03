# Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold a deployable Next.js 15 app with auth, i18n, database, and basic layout — the foundation all other modules build on.

**Architecture:** Next.js 15 App Router with SQLite (better-sqlite3) via Drizzle ORM. NextAuth v5 handles email/password login (owner/head chef) and PIN login (supervisors). next-intl provides English + Hindi UI translations. Tailwind CSS v4 for styling. All pages live under `app/[locale]/` for i18n routing.

**Tech Stack:** Next.js 15, Drizzle ORM, better-sqlite3, NextAuth v5 (beta), next-intl, Tailwind CSS v4

---

## File Structure

```
src/
├── app/
│   ├── [locale]/
│   │   ├── layout.tsx              # Locale-aware root layout with NextIntlClientProvider
│   │   ├── page.tsx                # Redirect to /dashboard or /kitchen based on role
│   │   ├── login/
│   │   │   └── page.tsx            # Login page (email/password + PIN tabs)
│   │   └── (authenticated)/
│   │       ├── layout.tsx          # Auth guard + sidebar layout
│   │       ├── dashboard/
│   │       │   └── page.tsx        # Owner dashboard placeholder
│   │       ├── recipes/
│   │       │   └── page.tsx        # Recipe management placeholder
│   │       ├── clients/
│   │       │   └── page.tsx        # Client management placeholder
│   │       ├── menu/
│   │       │   └── page.tsx        # Menu planning placeholder
│   │       └── kitchen/
│   │           └── page.tsx        # Kitchen task board placeholder
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth]/
│   │           └── route.ts        # NextAuth route handler
│   └── globals.css                 # Tailwind v4 entry + theme tokens
├── auth.ts                         # NextAuth config (credentials + PIN providers)
├── db/
│   ├── index.ts                    # Drizzle client singleton
│   └── schema.ts                   # Drizzle schema (User table for foundation)
├── i18n/
│   ├── routing.ts                  # next-intl locale config
│   └── request.ts                  # next-intl server request config
├── lib/
│   └── password.ts                 # bcrypt hash/verify helpers
├── components/
│   ├── sidebar.tsx                 # Sidebar navigation (role-aware)
│   └── locale-switcher.tsx         # EN/HI language toggle
└── middleware.ts                   # next-intl routing middleware
messages/
├── en.json                         # English UI strings
└── hi.json                         # Hindi UI strings
drizzle/                            # Generated migration files
drizzle.config.ts                   # Drizzle Kit config
next.config.ts                      # Next.js config with next-intl plugin
postcss.config.mjs                  # Tailwind v4 PostCSS config
docker-compose.yml                  # Single-container deployment
Dockerfile                          # Production build
.env.local                          # AUTH_SECRET, DATABASE_URL
```

---

### Task 1: Scaffold Next.js 15 Project

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `postcss.config.mjs`, `src/app/globals.css`, `src/app/layout.tsx`, `src/app/page.tsx`

- [ ] **Step 1: Create Next.js project**

```bash
cd /Users/Aakash/inventory_management
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --turbopack --yes
```

Expected: Project scaffolded with `src/app/` structure. Since the directory has existing files (.git, docs), create-next-app should add around it.

- [ ] **Step 2: Verify Tailwind v4 setup**

`create-next-app` with `--tailwind` on Next.js 15 installs Tailwind v4. Verify by checking `postcss.config.mjs`:

```js
// postcss.config.mjs — should contain:
export default {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
```

If it generated a v3-style config with `tailwindcss` and `autoprefixer`, replace it with the above content.

- [ ] **Step 3: Set up theme tokens in globals.css**

Replace `src/app/globals.css` with:

```css
@import "tailwindcss";

@theme {
  --color-primary: #1e40af;
  --color-primary-light: #3b82f6;
  --color-secondary: #059669;
  --color-warning: #f59e0b;
  --color-danger: #ef4444;
  --color-surface: #f8fafc;
  --color-border: #e2e8f0;

  --color-status-not-started: #9ca3af;
  --color-status-prepping: #3b82f6;
  --color-status-cooking: #f59e0b;
  --color-status-done: #10b981;

  --font-sans: "Inter", ui-sans-serif, system-ui, sans-serif;
}
```

- [ ] **Step 4: Run dev server to verify**

```bash
cd /Users/Aakash/inventory_management
npm run dev
```

Expected: App starts on http://localhost:3000 with no errors.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json tsconfig.json next.config.ts postcss.config.mjs src/ .eslintrc* next-env.d.ts
git commit -m "feat: scaffold Next.js 15 project with Tailwind v4"
```

---

### Task 2: Set Up Drizzle ORM + SQLite

**Files:**
- Create: `src/db/schema.ts`, `src/db/index.ts`, `drizzle.config.ts`
- Modify: `package.json` (new dependencies)

- [ ] **Step 1: Install dependencies**

```bash
cd /Users/Aakash/inventory_management
npm install drizzle-orm better-sqlite3
npm install -D drizzle-kit @types/better-sqlite3
```

- [ ] **Step 2: Create Drizzle config**

Create `drizzle.config.ts`:

```ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: './data/kitchenflow.db',
  },
});
```

- [ ] **Step 3: Create User schema**

Create `src/db/schema.ts`:

```ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  email: text('email'),
  passwordHash: text('password_hash'),
  pin: text('pin'),
  role: text('role', { enum: ['owner', 'head_chef', 'supervisor', 'worker'] }).notNull(),
  assignedShift: text('assigned_shift', { enum: ['shift_4am', 'shift_6am', 'shift_6pm'] }),
  isActive: integer('is_active', { mode: 'boolean' }).notNull().default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});
```

- [ ] **Step 4: Create database client**

Create `src/db/index.ts`:

```ts
import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from './schema';

const sqlite = new Database('./data/kitchenflow.db');
sqlite.pragma('journal_mode = WAL');

export const db = drizzle(sqlite, { schema });
```

- [ ] **Step 5: Generate and run initial migration**

```bash
mkdir -p data
npx drizzle-kit generate
npx drizzle-kit migrate
```

Expected: `drizzle/` folder contains a migration SQL file. `data/kitchenflow.db` is created.

- [ ] **Step 6: Add data/ to .gitignore**

Append to `.gitignore`:

```
data/
*.db
```

- [ ] **Step 7: Commit**

```bash
git add drizzle.config.ts src/db/ drizzle/ .gitignore package.json package-lock.json
git commit -m "feat: add Drizzle ORM with SQLite and User schema"
```

---

### Task 3: Set Up NextAuth v5

**Files:**
- Create: `src/auth.ts`, `src/app/api/auth/[...nextauth]/route.ts`, `src/lib/password.ts`, `.env.local`
- Modify: `package.json` (new dependencies)

- [ ] **Step 1: Install dependencies**

```bash
cd /Users/Aakash/inventory_management
npm install next-auth@beta @auth/core bcryptjs
npm install -D @types/bcryptjs
```

- [ ] **Step 2: Generate auth secret**

```bash
npx auth secret
```

Expected: Creates `.env.local` with `AUTH_SECRET=...`. Add `.env.local` to `.gitignore` if not already there.

- [ ] **Step 3: Create password helpers**

Create `src/lib/password.ts`:

```ts
import bcrypt from 'bcryptjs';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
```

- [ ] **Step 4: Create NextAuth config**

Create `src/auth.ts`:

```ts
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { verifyPassword } from '@/lib/password';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      id: 'credentials',
      name: 'Email & Password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      authorize: async (credentials) => {
        const email = credentials.email as string;
        const password = credentials.password as string;
        if (!email || !password) return null;

        const user = await db.query.users.findFirst({
          where: eq(users.email, email),
        });
        if (!user || !user.passwordHash) return null;

        const valid = await verifyPassword(password, user.passwordHash);
        if (!valid) return null;

        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
    Credentials({
      id: 'pin',
      name: 'PIN Login',
      credentials: {
        pin: { label: 'PIN', type: 'password' },
      },
      authorize: async (credentials) => {
        const pin = credentials.pin as string;
        if (!pin) return null;

        const user = await db.query.users.findFirst({
          where: eq(users.pin, pin),
        });
        if (!user) return null;

        return {
          id: String(user.id),
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
});
```

- [ ] **Step 5: Create auth type declarations**

Create `src/types/next-auth.d.ts`:

```ts
import 'next-auth';

declare module 'next-auth' {
  interface User {
    role?: string;
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role?: string;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string;
  }
}
```

- [ ] **Step 6: Create route handler**

Create `src/app/api/auth/[...nextauth]/route.ts`:

```ts
import { handlers } from '@/auth';

export const { GET, POST } = handlers;
```

- [ ] **Step 7: Create seed script for owner account**

Create `src/db/seed.ts`:

```ts
import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';
import { hashPassword } from '../lib/password';

async function seed() {
  const sqlite = new Database('./data/kitchenflow.db');
  const db = drizzle(sqlite, { schema });

  const passwordHash = await hashPassword('admin123');

  db.insert(schema.users).values({
    name: 'Kitchen Owner',
    email: 'owner@kitchenflow.local',
    passwordHash,
    role: 'owner',
  }).run();

  db.insert(schema.users).values({
    name: 'Head Chef',
    email: 'chef@kitchenflow.local',
    passwordHash: await hashPassword('chef123'),
    role: 'head_chef',
  }).run();

  db.insert(schema.users).values({
    name: 'Morning Supervisor',
    pin: '1234',
    role: 'supervisor',
    assignedShift: 'shift_4am',
  }).run();

  console.log('Seeded: owner, head chef, morning supervisor');
  sqlite.close();
}

seed();
```

- [ ] **Step 8: Add seed script to package.json and run it**

Add to `package.json` scripts:

```json
"db:seed": "npx tsx src/db/seed.ts",
"db:generate": "npx drizzle-kit generate",
"db:migrate": "npx drizzle-kit migrate"
```

```bash
npm install -D tsx
npm run db:seed
```

Expected: "Seeded: owner, head chef, morning supervisor"

- [ ] **Step 9: Commit**

```bash
git add src/auth.ts src/app/api/auth/ src/lib/password.ts src/types/ src/db/seed.ts package.json package-lock.json
git commit -m "feat: add NextAuth v5 with email/password and PIN providers"
```

---

### Task 4: Set Up next-intl (English + Hindi)

**Files:**
- Create: `src/i18n/routing.ts`, `src/i18n/request.ts`, `messages/en.json`, `messages/hi.json`, `src/middleware.ts`
- Modify: `next.config.ts`

- [ ] **Step 1: Install next-intl**

```bash
cd /Users/Aakash/inventory_management
npm install next-intl
```

- [ ] **Step 2: Update next.config.ts**

Replace `next.config.ts` contents:

```ts
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
```

- [ ] **Step 3: Create i18n routing config**

Create `src/i18n/routing.ts`:

```ts
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'hi'],
  defaultLocale: 'en',
});
```

- [ ] **Step 4: Create i18n request config**

Create `src/i18n/request.ts`:

```ts
import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }
  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
```

- [ ] **Step 5: Create middleware**

Create `src/middleware.ts`:

```ts
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)',
};
```

- [ ] **Step 6: Create message files**

Create `messages/en.json`:

```json
{
  "common": {
    "appName": "KitchenFlow",
    "loading": "Loading...",
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "add": "Add",
    "search": "Search",
    "back": "Back",
    "confirm": "Confirm",
    "yes": "Yes",
    "no": "No"
  },
  "nav": {
    "dashboard": "Dashboard",
    "recipes": "Recipes",
    "menu": "Menu Planning",
    "kitchen": "Kitchen",
    "clients": "Clients",
    "settings": "Settings"
  },
  "auth": {
    "login": "Log In",
    "logout": "Log Out",
    "email": "Email",
    "password": "Password",
    "pin": "PIN",
    "emailLogin": "Email & Password",
    "pinLogin": "PIN Login",
    "loginFailed": "Invalid credentials. Please try again.",
    "enterPin": "Enter your PIN"
  },
  "shifts": {
    "shift_4am": "4 AM — Breakfast",
    "shift_6am": "6 AM — Lunch",
    "shift_6pm": "6 PM — Dinner"
  },
  "status": {
    "not_started": "Not Started",
    "prepping": "Prepping",
    "cooking": "Cooking",
    "done": "Done"
  },
  "roles": {
    "owner": "Owner",
    "head_chef": "Head Chef",
    "supervisor": "Supervisor",
    "worker": "Worker"
  }
}
```

Create `messages/hi.json`:

```json
{
  "common": {
    "appName": "KitchenFlow",
    "loading": "लोड हो रहा है...",
    "save": "सहेजें",
    "cancel": "रद्द करें",
    "delete": "हटाएं",
    "edit": "संपादित करें",
    "add": "जोड़ें",
    "search": "खोजें",
    "back": "वापस",
    "confirm": "पुष्टि करें",
    "yes": "हाँ",
    "no": "नहीं"
  },
  "nav": {
    "dashboard": "डैशबोर्ड",
    "recipes": "रेसिपी",
    "menu": "मेन्यू योजना",
    "kitchen": "रसोई",
    "clients": "ग्राहक",
    "settings": "सेटिंग्स"
  },
  "auth": {
    "login": "लॉग इन",
    "logout": "लॉग आउट",
    "email": "ईमेल",
    "password": "पासवर्ड",
    "pin": "पिन",
    "emailLogin": "ईमेल और पासवर्ड",
    "pinLogin": "पिन लॉगिन",
    "loginFailed": "गलत जानकारी। कृपया पुनः प्रयास करें।",
    "enterPin": "अपना पिन दर्ज करें"
  },
  "shifts": {
    "shift_4am": "सुबह 4 बजे — नाश्ता",
    "shift_6am": "सुबह 6 बजे — दोपहर का खाना",
    "shift_6pm": "शाम 6 बजे — रात का खाना"
  },
  "status": {
    "not_started": "शुरू नहीं हुआ",
    "prepping": "तैयारी",
    "cooking": "पक रहा है",
    "done": "हो गया"
  },
  "roles": {
    "owner": "मालिक",
    "head_chef": "मुख्य रसोइया",
    "supervisor": "सुपरवाइज़र",
    "worker": "कर्मचारी"
  }
}
```

- [ ] **Step 7: Commit**

```bash
git add src/i18n/ src/middleware.ts messages/ next.config.ts
git commit -m "feat: add next-intl with English and Hindi translations"
```

---

### Task 5: Create Locale-Aware Layout

**Files:**
- Create: `src/app/[locale]/layout.tsx`, `src/app/[locale]/page.tsx`
- Delete: `src/app/layout.tsx`, `src/app/page.tsx` (replaced by locale versions)

- [ ] **Step 1: Create locale layout**

Create `src/app/[locale]/layout.tsx`:

```tsx
import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Inter } from 'next/font/google';
import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'KitchenFlow',
  description: 'Kitchen management system',
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={`${inter.className} bg-surface text-gray-900 antialiased`}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Create root redirect page**

Create `src/app/[locale]/page.tsx`:

```tsx
import { redirect } from 'next/navigation';
import { auth } from '@/auth';

export default async function RootPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();

  if (!session) {
    redirect(`/${locale}/login`);
  }

  const role = (session.user as any).role;
  if (role === 'owner' || role === 'head_chef') {
    redirect(`/${locale}/dashboard`);
  }
  redirect(`/${locale}/kitchen`);
}
```

- [ ] **Step 3: Remove the default app/layout.tsx and app/page.tsx**

Delete `src/app/layout.tsx` and `src/app/page.tsx` (the non-locale versions created by create-next-app). The `[locale]` versions replace them.

Note: Keep `src/app/globals.css` in place — it's imported by the locale layout.

- [ ] **Step 4: Verify dev server starts**

```bash
npm run dev
```

Navigate to http://localhost:3000 — should redirect to `/en` and then to `/en/login` (since no session exists). The login page doesn't exist yet (404 expected), but no build errors.

- [ ] **Step 5: Commit**

```bash
git add src/app/
git commit -m "feat: add locale-aware layout with auth-based routing"
```

---

### Task 6: Build Login Page

**Files:**
- Create: `src/app/[locale]/login/page.tsx`

- [ ] **Step 1: Create login page with email/password and PIN tabs**

Create `src/app/[locale]/login/page.tsx`:

```tsx
'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTranslations } from 'next-intl';

export default function LoginPage() {
  const t = useTranslations('auth');
  const router = useRouter();
  const [tab, setTab] = useState<'email' | 'pin'>('email');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      setError(t('loginFailed'));
    } else {
      router.push('/');
      router.refresh();
    }
  }

  async function handlePinLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');
    const result = await signIn('pin', {
      pin,
      redirect: false,
    });
    setLoading(false);
    if (result?.error) {
      setError(t('loginFailed'));
    } else {
      router.push('/');
      router.refresh();
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-center text-2xl font-bold text-primary">
          KitchenFlow
        </h1>

        {/* Tab switcher */}
        <div className="mb-6 flex rounded-lg bg-gray-100 p-1">
          <button
            onClick={() => setTab('email')}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition ${
              tab === 'email'
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-500'
            }`}
          >
            {t('emailLogin')}
          </button>
          <button
            onClick={() => setTab('pin')}
            className={`flex-1 rounded-md py-2 text-sm font-medium transition ${
              tab === 'pin'
                ? 'bg-white text-primary shadow-sm'
                : 'text-gray-500'
            }`}
          >
            {t('pinLogin')}
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-danger">
            {error}
          </div>
        )}

        {tab === 'email' ? (
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                {t('email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-border px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                {t('password')}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-border px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-white transition hover:bg-primary-light disabled:opacity-50"
            >
              {loading ? '...' : t('login')}
            </button>
          </form>
        ) : (
          <form onSubmit={handlePinLogin} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                {t('enterPin')}
              </label>
              <input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                required
                className="w-full rounded-lg border border-border px-4 py-3 text-center text-2xl tracking-[0.5em] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="• • • •"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-white transition hover:bg-primary-light disabled:opacity-50"
            >
              {loading ? '...' : t('login')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Verify login page renders**

```bash
npm run dev
```

Navigate to http://localhost:3000/en/login. Should see the login form with email/password and PIN tabs. Try logging in with `owner@kitchenflow.local` / `admin123`. After login, should redirect to `/en/dashboard` (which will 404 — that's expected).

- [ ] **Step 3: Commit**

```bash
git add src/app/\[locale\]/login/
git commit -m "feat: add login page with email/password and PIN tabs"
```

---

### Task 7: Build Authenticated Layout with Sidebar

**Files:**
- Create: `src/app/[locale]/(authenticated)/layout.tsx`, `src/components/sidebar.tsx`, `src/components/locale-switcher.tsx`

- [ ] **Step 1: Create locale switcher component**

Create `src/components/locale-switcher.tsx`:

```tsx
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
      className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-gray-600 transition hover:bg-gray-100"
    >
      {locale === 'en' ? 'हिंदी' : 'English'}
    </button>
  );
}
```

- [ ] **Step 2: Create sidebar navigation**

Create `src/components/sidebar.tsx`:

```tsx
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
  const locale = useLocale();
  const pathname = usePathname();

  const visibleItems = NAV_ITEMS.filter((item) => item.roles.includes(role as any));

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-border bg-white">
      <div className="border-b border-border p-4">
        <h1 className="text-xl font-bold text-primary">KitchenFlow</h1>
        <p className="mt-1 text-sm text-gray-500">{userName}</p>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {visibleItems.map((item) => {
          const href = `/${locale}${item.href}`;
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={item.key}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              {t(item.key)}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3 space-y-2">
        <LocaleSwitcher />
        <button
          onClick={() => signOut({ callbackUrl: `/${locale}/login` })}
          className="w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-gray-600 transition hover:bg-gray-50"
        >
          {tAuth('logout')}
        </button>
      </div>
    </aside>
  );
}
```

- [ ] **Step 3: Create authenticated layout with auth guard**

Create `src/app/[locale]/(authenticated)/layout.tsx`:

```tsx
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { Sidebar } from '@/components/sidebar';

export default async function AuthenticatedLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();

  if (!session?.user) {
    redirect(`/${locale}/login`);
  }

  const role = (session.user as any).role || 'worker';
  const userName = session.user.name || 'User';

  return (
    <div className="flex h-screen">
      <Sidebar role={role} userName={userName} />
      <main className="flex-1 overflow-y-auto bg-surface p-6">
        {children}
      </main>
    </div>
  );
}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/\[locale\]/\(authenticated\)/ src/components/
git commit -m "feat: add authenticated layout with sidebar navigation and locale switcher"
```

---

### Task 8: Create Placeholder Pages

**Files:**
- Create: `src/app/[locale]/(authenticated)/dashboard/page.tsx`, `src/app/[locale]/(authenticated)/recipes/page.tsx`, `src/app/[locale]/(authenticated)/clients/page.tsx`, `src/app/[locale]/(authenticated)/menu/page.tsx`, `src/app/[locale]/(authenticated)/kitchen/page.tsx`

- [ ] **Step 1: Create all placeholder pages**

Create `src/app/[locale]/(authenticated)/dashboard/page.tsx`:

```tsx
import { useTranslations } from 'next-intl';

export default function DashboardPage() {
  const t = useTranslations('nav');
  return (
    <div>
      <h1 className="text-2xl font-bold">{t('dashboard')}</h1>
      <p className="mt-2 text-gray-500">Coming in Plan 6 — Owner Dashboard & Alerts</p>
    </div>
  );
}
```

Create `src/app/[locale]/(authenticated)/recipes/page.tsx`:

```tsx
import { useTranslations } from 'next-intl';

export default function RecipesPage() {
  const t = useTranslations('nav');
  return (
    <div>
      <h1 className="text-2xl font-bold">{t('recipes')}</h1>
      <p className="mt-2 text-gray-500">Coming in Plan 2 — Recipe Management</p>
    </div>
  );
}
```

Create `src/app/[locale]/(authenticated)/clients/page.tsx`:

```tsx
import { useTranslations } from 'next-intl';

export default function ClientsPage() {
  const t = useTranslations('nav');
  return (
    <div>
      <h1 className="text-2xl font-bold">{t('clients')}</h1>
      <p className="mt-2 text-gray-500">Coming in Plan 3 — Client Management</p>
    </div>
  );
}
```

Create `src/app/[locale]/(authenticated)/menu/page.tsx`:

```tsx
import { useTranslations } from 'next-intl';

export default function MenuPage() {
  const t = useTranslations('nav');
  return (
    <div>
      <h1 className="text-2xl font-bold">{t('menu')}</h1>
      <p className="mt-2 text-gray-500">Coming in Plan 4 — Menu Planning</p>
    </div>
  );
}
```

Create `src/app/[locale]/(authenticated)/kitchen/page.tsx`:

```tsx
import { useTranslations } from 'next-intl';

export default function KitchenPage() {
  const t = useTranslations('nav');
  return (
    <div>
      <h1 className="text-2xl font-bold">{t('kitchen')}</h1>
      <p className="mt-2 text-gray-500">Coming in Plan 5 — Kitchen Task Board</p>
    </div>
  );
}
```

- [ ] **Step 2: Test the full flow**

```bash
npm run dev
```

1. Go to http://localhost:3000 → should redirect to `/en/login`
2. Log in with `owner@kitchenflow.local` / `admin123`
3. Should redirect to `/en/dashboard` with sidebar showing all nav items
4. Click each nav item — pages render with placeholder text
5. Click "हिंदी" — labels switch to Hindi, URL changes to `/hi/...`
6. Click "Log Out" — redirects to login

- [ ] **Step 3: Commit**

```bash
git add src/app/\[locale\]/\(authenticated\)/
git commit -m "feat: add placeholder pages for all modules"
```

---

### Task 9: Docker Setup for Deployment

**Files:**
- Create: `Dockerfile`, `docker-compose.yml`, `.dockerignore`

- [ ] **Step 1: Create .dockerignore**

Create `.dockerignore`:

```
node_modules
.git
.superpowers
data
.env.local
.next
```

- [ ] **Step 2: Create Dockerfile**

Create `Dockerfile`:

```dockerfile
FROM node:20-alpine AS base

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/drizzle ./drizzle
COPY --from=builder /app/messages ./messages
COPY --from=builder /app/src/db/seed.ts ./src/db/seed.ts
COPY --from=builder /app/src/lib/password.ts ./src/lib/password.ts
COPY --from=deps /app/node_modules ./node_modules
COPY docker-entrypoint.sh ./

RUN mkdir -p /app/data && chown nextjs:nodejs /app/data

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

ENTRYPOINT ["./docker-entrypoint.sh"]
```

- [ ] **Step 3: Create Docker entrypoint script**

Create `docker-entrypoint.sh`:

```bash
#!/bin/sh
set -e

# Run database migrations
npx drizzle-kit migrate

# Seed if users table is empty (first boot)
node -e "
const Database = require('better-sqlite3');
const db = new Database('./data/kitchenflow.db');
const count = db.prepare('SELECT COUNT(*) as c FROM users').get();
if (count.c === 0) {
  console.log('First boot — running seed...');
  require('child_process').execSync('npx tsx src/db/seed.ts', { stdio: 'inherit' });
} else {
  console.log('Database already seeded, skipping.');
}
db.close();
"

# Start the app
exec node server.js
```

```bash
chmod +x docker-entrypoint.sh
```

- [ ] **Step 4: Update next.config.ts for standalone output**

Add `output: 'standalone'` to the Next.js config:

```ts
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  output: 'standalone',
};

const withNextIntl = createNextIntlPlugin();
export default withNextIntl(nextConfig);
```

- [ ] **Step 5: Create docker-compose.yml**

Create `docker-compose.yml`:

```yaml
services:
  kitchenflow:
    build: .
    ports:
      - "3000:3000"
    volumes:
      - kitchenflow-data:/app/data
    environment:
      - AUTH_SECRET=${AUTH_SECRET}
      - AUTH_TRUST_HOST=true
    restart: unless-stopped

volumes:
  kitchenflow-data:
```

- [ ] **Step 6: Verify Docker build works**

```bash
docker compose build
```

Expected: Image builds successfully. Don't run it yet (would conflict with dev server).

- [ ] **Step 7: Commit**

```bash
git add Dockerfile docker-compose.yml docker-entrypoint.sh .dockerignore next.config.ts
git commit -m "feat: add Docker setup with auto-migration entrypoint"
```

---

### Task 10: Final Verification & Push

- [ ] **Step 1: Run full build check**

```bash
cd /Users/Aakash/inventory_management
npm run build
```

Expected: Build succeeds with no errors.

- [ ] **Step 2: Run dev server and test complete flow**

```bash
npm run dev
```

Test checklist:
- [ ] http://localhost:3000 → redirects to `/en/login`
- [ ] Email login works (owner@kitchenflow.local / admin123)
- [ ] After login, sidebar shows correct nav items for owner role
- [ ] All placeholder pages render
- [ ] Language toggle switches between English and Hindi
- [ ] Logout works
- [ ] PIN login works (1234 for morning supervisor)
- [ ] Supervisor sees only Kitchen in sidebar

- [ ] **Step 3: Commit any remaining files**

```bash
git status
# Add any missed files if needed
git add -A
git commit -m "chore: foundation complete"
```

- [ ] **Step 4: Push to GitHub**

```bash
# Add remote if not already set
git remote get-url origin 2>/dev/null || git remote add origin https://github.com/akashub/KitchenFlow.git

# If GitHub repo was initialized with README/license, pull first
git pull --rebase origin main || true

git push -u origin main
```

Expected: Code pushed to https://github.com/akashub/KitchenFlow. If the remote has initial files (README, .gitignore), `pull --rebase` merges them before pushing.
