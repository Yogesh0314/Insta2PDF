import React, { useState } from 'react';
import { Camera, AlertCircle, Check, Sparkles, Layers } from 'lucide-react';

export const InstagramUrlInput = ({ onSlidesFetched, onNotification }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [fetchedPost, setFetchedPost] = useState(null);

  const instagramRegex = /^(https?:\/\/)?(www\.)?instagram\.com\/(p|reel|tv)\/([a-zA-Z0-9_-]+)/i;

  const handleFetch = async (e) => {
    e.preventDefault();
    setError('');
    setFetchedPost(null);

    const trimmed = url.trim();
    if (!trimmed) {
      setError('Please enter a valid Instagram post or carousel URL');
      return;
    }

    if (!instagramRegex.test(trimmed)) {
      setError('Invalid link format. Must look like https://www.instagram.com/p/DbVIomslDzs/');
      return;
    }

    setIsFetching(true);

    try {
      const response = await fetch('/api/instagram/fetch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: trimmed }),
      });

      const data = await response.json();

      if (!data.success || !data.slides || data.slides.length === 0) {
        throw new Error(data.message || 'Could not find carousel slides for this post.');
      }

      setFetchedPost(data);

      const loadedImages = await Promise.all(
        data.slides.map(async (slide, idx) => {
          const proxyUrl = `/api/instagram/proxy-image?url=${encodeURIComponent(slide.imageUrl)}`;
          const imgRes = await fetch(proxyUrl);
          const blob = await imgRes.blob();
          const file = new File([blob], `${data.shortcode}-slide-${idx + 1}.jpg`, {
            type: 'image/jpeg',
          });

          return {
            id: `insta-${data.shortcode}-${idx}-${Date.now()}`,
            file,
            name: `${data.shortcode}_slide_${idx + 1}.jpg`,
            size: blob.size,
            type: 'image/jpeg',
            rotation: 0,
            previewUrl: URL.createObjectURL(blob),
          };
        })
      );

      if (onSlidesFetched) {
        onSlidesFetched(loadedImages, data);
      }

      if (onNotification) {
        onNotification('success', `Imported ${loadedImages.length} slides from @${data.author}!`);
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to fetch Instagram slides.');
      if (onNotification) {
        onNotification('error', err.message || 'Fetch failed.');
      }
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl p-6 sm:p-7 backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-rose-500/20">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-semibold text-white">Instagram URL Auto-Import</h2>
            <p className="text-xs text-slate-400">Paste any public carousel post to retrieve every high-res slide</p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20 self-start sm:self-auto">
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>RapidAPI Ingestion Active</span>
        </div>
      </div>

      <form onSubmit={handleFetch} className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2.5">
          <div className="relative flex-1">
            <input
              type="text"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. https://www.instagram.com/p/DbVIomslDzs/"
              className={`w-full text-sm px-4 py-3 rounded-xl border ${
                error ? 'border-rose-500/80 focus:ring-rose-500/20' : 'border-slate-800 focus:border-rose-500 focus:ring-rose-500/20'
              } outline-none focus:ring-4 transition-all bg-slate-950/80 hover:bg-slate-950 text-slate-100 placeholder:text-slate-500`}
            />
          </div>
          <button
            type="submit"
            disabled={isFetching}
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-rose-500/25 active:scale-95 whitespace-nowrap"
          >
            {isFetching ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Extracting Slides...</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>Fetch Slides</span>
              </span>
            )}
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-2 text-xs font-medium text-rose-400 bg-rose-500/10 px-3.5 py-2.5 rounded-xl border border-rose-500/20">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {fetchedPost && (
          <div className="text-xs bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3.5 space-y-1 animate-in fade-in duration-200">
            <div className="flex items-center gap-2 font-semibold text-emerald-300">
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Extracted {fetchedPost.slides?.length} slides from @{fetchedPost.author}</span>
            </div>
            <p className="text-slate-400 pl-6 line-clamp-2">{fetchedPost.title}</p>
          </div>
        )}
      </form>
    </div>
  );
};
