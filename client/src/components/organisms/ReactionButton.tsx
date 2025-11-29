import { useState, useRef, useEffect } from 'react';
import { FaHeart, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

import { type TCreateLike, type TlikeEnum } from 'shared';
import { Button } from '@/components/ui/button';

interface ReactionButtonProps {
  postId: string;
  onAction: ({ postId, value }: TCreateLike) => void;
  likeType?: TlikeEnum;
}

const reactions = [
  {
    type: 'like' as TlikeEnum,
    icon: FaThumbsUp,
    color: 'text-blue-500',
    hoverColor: 'hover:bg-blue-50 dark:hover:bg-blue-950/30',
    label: 'Like',
  },
  {
    type: 'dislike' as TlikeEnum,
    icon: FaThumbsDown,
    color: 'text-orange-500',
    hoverColor: 'hover:bg-orange-50 dark:hover:bg-orange-950/30',
    label: 'Dislike',
  },
  {
    type: 'love' as TlikeEnum,
    icon: FaHeart,
    color: 'text-red-500',
    hoverColor: 'hover:bg-red-50 dark:hover:bg-red-950/30',
    label: 'Love',
  },
];

export function ReactionButton({ postId, onAction, likeType }: ReactionButtonProps) {
  const [showReactions, setShowReactions] = useState(false);
  const [hoveredReaction, setHoveredReaction] = useState<TlikeEnum | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentReaction = reactions.find(r => r.type === likeType);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    if (!likeType) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setShowReactions(true);
      }, 300);
    }
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setShowReactions(false);
      setHoveredReaction(null);
    }, 200);
  };

  const handleReactionClick = (TlikeEnum: TlikeEnum) => {
    onAction({ postId, value: TlikeEnum });
    setShowReactions(false);
    setHoveredReaction(null);
  };

  const handleButtonClick = () => {
    if (likeType) {
      onAction({ postId, value: 'delete' });
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative inline-block w-1/3"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Reactions Popup */}
      {showReactions && !likeType && (
        <div
          className="bg-background border-border animate-in fade-in zoom-in-95 absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded-full border px-2 py-2 shadow-lg backdrop-blur-sm duration-200"
          style={{
            animation: 'slideUp 0.2s ease-out',
          }}
        >
          <div className="flex items-center gap-1">
            {reactions.map((reaction, index) => {
              const Icon = reaction.icon;
              const isHovered = hoveredReaction === reaction.type;

              return (
                <button
                  key={reaction.type}
                  onClick={() => handleReactionClick(reaction.type)}
                  onMouseEnter={() => setHoveredReaction(reaction.type)}
                  onMouseLeave={() => setHoveredReaction(null)}
                  className={`relative cursor-pointer rounded-full p-2 transition-all duration-200 ${reaction.hoverColor} group`}
                  style={{
                    animation: `popIn 0.3s ease-out ${index * 0.05}s backwards`,
                  }}
                >
                  <Icon
                    className={`h-6 w-6 ${reaction.color} transition-all duration-200 ${
                      isHovered ? '-translate-y-1 scale-125' : 'scale-100'
                    }`}
                  />

                  {/* Tooltip */}
                  {isHovered && (
                    <span className="bg-popover text-popover-foreground animate-in fade-in zoom-in-95 absolute -top-8 left-1/2 -translate-x-1/2 rounded px-2 py-1 text-xs whitespace-nowrap shadow-md duration-150">
                      {reaction.label}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Arrow */}
          <div className="bg-background border-border absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 border-r border-b" />
        </div>
      )}

      {/* Main Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={handleButtonClick}
        className={`flex w-full flex-1 items-center justify-center gap-2 rounded-lg text-sm font-medium transition-all duration-200 ${
          currentReaction
            ? `${currentReaction.color} ${currentReaction.hoverColor}`
            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
        }`}
      >
        {currentReaction ? (
          <>
            <currentReaction.icon
              className={`h-[18px] w-[18px] ${currentReaction.color} transition-transform duration-200 ${
                likeType ? 'scale-110 animate-pulse' : ''
              }`}
              style={{
                animation: likeType ? 'heartBeat 0.5s ease-in-out' : 'none',
              }}
            />
            <span className="hidden sm:inline">{currentReaction.label}</span>
          </>
        ) : (
          <>
            <FaThumbsUp className="h-[18px] w-[18px] transition-transform duration-200" />
            <span className="hidden sm:inline">Like</span>
          </>
        )}
      </Button>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translate(-50%, 10px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }

        @keyframes popIn {
          from {
            opacity: 0;
            transform: scale(0) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes heartBeat {
          0%, 100% {
            transform: scale(1);
          }
          25% {
            transform: scale(1.2);
          }
          50% {
            transform: scale(1.1);
          }
          75% {
            transform: scale(1.15);
          }
        }
      `}</style>
    </div>
  );
}
