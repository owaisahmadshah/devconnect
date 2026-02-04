import { Check, X, UserPlus } from 'lucide-react';

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
        <Button onClick={acceptConnection} className="flex-1" size="sm">
          <Check className="mr-1 h-4 w-4" />
          {!hideText && 'Accept'}
        </Button>
        <Button onClick={removeConnection} variant="outline" className="flex-1" size="sm">
          <X className="mr-1 h-4 w-4" />
          {!hideText && 'Ignore'}
        </Button>
      </div>
    );
  }

  // If there's a pending connection request sent BY the current user
  if (state === 'pending' && senderId !== userId) {
    return (
      <Button onClick={deleteConnection} variant="outline" size="sm">
        <X className="mr-1 h-4 w-4" />
        {!hideText && 'Withdraw'}
      </Button>
    );
  }

  // If already connected
  if (state === 'accepted') {
    return (
      <Button onClick={deleteConnection} variant="outline" size="sm">
        <X className="mr-1 h-4 w-4" />
        {!hideText && 'Remove'}
      </Button>
    );
  }

  // If no connection exists
  return (
    <Button onClick={addConnection} variant="default" size="sm">
      <UserPlus className="mr-1 h-4 w-4" />
      {!hideText && 'Connect'}
    </Button>
  );
};
