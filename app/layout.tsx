import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/Providers';

export const metadata: Metadata = {
  title: 'Anand Dham Senior Living & Elder Care Home',
  description: 'A compassionate, secure, and dignified senior sanctuary offering 24/7 assisted care, medical support, and a vibrant community for elders.',
  keywords: ['Old Age Home', 'Senior Living', 'Elder Care', 'Assisted Living', 'Dementia Care', 'Retirement Home'],
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/icon.svg',
    apple: '/icon.svg',
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
