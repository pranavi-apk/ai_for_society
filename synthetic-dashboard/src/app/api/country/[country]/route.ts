import { NextResponse } from 'next/server';
import { loadData } from '@/lib/data';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ country: string }> }
) {
  try {
    const { country } = await params;
    const countryParam = decodeURIComponent(country);
    const data = await loadData();
    
    const countryData = data.filter(hh => 
      hh.country.toLowerCase() === countryParam.toLowerCase()
    );
    
    if (countryData.length === 0) {
      return NextResponse.json({ error: 'Country not found' }, { status: 404 });
    }
    
    let totalPeople = 0;
    const campTotals: Record<string, number> = {};
    
    for (const hh of countryData) {
      totalPeople += hh.family_size;
      campTotals[hh.region_camp] = (campTotals[hh.region_camp] || 0) + hh.family_size;
    }

    return NextResponse.json({
      country: countryData[0].country,
      households: countryData.length,
      totalPeople,
      camps: campTotals
    });
  } catch (error) {
    console.error(`Error in /api/country:`, error);
    return NextResponse.json({ error: 'Failed to fetch country data' }, { status: 500 });
  }
}
