import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SEA Displacement Synthetic Population Model',
  description: 'AI-generated demographic data supporting humanitarian response (2026)',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900 min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <footer className="bg-slate-900 text-slate-400 py-6 text-center text-sm">
          <p>Data sources: UNHCR, IRC, World Vision, Danish Refugee Council. All data models represent simulated populations for Q1 2026.</p>
          <p className="mt-2">Last Updated: March 2026 | Open Data for Humanitarian Use</p>
        </footer>
      </body>
    </html>
  );
}
