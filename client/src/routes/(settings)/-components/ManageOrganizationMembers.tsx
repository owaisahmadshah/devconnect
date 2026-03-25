import { UserPlus } from 'lucide-react';
import { Suspense, useState } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

import ErrorFallbackCompact from '@/components/ErrorFallbackCompact';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { OrganizationMemberRow } from './organisms/OrganizationMemberRow';
import { OrganizationMemberInviteDialog } from './organisms/OrganizationMemberInviteDialog';
import { useFetchAllMembersOfOrganization } from '../-hooks/useFetchAllMembersOfOrganization';
import { useUpdateMemberRole } from '../-hooks/useUpdateMemberRole';
import { useDeleteOrganizationMember } from '../-hooks/useDeleteOrganizationMember';
import type { TOrganizationMemberRole } from 'shared';
import { useCreateOrganizationMemberInvite } from '../-hooks/useCreateOrganizationMemberInvite';

interface ManageMembersProps {
  organizationId: string;
}

export const ManageOrganizationMembers = ({ organizationId }: ManageMembersProps) => {
  const [inviteOpen, setInviteOpen] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [search, setSearch] = useState('');

  const { data: members } = useFetchAllMembersOfOrganization(organizationId);
  const { mutateAsync: inviteMember } = useCreateOrganizationMemberInvite();
  const { mutate: updateRole } = useUpdateMemberRole();
  const { mutate: removeMember } = useDeleteOrganizationMember();

  const handleInvite = async (data: { role: TOrganizationMemberRole; userId: string }) => {
    setIsInviting(true);
    try {
      await inviteMember({ ...data, status: 'pending', organizationId: organizationId });
      setInviteOpen(false);
    } finally {
      setIsInviting(false);
    }
  };

  const handleRoleChange = (memberId: string, role: TOrganizationMemberRole) => {
    updateRole({ _id: memberId, role, organizationId });
  };

  const handleRemove = (memberId: string) => {
    removeMember({ organizationId, userId: memberId });
  };

  const filtered = members.filter(m =>
    (m.user.firstName + ' ' + m.user.lastName).trim().toLowerCase().includes(search.toLowerCase()),
  );

  const adminCount = members.filter(m => m.role === 'admin').length;
  const memberCount = members.filter(m => m.role === 'member').length;

  return (
    <>
      {/* header row */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold">Members</h3>
          <p className="text-muted-foreground mt-0.5 text-xs">
            {adminCount} admin{adminCount !== 1 ? 's' : ''} · {memberCount} member
            {memberCount !== 1 ? 's' : ''}
          </p>
        </div>
        <Button size="sm" onClick={() => setInviteOpen(true)}>
          <UserPlus className="mr-1.5 h-4 w-4" />
          Add member
        </Button>
      </div>

      {/* search */}
      <Input
        placeholder="Search members..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-4 h-8 text-sm"
      />

      {/* list */}
      <ErrorBoundary FallbackComponent={ErrorFallbackCompact}>
        <Suspense
          fallback={
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="flex animate-pulse items-center gap-3 border-b py-3 last:border-0"
                >
                  <div className="bg-muted h-8 w-8 shrink-0 rounded-full" />
                  <div className="flex-1 space-y-1.5">
                    <div className="bg-muted h-3 w-32 rounded" />
                    <div className="bg-muted h-2.5 w-48 rounded" />
                  </div>
                </div>
              ))}
            </div>
          }
        >
          {filtered.length === 0 ? (
            <div className="text-muted-foreground py-10 text-center text-sm">
              {search
                ? 'No members match your search.'
                : 'No members yet. Invite someone to get started.'}
            </div>
          ) : (
            <div>
              {filtered.map(member => (
                <OrganizationMemberRow
                  key={member._id}
                  org_member={member}
                  onRoleChange={handleRoleChange}
                  onRemove={handleRemove}
                />
              ))}
            </div>
          )}
        </Suspense>
      </ErrorBoundary>

      <OrganizationMemberInviteDialog
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        onInvite={handleInvite}
        isLoading={isInviting}
      />
    </>
  );
};
