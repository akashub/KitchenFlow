import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'KitchenFlow',
  description: 'Kitchen management system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-surface text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
