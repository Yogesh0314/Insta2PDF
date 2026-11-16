import React from 'react';
import { Sparkles, Layers, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden pt-12 pb-10 sm:pt-16 sm:pb-14 border-b border-slate-800/60 bg-gradient-to-b from-slate-950 via-slate-900/40 to-slate-950">
      {/* Decorative ambient glowing backdrops */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-52 bg-gradient-to-r from-rose-500/15 via-purple-500/15 to-amber-500/15 blur-3xl -z-10 rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
          <span>Automated Study & Technical Carousel Exporter</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
          Turn Instagram Notes into{' '}
          <span className="bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">
            Crisp, Printable PDFs
          </span>
        </h1>

        <p className="mt-5 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
          Automate educational slide extraction, organize pages with intuitive drag-and-drop,
          rotate orientations, and generate print-ready A4 documents in seconds.
        </p>

        {/* Value pills */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs sm:text-sm font-medium text-slate-300">
          <div className="flex items-center gap-2 bg-slate-900/80 px-3.5 py-1.5 rounded-full border border-slate-800 shadow-sm backdrop-blur-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Apache PDFBox 3.x Engine</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-900/80 px-3.5 py-1.5 rounded-full border border-slate-800 shadow-sm backdrop-blur-xs">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>Interactive Drag & Drop Ordering</span>
          </div>
          <div className="flex items-center gap-2 bg-slate-900/80 px-3.5 py-1.5 rounded-full border border-slate-800 shadow-sm backdrop-blur-xs">
            <ShieldCheck className="w-4 h-4 text-rose-400" />
            <span>Live RapidAPI Slide Ingestion</span>
          </div>
        </div>
      </div>
    </section>
  );
};
