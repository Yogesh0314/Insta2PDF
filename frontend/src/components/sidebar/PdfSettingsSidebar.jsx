import React from 'react';
import {
  Sliders,
  FileDown,
} from 'lucide-react';

export const PdfSettingsSidebar = ({
  settings,
  onChange,
  imageCount,
  onGenerate,
  isGenerating,
}) => {
  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl p-6 space-y-6 sticky top-20 backdrop-blur-md">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">PDF Configuration</h3>
            <p className="text-[11px] text-slate-400">A4 Document Layout</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Document Filename */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
            <span>Output Filename</span>
            <span className="text-[10px] text-slate-500 font-mono">.pdf</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={settings.filename}
              onChange={(e) => onChange('filename', e.target.value)}
              placeholder="instanotes-document"
              className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-800 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 outline-none text-slate-100 bg-slate-950/80"
            />
          </div>
        </div>

        {/* Page Orientation */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Page Orientation (A4)</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onChange('orientation', 'PORTRAIT')}
              className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all flex items-center justify-center gap-2 ${
                settings.orientation === 'PORTRAIT'
                  ? 'bg-rose-500/15 border-rose-500 text-rose-300 font-semibold shadow-xs ring-1 ring-rose-500/30'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-950'
              }`}
            >
              <div className="w-3 h-4 border border-current rounded-2xs" />
              <span>Portrait</span>
            </button>
            <button
              type="button"
              onClick={() => onChange('orientation', 'LANDSCAPE')}
              className={`py-2 px-3 rounded-xl text-xs font-medium border text-center transition-all flex items-center justify-center gap-2 ${
                settings.orientation === 'LANDSCAPE'
                  ? 'bg-rose-500/15 border-rose-500 text-rose-300 font-semibold shadow-xs ring-1 ring-rose-500/30'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-950'
              }`}
            >
              <div className="w-4 h-3 border border-current rounded-2xs" />
              <span>Landscape</span>
            </button>
          </div>
        </div>

        {/* Image Fitting Option */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">Fitting & Aspect Ratio</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onChange('fitMode', 'FIT_ASPECT')}
              className={`py-2 px-2.5 rounded-xl text-[11px] font-medium border text-center transition-all ${
                settings.fitMode === 'FIT_ASPECT'
                  ? 'bg-rose-500/15 border-rose-500 text-rose-300 font-semibold shadow-xs ring-1 ring-rose-500/30'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-950'
              }`}
              title="Scale to fit within margins preserving original proportions"
            >
              Fit Proportional
            </button>
            <button
              type="button"
              onClick={() => onChange('fitMode', 'FILL_PAGE')}
              className={`py-2 px-2.5 rounded-xl text-[11px] font-medium border text-center transition-all ${
                settings.fitMode === 'FILL_PAGE'
                  ? 'bg-rose-500/15 border-rose-500 text-rose-300 font-semibold shadow-xs ring-1 ring-rose-500/30'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-950'
              }`}
              title="Expand to fill printable area"
            >
              Fill Available
            </button>
          </div>
        </div>

        {/* Page Margins */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">Margins</span>
            <span className="font-mono text-rose-400">{settings.margin} pt</span>
          </div>
          <input
            type="range"
            min="0"
            max="72"
            step="6"
            value={settings.margin}
            onChange={(e) => onChange('margin', Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-rose-500"
          />
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>Border (0)</span>
            <span>Standard (18pt)</span>
            <span>Spacious (72pt)</span>
          </div>
        </div>

        {/* Summary Info */}
        <div className="bg-slate-950/60 rounded-xl p-3 text-xs space-y-1.5 border border-slate-800/80">
          <div className="flex items-center justify-between text-slate-400">
            <span>Selected Pages:</span>
            <span className="font-semibold text-white">{imageCount}</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>Page Standard:</span>
            <span className="font-medium text-slate-200">ISO A4 (595 × 842 pt)</span>
          </div>
          <div className="flex items-center justify-between text-slate-400">
            <span>Layout:</span>
            <span className="font-medium text-slate-200">1 Slide / Page</span>
          </div>
        </div>
      </div>

      {/* Generate Action Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onGenerate}
          disabled={imageCount === 0 || isGenerating}
          className="w-full py-3.5 px-4 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-rose-500 via-pink-600 to-amber-500 hover:from-rose-600 hover:via-pink-700 hover:to-amber-600 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-rose-500/20 transition-all flex items-center justify-center gap-2 active:scale-98"
        >
          {isGenerating ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Generating Document...</span>
            </>
          ) : (
            <>
              <FileDown className="w-4 h-4" />
              <span>Generate PDF ({imageCount})</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
