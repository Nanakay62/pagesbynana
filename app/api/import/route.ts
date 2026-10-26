import { NextResponse } from 'next/server';
import { parseDocxManuscript } from '@/lib/import-docx';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    if (!file.name.toLowerCase().endsWith('.docx')) {
      return NextResponse.json(
        { error: 'Only Microsoft Word (.docx) files are supported' },
        { status: 400 }
      );
    }

    // Limit to 10MB as per Section 9 specification
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size exceeds 10MB limit' },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const chapters = await parseDocxManuscript(buffer);

    return NextResponse.json({
      success: true,
      filename: file.name,
      chapterCount: chapters.length,
      chapters,
    });
  } catch (error: any) {
    console.error('Word import error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to parse Word file' },
      { status: 500 }
    );
  }
}
