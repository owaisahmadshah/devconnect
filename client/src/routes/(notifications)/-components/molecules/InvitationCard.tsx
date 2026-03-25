import { ProfileWithUrl } from '@/components/organisms/ProfileWithUrl';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, Check, X } from 'lucide-react';
import type { TOrganizationMemberWithStatusResponse } from 'shared';

interface InvitationCardProps {
  invitation: TOrganizationMemberWithStatusResponse;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}

export const InvitationCard = ({ invitation, onAccept, onReject }: InvitationCardProps) => {
  const { _id, user, organization, role } = invitation;

  return (
    <Card className="group border-border bg-card border transition-shadow duration-200 hover:shadow-md">
      <CardContent className="flex items-center justify-between gap-4 p-4">
        <div>
          <ProfileWithUrl user={user} profileSize="s" reverse={true} />

          <div className="min-w-0 flex-1">
            <div className="mt-2 flex items-center gap-1.5">
              <Building2 className="text-muted-foreground h-3.5 w-3.5 shrink-0" />
              <span className="text-muted-foreground truncate text-xs">
                invited you to{' '}
                <span className="text-foreground font-medium">{organization.name}</span>
              </span>
            </div>

            <Badge variant="secondary" className="mt-2 h-5 px-1.5 text-[10px] capitalize">
              {role}
            </Badge>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button
            size="icon"
            variant="outline"
            onClick={() => onReject(_id)}
            aria-label="Reject invitation"
            className="border-destructive/40 text-destructive hover:bg-destructive hover:text-destructive-foreground h-8 w-8 rounded-full transition-colors"
          >
            <X className="h-4 w-4" />
          </Button>

          <Button
            size="icon"
            onClick={() => onAccept(_id)}
            className="bg-primary text-primary-foreground hover:bg-primary/90 h-8 w-8 rounded-full transition-colors"
            aria-label="Accept invitation"
          >
            <Check className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
