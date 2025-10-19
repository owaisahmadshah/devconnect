import type { TUserProfileSummaryResponse } from 'shared';
import { ProfileWithUrl } from '../organisms/ProfileWithUrl';

interface ProjectTemplateProps {
  children: React.ReactNode;
  title: string;
  user?: TUserProfileSummaryResponse;
}

export const ProjectTemplate = ({ children, title, user }: ProjectTemplateProps) => {
  return (
    <main>
      <div className="mx-auto flex w-3/4 items-center justify-between p-10 max-sm:w-full">
        <h1 className="text-2xl font-bold">{title}</h1>
        {user && <ProfileWithUrl user={user} />}
      </div>
      <div>{children}</div>
    </main>
  );
};
