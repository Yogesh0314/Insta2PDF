import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { RotateCw, Trash2, GripVertical } from 'lucide-react';

export const ImageCard = ({
  item,
  index,
  onRotate,
  onDelete,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative bg-slate-900 rounded-xl border ${
        isDragging
          ? 'border-rose-500 shadow-2xl opacity-90 scale-105 ring-2 ring-rose-500/50'
          : 'border-slate-800 hover:border-slate-700 shadow-md hover:shadow-xl'
      } overflow-hidden transition-all flex flex-col`}
    >
      {/* Card Header with drag handle and page badge */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-950/80 border-b border-slate-800/80">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 -ml-1 text-slate-500 hover:text-slate-300 rounded transition-colors"
          title="Drag to reorder page"
        >
          <GripVertical className="w-4 h-4" />
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-bold tracking-wider uppercase text-slate-300 bg-slate-800/90 px-2 py-0.5 rounded-md border border-slate-700/60 shadow-xs">
            Page {index + 1}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRotate(item.id);
            }}
            className="p-1 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded transition-colors"
            title="Rotate 90° Clockwise"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id);
            }}
            className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
            title="Remove page"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Image Preview Container */}
      <div className="relative aspect-4/5 w-full bg-slate-950/60 flex items-center justify-center overflow-hidden p-2">
        <img
          src={item.previewUrl}
          alt={item.name}
          style={{ transform: `rotate(${item.rotation || 0}deg)` }}
          className="max-h-full max-w-full object-contain rounded-lg transition-transform duration-200 pointer-events-none select-none shadow-sm"
        />

        {item.rotation !== 0 && (
          <span className="absolute bottom-2 left-2 text-[10px] bg-black/80 text-rose-300 font-mono px-1.5 py-0.5 rounded border border-rose-500/30 backdrop-blur-xs">
            {item.rotation}°
          </span>
        )}
      </div>

      {/* Card Footer Info */}
      <div className="p-2.5 bg-slate-900/90 text-xs space-y-0.5 border-t border-slate-800">
        <p className="font-medium text-slate-200 truncate" title={item.name}>
          {item.name}
        </p>
        <p className="text-[10px] text-slate-500 font-mono">
          {(item.size / (1024 * 1024)).toFixed(2)} MB • {item.type.replace('image/', '').toUpperCase()}
        </p>
      </div>
    </div>
  );
};
