"use client";
import { Calendar, TrendingUp } from "lucide-react";

interface ForecastsProps {
  forecasts: {
    next_1_year?: string;
    next_5_years?: string;
  };
  t: any;
}

export default function Forecasts({ forecasts, t }: ForecastsProps) {
  if (!forecasts) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 mb-8">
      <div className="bg-blue-500/[0.03] border border-blue-500/10 p-5 md:p-8 rounded-3xl group hover:bg-blue-500/[0.05] transition-all duration-500">
        <h4 className="text-blue-500 font-black mb-4 flex gap-3 items-center text-sm md:text-xl">
          <Calendar className="w-5 h-5 md:w-6 md:h-6"/> {t.oneYear}
        </h4>
        <p className="text-slate-300 text-xs md:text-base leading-relaxed font-medium">{forecasts.next_1_year}</p>
      </div>
      <div className="bg-purple-500/[0.03] border border-purple-500/10 p-5 md:p-8 rounded-3xl group hover:bg-purple-500/[0.05] transition-all duration-500">
        <h4 className="text-purple-500 font-black mb-4 flex gap-3 items-center text-sm md:text-xl">
          <TrendingUp className="w-5 h-5 md:w-6 md:h-6"/> {t.fiveYears}
        </h4>
        <p className="text-slate-300 text-xs md:text-base leading-relaxed font-medium">{forecasts.next_5_years}</p>
      </div>
    </div>
  );
}