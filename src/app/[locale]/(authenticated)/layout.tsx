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
