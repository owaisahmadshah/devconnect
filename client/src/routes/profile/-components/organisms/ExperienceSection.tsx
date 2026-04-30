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
      <div className="divide-border/40 flex w-full flex-col divide-y">
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
            className="py-6 first:pt-0 last:pb-0"
          />
        ))}
      </div>
    </ProfileSectionCard>
  );
};
