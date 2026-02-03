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
    <div className="min-h-screen bg-slate-950">
      <Navbar />

      {/* Hero Image */}
      {article.image_url && (
        <div className="relative w-full h-[200px] md:h-[250px] overflow-hidden">
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 to-slate-950" />
        </div>
      )}

      {/* Article Content - No container, just max-width */}
      <article className="max-w-3xl mx-auto px-6 md:px-8 py-8">
        {/* Article Header */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
            {article.title}
          </h1>
          <div className="flex items-center gap-3 text-sm text-slate-400">
            <span className="text-slate-300">{article.author}</span>
            <span>•</span>
            <time>
              {new Date(article.created_at).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </time>
          </div>
        </header>

        {/* Article Body */}
        <div className="prose prose-invert prose-lg max-w-none 
          prose-headings:text-white prose-headings:font-bold prose-headings:mb-4 prose-headings:mt-8
          prose-h2:text-2xl prose-h3:text-xl
          prose-p:text-slate-300 prose-p:leading-relaxed prose-p:mb-4
          prose-strong:text-white
          prose-ul:text-slate-300 prose-ul:my-4
          prose-ol:text-slate-300 prose-ol:my-4
          prose-li:my-1
          prose-li:marker:text-slate-500
          prose-a:text-blue-400 prose-a:no-underline hover:prose-a:text-blue-300
          prose-blockquote:border-l-slate-700 prose-blockquote:text-slate-400 prose-blockquote:italic
          prose-code:text-amber-400 prose-code:bg-slate-900 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
          prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800
          prose-table:text-slate-300">
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>

        {/* Related Stocks */}
        {article.related_tickers && article.related_tickers.length > 0 && (
          <div className="mt-8 pt-6 border-t border-slate-800">
            <h3 className="text-lg font-semibold text-white mb-3">Related Stocks</h3>
            <div className="flex flex-wrap gap-2">
              {article.related_tickers.map((ticker) => (
                <Link
                  key={ticker}
                  href={`/stock-analyzer?ticker=${ticker}`}
                  className="px-3 py-1.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-white text-sm font-medium rounded hover:bg-slate-800 transition-all"
                >
                  {ticker}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back Link */}
        <div className="mt-8 pt-6 border-t border-slate-800">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
          >
            <span>←</span>
            <span>Back to Articles</span>
          </Link>
        </div>
      </article>
            href="/articles"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
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