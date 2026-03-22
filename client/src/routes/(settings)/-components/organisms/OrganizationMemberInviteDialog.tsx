import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import type { TOrganizationMemberRole } from 'shared';

interface TOrganizationMemberInviteDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onInvite: (email: string, role: TOrganizationMemberRole) => Promise<void>;
  isLoading: boolean;
}

export const OrganizationMemberInviteDialog = ({
  open,
  onOpenChange,
  onInvite,
  isLoading,
}: TOrganizationMemberInviteDialogProps) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<TOrganizationMemberRole>('member');

  const handleSubmit = async () => {
    if (!email.trim()) return;
    await onInvite(email.trim(), role);
    setEmail('');
    setRole('member');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite member</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Email address</label>
            <Input
              placeholder="name@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              type="email"
            />
          </div>

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
          <Button onClick={handleSubmit} disabled={!email.trim() || isLoading}>
            {isLoading ? 'Sending...' : 'Send invite'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
