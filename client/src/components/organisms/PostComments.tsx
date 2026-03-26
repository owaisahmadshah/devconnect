import { FaRegCommentDots } from 'react-icons/fa';
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
      <DialogTrigger className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-blue-500 dark:text-slate-400 dark:hover:bg-slate-800">
        <FaRegCommentDots className="h-[18px] w-[18px]" />
        <span className="hidden sm:inline">
          Comment{' '}
          {post?.totalComments && post.totalComments > 0 ? (
            <span className="text-xs">{`(${post.totalComments})`}</span>
          ) : (
            ''
          )}
        </span>
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
              <div className="flex h-full flex-col justify-between p-3 max-sm:min-h-[70vh] max-sm:w-full sm:w-[50%]">
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
                    className="flex justify-center gap-3 pb-3"
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
                                placeholder="Add a comment..."
                                className="max-h-24 min-h-[40px] resize-none"
                                rows={4}
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
                      customClasses="text-base font-semibold w-20"
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
