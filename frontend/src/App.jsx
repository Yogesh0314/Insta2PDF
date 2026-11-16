import React, { useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { HeroSection } from './components/hero/HeroSection';
import { InstagramUrlInput } from './components/instagram/InstagramUrlInput';
import { DropZone } from './components/upload/DropZone';
import { ImageGrid } from './components/workspace/ImageGrid';
import { PdfSettingsSidebar } from './components/sidebar/PdfSettingsSidebar';
import confetti from 'canvas-confetti';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export default function App() {
  const [images, setImages] = useState([]);
  const [pdfSettings, setPdfSettings] = useState({
    filename: 'instanotes-carousel',
    orientation: 'PORTRAIT',
    fitMode: 'FIT_ASPECT',
    margin: 18,
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const handleFilesSelected = (newFiles) => {
    const formatted = newFiles.map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      rotation: 0,
      previewUrl: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...formatted]);
    showToast('success', `Added ${newFiles.length} ${newFiles.length === 1 ? 'slide' : 'slides'}`);
  };

  const handleInstagramSlidesFetched = (fetchedSlides, postData) => {
    setImages((prev) => [...prev, ...fetchedSlides]);
    if (postData?.shortcode) {
      setPdfSettings((prev) => ({
        ...prev,
        filename: `${postData.author || 'insta'}-${postData.shortcode}-notes`,
      }));
    }
  };

  const handleReorder = (activeId, overId) => {
    setImages((items) => {
      const oldIndex = items.findIndex((it) => it.id === activeId);
      const newIndex = items.findIndex((it) => it.id === overId);
      if (oldIndex === -1 || newIndex === -1) return items;

      const reordered = [...items];
      const [movedItem] = reordered.splice(oldIndex, 1);
      reordered.splice(newIndex, 0, movedItem);
      return reordered;
    });
  };

  const handleRotate = (id) => {
    setImages((items) =>
      items.map((item) =>
        item.id === id ? { ...item, rotation: (item.rotation + 90) % 360 } : item
      )
    );
  };

  const handleDelete = (id) => {
    setImages((items) => {
      const target = items.find((it) => it.id === id);
      if (target?.previewUrl) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return items.filter((it) => it.id !== id);
    });
  };

  const handleClearAll = () => {
    images.forEach((it) => {
      if (it.previewUrl) URL.revokeObjectURL(it.previewUrl);
    });
    setImages([]);
    showToast('info', 'Workspace cleared');
  };

  const handleSettingChange = (field, value) => {
    setPdfSettings((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGeneratePdf = async () => {
    if (images.length === 0) {
      showToast('error', 'Please upload or fetch at least one slide first.');
      return;
    }

    setIsGenerating(true);

    try {
      const formData = new FormData();

      images.forEach((img) => {
        formData.append('images', img.file);
      });

      const metadata = {
        filename: pdfSettings.filename.trim() || 'instanotes-document',
        orientation: pdfSettings.orientation,
        fitMode: pdfSettings.fitMode,
        margin: pdfSettings.margin,
        pageRotations: images.map((img) => img.rotation || 0),
      };

      formData.append(
        'config',
        new Blob([JSON.stringify(metadata)], { type: 'application/json' })
      );

      const endpoint = `${API_BASE_URL}/api/pdf/generate`;
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errMessage = `PDF generation failed on server (Status ${response.status}).`;
        try {
          const errData = await response.json();
          errMessage = errData.message || errMessage;
        } catch (_) {
          const rawText = await response.text();
          if (rawText) errMessage = rawText.slice(0, 150);
        }
        throw new Error(errMessage);
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      const downloadName = pdfSettings.filename.endsWith('.pdf')
        ? pdfSettings.filename
        : `${pdfSettings.filename || 'instanotes'}.pdf`;
      a.download = downloadName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.8 },
      });

      showToast('success', `PDF successfully generated and downloaded!`);
    } catch (err) {
      console.error(err);
      showToast('error', err.message || 'Error generating PDF. Is backend reachable?');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />

      <main className="flex-1 pb-16">
        <HeroSection />

        <div id="workspace" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 8 columns: Workflow inputs and Workspace */}
            <div className="lg:col-span-8 space-y-6">
              {/* Step 1: Automated Instagram URL Fetcher */}
              <InstagramUrlInput
                onSlidesFetched={handleInstagramSlidesFetched}
                onNotification={showToast}
              />

              {/* Step 2: Multi-file Upload Dropzone */}
              <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl p-6 space-y-3 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-semibold text-white">
                    Or Upload Image Slides Manually
                  </h3>
                  <span className="text-xs text-slate-400 font-medium">
                    JPEG, PNG, WebP supported
                  </span>
                </div>
                <DropZone onFilesSelected={handleFilesSelected} />
              </div>

              {/* Step 3: Visual Page Workspace */}
              <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl p-6 backdrop-blur-md">
                <ImageGrid
                  items={images}
                  onReorder={handleReorder}
                  onRotate={handleRotate}
                  onDelete={handleDelete}
                  onClearAll={handleClearAll}
                />
              </div>
            </div>

            {/* Right 4 columns: PDF Settings Sidebar */}
            <div className="lg:col-span-4">
              <PdfSettingsSidebar
                settings={pdfSettings}
                onChange={handleSettingChange}
                imageCount={images.length}
                onGenerate={handleGeneratePdf}
                isGenerating={isGenerating}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Floating feedback notification toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-3 duration-200">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl border text-xs font-semibold text-white backdrop-blur-md ${
              toast.type === 'error'
                ? 'bg-rose-900/90 border-rose-700 text-rose-100'
                : toast.type === 'info'
                ? 'bg-slate-900/95 border-slate-700 text-slate-200'
                : 'bg-emerald-900/90 border-emerald-700 text-emerald-100'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
