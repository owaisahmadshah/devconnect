import React from 'react';
import { useDropzone } from 'react-dropzone';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import { Trash2, Plus, ImagePlus, X } from 'lucide-react';
import 'yet-another-react-lightbox/styles.css';
import { cn } from '@/lib/utils';

interface ImageUploadSectionProps {
  preview: string[] | null;
  onDrop: (files: File[]) => void;
  open: boolean;
  currentIndex: number;
  onDelete: () => void;
  onOpenLightbox: (index: number) => void;
  onCloseLightbox: () => void;
  setCurrentIndex: (index: number) => void;
}

export const ImageUploadSection: React.FC<ImageUploadSectionProps> = ({
  preview,
  onDrop,
  open,
  currentIndex,
  onDelete,
  onOpenLightbox,
  onCloseLightbox,
  setCurrentIndex,
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    onDrop,
    multiple: true,
  });

  const hasImages = preview && preview.length > 0;

  return (
    <div className="w-full">
      {hasImages ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
          {preview.map((src, i) => (
            <div
              key={i}
              className="group border-border/50 bg-muted relative aspect-square overflow-hidden rounded-xl border"
            >
              <img
                src={src}
                onClick={() => onOpenLightbox(i)}
                className="h-full w-full cursor-zoom-in object-cover transition-transform duration-500 group-hover:scale-110"
                alt={`Preview ${i + 1}`}
              />

              {/* Individual Delete Button on Hover */}
              <button
                type="button"
                onClick={e => {
                  e.stopPropagation();
                  setCurrentIndex(i);
                  onDelete();
                }}
                className="absolute top-1.5 right-1.5 flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white opacity-0 backdrop-blur-md transition-opacity group-hover:opacity-100 hover:bg-red-500"
              >
                <X size={14} />
              </button>

              {/* Overlay for "More" images */}
              {i === 3 && preview.length > 4 && (
                <div
                  onClick={() => onOpenLightbox(i)}
                  className="absolute inset-0 flex cursor-pointer items-center justify-center bg-black/40 text-white backdrop-blur-[2px]"
                >
                  <span className="text-lg font-bold">+{preview.length - 4}</span>
                </div>
              )}
            </div>
          ))}

          {/* The Small "+" Tile (Compact Dropzone) */}
          {preview.length < 10 && (
            <div
              {...getRootProps()}
              className={cn(
                'border-border/60 hover:border-primary/50 hover:bg-primary/5 flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all',
                isDragActive && 'border-primary bg-primary/10',
              )}
            >
              <input {...getInputProps()} />
              <div className="text-muted-foreground flex flex-col items-center gap-1">
                <Plus size={24} className="text-primary" />
                <span className="text-[10px] font-extrabold tracking-widest uppercase">Add</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* The "Big" Dropzone - only shows when empty */
        <div
          {...getRootProps()}
          className={cn(
            'group border-border/60 bg-muted/20 hover:border-primary/40 hover:bg-muted/40 flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all',
            isDragActive && 'border-primary bg-primary/5',
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-3">
            <div className="bg-background ring-border flex h-12 w-12 items-center justify-center rounded-full shadow-sm ring-1 transition-transform group-hover:scale-110">
              <ImagePlus className="text-primary h-6 w-6" />
            </div>
            <div className="text-center">
              <p className="text-foreground text-sm font-bold">Add photos or videos</p>
              <p className="text-muted-foreground mt-0.5 text-xs">or drag and drop</p>
            </div>
          </div>
        </div>
      )}

      {open && (
        <Lightbox
          open={open}
          close={onCloseLightbox}
          index={currentIndex}
          plugins={[Zoom, Fullscreen]}
          slides={preview?.map(src => ({ src })) || []}
          on={{ view: ({ index }) => setCurrentIndex(index) }}
          toolbar={{
            buttons: [
              <button
                onClick={onDelete}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-red-500"
              >
                <Trash2 size={20} />
              </button>,

              <button
                key="close"
                onClick={onCloseLightbox}
                type="button"
                className="hover:text-muted-foreground cursor-pointer rounded px-3 py-1 text-2xl"
              >
                ✖
              </button>,
            ],
          }}
          styles={{
            root: { '--yarl__color_backdrop': 'rgba(0, 0, 0, 0.95)' },
          }}
        />
      )}
    </div>
  );
};
