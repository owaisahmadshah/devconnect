import { ProfileSectionCard } from '../molecules/ProfileSectionCard';
import { ConnectGithub } from '../../../../components/ConnectGithub';
import { AddSkillForm } from './AddSkillForm';
import { AddAchivementForm } from './AddAchievementForm';
import { AddCertificationForm } from './AddCertificationForm';
import { AddExperienceForm } from './AddExperience';
import { AddEducationForm } from './AddEducationForm';
import { AddGithubProject } from './AddGithubProject';
import { Link } from '@tanstack/react-router';

interface SuggestionsSectionProps {
  showGithubAddButton: boolean;
  showAddSkillButton: boolean;
  showAddAchievementButton: boolean;
  showAddCertficationButton: boolean;
  showAddExperienceButton: boolean;
  showAddEducationButton: boolean;
  showAddGithubProject: boolean;
  navigateProfileUrl?: string;
  showOrganizationsButton?: boolean;
  showPostAJobButton?: boolean;
}

export const SuggestionsSection = ({
  showGithubAddButton,
  showAddSkillButton,
  showAddAchievementButton,
  showAddCertficationButton,
  showAddExperienceButton,
  showAddEducationButton,
  showAddGithubProject,
  navigateProfileUrl,
  showOrganizationsButton,
  showPostAJobButton,
}: SuggestionsSectionProps) => {
  const RenderButton = ({ text, children }: { text: string; children: React.ReactNode }) => {
    return (
      <div className="group bg-secondary flex items-center justify-center rounded-sm pr-4 hover:cursor-pointer">
        {children}
        <div>{text}</div>
      </div>
    );
  };

  return (
    <ProfileSectionCard title="Suggestions">
      <div className="flex flex-wrap gap-4">
        {navigateProfileUrl && (
          <Link
            to={`/projects/${navigateProfileUrl}`}
            className="group bg-secondary flex items-center justify-center rounded-sm px-4 hover:cursor-pointer"
          >
            Projects
          </Link>
        )}
        {showOrganizationsButton && (
          <Link
            to="/organizations-list"
            className="group bg-secondary flex items-center justify-center rounded-sm px-4 hover:cursor-pointer"
          >
            Organizations
          </Link>
        )}
        {showPostAJobButton && (
          <Link
            to="/job/new"
            className="group bg-secondary flex items-center justify-center rounded-sm px-4 hover:cursor-pointer"
          >
            Post a Job
          </Link>
        )}
        {showGithubAddButton && <ConnectGithub />}
        {showAddSkillButton && (
          <RenderButton text="Skill">
            <AddSkillForm />
          </RenderButton>
        )}
        {showAddAchievementButton && (
          <RenderButton text="Achivement">
            <AddAchivementForm />
          </RenderButton>
        )}
        {showAddCertficationButton && (
          <RenderButton text="Certificate">
            <AddCertificationForm />
          </RenderButton>
        )}
        {showAddExperienceButton && (
          <RenderButton text="Experience">
            <AddExperienceForm />
          </RenderButton>
        )}
        {showAddEducationButton && (
          <RenderButton text="Education">
            <AddEducationForm />
          </RenderButton>
        )}
        {showAddGithubProject && (
          <RenderButton text="Add Github Repo">
            {' '}
            <AddGithubProject />{' '}
          </RenderButton>
        )}
      </div>
    </ProfileSectionCard>
  );
};
