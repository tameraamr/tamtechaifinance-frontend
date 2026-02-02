import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export async function GET() {
  try {
    const articlesDirectory = path.join(process.cwd(), 'content/articles');
    
    if (!fs.existsSync(articlesDirectory)) {
      return NextResponse.json(null);
    }
    
    const files = fs.readdirSync(articlesDirectory);
    const today = new Date().toISOString().split('T')[0];
    
    // Find today's featured article
    for (const file of files) {
      if (!file.endsWith('.mdx')) continue;
      
      const filePath = path.join(articlesDirectory, file);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContents);
      
      // Check if article is featured for today
      if (data.featured && data.featuredDate === today) {
        return NextResponse.json({
          title: data.title,
          slug: data.slug,
          date: data.date,
          readTime: data.readTime,
          excerpt: data.excerpt,
          tags: data.tags,
        });
      }
    }
    
    // If no featured article for today, return the most recent article
    const articles = files
      .filter(file => file.endsWith('.mdx'))
      .map(file => {
        const filePath = path.join(articlesDirectory, file);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data } = matter(fileContents);
        return {
          title: data.title,
          slug: data.slug,
          date: data.date,
          readTime: data.readTime,
          excerpt: data.excerpt,
          tags: data.tags,
        };
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return NextResponse.json(articles[0] || null);
  } catch (error) {
    console.error('Error fetching featured article:', error);
    return NextResponse.json(null);
  }
}
