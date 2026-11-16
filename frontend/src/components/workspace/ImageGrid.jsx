import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import { ImageCard } from './ImageCard';
import { Image as ImageIcon, Trash } from 'lucide-react';

export const ImageGrid = ({
  items,
  onReorder,
  onRotate,
  onDelete,
  onClearAll,
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      onReorder(active.id, over.id);
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-slate-950/40 rounded-2xl border border-dashed border-slate-800 p-12 text-center flex flex-col items-center justify-center space-y-3">
        <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
          <ImageIcon className="w-6 h-6 stroke-[1.5]" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-slate-300">No slides loaded yet</h3>
          <p className="text-xs text-slate-500 max-w-sm">
            Paste an Instagram carousel link above or drag and drop images to arrange your document.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white">
            Workspace Pages ({items.length} {items.length === 1 ? 'slide' : 'slides'})
          </span>
          <span className="text-xs text-slate-500 hidden sm:inline">
            • Drag cards to adjust reading order
          </span>
        </div>
        <button
          type="button"
          onClick={onClearAll}
          className="text-xs text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1.5 px-2.5 py-1 rounded-md hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20"
        >
          <Trash className="w-3.5 h-3.5" />
          <span>Clear All</span>
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={items.map((it) => it.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
            {items.map((item, idx) => (
              <ImageCard
                key={item.id}
                item={item}
                index={idx}
                onRotate={onRotate}
                onDelete={onDelete}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};
