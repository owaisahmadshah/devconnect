import { type TEducationWithId } from 'shared';
import { Button } from '../../ui/button';
import { EducationItem } from '../../molecules/EducationItem';
import { ProfileSectionCard } from '../../molecules/ProfileSectionCard';

interface EducationSectionProps {
  onItemAction?: () => Promise<void>;
  onAddItem?: () => Promise<void>;
  educations: TEducationWithId[];
  isCurrentUser: boolean;
}

export const EducationSection = ({
  onItemAction,
  educations,
  isCurrentUser,
}: EducationSectionProps) => {
  return (
    <ProfileSectionCard title="Education">
      {isCurrentUser && <Button variant={'outline'}>Add Education</Button>}
      <div className="flex w-full flex-col gap-3">
        {educations.map((education, index) => (
            <EducationItem
              key={index}
              onAction={onItemAction}
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
