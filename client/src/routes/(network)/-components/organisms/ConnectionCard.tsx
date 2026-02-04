import { ConnectionActionButton } from '@/components/organisms/ConnectionActionButton';
import { ProfileWithUrl } from '@/components/organisms/ProfileWithUrl';
import { Card, CardContent } from '@/components/ui/card';
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
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <CardContent className="flex w-52 flex-col items-center gap-4 max-sm:w-36 max-sm:gap-2 max-sm:p-0">
        <ProfileWithUrl user={user} profileSize="connection" underlineOnHover={false} />
        <ConnectionActionButton
          state={user.connection?.state}
          senderId={user.connection?.sender}
          userId={user._id}
          addConnection={addConnection}
          removeConnection={removeConnection}
          deleteConnection={deleteConnection}
          acceptConnection={acceptConnection}
        />
      </CardContent>
    </Card>
  );
}
