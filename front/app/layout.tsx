import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '../components/theme-provider';
import { ThemeToggle } from '../components/theme-toggle';
import { BackgroundPattern } from '../components/background-pattern';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'SAKANI',
  description: 'Gestion Immobilière',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen relative`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="theme"
        >
          <BackgroundPattern />
          <ThemeToggle />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
