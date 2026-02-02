import Link from 'next/link';
import { Calendar, Clock, User } from 'lucide-react';
import Navbar from '@/src/components/Navbar';
import Footer from '@/src/components/Footer';

export const metadata = {
  title: "YOUR_ARTICLE_TITLE | TamtechAI Finance",
  description: "YOUR_ARTICLE_DESCRIPTION (shows in Google search results)",
  openGraph: {
    title: "YOUR_ARTICLE_TITLE",
    description: "YOUR_ARTICLE_DESCRIPTION",
    type: 'article',
    publishedTime: '2026-02-05T00:00:00.000Z', // CHANGE DATE
  },
};

export default function ArticleTemplate() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1121] via-[#070b14] to-[#0b1121]">
      <Navbar />
      
      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* Hero Image - Change emoji and colors */}
        <div className="relative w-full h-[400px] rounded-2xl overflow-hidden mb-8">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center p-8">
              <div className="text-8xl mb-4">🚀</div> {/* CHANGE EMOJI */}
              <p className="text-2xl font-bold text-white">Your Subtitle Here</p> {/* CHANGE SUBTITLE */}
            </div>
          </div>
        </div>

        {/* Optional: Article of the Day badge */}
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-full px-4 py-1.5 mb-6">
          <span className="text-yellow-400 text-sm font-bold">✨ Article of the Day - Feb 5</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
          YOUR ARTICLE TITLE GOES HERE
        </h1>
        
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 mb-8 pb-8 border-b border-slate-800">
          <span className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span className="font-medium">TamtechAI Research</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            February 5, 2026 {/* CHANGE DATE */}
          </span>
          <span>•</span>
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            7 min read {/* CHANGE READ TIME */}
          </span>
        </div>

        <div className="prose prose-invert max-w-none text-slate-300">
          {/* START WRITING HERE */}
          
          <p className="text-xl mb-6">
            <strong>Your opening hook goes here.</strong> Make it attention-grabbing!
          </p>

          <p>
            Your first paragraph explaining the topic...
          </p>

          <h2 className="text-3xl font-bold text-white mt-12 mb-4">🎯 Main Section Title</h2>

          <h3 className="text-2xl font-bold text-slate-200 mt-8 mb-3">1. First Point</h3>
          <p>
            Explain your first point here...
          </p>

          <p><strong>Why it matters:</strong></p>
          <ul className="space-y-2">
            <li>Bullet point 1</li>
            <li>Bullet point 2</li>
            <li>Bullet point 3</li>
          </ul>

          <h3 className="text-2xl font-bold text-slate-200 mt-8 mb-3">2. Second Point</h3>
          <p>
            Explain your second point here...
          </p>

          <blockquote className="border-l-4 border-blue-500 pl-6 my-6 italic text-xl">
            Add an important quote or key insight here
          </blockquote>

          <h2 className="text-3xl font-bold text-white mt-12 mb-4">🚨 Counterargument Section</h2>

          <p>
            Present the other side of the argument...
          </p>

          <h2 className="text-3xl font-bold text-white mt-12 mb-4">🔥 The Verdict</h2>

          <p className="text-xl font-bold text-blue-400">
            Your final take or conclusion
          </p>

          <p>
            Wrap up with actionable insights...
          </p>

          {/* END WRITING HERE */}
        </div>

        {/* Related Stocks Section */}
        <div className="mt-12 p-6 bg-gradient-to-br from-slate-900/80 to-slate-800/60 border border-slate-700/50 rounded-2xl">
          <h3 className="text-xl font-bold text-white mb-4">Analyze Related Stocks</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['AAPL', 'MSFT', 'GOOGL', 'NVDA'].map((ticker) => ( /* CHANGE TICKERS */
              <Link
                key={ticker}
                href={`/?ticker=${ticker}`}
                className="group bg-slate-800/50 border border-slate-700 hover:border-blue-500/50 rounded-xl p-4 text-center transition-all"
              >
                <p className="font-black text-blue-400 group-hover:text-blue-300 text-lg">{ticker}</p>
                <p className="text-xs text-slate-400">Analyze →</p>
              </Link>
            ))}
          </div>
        </div>
      </article>
      
      <Footer />
    </div>
  );
}
