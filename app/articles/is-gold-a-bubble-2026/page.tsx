import Link from 'next/link';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: "Is Gold a Bubble? Why This 5,000-Year-Old Asset Won't Die | TamtechAI Finance",
  description: "Gold just hit all-time highs. Critics call it a relic. Bugs call it the ultimate insurance. Who's right?",
};

export default function GoldArticle() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0b1121] via-[#070b14] to-[#0b1121]">
      <div className="max-w-4xl mx-auto px-4 pt-6">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-blue-400 transition">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
      
      <article className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-5xl font-black text-white mb-4 leading-tight">
          Is Gold a Bubble? Why This 5,000-Year-Old Asset Won't Die
        </h1>
        
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 mb-8">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            February 3, 2026
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            7 min read
          </span>
          <span>TamtechAI Research</span>
        </div>

        <div className="prose prose-invert prose-lg max-w-none text-slate-300">
          <p className="text-xl mb-6">
            <strong>Gold is having a moment.</strong> Again.
          </p>

          <p>
            After hitting <strong>all-time highs</strong> in 2026, the "barbarous relic" is outperforming stocks, bonds, 
            and even some cryptocurrencies. Central banks are buying it. Hedge funds are hoarding it. And retail investors are piling in.
          </p>

          <p>But is this rally sustainable—or are we in a classic bubble?</p>

          <h2 className="text-3xl font-bold text-white mt-12 mb-4">🏆 The Bull Case: "The Ultimate Insurance"</h2>

          <h3 className="text-2xl font-bold text-slate-200 mt-8 mb-3">1. Central Banks Are Stockpiling</h3>
          <p>
            China, Russia, and India have been <strong>buying gold at record levels</strong> to reduce reliance on the U.S. dollar.
          </p>

          <h3 className="text-2xl font-bold text-slate-200 mt-8 mb-3">2. Inflation Hedge That Actually Works</h3>
          <p>
            Unlike bonds (which get crushed by inflation), gold has <strong>maintained purchasing power for 5,000 years</strong>.
          </p>

          <p className="bg-slate-800/50 border-l-4 border-yellow-500 p-4 rounded-r italic">
            <strong>Historical fact:</strong> An ounce of gold could buy a fine suit in Ancient Rome. It still can today.
          </p>

          <h2 className="text-3xl font-bold text-white mt-12 mb-4">🚨 The Bear Case: "A Shiny Rock With No Yield"</h2>

          <h3 className="text-2xl font-bold text-slate-200 mt-8 mb-3">1. It Produces Nothing</h3>
          <p>
            Warren Buffett's famous critique: <em>"Gold gets dug out of the ground... then we melt it down, dig another hole, 
            bury it again, and pay people to stand around guarding it."</em>
          </p>

          <h3 className="text-2xl font-bold text-slate-200 mt-8 mb-3">2. Opportunity Cost vs. Stocks</h3>
          <p>Over the last 100 years:</p>
          <ul className="space-y-2">
            <li><strong>S&P 500:</strong> ~10% annual return</li>
            <li><strong>Gold:</strong> ~2% annual return (after inflation)</li>
          </ul>

          <h2 className="text-3xl font-bold text-white mt-12 mb-4">🔥 The Verdict</h2>

          <p className="text-xl font-bold text-yellow-400">
            Gold is not a bubble. It's a hedge.
          </p>

          <p>If you think governments will keep printing money → <strong>Buy gold</strong></p>
          <p>If you think the dollar will collapse → <strong>Buy gold</strong></p>
          <p>If you think stocks will keep going up → <strong>Skip gold</strong></p>
        </div>

        <div className="mt-12 p-6 bg-gradient-to-br from-slate-900/80 to-slate-800/60 border border-slate-700/50 rounded-2xl">
          <h3 className="text-xl font-bold text-white mb-4">Analyze Gold Stocks</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {['GLD', 'GOLD', 'NEM', 'AEM'].map((ticker) => (
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
    </div>
  );
}
