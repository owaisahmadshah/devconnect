import { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import type { TOrganizationMemberRole, TUserProfileSummary } from 'shared';
import { UserPicker } from '@/components/organisms/UserPicker';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface TOrganizationMemberInviteDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onInvite: (data: { role: TOrganizationMemberRole; userId: string }) => Promise<void>;
  isLoading: boolean;
}

export const OrganizationMemberInviteDialog = ({
  open,
  onOpenChange,
  onInvite,
  isLoading,
}: TOrganizationMemberInviteDialogProps) => {
  const [role, setRole] = useState<TOrganizationMemberRole>('member');
  const [selectedUsers, setSelectedUsers] = useState<TUserProfileSummary[]>([]);

  const handleSubmit = async () => {
    if (selectedUsers.length === 0) return;
    await onInvite({ role, userId: selectedUsers[0]._id });
    setRole('member');
  };

  const handleUserSelect = (user: TUserProfileSummary) => {
    setSelectedUsers([user]);
  };

  const handleRemoveSelectedUser = () => {
    setSelectedUsers([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite member</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <UserPicker
            onSelect={handleUserSelect}
            onDelete={handleRemoveSelectedUser}
            selectedUsers={selectedUsers}
          />

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Role</label>
            <div className="flex gap-2">
              {(['member', 'admin'] as TOrganizationMemberRole[]).map(r => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={cn(
                    'flex-1 rounded-md border px-3 py-2 text-sm font-medium capitalize transition-colors',
                    role === r
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background hover:bg-muted',
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={selectedUsers.length == 0 || isLoading}>
            {isLoading ? 'Sending...' : 'Send invite'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
