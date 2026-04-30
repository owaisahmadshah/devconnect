import { useState, useRef, useEffect } from 'react';
import { Heart, ThumbsUp, ThumbsDown } from 'lucide-react';
import { type TCreateLike, type TlikeEnum } from 'shared';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ReactionButtonProps {
  postId: string;
  onAction: ({ postId, value }: TCreateLike & { profileUrl?: string }) => void;
  likeType?: TlikeEnum;
  currentUserProfileUrl?: string;
  postOwnerId: string;
}

const reactions = [
  {
    type: 'like' as TlikeEnum,
    icon: ThumbsUp,
    color: 'text-primary',
    hoverColor: 'hover:bg-primary/10',
    label: 'Like',
  },
  {
    type: 'dislike' as TlikeEnum,
    icon: ThumbsDown,
    color: 'text-orange-500',
    hoverColor: 'hover:bg-orange-500/10',
    label: 'Dislike',
  },
  {
    type: 'love' as TlikeEnum,
    icon: Heart,
    color: 'text-red-500',
    hoverColor: 'hover:bg-red-500/10',
    label: 'Love',
  },
];

export function ReactionButton({
  postId,
  onAction,
  likeType,
  currentUserProfileUrl,
  postOwnerId,
}: ReactionButtonProps) {
  const [showReactions, setShowReactions] = useState(false);
  const [hoveredReaction, setHoveredReaction] = useState<TlikeEnum | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  const currentReaction = reactions.find(r => r.type === likeType);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (!likeType) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => setShowReactions(true), 300);
    }
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setShowReactions(false);
      setHoveredReaction(null);
    }, 200);
  };

  const handleReactionClick = (val: TlikeEnum) => {
    onAction({ postId, value: val, profileUrl: currentUserProfileUrl, postOwnerId });
    setShowReactions(false);
  };

  return (
    <div
      className="relative flex flex-1"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {showReactions && !likeType && (
        <div className="border-border/50 bg-background/95 animate-in fade-in zoom-in-95 absolute bottom-full left-1/2 z-50 mb-3 flex -translate-x-1/2 items-center gap-1 rounded-full border p-1.5 shadow-xl backdrop-blur-md duration-200">
          {reactions.map((reaction, index) => {
            const Icon = reaction.icon;
            return (
              <button
                key={reaction.type}
                onClick={() => handleReactionClick(reaction.type)}
                onMouseEnter={() => setHoveredReaction(reaction.type)}
                onMouseLeave={() => setHoveredReaction(null)}
                className={cn(
                  'relative flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200',
                  reaction.hoverColor,
                )}
                style={{ animation: `popIn 0.3s ease-out ${index * 0.04}s backwards` }}
              >
                <Icon
                  className={cn(
                    'h-5 w-5 transition-transform',
                    reaction.color,
                    hoveredReaction === reaction.type && '-translate-y-0.5 scale-125',
                  )}
                />
                {hoveredReaction === reaction.type && (
                  <span className="bg-foreground text-background absolute -top-10 rounded px-2 py-1 text-[11px] font-medium">
                    {reaction.label}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      <Button
        variant="ghost"
        size="sm"
        onClick={() =>
          likeType &&
          onAction({ postId, value: 'delete', profileUrl: currentUserProfileUrl, postOwnerId })
        }
        className={cn(
          'hover:bg-muted/50 h-10 w-full gap-2 font-semibold transition-all',
          currentReaction ? currentReaction.color : 'text-muted-foreground',
        )}
      >
        {currentReaction ? (
          <currentReaction.icon className="h-[18px] w-[18px] fill-current" />
        ) : (
          <ThumbsUp className="h-[18px] w-[18px]" />
        )}
        <span className="hidden sm:inline">{currentReaction?.label || 'Like'}</span>
      </Button>

      <style>{`
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.5) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
