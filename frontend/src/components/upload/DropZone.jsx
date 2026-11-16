import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, AlertCircle, FileCheck2 } from 'lucide-react';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25MB

export const DropZone = ({ onFilesSelected }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);

  const processFiles = (fileList) => {
    setErrorMessage('');
    const files = Array.from(fileList);
    const validFiles = [];
    const rejectedFiles = [];

    files.forEach((file) => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        rejectedFiles.push(`${file.name} (unsupported format)`);
      } else if (file.size > MAX_FILE_SIZE_BYTES) {
        rejectedFiles.push(`${file.name} (exceeds 25MB limit)`);
      } else {
        validFiles.push(file);
      }
    });

    if (rejectedFiles.length > 0) {
      setErrorMessage(`Skipped invalid items: ${rejectedFiles.join(', ')}`);
    }

    if (validFiles.length > 0) {
      onFilesSelected(validFiles);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      e.target.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center transition-all duration-200 group ${
          isDragOver
            ? 'border-rose-500 bg-rose-500/10 scale-[1.005]'
            : 'border-slate-800 hover:border-rose-500/60 bg-slate-950/60 hover:bg-slate-950/80 shadow-inner'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileInputChange}
        />

        <div className="flex flex-col items-center justify-center space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 group-hover:bg-rose-500/20 flex items-center justify-center text-rose-400 transition-colors">
            <UploadCloud className="w-7 h-7 stroke-[1.75]" />
          </div>

          <div className="space-y-1">
            <p className="text-sm font-semibold text-slate-200">
              <span className="text-rose-400 group-hover:underline">Click to upload</span> or drag and drop image slides
            </p>
            <p className="text-xs text-slate-400">
              Supports JPEG, JPG, PNG, and WebP (up to 25MB each)
            </p>
          </div>

          <div className="pt-2 flex items-center gap-3 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5" /> High-DPI preservation
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" /> Multi-selection enabled
            </span>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2 text-xs font-medium text-amber-400 bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
