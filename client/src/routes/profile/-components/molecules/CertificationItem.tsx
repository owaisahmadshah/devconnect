import { MdVerified, MdOpenInNew } from 'react-icons/md';

import { formatDate } from '@/lib/dateUtils';
import { type TCertificationWithId } from 'shared';
import { useProfileArrayDelete } from '../../-hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

interface CertificationItemProps extends Partial<TCertificationWithId> {
  isCurrentUser: boolean;
}

export const CertificationItem = ({
  _id,
  title,
  issuer,
  issuedDate,
  credentials,
  credentialsUrl,
  isCurrentUser = false,
}: CertificationItemProps) => {
  const { mutateAsync, isPending } = useProfileArrayDelete();

  const deleteAchievement = async () => {
    await mutateAsync({ fieldName: 'certifications', deleteObjectId: _id as string });
  };

  return (
    <div className="flex w-full justify-between">
      <div className="grid gap-3">
        <div>
          <h1>{title}</h1>
          <p>{issuer}</p>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <MdVerified className="text-blue-500" />
            <span>Issued {formatDate(issuedDate!)}</span>
          </div>

          {credentials && (
            <div className="flex items-center gap-1">
              <span>ID: {credentials}</span>
            </div>
          )}

          {credentialsUrl && (
            <a
              href={credentialsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-500 transition-colors hover:text-blue-600"
            >
              <span>View Certificate</span>
              <MdOpenInNew size={14} />
            </a>
          )}
        </div>
      </div>

      {/* If the user is signed and looking at his own profile then he can perform action on his profile */}
      {isCurrentUser && (
        <Button variant={'ghost'} onClick={deleteAchievement} disabled={isPending}>
          <span className="cursor-pointer transition-colors hover:text-gray-600">
            <Trash2 size={20} />
          </span>
        </Button>
      )}
    </div>
  );
};
