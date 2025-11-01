import { type TExperienceWithId } from 'shared';
import { ExperienceItem } from '../molecules/ExperienceItem';
import { ProfileSectionCard } from '../molecules/ProfileSectionCard';
import { AddExperienceForm } from './AddExperience';

interface ExperienceSectionProps {
  experiences: TExperienceWithId[];
  isCurrentUser: boolean;
}

export const ExperienceSection = ({ experiences, isCurrentUser }: ExperienceSectionProps) => {
  return (
    <ProfileSectionCard title="Experience" actionAddChild={isCurrentUser && <AddExperienceForm />}>
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
