import { formatDate } from '@/lib/dateUtils';
import { MdEdit, MdVerified, MdOpenInNew } from 'react-icons/md';
import { type TCertification } from 'shared';

interface CertificationItemProps extends TCertification {
  onAction?: () => Promise<void>;
  isCurrentUser: boolean;
}

export const CertificationItem = ({
  onAction,
  title,
  issuer,
  issuedDate,
  credentials,
  credentialsUrl,
  isCurrentUser = false,
}: CertificationItemProps) => {
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
            <span>Issued {formatDate(issuedDate)}</span>
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
        <div>
          <span onClick={onAction} className="cursor-pointer transition-colors hover:text-gray-600">
            <MdEdit />
          </span>
        </div>
      )}
    </div>
  );
};
