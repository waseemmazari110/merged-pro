import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    // Path to the PDF file in the public directory
    const filePath = path.join(process.cwd(), 'public', 'owners-guide.pdf');
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'PDF file not found' },
        { status: 404 }
      );
    }
    
    // Read the file
    const fileBuffer = fs.readFileSync(filePath);
    
    // Check if user wants to view inline or download
    const { searchParams } = new URL(request.url);
    const viewInline = searchParams.get('view') === 'true';
    
    // Return the file with proper headers
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': viewInline ? 'inline' : 'attachment; filename="owners-guide.pdf"',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch (error) {
    console.error('Error downloading PDF:', error);
    return NextResponse.json(
      { error: 'Failed to download PDF' },
      { status: 500 }
    );
  }
}
