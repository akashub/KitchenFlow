import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { isDbAvailable } from '@/db';

export default async function RootPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isDbAvailable()) {
    redirect(`/${locale}/dashboard`);
  }

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
