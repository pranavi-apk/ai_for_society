import InteractiveMap from '@/components/InteractiveMap';
import { MapPin } from 'lucide-react';

export default function MapPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-slate-800 flex items-center gap-3">
          <MapPin className="text-[#0072B7] w-10 h-10" />
          Interactive Displacement Map
        </h1>
        <p className="text-xl text-slate-600 mt-2 max-w-3xl">
          Visualizing the synthetic population distribution across Southeast Asia. Data is modeled after verified humanitarian reports from early 2026.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <InteractiveMap />
        
        <div className="mt-6 flex flex-wrap gap-4 justify-center text-sm">
          <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-amber-600 block"></span> Myanmar</div>
          <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-emerald-600 block"></span> Bangladesh</div>
          <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-blue-600 block"></span> Thailand</div>
          <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-violet-600 block"></span> Malaysia</div>
          <div className="flex items-center gap-2"><span className="w-4 h-4 rounded-full bg-pink-600 block"></span> Cambodia</div>
        </div>
      </div>
    </div>
  );
}
