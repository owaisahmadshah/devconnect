import { ProjectTemplate } from '@/components/templates/ProjectTemplate';
import { useInfiniteFetchProjectsProfileUrl } from '../-hooks/useProject';
import { ProjectItem } from './organisms/ProjectItem';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ProjectListSkeleton } from '@/components/ProjectListSkeleton';

export const ProjectList = () => {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isLoading } =
    useInfiniteFetchProjectsProfileUrl();

  if (isLoading) {
    return <ProjectListSkeleton />;
  }

  const projects = data?.pages.flatMap(page => page.projects) || [];

  return (
    <ProjectTemplate title="Portfolio Hub" user={projects.at(0)?.createdBy}>
      <ScrollArea className="h-full px-4 pb-20">
        <div className="mx-auto flex max-w-4xl flex-col gap-6 pt-6">
          {projects.length ? (
            projects.map(project => (
              <ProjectItem
                key={project._id}
                _id={project._id}
                title={project.title}
                description={project.description}
                tags={project.tags}
                techStacks={project.techStacks}
                creationDate={project.creationDate}
                createdBy={project.createdBy}
                createdAt={project.createdAt}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-muted-foreground text-[11px] font-black tracking-widest uppercase opacity-50">
                User hasn't registered any projects yet
              </p>
            </div>
          )}

          {hasNextPage && (
            <div className="mt-4 flex justify-center py-10">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="text-primary text-[10px] font-black tracking-[0.2em] uppercase transition-all hover:tracking-[0.3em] disabled:opacity-50"
              >
                {isFetchingNextPage ? 'Synchronizing...' : 'Load more projects'}
              </button>
            </div>
          )}
        </div>
      </ScrollArea>
    </ProjectTemplate>
  );
};
