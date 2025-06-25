import type React from 'react';
import type {Metadata} from 'next';
import {Inter} from 'next/font/google';
import './globals.css';
import {ThemeProvider} from '@/components/ThemeProvider';
import {AsgardeoProvider} from '@asgardeo/nextjs';

const inter = Inter({subsets: ['latin']});

export const metadata: Metadata = {
  title: 'Teamspace - Where teams collaborate',
  description: "Streamline your team's workflow with our all-in-one collaboration platform.",
  generator: 'v0.dev',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AsgardeoProvider>
            <div className="min-h-screen bg-background">{children}</div>
          </AsgardeoProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
