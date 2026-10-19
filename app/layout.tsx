import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/Providers';

export const metadata: Metadata = {
  title: 'OBOKASH - SENIOR LIVING | A Haven of Trust, Security, and Unparalleled Peace.',
  description: 'OBOKASH - SENIOR LIVING: A Haven of Trust, Security, and Unparalleled Peace. A compassionate, secure, and dignified senior sanctuary offering 24/7 assisted care, medical support, and a vibrant community.',
  keywords: ['Obokash Senior Living', 'Old Age Home', 'Senior Living', 'Elder Care', 'Assisted Living', 'Dementia Care', 'Retirement Home'],
  icons: {
    icon: [
      { url: '/images/obokash-logo.png', type: 'image/png' },
    ],
    shortcut: '/images/obokash-logo.png',
    apple: '/images/obokash-logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-cream-50 font-sans text-sage-900 antialiased selection:bg-sage-200 selection:text-sage-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
