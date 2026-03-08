import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Outfit } from 'next/font/google';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-display',
});

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-body',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#faf7f2',
};

export const metadata: Metadata = {
  title: 'Personas',
  description: 'AI coaching personas',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${outfit.variable}`}>
      <body className={`${outfit.className} min-h-screen`}>
        {children}
      </body>
    </html>
  );
}
