import { Post } from '@/components/organisms/Post';
import { Button } from '@/components/ui/button';
import { PostSkeleton } from '@/components/PostSkeleton';
import { useInfiniteFetchUserPosts } from '@/hooks/useInfiniteFetchUserPosts';
import { useDeletePost } from '@/hooks/useDeletePost';
import { useReaction } from '@/routes/post/-hooks/useReaction';

export const UserPosts = ({
  profileUrl,
  isCurrentUser,
}: {
  profileUrl: string;
  isCurrentUser: boolean;
}) => {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isLoading } =
    useInfiniteFetchUserPosts(profileUrl);

  const { mutateAsync: deletePost } = useDeletePost();

  const { mutateAsync: onReact } = useReaction();

  const posts = data?.pages.flatMap(page => page.posts) ?? [];

  if (isLoading) {
    return <PostSkeleton />;
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center space-y-2 py-4">
      {posts.map(post => (
        <Post
          key={post._id}
          post={post}
          isEditable={isCurrentUser}
          onDelete={deletePost}
          onReaction={onReact}
          currentUserProfileUrl={profileUrl}
        />
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
