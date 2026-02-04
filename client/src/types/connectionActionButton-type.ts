import type { TConnectionPendingState } from 'shared';

export interface IConnectionActionButtonProps {
  _id?: string;
  state?: TConnectionPendingState;
  senderId?: string;
  userId: string;
  addConnection?: () => void;
  acceptConnection?: () => void;
  removeConnection?: () => void;
  deleteConnection?: () => void;
  hideText?: boolean;
}
