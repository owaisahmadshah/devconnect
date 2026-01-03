import { ProfileWithUrl } from '@/components/organisms/ProfileWithUrl';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, X, UserPlus } from 'lucide-react';
import type { TUserProfileSummaryResponse, TUserProfileWithConnection } from 'shared';

interface IConnectionCardProps {
  user: TUserProfileSummaryResponse | TUserProfileWithConnection;
  addConnection?: () => void;
  removeConnection?: () => void;
  deleteConnection?: () => void;
  acceptConnection?: () => void;
}

export function ConnectionCard({
  user,
  addConnection,
  removeConnection,
  deleteConnection,
  acceptConnection,
}: IConnectionCardProps) {
  const renderActionButtons = () => {
    // If there's a pending connection request sent TO the current user
    if (user.connection?.state === 'pending' && user.connection.sender === user._id) {
      return (
        <div className="flex gap-2">
          <Button onClick={acceptConnection} className="flex-1" size="sm">
            <Check className="mr-1 h-4 w-4" />
            Accept
          </Button>
          <Button onClick={removeConnection} variant="outline" className="flex-1" size="sm">
            <X className="mr-1 h-4 w-4" />
            Ignore
          </Button>
        </div>
      );
    }

    // If there's a pending connection request sent BY the current user
    if (user.connection?.state === 'pending' && user.connection.sender !== user._id) {
      return (
        <Button onClick={deleteConnection} variant="outline" className="w-full" size="sm">
          <X className="mr-1 h-4 w-4" />
          Withdraw
        </Button>
      );
    }

    // If already connected
    if (user.connection?.state === 'accepted') {
      return (
        <Button onClick={deleteConnection} variant="outline" className="w-full" size="sm">
          <X className="mr-1 h-4 w-4" />
          Remove
        </Button>
      );
    }

    // If no connection exists
    return (
      <Button onClick={addConnection} variant="default" className="w-full" size="sm">
        <UserPlus className="mr-1 h-4 w-4" />
        Connect
      </Button>
    );
  };

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardContent className="flex w-52 flex-col items-center gap-4 max-sm:w-36 max-sm:gap-2 max-sm:p-0">
        <ProfileWithUrl user={user} profileSize="connection" underlineOnHover={false} />
        {renderActionButtons()}
      </CardContent>
    </Card>
  );
}
