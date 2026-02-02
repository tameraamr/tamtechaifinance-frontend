import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const articlesDirectory = path.join(process.cwd(), 'public/content/articles');
    
    const exists = fs.existsSync(articlesDirectory);
    
    if (!exists) {
      return NextResponse.json({
        error: 'Articles directory does not exist',
        path: articlesDirectory,
        cwd: process.cwd(),
      });
    }
    
    const files = fs.readdirSync(articlesDirectory);
    
    return NextResponse.json({
      success: true,
      path: articlesDirectory,
      cwd: process.cwd(),
      files: files,
    });
  } catch (error: any) {
    return NextResponse.json({
      error: error.message,
      stack: error.stack,
    });
  }
}
