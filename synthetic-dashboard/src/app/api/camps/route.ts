import { NextResponse } from 'next/server';
import { loadData } from '@/lib/data';

export async function GET() {
  try {
    const data = await loadData();
    
    const campTotals: Record<string, { country: string, population: number }> = {};
    
    for (const hh of data) {
      // Just for Bangladesh specifically, as per the spec, 
      // but returning all camps is more flexible and dashboard can filter.
      if (!campTotals[hh.region_camp]) {
        campTotals[hh.region_camp] = { country: hh.country, population: 0 };
      }
      campTotals[hh.region_camp].population += hh.family_size;
    }

    const bangladeshCamps = Object.entries(campTotals)
      .filter(([_, info]) => info.country === 'Bangladesh')
      .map(([camp, info]) => ({ name: camp, population: info.population }));

    return NextResponse.json({
      allCamps: campTotals,
      bangladesh: bangladeshCamps
    });
  } catch (error) {
    console.error('Error in /api/camps:', error);
    return NextResponse.json({ error: 'Failed to fetch camps data' }, { status: 500 });
  }
}
