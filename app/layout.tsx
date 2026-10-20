import type { Metadata } from 'next';
import './globals.css';
import Providers from '@/components/Providers';

export const metadata: Metadata = {
  title: 'OBOKASH Senior Living | A New Chapter of Life, Filled with Peace.',
  description: 'OBOKASH is an evolving vision for senior living, built around dignity, comfort, companionship, and peace of mind. A Haven of Trust, Security, and Unparalleled Peace. 8769, SH 1, Kulpi, Chak Ramnath, West Bengal – 743351.',
  keywords: [
    'OBOKASH Senior Living',
    'A New Chapter of Life Filled with Peace',
    'A Haven of Trust Security and Unparalleled Peace',
    'Kulpi West Bengal Senior Living',
    'Old Age Home West Bengal',
    'Senior Care Kolkata',
    'Assisted Living Bengal',
    'Dignified Elder Care',
  ],
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
      <body className="min-h-screen bg-[#F7F2EA] font-sans text-[#352A25] antialiased selection:bg-[#78836A]/20 selection:text-[#352A25]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
