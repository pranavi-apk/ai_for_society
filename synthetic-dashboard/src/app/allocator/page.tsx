import AllocatorFeature from '@/components/AllocatorFeature';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Resource Allocator | AI Synthetic Population',
  description: 'Simulate humanitarian resource distribution using our synthetic demographic pipeline.',
};

export default function AllocatorPage() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <AllocatorFeature />
    </div>
  );
}
