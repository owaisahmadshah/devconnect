import { useInfiniteFetchPosts } from '../-hooks/useInfiniteFetchFeed';
import { Post } from '@/components/organisms/Post';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { PostSkeleton } from '@/components/PostSkeleton';
import { useReaction } from '../-hooks/useReaction';
import { CreatePostTrigger } from './organisms/CreatePostTrigger';

export const Posts = () => {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isLoading } =
    useInfiniteFetchPosts();

  const { mutateAsync: onReaction } = useReaction();

  const posts = data?.pages.flatMap(page => page.posts) ?? [];

  if (isLoading) {
    return (
      <div className="mt-2 space-y-3">
        <div>
          <Skeleton className="mx-auto h-10 w-3xl max-sm:w-full" />
        </div>
        <PostSkeleton />
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center space-y-2 py-4">
      <CreatePostTrigger />
      {posts.map(post => (
        <Post key={post._id} post={post} onReaction={onReaction} />
      ))}
      {hasNextPage && (
        <div className="px-4 py-2">
          <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage} variant="link">
            {isFetchingNextPage ? 'Loading more posts...' : 'Load more posts'}
          </Button>
        </div>
      )}
    </div>
  );
};
