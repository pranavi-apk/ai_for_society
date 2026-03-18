import { NextResponse } from 'next/server';
import { getSummaryStats } from '@/lib/data';

export async function GET() {
  try {
    const stats = await getSummaryStats();
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error in /api/summary:', error);
    return NextResponse.json({ error: 'Failed to fetch summary data' }, { status: 500 });
  }
}
