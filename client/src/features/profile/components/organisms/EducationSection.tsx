import { type TEducationWithId } from 'shared';
import { Button } from '../../../../components/ui/button';
import { EducationItem } from '../molecules/EducationItem';
import { ProfileSectionCard } from '../molecules/ProfileSectionCard';

interface EducationSectionProps {
  educations: TEducationWithId[];
  isCurrentUser: boolean;
}

export const EducationSection = ({ educations, isCurrentUser }: EducationSectionProps) => {
  return (
    <ProfileSectionCard title="Education">
      {isCurrentUser && <Button variant={'outline'}>Add Education</Button>}
      <div className="flex w-full flex-col gap-3">
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
          />
        ))}
      </div>
    </ProfileSectionCard>
  );
};
