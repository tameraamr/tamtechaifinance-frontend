import { NextResponse } from 'next/server';
import { getFeaturedArticle } from '../../../lib/articles';

export async function GET() {
  try {
    const today = new Date().toISOString().split('T')[0];
    const article = getFeaturedArticle(today);
    
    if (!article) {
      return NextResponse.json(null);
    }
    
    return NextResponse.json({
      title: article.title,
      slug: article.slug,
      date: article.date,
      readTime: article.readTime,
      excerpt: article.excerpt,
      tags: article.tags,
    });
  } catch (error) {
    console.error('Error fetching featured article:', error);
    return NextResponse.json(null);
  }
}
