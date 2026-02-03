import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Navbar from '../../../src/components/Navbar';
import Footer from '../../../src/components/Footer';
import Link from 'next/link';

// Dynamic route segment for articles
export const dynamicParams = true;
export const revalidate = 0; // Disable caching for now
export const dynamic = 'force-dynamic';

interface ArticleData {
  id: number;
  slug: string;
  title: string;
  description: string;
  content: string;
  author: string;
  hero_emoji: string;
  hero_gradient: string;
  image_url?: string;
  related_tickers: string[];
  created_at: string;
}

async function getArticle(slug: string): Promise<ArticleData | null> {
  try {
    const url = `https://tamtechaifinance-backend-production.up.railway.app/articles/${slug}`;
    console.log('Fetching article from:', url);
    
    const response = await fetch(url, {
      cache: 'no-store'
    });

    console.log('Article response status:', response.status);
    
    if (!response.ok) {
      const text = await response.text();
      console.error('Article fetch failed:', response.status, text);
      return null;
    }

    const data = await response.json();
    console.log('Article data:', data);
    return data.success ? data.article : null;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticle(slug);

  if (!article) {
    return {
      title: 'Article Not Found | TamtechAI',
    };
  }

  return {
    title: `${article.title} | TamtechAI`,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      publishedTime: article.created_at,
      authors: [article.author],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  console.log('[Article Page] Rendering article with slug:', slug);
  const article = await getArticle(slug);

  if (!article) {
    console.error('[Article Page] Article not found for slug:', slug);
    notFound();
  }

  // Parse gradient colors
  const gradientColors = article.hero_gradient.split(',');
  const fromColor = gradientColors[0] || 'blue';
  const viaColor = gradientColors[1] || 'purple';
  const toColor = gradientColors[2] || 'pink';

  const gradientClass = `from-${fromColor}-600 via-${viaColor}-600 to-${toColor}-600`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Navbar />

      {/* Hero Image */}
      {article.image_url && (
        <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/30 to-slate-900" />
        </div>
      )}

      {/* Article Content */}
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-4xl">
        {/* Article Header */}
        <header className="py-12 border-b border-slate-700/50">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            {article.title}
          </h1>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="text-lg font-medium text-slate-300">{article.author}</span>
            <span className="text-slate-600">•</span>
            <time className="text-lg">
              {new Date(article.created_at).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </time>
          </div>
        </header>

        {/* Article Body */}
        <article className="py-12 prose prose-invert prose-xl max-w-none 
          prose-headings:text-white prose-headings:font-bold prose-headings:mb-6 prose-headings:mt-8
          prose-h2:text-3xl prose-h3:text-2xl
          prose-p:text-slate-200 prose-p:leading-relaxed prose-p:mb-6 prose-p:text-lg
          prose-strong:text-white prose-strong:font-semibold
          prose-ul:text-slate-200 prose-ul:my-6
          prose-ol:text-slate-200 prose-ol:my-6
          prose-li:my-2 prose-li:text-lg
          prose-li:marker:text-amber-400
          prose-a:text-blue-400 prose-a:no-underline hover:prose-a:text-blue-300
          prose-blockquote:border-l-amber-500 prose-blockquote:text-slate-300 prose-blockquote:italic
          prose-code:text-amber-400 prose-code:bg-slate-800/50 prose-code:px-2 prose-code:py-1 prose-code:rounded
          prose-pre:bg-slate-800/50 prose-pre:border prose-pre:border-slate-700
          prose-table:text-slate-200">
          <div 
            className="article-content"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>

        {/* Related Stocks */}
        {article.related_tickers && article.related_tickers.length > 0 && (
          <div className="py-8 border-t border-slate-700/50">
            <h3 className="text-2xl font-bold text-white mb-6">Related Stocks</h3>
            <div className="flex flex-wrap gap-3">
              {article.related_tickers.map((ticker) => (
                <Link
                  key={ticker}
                  href={`/stock-analyzer?ticker=${ticker}`}
                  className="px-5 py-2.5 bg-slate-800/50 border border-slate-700 hover:border-blue-500 text-white font-semibold rounded-lg hover:bg-slate-800 transition-all"
                >
                  {ticker}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back Link */}
        <div className="py-12 border-t border-slate-700/50">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-lg"
          >
            <span>←</span>
            <span>Back to Articles</span>
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}