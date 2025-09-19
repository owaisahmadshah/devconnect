import { DynamicDialogWithHeaderAction } from '@/components/molecules/DynamicDialogWithHeaderAction';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAddRepo, useFetchRepos } from '../../hooks/useProfile';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import type { TCreateGithubProject } from 'shared';

export const AddGithubProject = () => {
  const [isFetchRepos, setIsFetchRepos] = useState(false);

  const { data: repos, mutateAsync, isPending } = useFetchRepos();
  const { mutateAsync: addRepo } = useAddRepo();

  const handleFetchRepos = async () => {
    setIsFetchRepos(true);
    await mutateAsync();
  };

  const handleAddRepo = async (data: TCreateGithubProject) => {
    await addRepo(data);
  };

  return (
    <DynamicDialogWithHeaderAction
      title="Github Repositories"
      description="Add your projects directly from github."
    >
      <ScrollArea className="h-64">
        <div className="">
          {isPending && isFetchRepos && 'Loading..'}
          {!isFetchRepos && (
            <Button onClick={handleFetchRepos} variant={'outline'}>
              Fetch Repos
            </Button>
          )}
          {repos?.map(repo => (
            <React.Fragment key={repo.repo_id}>
              <Button
                variant={'link'}
                className="text-sm"
                onClick={() =>
                  handleAddRepo({ githubId: repo.repo_id, githubName: repo.repo_name })
                }
              >
                {repo.repo_name}
              </Button>
              <Separator className="my-2" />
            </React.Fragment>
          ))}
        </div>
      </ScrollArea>
    </DynamicDialogWithHeaderAction>
  );
};
