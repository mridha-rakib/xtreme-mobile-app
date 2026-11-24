import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
import { CommandCenterSessionProvider } from '@/lib/auth/session';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'XTREME Concierge — Admin Web Command Center',
  description: 'Operations, Fleet, Chauffeur, and Executive Management Portal',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen antialiased bg-[var(--color-surface-canvas,#FAF8F4)]">
        <CommandCenterSessionProvider>{children}</CommandCenterSessionProvider>
      </body>
    </html>
  );
}
