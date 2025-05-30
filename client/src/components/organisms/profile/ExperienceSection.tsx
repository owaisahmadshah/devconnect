import { type TExperience } from 'shared';
import { ExperienceItem } from '../../molecules/ExperienceItem';
import { Button } from '../../ui/button';
import { ProfileSectionCard } from '../../molecules/ProfileSectionCard';

interface ExperienceSectionProps {
  onItemAction?: () => Promise<void>;
  experiences: TExperience[];
  isCurrentUser: boolean;
}

export const ExperienceSection = ({
  onItemAction,
  experiences,
  isCurrentUser,
}: ExperienceSectionProps) => {
  return (
    <ProfileSectionCard title="Experience">
      {isCurrentUser && <Button variant={'outline'}>Add Experience</Button>}
      <div className="flex w-full flex-col gap-3">
        {experiences.map((experience, index) => (
            <ExperienceItem
              key={index}
              onAction={onItemAction}
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
