import { Link } from '@tanstack/react-router';
import { useInfiniteFetchPosts } from '../hooks/useInfiniteFetchFeed';
import { Post } from './organisms/Post';
import { Button } from '@/components/ui/button';
import { FaPlus } from 'react-icons/fa';
import { Skeleton } from '@/components/ui/skeleton';
import { PostSkeleton } from '@/components/PostSkeleton';

export const Posts = () => {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isLoading } =
    useInfiniteFetchPosts();

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
      {/* If user is signed in then he can create a post */}
      <Link to={'/post/new'} className="w-full">
        <Button variant="outline" className="w-full">
          <FaPlus className="h-4 w-4" />
          <span className="text-sm font-medium max-sm:hidden">Create Post</span>
        </Button>
      </Link>
      {posts.map(post => (
        <Post key={post._id} post={post} />
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
