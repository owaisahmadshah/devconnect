import { type TEducationWithId } from 'shared';
import { EducationItem } from '../molecules/EducationItem';
import { ProfileSectionCard } from '../molecules/ProfileSectionCard';
import { AddEducationForm } from './AddEducationForm';

interface EducationSectionProps {
  educations: TEducationWithId[];
  isCurrentUser: boolean;
}

export const EducationSection = ({ educations, isCurrentUser }: EducationSectionProps) => {
  return (
    <ProfileSectionCard title="Education" actionAddChild={isCurrentUser && <AddEducationForm />}>
      <div className="divide-border/40 flex w-full flex-col divide-y">
        {educations.map(education => (
          <EducationItem
            key={education._id}
            _id={education._id}
            degree={education.degree}
            school={education.school}
            fieldOfStudy={education.fieldOfStudy}
            started={education.started}
            ended={education.ended}
            isCurrentUser={isCurrentUser}
            className="py-6 first:pt-0 last:pb-0"
          />
        ))}
      </div>
    </ProfileSectionCard>
  );
};
