import { Check, X, UserPlus, UserMinus, Clock } from 'lucide-react';

import type { IConnectionActionButtonProps } from '@/types/connectionActionButton-type';
import { Button } from '@/components/ui/button';

export const ConnectionActionButton = ({
  state,
  senderId,
  userId,
  addConnection,
  acceptConnection,
  removeConnection,
  deleteConnection,
  hideText,
}: IConnectionActionButtonProps) => {
  // If there's a pending connection request sent TO the current user
  if (state === 'pending' && senderId === userId) {
    return (
      <div className="flex gap-2">
        <Button onClick={acceptConnection} className="flex-1 gap-1.5" size="sm" variant="default">
          <Check className="h-4 w-4" />
          {!hideText && <span>Accept</span>}
        </Button>
        <Button
          onClick={removeConnection}
          variant="outline"
          className="hover:border-destructive hover:text-destructive flex-1 gap-1.5"
          size="sm"
        >
          <X className="h-4 w-4" />
          {!hideText && <span>Ignore</span>}
        </Button>
      </div>
    );
  }

  // If there's a pending connection request sent BY the current user
  if (state === 'pending' && senderId !== userId) {
    return (
      <Button onClick={deleteConnection} variant="secondary" size="sm" className="gap-1.5">
        <Clock className="h-4 w-4" />
        {!hideText && <span>Pending</span>}
      </Button>
    );
  }

  // If already connected
  if (state === 'accepted') {
    return (
      <Button
        onClick={deleteConnection}
        variant="outline"
        size="sm"
        className="hover:border-destructive hover:bg-destructive/10 hover:text-destructive gap-1.5"
      >
        <UserMinus className="h-4 w-4" />
        {!hideText && <span>Connected</span>}
      </Button>
    );
  }

  // If no connection exists
  return (
    <Button onClick={addConnection} variant="default" size="sm" className="gap-1.5">
      <UserPlus className="h-4 w-4" />
      {!hideText && <span>Connect</span>}
    </Button>
  );
};
