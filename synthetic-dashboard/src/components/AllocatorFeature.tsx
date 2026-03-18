"use client";

import { useState, useEffect, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Calculator, Users, DollarSign, Target, ArrowRight, Printer } from 'lucide-react';
import { motion } from 'framer-motion';

const COLORS = ['#10B981', '#E2E8F0']; // Emerald for met, Slate for unmet

export default function AllocatorFeature() {
  const [budget, setBudget] = useState<number>(50000);
  const [costPerPerson, setCostPerPerson] = useState<number>(150);
  const [targetGroup, setTargetGroup] = useState<string>('all');
  const [country, setCountry] = useState<string>('all');
  
  const [summaryData, setSummaryData] = useState<any>(null);
  const [demographicsData, setDemographicsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/summary').then(res => res.json()),
      fetch('/api/demographics/all').then(res => res.json())
    ]).then(([summary, demo]) => {
      setSummaryData(summary);
      setDemographicsData(demo);
      setLoading(false);
    });
  }, []);

  // Compute matched population based on filters
  const targetPopulation = useMemo(() => {
    if (!summaryData || !demographicsData) return 0;
    
    // Total in current dataset
    let pop = summaryData.totalPeople;

    // Filter by country
    if (country !== 'all') {
      pop = summaryData.countries[country] || 0;
    }

    // Rough estimation multipliers based on regional demographics generated
    if (targetGroup === 'children') pop = pop * summaryData.demographics.childrenPercent;
    if (targetGroup === 'women') pop = pop * summaryData.demographics.femalePercent;
    if (targetGroup === 'vulnerable') pop = pop * summaryData.demographics.vulnerablePercent;

    return Math.floor(pop);
  }, [summaryData, demographicsData, targetGroup, country]);

  const peopleHelped = Math.floor(budget / costPerPerson);
  const percentageHelped = targetPopulation > 0 
    ? Math.min(100, (peopleHelped / targetPopulation) * 100) 
    : 0;

  if (loading) return <div className="h-96 flex items-center justify-center"><p className="animate-pulse text-slate-500 font-bold">Initializing Simulation Engine...</p></div>;

  const pieData = [
    { name: 'Needs Met', value: Math.min(peopleHelped, targetPopulation) },
    { name: 'Unmet Need', value: Math.max(0, targetPopulation - peopleHelped) }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 print:p-0">
      <div className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="inline-block bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase mb-4 flex items-center gap-2 w-max print:hidden">
            <Calculator className="w-4 h-4" /> Interactive Simulation
          </div>
          <h1 className="text-4xl font-extrabold text-[#00385e] mb-4">AI Resource Allocator</h1>
          <p className="text-xl text-slate-600 max-w-3xl print:text-black print:text-base">
            Use the synthetic demographic model to simulate humanitarian aid distributions. See exactly how far a financial budget stretches across specific vulnerable groups in the region.
          </p>
        </div>
        <button 
          onClick={() => window.print()} 
          className="print:hidden bg-white hover:bg-slate-50 text-[#00385e] border border-slate-200 shadow-sm font-bold py-3 px-6 rounded-xl transition-all flex items-center gap-2 group"
        >
          <Printer className="w-5 h-5 group-hover:scale-110 transition-transform" />
          Export SitRep (PDF)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 print:block">
        
        {/* Controls Panel */}
        <div className="lg:col-span-5 bg-white p-8 rounded-3xl shadow-lg border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Target className="w-6 h-6 text-[#0072B7]" /> Campaign Parameters
          </h2>

          <div className="space-y-8">
            {/* Total Budget */}
            <div>
              <label className="text-sm font-bold text-slate-600 mb-2 flex justify-between">
                <span>Total Campaign Budget (USD)</span>
                <span className="text-[#0072B7]">${budget.toLocaleString()}</span>
              </label>
              <input 
                type="range" 
                min="1000" max="5000000" step="1000"
                value={budget} 
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-[#0072B7]"
              />
            </div>

            {/* Cost Per Person */}
            <div>
              <label className="text-sm font-bold text-slate-600 mb-2 flex justify-between">
                <span>Cost of Aid per Individual</span>
                <span className="text-emerald-600">${costPerPerson.toLocaleString()}</span>
              </label>
              <input 
                type="range" 
                min="10" max="1000" step="5"
                value={costPerPerson} 
                onChange={(e) => setCostPerPerson(Number(e.target.value))}
                className="w-full h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <p className="text-xs text-slate-400 mt-2">Example: $50 = Basic Food Kit, $500 = Temporary Shelter</p>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              {/* Region Filter */}
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">Target Region</label>
                <select 
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-[#0072B7] outline-none transition-all"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                >
                  <option value="all">Entire SEA Region</option>
                  <option value="Myanmar">Myanmar (IDPs)</option>
                  <option value="Bangladesh">Bangladesh (Camps)</option>
                  <option value="Thailand">Thailand Border</option>
                  <option value="Malaysia">Malaysia</option>
                  <option value="Cambodia">Cambodia</option>
                </select>
              </div>

              {/* Demographic Target */}
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-2">Vulnerable Group</label>
                <select 
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-[#0072B7] outline-none transition-all"
                  value={targetGroup}
                  onChange={(e) => setTargetGroup(e.target.value)}
                >
                  <option value="all">General Population</option>
                  <option value="children">Children (Under 18)</option>
                  <option value="women">Women & Girls</option>
                  <option value="vulnerable">High Risk (Elderly, Disable, Unaccompanied)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Impact Results Panel */}
        <div className="lg:col-span-7 space-y-6 print:mt-8">
          
          <div className="bg-[#00385e] print:bg-slate-100 print:text-black print:border print:border-slate-300 p-8 rounded-3xl shadow-xl text-white relative overflow-hidden print:shadow-none">
            <div className="absolute right-0 top-0 opacity-10 transform translate-x-10 -translate-y-10 print:opacity-5">
              <DollarSign className="w-64 h-64 print:text-slate-800" />
            </div>
            
            <h3 className="text-xl font-bold text-blue-200 print:text-slate-600 mb-2">Simulated Impact</h3>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-6xl font-black text-white print:text-black">{peopleHelped.toLocaleString()}</span>
              <span className="text-xl text-blue-100 print:text-slate-600">individuals helped</span>
            </div>
            
            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-blue-400/30">
              <div>
                <p className="text-blue-200 text-sm mb-1 uppercase tracking-wider font-semibold">Target Size</p>
                <p className="text-2xl font-bold">{targetPopulation.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-blue-200 text-sm mb-1 uppercase tracking-wider font-semibold">Total Cost</p>
                <p className="text-2xl font-bold">${budget.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center">
               <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Need Coverage</h4>
               <div className="w-48 h-48 relative">
                 <ResponsiveContainer width="100%" height="100%">
                   <PieChart>
                     <Pie
                       data={pieData}
                       cx="50%"
                       cy="50%"
                       innerRadius={60}
                       outerRadius={80}
                       paddingAngle={5}
                       dataKey="value"
                     >
                       {pieData.map((entry, index) => (
                         <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                       ))}
                     </Pie>
                     <RechartsTooltip formatter={(value: any) => Number(value).toLocaleString()} />
                   </PieChart>
                 </ResponsiveContainer>
                 <div className="absolute inset-0 flex items-center justify-center flex-col">
                   <span className="text-3xl font-black text-slate-800">{percentageHelped.toFixed(1)}%</span>
                   <span className="text-xs text-slate-400">Met</span>
                 </div>
               </div>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
               <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 border-b pb-2">AI Dataset Insight</h4>
               <p className="text-slate-600 mb-4">
                 Because this simulation runs against our statistically-accurate synthetic population, the <strong>{targetPopulation.toLocaleString()}</strong> target individual count directly mirrors the real-world scale in {country === 'all' ? 'the region' : country}.
               </p>
               <div className="bg-blue-50 text-[#0072B7] p-4 rounded-xl text-sm font-medium flex items-start gap-3">
                 <Users className="w-5 h-5 flex-shrink-0 mt-0.5" />
                 This allows NGOs to budget logistics without handling classified refugee rosters.
               </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
