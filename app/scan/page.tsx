import { Metadata } from 'next';
import ScanExperience from '@/components/ScanExperience';

export const metadata: Metadata = {
  title: 'OBOKASH - SENIOR LIVING | Early Checkers Discovery & Pass',
  description: 'A Haven of Trust, Security, and Unparalleled Peace. Explore Obokash Senior Living and claim your Early Checker VIP Pass.',
};

export default function ScanPage() {
  return <ScanExperience />;
}
