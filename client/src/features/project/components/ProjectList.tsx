import { ProjectTemplate } from '@/components/templates/ProjectTemplate';
import { useInfiniteFetchProjectsProfileUrl } from '../hooks/useProject';
import { ProjectItem } from './organisms/ProjectItem';
import { ScrollArea } from '@/components/ui/scroll-area';

export const ProjectList = () => {
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage, isLoading } =
    useInfiniteFetchProjectsProfileUrl();

  if (isLoading) {
    return <div>'Loading...'</div>;
  }

  const projects = data?.pages.flatMap(page => page.projects) || [];

  // TODO Fetch user too and pass to user instead from projects

  return (
    <ProjectTemplate title="Projects" user={projects.at(0)?.createdBy}>
      <ScrollArea className="h-full">
        {projects.length
          ? projects.map(project => (
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
          : "User hasn't added any project yet."}
        {hasNextPage && (
          <div className="border-t px-4 py-2">
            <button
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
              className="w-full cursor-pointer text-sm text-blue-600 hover:text-blue-800 disabled:opacity-50"
            >
              {isFetchingNextPage ? 'Loading more projects...' : 'Load more projects'}
            </button>
          </div>
        )}
      </ScrollArea>
    </ProjectTemplate>
  );
};
