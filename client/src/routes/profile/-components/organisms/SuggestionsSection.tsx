import { Link } from '@tanstack/react-router';
import {
  Layers,
  Briefcase,
  Trophy,
  GraduationCap,
  Award,
  Building,
  FolderKanban,
} from 'lucide-react';

import { ProfileSectionCard } from '../molecules/ProfileSectionCard';
import { AddSkillForm } from './AddSkillForm';
import { AddAchivementForm } from './AddAchievementForm';
import { AddCertificationForm } from './AddCertificationForm';
import { AddExperienceForm } from './AddExperience';
import { AddEducationForm } from './AddEducationForm';

interface SuggestionsSectionProps {
  showAddSkillButton: boolean;
  showAddAchievementButton: boolean;
  showAddCertficationButton: boolean;
  showAddExperienceButton: boolean;
  showAddEducationButton: boolean;
  navigateProfileUrl?: string;
  showOrganizationsButton?: boolean;
  showPostAJobButton?: boolean;
}

export const SuggestionsSection = ({
  showAddSkillButton,
  showAddAchievementButton,
  showAddCertficationButton,
  showAddExperienceButton,
  showAddEducationButton,
  navigateProfileUrl,
  showOrganizationsButton,
  showPostAJobButton,
}: SuggestionsSectionProps) => {
  const RenderButton = ({
    text,
    icon: Icon,
    children,
  }: {
    text: string;
    icon: any;
    children: React.ReactNode;
  }) => {
    return (
      <div className="group border-border/40 bg-muted/20 hover:bg-muted/40 hover:border-primary/30 relative flex min-w-[85px] flex-1 cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border p-3 transition-all">
        <div className="text-muted-foreground group-hover:text-primary transition-colors">
          <Icon className="size-5" />
        </div>
        <span className="text-[10px] font-bold tracking-tight uppercase">{text}</span>
        <div className="bg-background/40 absolute inset-0 flex items-center justify-center opacity-0 backdrop-blur-[1px] transition-opacity group-hover:opacity-100">
          {children}
        </div>
      </div>
    );
  };

  return (
    <ProfileSectionCard title="Suggestions">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {navigateProfileUrl && (
          <Link
            to={`/projects/${navigateProfileUrl}`}
            className="border-border/40 bg-muted/20 hover:bg-muted/40 hover:border-primary/30 flex min-w-[85px] flex-1 flex-col items-center justify-center gap-2 rounded-xl border p-3 transition-all"
          >
            <FolderKanban className="text-muted-foreground size-5" />
            <span className="text-[10px] font-bold tracking-tight uppercase">Projects</span>
          </Link>
        )}
        {showOrganizationsButton && (
          <Link
            to="/organizations-list"
            className="border-border/40 bg-muted/20 hover:bg-muted/40 hover:border-primary/30 flex min-w-[85px] flex-1 flex-col items-center justify-center gap-2 rounded-xl border p-3 transition-all"
          >
            <Building className="text-muted-foreground size-5" />
            <span className="text-[10px] font-bold tracking-tight uppercase">Orgs</span>
          </Link>
        )}
        {showPostAJobButton && (
          <Link
            to="/job/new"
            className="border-primary/20 bg-primary/5 hover:bg-primary/10 hover:border-primary/40 flex min-w-[85px] flex-1 flex-col items-center justify-center gap-2 rounded-xl border p-3 transition-all"
          >
            <Briefcase className="text-primary size-5" />
            <span className="text-primary text-[10px] font-black tracking-tight uppercase">
              Post Job
            </span>
          </Link>
        )}
        {showAddSkillButton && (
          <RenderButton text="Skill" icon={Layers}>
            <AddSkillForm />
          </RenderButton>
        )}
        {showAddAchievementButton && (
          <RenderButton text="Trophy" icon={Trophy}>
            <AddAchivementForm />
          </RenderButton>
        )}
        {showAddCertficationButton && (
          <RenderButton text="Award" icon={Award}>
            <AddCertificationForm />
          </RenderButton>
        )}
        {showAddExperienceButton && (
          <RenderButton text="Work" icon={Briefcase}>
            <AddExperienceForm />
          </RenderButton>
        )}
        {showAddEducationButton && (
          <RenderButton text="Study" icon={GraduationCap}>
            <AddEducationForm />
          </RenderButton>
        )}
      </div>
    </ProfileSectionCard>
  );
};
