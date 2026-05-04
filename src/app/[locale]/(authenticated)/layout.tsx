import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { Sidebar } from '@/components/sidebar';
import { isDbAvailable } from '@/db';

export default async function AuthenticatedLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const dbUp = isDbAvailable();

  let role = 'owner';
  let userName = 'Demo';

  if (dbUp) {
    const session = await auth();
    if (!session?.user) {
      redirect(`/${locale}/login`);
    }
    role = (session.user as any).role || 'worker';
    userName = session.user.name || 'User';
  }

  return (
    <div className="flex h-screen">
      <Sidebar role={role} userName={userName} />
      <main className="flex-1 overflow-y-auto bg-surface p-6">
        {children}
      </main>
    </div>
  );
}
