import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import './globals.css';
import Header from '@/components/header';
import { cn } from '@/lib/utils';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'HeardleSpot',
  description: 'How well do you know your favorite songs on Spotify?',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorInputText: 'black',
        },
        elements: {
          userButtonAvatarBox: 'size-6',
        },
      }}
    >
      <html lang="en">
        <body
          className={cn(
            'reletive dark h-screen bg-black text-white antialiased',
            inter.className
          )}
        >
          <Header />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
