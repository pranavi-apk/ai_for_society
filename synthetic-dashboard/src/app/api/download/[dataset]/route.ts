import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ dataset: string }> }
) {
  try {
    const { dataset } = await params;
    
    // Map 'full' and 'sample'
    let filename = '';
    if (dataset === 'sample') filename = 'sample_population.csv';
    else if (dataset === 'full') filename = 'full_population.csv';
    else {
      return NextResponse.json({ error: 'Invalid dataset. Choose "full" or "sample".' }, { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'public', 'data', filename);
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Dataset file not available.' }, { status: 404 });
    }

    // Read the file and force a download via Content-Disposition
    const fileBuffer = fs.readFileSync(filePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error(`Error in /api/download:`, error);
    return NextResponse.json({ error: 'Failed to download dataset' }, { status: 500 });
  }
}
