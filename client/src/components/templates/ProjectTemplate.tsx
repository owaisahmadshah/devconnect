import type { TUserProfileSummaryResponse } from 'shared';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from '@tanstack/react-router';

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
        {user && (
          <Link
            className="flex items-center gap-5"
            to={'/profile/$identifier'}
            params={
              {
                // identifier: TODO User profile url
              }
            }
          >
            <p className="text-semi-bold hover:underline max-sm:hidden">
              {user.firstName} {user?.lastName}
            </p>
            <Avatar className="h-16 w-16 max-sm:h-10 max-sm:w-10">
              <AvatarImage src={user.profilePictureUrl} />
              <AvatarFallback>
                {user.firstName[0]}
                {user?.lastName[0]}Z
              </AvatarFallback>
            </Avatar>
          </Link>
        )}
      </div>
      <div>{children}</div>
    </main>
  );
};
