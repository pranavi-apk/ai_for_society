import AnimatedHero from '@/components/AnimatedHero';
import { Users, Map as MapIcon, Shield, Database, LayoutTemplate } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col bg-slate-50 min-h-screen">
      <AnimatedHero />

      {/* Stats Dashboard - Elevated UI */}
      <section className="py-20 px-4 -mt-16 relative z-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-slate-100 hover:-translate-y-2 transition-transform duration-300">
              <div className="flex justify-between items-start mb-4">
                <p className="text-slate-500 font-bold uppercase tracking-wider text-xs">Total Synthesized</p>
                <Database className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-5xl font-black text-[#00385e] tracking-tight">5.3M<span className="text-3xl text-blue-500">+</span></p>
              <p className="text-sm text-slate-500 mt-3 font-medium">Individuals modeled statistically</p>
            </div>
            
            <div className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-slate-100 hover:-translate-y-2 transition-transform duration-300 delay-75">
               <div className="flex justify-between items-start mb-4">
                <p className="text-slate-500 font-bold uppercase tracking-wider text-xs">Myanmar Crisis</p>
                <MapIcon className="w-5 h-5 text-amber-500" />
              </div>
              <p className="text-5xl font-black text-amber-600 tracking-tight">3.7M</p>
              <p className="text-sm text-slate-500 mt-3 font-medium">Internal Displaced Persons [6]</p>
            </div>
            
            <div className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-slate-100 hover:-translate-y-2 transition-transform duration-300 delay-150">
               <div className="flex justify-between items-start mb-4">
                <p className="text-slate-500 font-bold uppercase tracking-wider text-xs">Bangladesh Caps</p>
                <LayoutTemplate className="w-5 h-5 text-emerald-500" />
              </div>
              <p className="text-5xl font-black text-emerald-600 tracking-tight">1.1M</p>
              <p className="text-sm text-slate-500 mt-3 font-medium">Cox's Bazar & Bhasan Char [6]</p>
            </div>
            
            <div className="bg-white/90 backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-slate-100 hover:-translate-y-2 transition-transform duration-300 delay-200">
               <div className="flex justify-between items-start mb-4">
                <p className="text-slate-500 font-bold uppercase tracking-wider text-xs">Demographics</p>
                <Users className="w-5 h-5 text-rose-500" />
              </div>
              <p className="text-5xl font-black text-rose-600 tracking-tight">78%</p>
              <p className="text-sm text-slate-500 mt-3 font-medium">Women & Children targets hit [4]</p>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 px-4 bg-white relative overflow-hidden">
        {/* Subtle decorative background */}
        <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50 skew-x-12 origin-top-right transform -translate-x-20"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-black tracking-widest text-[#0072B7] uppercase mb-3">AI for Society</h2>
            <h3 className="text-4xl font-extrabold text-[#00385e] mb-6">Fusing Social Ethics with Deep Data</h3>
            <p className="text-xl text-slate-600 leading-relaxed">
              Real humanitarian micro-data is highly sensitive. If exposed, it risks lives. We invert the paradigm: using macro-statistics to algorithmically generate an identical, but entirely artificial, demographic baseline for research.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-blue-50/50 border border-blue-100 transition-colors hover:bg-blue-50">
              <div className="w-16 h-16 bg-white shadow-sm border border-blue-100 text-[#0072B7] rounded-2xl flex items-center justify-center mb-6 transform -rotate-3">
                <Shield className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-bold mb-3 text-slate-800">Zero PII Risk</h4>
              <p className="text-slate-600 text-lg">
                Statistically accurate households constructed via probabilistic distributions. Not a single real identity is contained within the dataset.
              </p>
            </div>
            
            <div className="p-8 rounded-3xl bg-emerald-50/50 border border-emerald-100 transition-colors hover:bg-emerald-50">
              <div className="w-16 h-16 bg-white shadow-sm border border-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 transform rotate-3">
                <Users className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-bold mb-3 text-slate-800">Verified Structures</h4>
              <p className="text-slate-600 text-lg">
                Generative parameters mirror precise demographic splits, such as the exact &gt;60 years old constraints at the Thai border camps.
              </p>
            </div>
            
            <div className="p-8 rounded-3xl bg-purple-50/50 border border-purple-100 transition-colors hover:bg-purple-50">
              <div className="w-16 h-16 bg-white shadow-sm border border-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6 transform -rotate-3">
                <Database className="w-8 h-8" />
              </div>
              <h4 className="text-2xl font-bold mb-3 text-slate-800">Open Validation</h4>
              <p className="text-slate-600 text-lg">
                Download the 500,000-row synthetic engine output instantly as CSV to seed your own local logistics and GIS forecasting models.
              </p>
            </div>
          </div>
          
          <div className="mt-16 text-center">
             <Link href="/methodology" className="inline-flex items-center gap-2 text-[#0072B7] font-bold text-lg hover:text-[#00385e] hover:underline transition-all">
                Read the Methodology and Citations &rarr;
             </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
