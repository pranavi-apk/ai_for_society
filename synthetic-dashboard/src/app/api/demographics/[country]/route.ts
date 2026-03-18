import { NextResponse } from 'next/server';
import { loadData } from '@/lib/data';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ country: string }> }
) {
  try {
    const { country } = await params;
    const countryParam = decodeURIComponent(country).toLowerCase();
    const data = await loadData();
    
    const countryData = countryParam === 'all' 
      ? data 
      : data.filter(hh => hh.country.toLowerCase() === countryParam);
    
    if (countryData.length === 0 && countryParam !== 'all') {
      return NextResponse.json({ error: 'Country not found' }, { status: 404 });
    }
    
    // Age/Gender distribution (0-4, 5-11, 12-17, 18-59, 60+)
    const ageGroups = {
      '0-4': { M: 0, F: 0 },
      '5-11': { M: 0, F: 0 },
      '12-17': { M: 0, F: 0 },
      '18-59': { M: 0, F: 0 },
      '60+': { M: 0, F: 0 }
    };
    
    const vulnerabilities: Record<string, number> = {};

    for (const hh of countryData) {
      if (hh.vulnerability_type) {
        vulnerabilities[hh.vulnerability_type] = (vulnerabilities[hh.vulnerability_type] || 0) + 1;
      }
      
      for (const member of hh.members) {
        const gender = member.gender as 'M' | 'F';
        if (member.age <= 4) ageGroups['0-4'][gender]++;
        else if (member.age <= 11) ageGroups['5-11'][gender]++;
        else if (member.age <= 17) ageGroups['12-17'][gender]++;
        else if (member.age <= 59) ageGroups['18-59'][gender]++;
        else ageGroups['60+'][gender]++;
      }
    }

    // Format for Recharts age pyramid (Men negative, Women positive makes a good pyramid)
    const formattedPyramid = Object.entries(ageGroups).map(([ageGroup, genders]) => ({
      ageGroup,
      male: genders.M,
      female: genders.F,
    }));

    const formattedVulnerabilities = Object.entries(vulnerabilities).map(([name, value]) => ({
      name,
      value
    }));

    return NextResponse.json({
      pyramid: formattedPyramid,
      vulnerabilities: formattedVulnerabilities
    });
  } catch (error) {
    console.error(`Error in /api/demographics:`, error);
    return NextResponse.json({ error: 'Failed to fetch demographics data' }, { status: 500 });
  }
}
