import { type TCertificationWithId } from 'shared';
import { CertificationItem } from '../molecules/CertificationItem';
import { ProfileSectionCard } from '../molecules/ProfileSectionCard';
import { AddCertificationForm } from './AddCertificationForm';

interface EducationSectionProps {
  certificates: TCertificationWithId[];
  isCurrentUser: boolean;
}

export const CertificationSection = ({ certificates, isCurrentUser }: EducationSectionProps) => {
  return (
    <ProfileSectionCard
      title="Certifications"
      actionAddChild={isCurrentUser && <AddCertificationForm />}
    >
      <div className="divide-border/40 flex w-full flex-col divide-y">
        {certificates.map(certificate => (
          <CertificationItem
            key={certificate._id}
            _id={certificate._id}
            title={certificate.title}
            issuer={certificate.issuer}
            credentials={certificate.credentials}
            credentialsUrl={certificate.credentialsUrl}
            issuedDate={certificate.issuedDate}
            isCurrentUser={isCurrentUser}
            className="py-4 first:pt-0 last:pb-0"
          />
        ))}
      </div>
    </ProfileSectionCard>
  );
};
