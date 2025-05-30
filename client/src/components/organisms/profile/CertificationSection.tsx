import { type TCertification } from 'shared';
import { Button } from '../../ui/button';
import { CertificationItem } from '../../molecules/CertificationItem';
import { ProfileSectionCard } from '../../molecules/ProfileSectionCard';

interface EducationSectionProps {
  onItemAction?: () => Promise<void>;
  onAddItem?: () => Promise<void>;
  certificates: TCertification[];
  isCurrentUser: boolean;
}

export const CertificationSection = ({
  onItemAction,
  certificates,
  isCurrentUser,
}: EducationSectionProps) => {
  return (
    <ProfileSectionCard title="Education">
      {isCurrentUser && <Button variant={'outline'}>Add Education</Button>}
      <div className="flex w-full flex-col gap-3">
        {certificates.map((certificate, index) => (
            <CertificationItem
              key={index}
              onAction={onItemAction}
              title={certificate.title}
              issuer={certificate.issuer}
              credentials={certificate.credentials}
              credentialsUrl={certificate.credentialsUrl}
              issuedDate={certificate.issuedDate}
              isCurrentUser={isCurrentUser}
            />
          ))}
      </div>
    </ProfileSectionCard>
  );
};
