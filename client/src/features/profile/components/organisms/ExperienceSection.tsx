import { type TExperienceWithId } from 'shared';
import { ExperienceItem } from '../molecules/ExperienceItem';
import { Button } from '../../../../components/ui/button';
import { ProfileSectionCard } from '../molecules/ProfileSectionCard';

interface ExperienceSectionProps {
  experiences: TExperienceWithId[];
  isCurrentUser: boolean;
}

export const ExperienceSection = ({ experiences, isCurrentUser }: ExperienceSectionProps) => {
  return (
    <ProfileSectionCard title="Experience">
      {isCurrentUser && <Button variant={'outline'}>Add Experience</Button>}
      <div className="flex w-full flex-col gap-3">
        {experiences.map(experience => (
          <ExperienceItem
            key={experience._id}
            _id={experience._id}
            role={experience.role}
            companyOrProject={experience.companyOrProject}
            description={experience.description}
            location={experience.location}
            type={experience.type}
            started={experience.started}
            ended={experience.ended}
            technologies={experience.technologies}
            isCurrentUser={isCurrentUser}
          />
        ))}
      </div>
    </ProfileSectionCard>
  );
};
