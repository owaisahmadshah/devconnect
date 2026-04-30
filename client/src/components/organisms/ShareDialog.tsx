import { Copy, Share2, Check } from 'lucide-react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
interface ShareDialogProps {
  postId: string;
  baseUrl?: string; // optional, fallback to window.location.origin
}

export default function ShareDialog({ postId, baseUrl }: ShareDialogProps) {
  const [copied, setCopied] = useState(false);
  const url = `${baseUrl || window.location.origin}/post/p/${postId}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:bg-muted/50 h-10 flex-1 gap-2 font-semibold transition-colors hover:text-green-600"
        >
          <Share2 className="h-[18px] w-[18px]" />
          <span className="hidden sm:inline">Share</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md gap-6 rounded-2xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Share this post</DialogTitle>
        </DialogHeader>
        <div className="bg-muted/50 border-border/50 focus-within:border-primary/30 flex items-center gap-2 rounded-xl border p-1.5 pl-3 transition-colors">
          <Input
            value={url}
            readOnly
            className="h-9 border-none bg-transparent p-0 text-sm font-medium shadow-none focus-visible:ring-0"
          />
          <Button
            onClick={handleCopy}
            size="sm"
            className={cn(
              'h-9 rounded-lg px-3 transition-all',
              copied ? 'bg-green-600 hover:bg-green-600' : 'bg-primary',
            )}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </Button>
        </div>
        <p className="text-muted-foreground text-center text-[13px]">
          Link copied will redirect to the full post view.
        </p>
      </DialogContent>
    </Dialog>
  );
}
