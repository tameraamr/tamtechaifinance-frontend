import { Metadata } from 'next';
import Link from 'next/link';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Calendar, Clock, Tag, ArrowRight, Newspaper } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Market Insights & Analysis | TamtechAI Finance',
  description: 'Expert stock market analysis, investment strategies, and financial insights powered by AI. Daily articles on trending stocks, sectors, and market opportunities.',
  keywords: 'stock analysis, market insights, investment strategies, financial news, AI stock research',
};

interface ArticleMetadata {
  title: string;
  slug: string;
  date: string;
  author: string;
  readTime: string;
  featured?: boolean;
  featuredDate?: string;
  excerpt: string;
  tags: string[];
}

function getAllArticles(): ArticleMetadata[] {
  const articlesDirectory = path.join(process.cwd(), 'public/content/articles');
  
  if (!fs.existsSync(articlesDirectory)) {
    return [];
  }
  
  const files = fs.readdirSync(articlesDirectory);
  
  const articles = files
    .filter(file => file.endsWith('.mdx'))
    .map(file => {
      const filePath = path.join(articlesDirectory, file);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContents);
      return data as ArticleMetadata;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return articles;
}

export default function ArticlesPage() {
  const articles = getAllArticles();
  const today = new Date().toISOString().split('T')[0];
  const featuredArticle = articles.find(a => a.featured && a.featuredDate === today);
  const otherArticles = articles.filter(a => a.slug !== featuredArticle?.slug);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1121] via-[#070b14] to-[#0b1121] text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-12 text-center">
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
        
        {/* Featured Article of the Day */}
        {featuredArticle && (
          <div className="mb-12">
            <div className="bg-gradient-to-br from-slate-900/90 to-slate-800/70 border border-amber-500/30 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-amber-500/10 blur-3xl rounded-full" />
              
              <div className="relative z-10">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-400/40 rounded-full px-4 py-2 mb-6">
                  <span className="text-2xl">⭐</span>
                  <span className="text-amber-300 font-bold text-sm uppercase tracking-wide">
                    Article of the Day
                  </span>
                </div>
                
                <Link href={`/articles/${featuredArticle.slug}`} className="group block">
                  <h2 className="text-3xl md:text-4xl font-black text-white group-hover:text-amber-300 transition-colors mb-4">
                    {featuredArticle.title}
                  </h2>
                </Link>
                
                <p className="text-lg text-slate-300 mb-6 leading-relaxed">
                  {featuredArticle.excerpt}
                </p>
                
                <div className="flex flex-wrap items-center gap-4 text-slate-400 text-sm mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(featuredArticle.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{featuredArticle.readTime}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {featuredArticle.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-amber-500/10 border border-amber-400/30 rounded-full px-3 py-1 text-xs text-amber-300 font-semibold"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                <Link
                  href={`/articles/${featuredArticle.slug}`}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-amber-500/30"
                >
                  Read Full Article
                  <ArrowRight className="w-4 h-4" />
                </Link>
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
                key={article.slug}
                href={`/articles/${article.slug}`}
                className="group bg-gradient-to-br from-slate-900/80 to-slate-800/60 border border-slate-700/50 hover:border-blue-500/50 rounded-2xl p-6 transition-all hover:shadow-lg hover:shadow-blue-500/20"
              >
                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors mb-3 line-clamp-2">
                  {article.title}
                </h3>
                
                <p className="text-slate-300 text-sm mb-4 line-clamp-3">
                  {article.excerpt}
                </p>
                
                <div className="flex items-center gap-4 text-slate-400 text-xs mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{article.readTime}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1.5">
                  {article.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 bg-slate-800/50 border border-slate-700 rounded-full px-2 py-0.5 text-[10px] text-slate-400"
                    >
                      <Tag className="w-2.5 h-2.5" />
                      {tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
