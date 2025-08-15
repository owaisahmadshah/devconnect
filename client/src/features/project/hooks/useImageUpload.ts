import { useCallback, useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';

export const useImageUpload = (form: UseFormReturn<any>) => {
  const [preview, setPreview] = useState<string[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [open, setOpen] = useState(false);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (!acceptedFiles.length) return;

      const currentMedia = form.getValues('media');
      const media = acceptedFiles.map(file => ({ image: file }));
      form.setValue('media', [...currentMedia, ...media]);

      const newPreviews = acceptedFiles.map(file => URL.createObjectURL(file));
      setPreview(prev => (prev ? [...prev, ...newPreviews] : newPreviews));
    },
    [form],
  );

  const handleDelete = useCallback(() => {
    setPreview(prev => (prev ? prev.filter((_, i) => i !== currentIndex) : prev));

    const media = form.getValues('media').filter((_: any, idx: number) => idx !== currentIndex);
    form.setValue('media', media);

    setOpen(preview && preview.length - 1 > currentIndex ? true : currentIndex > 0);
  }, [form, currentIndex, preview]);

  const openLightbox = useCallback((index: number) => {
    setCurrentIndex(index);
    setOpen(true);
  }, []);

  return {
    preview,
    currentIndex,
    open,
    onDrop,
    handleDelete,
    openLightbox,
    setOpen,
    setCurrentIndex,
  };
};
