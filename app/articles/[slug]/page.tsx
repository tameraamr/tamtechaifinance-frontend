import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Link from 'next/link';
import { Calendar, Clock, Tag, TrendingUp, ArrowLeft } from 'lucide-react';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// Article metadata type
interface ArticleMetadata {
  title: string;
  slug: string;
  date: string;
  author: string;
  readTime: string;
  featured?: boolean;
  featuredDate?: string;
  excerpt: string;
  image?: string;
  tags: string[];
  relatedTickers: string[];
}

// Get article by slug
function getArticle(slug: string) {
  try {
    const articlesDirectory = path.join(process.cwd(), 'content/articles');
    const filePath = path.join(articlesDirectory, `${slug}.mdx`);
    
    if (!fs.existsSync(filePath)) {
      return null;
    }
    
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    
    return {
      metadata: data as ArticleMetadata,
      content,
    };
  } catch (error) {
    return null;
  }
}

// Generate static params for all articles
export async function generateStaticParams() {
  try {
    const articlesDirectory = path.join(process.cwd(), 'content/articles');
    
    if (!fs.existsSync(articlesDirectory)) {
      return [];
    }
    
    const files = fs.readdirSync(articlesDirectory);
    
    return files
      .filter(file => file.endsWith('.mdx'))
      .map(file => ({
        slug: file.replace('.mdx', ''),
      }));
  } catch (error) {
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = getArticle(params.slug);
  
  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }
  
  const { metadata } = article;
  
  return {
    title: `${metadata.title} | TamtechAI Finance`,
    description: metadata.excerpt,
    keywords: [...metadata.tags, ...metadata.relatedTickers, 'stock analysis', 'AI finance'].join(', '),
    authors: [{ name: metadata.author }],
    openGraph: {
      title: metadata.title,
      description: metadata.excerpt,
      type: 'article',
      publishedTime: metadata.date,
      authors: [metadata.author],
      tags: metadata.tags,
      images: metadata.image ? [metadata.image] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: metadata.title,
      description: metadata.excerpt,
      images: metadata.image ? [metadata.image] : [],
    },
  };
}

// MDX Components with custom styling
const components = {
  h1: (props: any) => <h1 className="text-4xl font-black text-white mt-8 mb-4" {...props} />,
  h2: (props: any) => <h2 className="text-3xl font-bold text-white mt-8 mb-4" {...props} />,
  h3: (props: any) => <h3 className="text-2xl font-bold text-slate-200 mt-6 mb-3" {...props} />,
  p: (props: any) => <p className="text-slate-300 text-lg leading-relaxed mb-4" {...props} />,
  ul: (props: any) => <ul className="list-disc list-inside text-slate-300 mb-4 space-y-2" {...props} />,
  ol: (props: any) => <ol className="list-decimal list-inside text-slate-300 mb-4 space-y-2" {...props} />,
  li: (props: any) => <li className="text-slate-300" {...props} />,
  blockquote: (props: any) => (
    <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-6 bg-slate-800/50 rounded-r-lg italic text-slate-200" {...props} />
  ),
  a: (props: any) => (
    <a className="text-blue-400 hover:text-blue-300 underline font-semibold" {...props} />
  ),
  table: (props: any) => (
    <div className="overflow-x-auto my-6">
      <table className="min-w-full border border-slate-700 rounded-lg" {...props} />
    </div>
  ),
  th: (props: any) => <th className="bg-slate-800 text-slate-200 font-bold px-4 py-2 border border-slate-700" {...props} />,
  td: (props: any) => <td className="px-4 py-2 border border-slate-700 text-slate-300" {...props} />,
  code: (props: any) => (
    <code className="bg-slate-800 text-emerald-400 px-1.5 py-0.5 rounded font-mono text-sm" {...props} />
  ),
  pre: (props: any) => (
    <pre className="bg-slate-900 border border-slate-700 rounded-lg p-4 overflow-x-auto my-4" {...props} />
  ),
  div: (props: any) => <div {...props} />,
};

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticle(params.slug);
  
  if (!article) {
    notFound();
  }
  
  const { metadata, content } = article;
  const isFeatured = metadata.featured && metadata.featuredDate === new Date().toISOString().split('T')[0];
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1121] via-[#070b14] to-[#0b1121]">
      {/* Back Navigation */}
      <div className="max-w-4xl mx-auto px-4 pt-6">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-400 transition">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
      
      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Article Header */}
        <header className="mb-8">
          {isFeatured && (
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-400/40 rounded-full px-4 py-2 mb-4">
              <span className="text-2xl">⭐</span>
              <span className="text-amber-300 font-bold text-sm uppercase tracking-wide">
                Article of the Day
              </span>
            </div>
          )}
          
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
            {metadata.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-slate-400 text-sm mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{new Date(metadata.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>{metadata.readTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>By {metadata.author}</span>
            </div>
          </div>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {metadata.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 bg-slate-800/50 border border-slate-700 rounded-full px-3 py-1 text-xs text-slate-300"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
          
          <p className="text-xl text-slate-300 leading-relaxed">
            {metadata.excerpt}
          </p>
        </header>
        
        {/* Article Content */}
        <div className="prose prose-invert prose-lg max-w-none">
          <MDXRemote source={content} components={components} />
        </div>
        
        {/* Related Tickers Section */}
        {metadata.relatedTickers.length > 0 && (
          <div className="mt-12 p-6 bg-gradient-to-br from-slate-900/80 to-slate-800/60 border border-slate-700/50 rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <h3 className="text-xl font-bold text-white">Stocks Mentioned in This Article</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {metadata.relatedTickers.map((ticker) => (
                <Link
                  key={ticker}
                  href={`/?ticker=${ticker}`}
                  className="group bg-slate-800/50 border border-slate-700 hover:border-blue-500/50 rounded-xl p-4 text-center transition-all hover:shadow-lg hover:shadow-blue-500/20"
                >
                  <p className="font-black text-blue-400 group-hover:text-blue-300 text-lg mb-1">
                    {ticker}
                  </p>
                  <p className="text-xs text-slate-400">Analyze Now →</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
