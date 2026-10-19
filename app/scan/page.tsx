import { Metadata } from 'next';
import ScanExperience from '@/components/ScanExperience';

export const metadata: Metadata = {
  title: 'OBOKASH - SENIOR LIVING | Visitor Registration & Introduction',
  description: 'A Haven of Trust, Security, and Unparalleled Peace. Connect with Obokash Senior Living and register your details.',
};

export default function ScanPage() {
  return <ScanExperience />;
}
