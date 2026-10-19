import { Metadata } from 'next';
import ScanExperience from '@/components/ScanExperience';

export const metadata: Metadata = {
  title: 'Anand Dham | Early Checkers Discovery & Pass',
  description: 'Explore Anand Dham Elder Care Sanctuary and claim your Early Checker VIP Pass.',
};

export default function ScanPage() {
  return <ScanExperience />;
}
