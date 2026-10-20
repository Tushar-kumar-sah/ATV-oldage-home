import { Metadata } from 'next';
import ScanExperience from '@/components/ScanExperience';

export const metadata: Metadata = {
  title: 'Discover OBOKASH | Register Your Interest | OBOKASH Senior Living',
  description: 'A New Chapter of Life, Filled with Peace. A Haven of Trust, Security, and Unparalleled Peace. 8769, SH 1, Kulpi, Chak Ramnath, West Bengal – 743351.',
};

export default function ScanPage() {
  return <ScanExperience />;
}
