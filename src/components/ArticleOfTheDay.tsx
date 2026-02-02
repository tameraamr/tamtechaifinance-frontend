"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Newspaper, ArrowRight, Calendar, Sparkles } from 'lucide-react';

interface Article {
  id: number;
  title: string;
  slug: string;
  description: string;
  author: string;
  hero_emoji: string;
  image_url?: string;
  created_at: string;
  related_tickers: string[];
}

export default function ArticleOfTheDay() {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch featured article from API
    fetch('/api/featured-article')
      .then(res => res.json())
      .then(data => {
        console.log('Featured article API response:', data);
        if (data.success && data.article) {
          setArticle(data.article);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load featured article:', err);
        setLoading(false);
      });
  }, []);

  // Show skeleton loader instead of nothing
  if (loading) {
    return (
      <div className="relative mb-6 overflow-hidden">
        <div className="relative bg-gradient-to-br from-slate-900/90 via-slate-800/70 to-slate-900/90 backdrop-blur-xl border border-amber-500/30 rounded-2xl overflow-hidden shadow-xl p-4">
          <div className="animate-pulse flex gap-4">
            <div className="w-28 h-28 bg-slate-700/50 rounded-lg flex-shrink-0" />
            <div className="flex-1">
              <div className="h-5 w-32 bg-slate-700/50 rounded-full mb-2" />
              <div className="h-6 bg-slate-700/50 rounded mb-1" />
              <div className="h-4 bg-slate-700/50 rounded mb-2" />
              <div className="h-3 w-2/3 bg-slate-700/50 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!article) return null;

  return (
    <div className="relative mb-6 overflow-hidden">
      {/* Shimmer Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/10 to-transparent -translate-x-full animate-shimmer" style={{ animation: 'shimmer 3s infinite' }} />

      <div className="relative bg-gradient-to-br from-slate-900/90 via-slate-800/70 to-slate-900/90 backdrop-blur-xl border border-amber-500/30 rounded-2xl overflow-hidden shadow-xl">
        {/* Background Glow */}
        <div className="absolute -left-20 -top-20 w-32 h-32 bg-amber-500/10 blur-3xl rounded-full" />
        <div className="absolute -right-20 -bottom-20 w-32 h-32 bg-yellow-500/10 blur-3xl rounded-full" />

        <div className="relative z-10 flex gap-4 p-4">
          {/* Thumbnail Image - Left Side */}
          {article.image_url && (
            <div className="relative w-28 h-28 flex-shrink-0 rounded-lg overflow-hidden">
              <img 
                src={article.image_url} 
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content - Right Side */}
          <div className="flex-1 min-w-0">
          {/* Featured Badge */}
          <div className="mb-2">
            <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-400/40 rounded-full px-2.5 py-1\">
              <Sparkles className="w-3 h-3 text-amber-400 animate-pulse" />
              <span className="text-amber-300 font-bold text-xs uppercase tracking-wide">
                Article of the Day
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
          <div className="flex-1">
            {/* Header */}
            <div className="flex items-center gap-2 mb-3">
              <Newspaper className="w-5 h-5 text-amber-400" />
              <h3 className="text-xs uppercase tracking-[0.2em] text-amber-300 font-bold">
                Featured Analysis
              </h3>
            </div>

            {/* Title */}
            <Link 
              href={`/articles/${article.slug}`}
              className="group block mb-1"
            >
              <h2 className="text-base md:text-lg font-bold text-white group-hover:text-amber-300 transition-colors leading-tight line-clamp-2">
                {article.title}
              </h2>
            </Link>

            {/* Description */}
            <p className="text-slate-400 text-xs leading-relaxed mb-2 line-clamp-2">
              {article.description}
            </p>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-2 text-slate-500 text-xs mb-2">
              <div className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span>{new Date(article.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
              <span>•</span>
              <span>{article.author}</span>
            </div>

            {/* Related Tickers */}
            {article.related_tickers && article.related_tickers.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {article.related_tickers.slice(0, 3).map((ticker) => (
                  <Link
                    key={ticker}
                    href={`/stock-analyzer?ticker=${ticker}`}
                    className="bg-amber-500/10 border border-amber-400/30 rounded px-2 py-0.5 text-xs text-amber-300 font-semibold hover:bg-amber-500/20 transition-all"
                  >
                    {ticker}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
