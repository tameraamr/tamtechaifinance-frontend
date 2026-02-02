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
    const url = `${process.env.NEXT_PUBLIC_API_URL}/articles/${slug}`;
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
  const article = await getArticle(slug);

  if (!article) {
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
        <div className="relative w-full h-[500px] overflow-hidden">
          <img
            src={article.image_url}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-slate-900" />
        </div>
      )}

      {/* Hero Section */}
      <div className={`bg-gradient-to-r ${gradientClass} py-20`}>
        <div className="container mx-auto px-4 text-center">
          <div className="text-8xl mb-6">{article.hero_emoji}</div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {article.title}
          </h1>
          <div className="flex items-center justify-center gap-4 text-white/90">
            <span>{article.author}</span>
            <span>•</span>
            <span>{new Date(article.created_at).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-8 md:p-12 shadow-2xl">
          <article 
            className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-white/90 prose-strong:text-white prose-ul:text-white/90 prose-ol:text-white/90"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>

        {/* Related Stocks */}
        {article.related_tickers && article.related_tickers.length > 0 && (
          <div className="mt-8 bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-4">📊 Related Stocks</h3>
            <div className="flex flex-wrap gap-3">
              {article.related_tickers.map((ticker) => (
                <Link
                  key={ticker}
                  href={`/stock-analyzer?ticker=${ticker}`}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg"
                >
                  {ticker}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back Link */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-all"
          >
            ← Back to Home
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}