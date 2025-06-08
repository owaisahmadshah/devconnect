import { type TCertificationWithId } from 'shared';
import { Button } from '../../../../components/ui/button';
import { CertificationItem } from '../molecules/CertificationItem';
import { ProfileSectionCard } from '../molecules/ProfileSectionCard';

interface EducationSectionProps {
  certificates: TCertificationWithId[];
  isCurrentUser: boolean;
}

export const CertificationSection = ({ certificates, isCurrentUser }: EducationSectionProps) => {
  return (
    <ProfileSectionCard title="Education">
      {isCurrentUser && <Button variant={'outline'}>Add Education</Button>}
      <div className="flex w-full flex-col gap-3">
        {certificates.map((certificate) => (
          <CertificationItem
            key={certificate._id}
            _id={certificate._id}
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
