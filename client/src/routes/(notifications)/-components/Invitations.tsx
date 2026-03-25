import { InvitationCard } from './molecules/InvitationCard';
import { useFetchOrganizationsInvitations } from '@/hooks/useFetchOrganizationsInvitations';
import { useAcceptOrganizationMemberInvite } from '@/hooks/useAcceptOrganizationMemberInvite';
import { useRejectOrganizationMemberInvite } from '@/hooks/useRejectOrganizationMemberInvite';
import { Inbox } from 'lucide-react';

export const Invitations = () => {
  const { data: invitations } = useFetchOrganizationsInvitations();
  const { mutateAsync: accept } = useAcceptOrganizationMemberInvite();
  const { mutateAsync: reject } = useRejectOrganizationMemberInvite();

  if (!invitations || invitations.length === 0)
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <Inbox className="text-muted-foreground mb-3 h-10 w-10" />
        <p className="text-foreground text-sm font-medium">No pending invitations</p>
        <p className="text-muted-foreground mt-1 text-xs">
          When someone invites you to an organization, it'll show up here.
        </p>
      </div>
    );

  return (
    <section className="w-full max-w-lg space-y-2">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-foreground text-sm font-semibold">Invitations</h2>
        <span className="text-muted-foreground text-xs">{invitations.length} pending</span>
      </div>

      <div className="space-y-2">
        {invitations.map(invitation => (
          <InvitationCard
            key={invitation._id}
            invitation={invitation}
            onAccept={() => accept({ inviteId: invitation._id })}
            onReject={() => reject({ inviteId: invitation._id })}
          />
        ))}
      </div>
    </section>
  );
};
