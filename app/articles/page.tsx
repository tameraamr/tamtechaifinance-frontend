"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, ArrowRight, Newspaper } from 'lucide-react';
import Navbar from '../../src/components/Navbar';
import Footer from '../../src/components/Footer';

interface Article {
  id: number;
  slug: string;
  title: string;
  description: string;
  author: string;
  hero_emoji: string;
  hero_gradient: string;
  image_url?: string;
  related_tickers: string;
  is_featured: number;
  published: number;
  created_at: string;
}

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await fetch('/api/articles');
      const data = await response.json();
      
      console.log('Articles API response:', data);
      console.log('Articles count:', data.articles?.length);
      console.log('Sample article:', data.articles?.[0]);
      
      if (data.success) {
        setArticles(data.articles.filter((a: Article) => a.published === 1));
      }
    } catch (err) {
      console.error('Failed to fetch articles:', err);
    } finally {
      setLoading(false);
    }
  };
  
  const featuredArticle = articles.find(a => a.is_featured === 1);
  const otherArticles = articles.filter(a => a.id !== featuredArticle?.id);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1121] via-[#070b14] to-[#0b1121] text-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Home Button */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm"
          >
            <span>←</span>
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/40 rounded-full px-4 py-2 mb-4">
            <Newspaper className="w-4 h-4 text-amber-400" />
            <span className="text-amber-300 font-bold text-sm uppercase tracking-wide">
              Market Insights
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
            Expert Stock Analysis & Research
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Daily insights on trending stocks, market opportunities, and investment strategies
          </p>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="inline-block w-8 h-8 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
            <p className="text-slate-400 mt-4">Loading articles...</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20">
            <Newspaper className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-300 mb-2">No Articles Yet</h2>
            <p className="text-slate-500">Check back soon for expert market insights and analysis!</p>
          </div>
        ) : (
          <>
        
        {/* Featured Article of the Day */}
        {featuredArticle && (
          <div className="mb-8">
            <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/70 border border-amber-500/30 rounded-2xl overflow-hidden shadow-xl">
              <div className="flex flex-col md:flex-row gap-4 p-4">
                {/* Thumbnail Image */}
                {featuredArticle.image_url && (
                  <div className="relative w-full md:w-48 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                    <img 
                      src={featuredArticle.image_url} 
                      alt={featuredArticle.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-400/40 rounded-full px-3 py-1 mb-3">
                    <span className="text-amber-300 font-bold text-xs uppercase tracking-wide">
                      Article of the Day
                    </span>
                  </div>
                  
                  <Link href={`/articles/${featuredArticle.slug}`} className="group block">
                    <h2 className="text-xl md:text-2xl font-bold text-white group-hover:text-amber-300 transition-colors mb-2 line-clamp-2">
                      {featuredArticle.title}
                    </h2>
                  </Link>
                  
                  <p className="text-sm text-slate-300 mb-3 leading-relaxed line-clamp-2">
                    {featuredArticle.description}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-3 text-slate-400 text-xs mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(featuredArticle.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <span className="text-slate-600">•</span>
                    <span>{featuredArticle.author}</span>
                  </div>
                  
                  <Link
                    href={`/articles/${featuredArticle.slug}`}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white font-semibold px-4 py-2 rounded-lg transition-all text-sm"
                  >
                    Read Article
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* All Articles Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-black text-white mb-6">All Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherArticles.map((article) => (
              <Link
                key={article.id}
                href={`/articles/${article.slug}`}
                className="group bg-gradient-to-br from-slate-900/80 to-slate-800/60 border border-slate-700/50 hover:border-blue-500/50 rounded-2xl overflow-hidden transition-all hover:shadow-lg hover:shadow-blue-500/20"
              >
                {/* Hero Image */}
                {article.image_url && (
                  <div className="relative w-full h-48 overflow-hidden">
                    <img 
                      src={article.image_url} 
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/80" />
                  </div>
                )}
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors mb-3 line-clamp-2">
                    {article.title}
                  </h3>
                  
                  <p className="text-slate-300 text-sm mb-4 line-clamp-3">
                    {article.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-slate-400 text-xs mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(article.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-1 text-blue-400">
                      <span>Read</span>
                      <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                  
                  {article.related_tickers && (
                    <div className="flex flex-wrap gap-1.5">
                      {article.related_tickers.split(',').slice(0, 3).map((ticker, i) => (
                        <span
                          key={i}
                          className="text-xs bg-blue-500/10 text-blue-400 border border-blue-500/30 px-2 py-0.5 rounded"
                        >
                          {ticker.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
        </>
        )}
      </div>
      
      <Footer />
    </div>
  );
}
