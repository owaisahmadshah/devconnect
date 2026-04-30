import type { TUserProfileSummaryResponse } from 'shared';
import { ProfileWithUrl } from '../organisms/ProfileWithUrl';

interface ProjectTemplateProps {
  children: React.ReactNode;
  title: string;
  user?: TUserProfileSummaryResponse;
}

export const ProjectTemplate = ({ children, title, user }: ProjectTemplateProps) => {
  return (
    <main className="bg-background min-h-screen">
      <div className="mx-auto max-w-6xl p-8 md:p-12">
        <div className="border-border/40 flex flex-col items-center justify-between gap-6 border-b pb-10 md:flex-row">
          <div className="space-y-1">
            <h1 className="text-foreground text-3xl font-black tracking-[0.2em] uppercase">
              {title}
            </h1>
            <p className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase">
              Professional body of work
            </p>
          </div>
          {user && (
            <div className="border-border/40 bg-card rounded-2xl border px-4 py-2 shadow-sm">
              <ProfileWithUrl user={user} />
            </div>
          )}
        </div>
      </div>
      <div className="w-full">{children}</div>
    </main>
  );
};
