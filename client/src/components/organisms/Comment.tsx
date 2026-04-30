import type { TCommentResponse } from 'shared';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Link } from '@tanstack/react-router';
import { MoreHorizontal } from 'lucide-react';

interface CommentProps {
  comment: TCommentResponse;
  onDelete?: () => void;
  isAuthor?: boolean;
}

export const Comment = ({ comment, onDelete, isAuthor = false }: CommentProps) => {
  return (
    <div className="group flex gap-3 py-2.5 transition-all">
      <Link
        to={'/profile/$identifier'}
        params={{ identifier: comment.commentBy.profileUrls[0].url }}
        className="mt-1 flex-shrink-0"
      >
        <Avatar className="ring-border/20 h-8 w-8 ring-1">
          <AvatarImage src={comment.commentBy.profilePictureUrl} />
          <AvatarFallback className="bg-muted text-[10px]">
            {comment.commentBy.firstName[0]}
            {comment.commentBy.lastName[0]}
          </AvatarFallback>
        </Avatar>
      </Link>
      <div className="flex-1 space-y-1">
        <div className="flex items-start justify-between gap-2">
          <div className="bg-muted/40 border-border/10 rounded-2xl border px-3 py-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex justify-between gap-2">
                <Link
                  to={'/profile/$identifier'}
                  params={{ identifier: comment.commentBy.profileUrls[0].url }}
                  className="text-foreground text-[13px] font-bold underline-offset-2 hover:underline"
                >
                  {`${comment.commentBy.firstName} ${comment.commentBy.lastName}`}
                </Link>
                {isAuthor && (
                  <span className="bg-primary/10 text-primary rounded-md px-1.5 py-0.5 text-[10px] font-bold tracking-tight uppercase">
                    Author
                  </span>
                )}
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex-shrink-0 transition-opacity hover:opacity-70 focus:outline-none">
                  <MoreHorizontal className="text-muted-foreground h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onDelete && (
                    <DropdownMenuItem onClick={onDelete} className="text-destructive">
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <p className="text-foreground/90 mt-1 text-[14px] leading-relaxed whitespace-pre-wrap">
              {comment.body}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
