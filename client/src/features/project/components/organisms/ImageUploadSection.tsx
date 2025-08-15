import React from 'react';
import { useDropzone } from 'react-dropzone';
import Lightbox from 'yet-another-react-lightbox';
import Zoom from 'yet-another-react-lightbox/plugins/zoom';
import Fullscreen from 'yet-another-react-lightbox/plugins/fullscreen';
import { MdDelete } from 'react-icons/md';
import 'yet-another-react-lightbox/styles.css';

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

  return (
    <>
      <div className="w-full">
        <div className="mx-auto w-[80%] space-y-4">
          {preview && preview.length > 0 && (
            <div className="rounded-sm border p-4">
              <div className="grid grid-cols-2 gap-4 max-sm:grid-cols-1">
                {preview.slice(0, 4).map((src, i) => (
                  <div key={i} className="relative overflow-hidden rounded-lg">
                    <img
                      src={src}
                      onClick={() => onOpenLightbox(i)}
                      className="h-40 w-full cursor-pointer object-cover transition-transform hover:scale-105"
                      alt={`Preview ${i + 1}`}
                    />
                    {i === 3 && preview.length > 4 && (
                      <div className="bg-opacity-50 absolute inset-0 flex items-center justify-center bg-black text-white">
                        <span className="text-lg font-semibold">+{preview.length - 4} more</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div
            {...getRootProps()}
            className={`mx-auto flex h-40 w-full max-w-md cursor-pointer items-center justify-center rounded-xl border-2 border-dashed text-gray-400 transition ${
              isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the image here...</p>
            ) : (
              <p>Click or drag image here to upload</p>
            )}
          </div>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50">
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
                  key="delete"
                  onClick={onDelete}
                  type="button"
                  className="hover:text-muted-foreground cursor-pointer rounded px-3 py-1 text-2xl"
                >
                  <MdDelete />
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
          />
        </div>
      )}
    </>
  );
};
