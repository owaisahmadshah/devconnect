import { Copy } from 'lucide-react';
import { FaShare } from 'react-icons/fa';
import { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ShareDialogProps {
  postId: string;
  baseUrl?: string; // optional, fallback to window.location.origin
}

export default function ShareDialog({ postId, baseUrl }: ShareDialogProps) {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const url = `${baseUrl || window.location.origin}/post/p/${postId}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex flex-1 items-center justify-center gap-2 rounded-lg text-sm font-medium text-slate-600 transition-all duration-200 hover:bg-slate-100 hover:text-green-500 dark:text-slate-400 dark:hover:bg-slate-800"
        >
          <FaShare className="h-[18px] w-[18px]" />
          <span className="hidden sm:inline">Share</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Post</DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-2">
          <Input value={url} readOnly />
          <Button onClick={handleCopy} size="icon" variant="secondary">
            <Copy size={16} />
          </Button>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Close
          </Button>
        </DialogFooter>

        {copied && <p className="mt-2 text-sm text-green-600">Copied to clipboard!</p>}
      </DialogContent>
    </Dialog>
  );
}
