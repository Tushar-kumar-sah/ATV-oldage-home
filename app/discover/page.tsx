import { Metadata } from 'next';
import ScanExperience from '@/components/ScanExperience';

export const metadata: Metadata = {
  title: 'OBOKASH - SENIOR LIVING | Discover & Connect',
  description: 'A Haven of Trust, Security, and Unparalleled Peace. Experience Obokash Senior Living and share your details.',
};

export default function DiscoverPage() {
  return <ScanExperience />;
}
