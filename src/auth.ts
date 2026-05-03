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
