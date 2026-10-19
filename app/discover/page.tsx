import { Metadata } from 'next';
import ScanExperience from '@/components/ScanExperience';

export const metadata: Metadata = {
  title: 'Anand Dham | Discover & Early Checkers List',
  description: 'Experience Anand Dham and join the Early Checkers List.',
};

export default function DiscoverPage() {
  return <ScanExperience />;
}
