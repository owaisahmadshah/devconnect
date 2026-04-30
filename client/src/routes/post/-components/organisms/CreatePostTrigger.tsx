import { Link } from '@tanstack/react-router';
import { Image, FileText } from 'lucide-react';
import { ProfileImage } from '@/components/atoms/ProfileImage';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';

export const CreatePostTrigger = () => {
  const { user } = useSelector((state: RootState) => state.profileSummary);

  return (
    <div className="bg-card border-border/50 hover:border-border/80 mb-6 w-full rounded-2xl border p-4 shadow-sm transition-all duration-300">
      <div className="flex items-center gap-4">
        {/* Profile Avatar */}
        <ProfileImage
          src={user?.profilePictureUrl}
          fallback={user?.firstName?.[0] ?? ''}
          className="ring-border h-10 w-10 flex-shrink-0 ring-1 sm:h-11 sm:w-11"
        />

        {/* The "Mock" Input Trigger */}
        <Link
          to="/post/new"
          className="bg-muted/40 hover:bg-muted/70 border-border/40 text-muted-foreground flex h-11 flex-1 cursor-pointer items-center rounded-full border px-5 text-[15px] transition-all"
        >
          What's on your mind, {user?.firstName}?
        </Link>
      </div>

      {/* Action Footer */}
      <div className="border-border/30 mt-3 flex items-center gap-2 border-t pt-3">
        <Link
          to="/post/new"
          className="text-muted-foreground hover:bg-primary/5 hover:text-primary group flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-[13px] font-bold transition-all"
        >
          <Image className="h-4.5 w-4.5 text-blue-500 transition-transform group-hover:scale-110" />
          <span>Photo</span>
        </Link>

        {/* Vertical Divider */}
        <div className="bg-border/40 h-4 w-px" />

        <Link
          to="/post/new"
          className="text-muted-foreground hover:bg-primary/5 hover:text-primary group flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-[13px] font-bold transition-all"
        >
          <FileText className="h-4.5 w-4.5 text-emerald-500 transition-transform group-hover:scale-110" />
          <span>Article</span>
        </Link>
      </div>
    </div>
  );
};
