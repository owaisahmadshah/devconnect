import { Link, useParams } from '@tanstack/react-router';

import { useFetchPost } from '../-hooks/useFetchPost';
import { Post } from '@/components/organisms/Post';
import { useReaction } from '../-hooks/useReaction';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export const SharedPost = () => {
  const { postId } = useParams({ from: '/post/p/$postId' });
  const { data } = useFetchPost(postId);
  const { mutateAsync: onReaction } = useReaction();

  return (
    <div className="mx-auto flex max-w-3xl flex-col space-y-4 py-4">
      <div>
        <Button asChild variant="ghost" className="flex items-center gap-2">
          <Link to="/">
            <ArrowLeft size={16} />
            Back to Feed
          </Link>
        </Button>
      </div>

      <div className="flex flex-col items-center space-y-2">
        <Post post={data} onReaction={onReaction} />
      </div>
    </div>
  );
};
