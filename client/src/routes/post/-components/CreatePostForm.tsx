import { Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from '@tanstack/react-router';
import { X, ChevronDown } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.bubble.css';

import { createPostFrontendSchema, type TCreatePostFrontend } from 'shared';
import { Form } from '@/components/ui/form';
import { ImageUploadSection } from '@/components/organisms/ImageUploadSection';
import { SubmitButton } from '@/components/atoms/SubmitButton';
import { useCreatePost } from '../-hooks/useCreatePost';
import { useImageUpload } from '@/hooks/useImageUpload';
import { Button } from '@/components/ui/button';
import { ProfileImage } from '@/components/atoms/ProfileImage';
import { useSelector } from 'react-redux';
import { cn } from '@/lib/utils';
import type { RootState } from '@/store/store';

export const CreatePostForm = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.profileSummary);

  const form = useForm<TCreatePostFrontend>({
    resolver: zodResolver(createPostFrontendSchema),
    defaultValues: { description: '', links: [], media: [] },
  });

  const { mutateAsync, isPending, isSuccess } = useCreatePost();
  const imageUpload = useImageUpload(form);
  const hasImages = imageUpload?.preview && imageUpload.preview.length > 0;

  const onSubmit = async (data: TCreatePostFrontend) => {
    const formData = new FormData();
    formData.append('description', data.description ?? '');
    if (data.media?.length) {
      data.media.forEach(mediaObj => formData.append('media', mediaObj.image));
    }
    await mutateAsync(formData);
  };

  if (isSuccess) navigate({ to: '/' });

  return (
    <div className="bg-background flex min-h-screen justify-center pt-4">
      <div className="w-full max-w-4xl px-6">
        <div className="border-border/10 mb-2 flex items-center justify-between border-b pb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate({ to: '/' })}
            className="text-muted-foreground hover:text-foreground rounded-full"
          >
            <X className="mr-1 h-5 w-5" />
            Cancel
          </Button>
          <Button variant="ghost" size="sm" className="text-primary rounded-full font-bold">
            Drafts
          </Button>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-6">
            <div className="flex gap-5">
              <ProfileImage
                src={user?.profilePictureUrl}
                fallback={user?.firstName?.[0] ?? ''}
                className="ring-border h-12 w-12 shadow-sm ring-1"
              />

              <div className="flex-1">
                {/* Audience Selector */}
                <button
                  type="button"
                  className="border-primary/30 text-primary hover:bg-primary/5 mb-3 flex items-center gap-1 rounded-full border px-3 py-0.5 text-[12px] font-bold transition-colors"
                >
                  Public <ChevronDown className="h-3 w-3" />
                </button>

                <div className="min-h-[150px]">
                  <Controller
                    name="description"
                    control={form.control}
                    render={({ field }) => (
                      <ReactQuill
                        theme="bubble"
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="What's your story?"
                        className="text-xl leading-relaxed"
                      />
                    )}
                  />
                </div>

                <div
                  className={cn(
                    'mt-4 transition-all duration-300',
                    hasImages ? 'opacity-100' : 'opacity-80 hover:opacity-100',
                  )}
                >
                  <ImageUploadSection
                    preview={imageUpload.preview}
                    onDrop={imageUpload.onDrop}
                    open={imageUpload.open}
                    currentIndex={imageUpload.currentIndex}
                    onDelete={imageUpload.handleDelete}
                    onOpenLightbox={imageUpload.openLightbox}
                    onCloseLightbox={() => imageUpload.setOpen(false)}
                    setCurrentIndex={imageUpload.setCurrentIndex}
                  />
                </div>

                <div className="border-border/40 bg-background/80 sticky bottom-4 mt-8 flex items-center justify-between border-t pt-4 backdrop-blur-md">
                  <SubmitButton
                    isLoading={isPending}
                    disabled={isPending || (!form.getValues('description') && !hasImages)}
                    className="shadow-primary/20 h-10 rounded-full px-8 text-[15px] font-black shadow-lg transition-all hover:scale-[1.02] active:scale-95"
                  >
                    Post
                  </SubmitButton>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>

      <style>{`
        .ql-editor { font-size: 1.25rem; min-height: 150px; padding: 0; }
        .ql-editor.ql-blank::before { left: 0; font-style: normal; opacity: 0.5; }
      `}</style>
    </div>
  );
};
