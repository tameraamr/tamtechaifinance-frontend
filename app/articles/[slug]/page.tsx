import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Calendar, Clock, Tag, TrendingUp, ArrowLeft } from 'lucide-react';
import { getArticleBySlug, getAllArticles } from '../../../lib/articles';
import ReactMarkdown from 'react-markdown';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const article = getArticleBySlug(params.slug);
  
  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }
  
  const { title, excerpt, author, date, readTime, tags, relatedTickers } = article;
  
  return {
    title: `${title} | TamtechAI Finance`,
    description: excerpt,
    keywords: [...tags, ...relatedTickers, 'stock analysis', 'AI finance'].join(', '),
    authors: [{ name: author }],
    openGraph: {
      title: title,
      description: excerpt,
      type: 'article',
      publishedTime: date,
      authors: [author],
      tags: tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: excerpt,
    },
  };
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = getArticleBySlug(params.slug);
  
  if (!article) {
    notFound();
  }
  
  const { title, content, author, date, readTime, tags, relatedTickers, featured, featuredDate } = article;
  const isFeatured = featured && featuredDate === new Date().toISOString().split('T')[0];
  
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
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-full px-4 py-1.5 mb-4">
              <span className="text-yellow-400 text-sm font-bold">✨ Article of the Day</span>
            </div>
          )}
          
          <h1 className="text-5xl font-black text-white mb-4 leading-tight">
            {title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 mb-6">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {readTime}
            </span>
            <span>{author}</span>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 bg-slate-800/50 border border-slate-700 rounded-full px-3 py-1 text-xs text-slate-300"
              >
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        </header>
        
        {/* Article Content */}
        <div className="prose prose-invert prose-lg max-w-none">
          <ReactMarkdown>{content}</ReactMarkdown>
        </div>
        
        {/* Related Tickers Section */}
        {relatedTickers.length > 0 && (
          <div className="mt-12 p-6 bg-gradient-to-br from-slate-900/80 to-slate-800/60 border border-slate-700/50 rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <h3 className="text-xl font-bold text-white">Stocks Mentioned in This Article</h3>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {relatedTickers.map((ticker) => (
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