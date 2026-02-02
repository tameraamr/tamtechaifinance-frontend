"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Newspaper, ArrowRight, Calendar, Clock, Sparkles } from 'lucide-react';

interface Article {
  title: string;
  slug: string;
  date: string;
  readTime: string;
  excerpt: string;
  tags: string[];
}

export default function ArticleOfTheDay() {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch featured article
    fetch('/api/featured-article')
      .then(res => res.json())
      .then(data => {
        setArticle(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading || !article) return null;

  return (
    <div className="relative mb-6 overflow-hidden">
      {/* Shimmer Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-400/10 to-transparent -translate-x-full animate-shimmer" style={{ animation: 'shimmer 3s infinite' }} />

      <div className="relative bg-gradient-to-br from-slate-900/90 via-slate-800/70 to-slate-900/90 backdrop-blur-xl border border-amber-500/30 rounded-3xl p-6 shadow-2xl overflow-hidden">
        {/* Background Glow */}
        <div className="absolute -left-20 -top-20 w-40 h-40 bg-amber-500/10 blur-3xl rounded-full" />
        <div className="absolute -right-20 -bottom-20 w-40 h-40 bg-yellow-500/10 blur-3xl rounded-full" />

        {/* Featured Badge */}
        <div className="relative z-10 mb-4">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-400/40 rounded-full px-4 py-2">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span className="text-amber-300 font-bold text-sm uppercase tracking-wide">
              📰 Article of the Day
            </span>
          </div>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
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
              className="group block mb-3"
            >
              <h2 className="text-2xl md:text-3xl font-black text-white group-hover:text-amber-300 transition-colors leading-tight">
                {article.title}
              </h2>
            </Link>

            {/* Excerpt */}
            <p className="text-slate-300 text-sm leading-relaxed mb-4 line-clamp-2">
              {article.excerpt}
            </p>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-4 text-slate-400 text-xs mb-4">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                <span>{new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>{article.readTime}</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {article.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="bg-amber-500/10 border border-amber-400/30 rounded-full px-2.5 py-1 text-xs text-amber-300 font-semibold"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <div className="md:flex-shrink-0">
            <Link
              href={`/articles/${article.slug}`}
              className="group inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:scale-105"
            >
              Read Full Article
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
