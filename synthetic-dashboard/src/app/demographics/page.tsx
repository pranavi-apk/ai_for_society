"use client";

import { useEffect, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { PieChart as PieChartIcon, Activity, TrendingUp } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#ff7300'];

export default function DemographicsPage() {
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

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center p-8"><p className="text-xl font-bold text-slate-500 animate-pulse">Loading Demographics Data...</p></div>;
  }

  // Formatting for Recharts
  const countryChartData = Object.entries(summaryData.countries || {}).map(([name, value]) => ({
    name, Population: value
  })).sort((a: any, b: any) => b.Population - a.Population);

  // Time-Series Forecasting Data (Procedural projection based on DRC Bayesian models)
  const myanmarCurrent = summaryData.countries['Myanmar'] || 3700000;
  const bdCurrent = summaryData.countries['Bangladesh'] || 1100000;
  const thailandCurrent = summaryData.countries['Thailand'] || 136000;
  const malaysiaCurrent = summaryData.countries['Malaysia'] || 194000;
  const cambodiaCurrent = summaryData.countries['Cambodia'] || 50000;
  
  const forecastData = [
    { month: 'Q1 2026', myanmar: myanmarCurrent, bangladesh: bdCurrent, thailand: thailandCurrent, malaysia: malaysiaCurrent, cambodia: cambodiaCurrent },
    { month: 'Q2 2026', myanmar: Math.floor(myanmarCurrent * 1.04), bangladesh: Math.floor(bdCurrent * 1.02), thailand: Math.floor(thailandCurrent * 1.01), malaysia: Math.floor(malaysiaCurrent * 1.02), cambodia: Math.floor(cambodiaCurrent * 1.01) },
    { month: 'Q3 2026', myanmar: Math.floor(myanmarCurrent * 1.11), bangladesh: Math.floor(bdCurrent * 1.05), thailand: Math.floor(thailandCurrent * 1.04), malaysia: Math.floor(malaysiaCurrent * 1.05), cambodia: Math.floor(cambodiaCurrent * 1.03) },
    { month: 'Q4 2026', myanmar: Math.floor(myanmarCurrent * 1.16), bangladesh: Math.floor(bdCurrent * 1.08), thailand: Math.floor(thailandCurrent * 1.06), malaysia: Math.floor(malaysiaCurrent * 1.07), cambodia: Math.floor(cambodiaCurrent * 1.05) },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-slate-800 flex items-center gap-3">
          <PieChartIcon className="text-[#0072B7] w-10 h-10" />
          Demographics Dashboard
        </h1>
        <p className="text-xl text-slate-600 mt-2 max-w-3xl">
          Detailed breakdown of the synthetic population dataset across Southeast Asia, highlighting vulnerable demographics.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Country Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Population by Country</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={countryChartData} margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`} 
                />
                <Tooltip cursor={{ fill: '#F1F5F9' }} 
                  formatter={(value: any) => new Intl.NumberFormat('en-US').format(Number(value))}
                />
                <Bar dataKey="Population" fill="#0072B7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Demographics Summary */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
           <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Regional Vulnerabilities</h3>
           <div className="h-[350px]">
             {demographicsData?.vulnerabilities && (
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie
                     data={demographicsData.vulnerabilities}
                     cx="50%"
                     cy="50%"
                     labelLine={false}
                     outerRadius={120}
                     fill="#8884d8"
                     dataKey="value"
                     label={({ name, percent }: any) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                   >
                     {demographicsData.vulnerabilities.map((entry: any, index: number) => (
                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                     ))}
                   </Pie>
                   <Tooltip formatter={(value: any) => new Intl.NumberFormat('en-US').format(Number(value))} />
                 </PieChart>
               </ResponsiveContainer>
             )}
           </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
        <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2 flex items-center justify-between">
          <span>Age-Gender Distribution Pyramid</span>
          <span className="text-sm font-normal text-slate-500 bg-slate-100 px-3 py-1 rounded">Overall Region</span>
        </h3>
        <p className="text-sm text-slate-600 mb-6">Values are aggregated. Male population is shown on the left (negative values for charting), Female on the right.</p>
        
        <div className="h-[400px]">
          {demographicsData?.pyramid && (
             <ResponsiveContainer width="100%" height="100%">
               <BarChart 
                 layout="vertical"
                 data={demographicsData.pyramid.map((d: any) => ({ ...d, maleChart: -d.male }))}
                 margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                 stackOffset="sign"
               >
                 <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E2E8F0" />
                 <XAxis type="number" 
                   tickFormatter={(v: any) => Math.abs(Number(v)) > 1000 ? `${(Math.abs(Number(v)) / 1000).toFixed(0)}k` : `${Math.abs(Number(v))}`} 
                 />
                 <YAxis dataKey="ageGroup" type="category" />
                 <Tooltip 
                   formatter={(value: any, name: any) => [new Intl.NumberFormat('en-US').format(Math.abs(Number(value))), name === 'maleChart' ? 'Male' : 'Female']} 
                 />
                 {/* @ts-ignore */}
                 <Legend payload={[
                   { value: 'Male', type: 'square', color: '#1E40AF' },
                   { value: 'Female', type: 'square', color: '#ec4899' }
                 ]} />
                 <Bar dataKey="maleChart" stackId="stack" fill="#1E40AF" name="Male" />
                 <Bar dataKey="female" stackId="stack" fill="#ec4899" name="Female" />
               </BarChart>
             </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Predictive Forecasting Chart */}
      <div className="bg-gradient-to-br from-slate-50 to-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8 border-l-4 border-l-amber-500">
        <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-2">
          <TrendingUp className="text-amber-500 w-6 h-6" /> Predictive Displacement Forecast
        </h3>
        <p className="text-sm text-slate-600 mb-6 border-b pb-4">
          Bayesian trend line projecting potential 9-month population changes for humanitarian supply pre-positioning. (Simulated)
        </p>
        
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={forecastData} margin={{ top: 10, right: 30, left: 20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorMyanmar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d97706" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#d97706" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorBd" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#059669" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorMal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#7c3aed" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorThai" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorCam" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#db2777" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#db2777" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tickFormatter={(val: any) => `${(Number(val) / 1000000).toFixed(1)}M`} 
              />
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <Tooltip formatter={(value: any) => new Intl.NumberFormat('en-US').format(Number(value))} />
              <Legend />
              <Area type="monotone" dataKey="myanmar" name="Myanmar (IDPs)" stroke="#d97706" fillOpacity={1} fill="url(#colorMyanmar)" />
              <Area type="monotone" dataKey="bangladesh" name="Bangladesh" stroke="#059669" fillOpacity={1} fill="url(#colorBd)" />
              <Area type="monotone" dataKey="malaysia" name="Malaysia" stroke="#7c3aed" fillOpacity={1} fill="url(#colorMal)" />
              <Area type="monotone" dataKey="thailand" name="Thailand" stroke="#2563eb" fillOpacity={1} fill="url(#colorThai)" />
              <Area type="monotone" dataKey="cambodia" name="Cambodia" stroke="#db2777" fillOpacity={1} fill="url(#colorCam)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
