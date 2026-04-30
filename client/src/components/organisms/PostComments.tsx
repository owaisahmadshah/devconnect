import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  createCommentSchema,
  type TCreateComment,
  type TCreateLike,
  type TPostResponse,
} from 'shared';
import { Post } from './Post';

import { SubmitButton } from '../atoms/SubmitButton';
import { Form, FormControl, FormField, FormItem } from '../ui/form';
import { Textarea } from '@/components/ui/textarea';
import { ProfileWithUrl } from './ProfileWithUrl';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useInfiniteFetchComments } from '@/routes/post/-hooks/useInfiniteFetchComment';
import { useCreateComment } from '@/routes/post/-hooks/useCreateComment';
import { useDeleteComment } from '@/routes/post/-hooks/useDeleteComment';
import { Button } from '../ui/button';
import { Comment } from './Comment';
import { MessageSquare } from 'lucide-react';

interface PostCommentsProps {
  post: TPostResponse;
  isEditable?: boolean;
  onDelete?: ({ _id }: { _id: string }) => void;
  onReaction: (data: TCreateLike & { profileUrl?: string }) => void;
  currentUserProfileUrl?: string;
}

export function PostComments({ post, onReaction }: PostCommentsProps) {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteFetchComments(
    post._id,
  );
  const createComment = useCreateComment();
  const deleteComment = useDeleteComment();

  const comments = data?.pages.flatMap(page => page.comments) ?? [];

  const form = useForm<TCreateComment>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: {
      body: '',
      commentBy: '',
      postId: post._id,
      postOwnerId: post.createdBy._id,
    },
  });

  const onSubmit = async (data: TCreateComment) => {
    await createComment.mutateAsync(data);
    if (createComment.isSuccess) {
      form.reset();
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:bg-muted/50 hover:text-foreground h-10 flex-1 gap-2 font-semibold"
        >
          <MessageSquare className="h-[18px] w-[18px]" />
          <span className="hidden sm:inline">
            Comment{' '}
            {post?.totalComments && post?.totalComments > 0 && (
              <span className="ml-1 opacity-60">({post.totalComments})</span>
            )}
          </span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[92vh] min-w-[85vw] p-0 max-sm:min-h-[70vh]">
        <DialogHeader>
          <DialogTitle className="sr-only">Post Comments</DialogTitle>
          <DialogDescription asChild>
            <div className="flex items-start gap-3">
              {/* Post Section */}
              <div className="w-[50%] max-sm:hidden">
                <Post post={post} showProfile={false} onReaction={onReaction} openImages={false} />
              </div>

              {/* Comment Section */}
              <div className="flex h-full flex-col justify-around p-3 max-sm:min-h-[70vh] max-sm:w-full sm:w-[50%]">
                <div className="h-full">
                  {/* Profile */}
                  <div className="flex flex-1 items-center gap-3 max-sm:hidden">
                    <ProfileWithUrl
                      user={post.createdBy}
                      profileSize="m"
                      reverse={true}
                      underlineOnHover={false}
                      postDate={post.createdAt}
                    />
                  </div>

                  {/* Comments */}
                  <ScrollArea className="mt-2 h-[85%] max-h-[60vh] rounded-sm border p-3 max-sm:mt-6">
                    {/* Comments Goes here */}
                    {comments.map(comment => (
                      <Comment
                        key={comment._id}
                        comment={comment}
                        onDelete={() => deleteComment.mutateAsync({ _id: comment._id })}
                        isAuthor={comment.commentBy._id === post.createdBy._id}
                      />
                    ))}

                    {hasNextPage && (
                      <div className="px-4 py-2">
                        <Button
                          onClick={() => fetchNextPage()}
                          disabled={isFetchingNextPage}
                          variant="link"
                        >
                          {isFetchingNextPage ? 'Loading more comments...' : 'Load more comments'}
                        </Button>
                      </div>
                    )}
                  </ScrollArea>
                </div>

                {/* Comment Input Form */}
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="mb-5 flex justify-center gap-3"
                  >
                    <div className="w-full">
                      <FormField
                        control={form.control}
                        name="body"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea
                                {...field}
                                placeholder="Write your comment..."
                                className="max-h-24 min-h-[40px] resize-none"
                                rows={1}
                              />
                            </FormControl>
                            {/* <FormMessage /> */}
                          </FormItem>
                        )}
                      />
                    </div>
                    <SubmitButton
                      isLoading={createComment.isPending}
                      disabled={createComment.isPending}
                      className="w-20 text-base font-semibold"
                    >
                      {createComment.isPending ? 'Commenting...' : 'Comment'}
                    </SubmitButton>
                  </form>
                </Form>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
