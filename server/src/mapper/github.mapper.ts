import type { TCreateProjectBackend, TRepo, TReposListResponse } from 'shared';

export class GithubMapper {
  static toGithubProjectsListResponse(data: TRepo[]): TReposListResponse[] {
    const repos: TReposListResponse[] = [];

    data.forEach(repo => {
      repos.push({ repo_id: repo.id, repo_name: repo.name });
    });

    return repos;
  }

  static toBaseProject(data: TRepo, createdBy: string): TCreateProjectBackend {
    return {
      title: data.name,
      description: data.description ?? 'No description provided.',
      githubUrl: data.html_url,
      liveDemoUrl: data.homepage ?? '',
      createdBy: createdBy,
      collaborators: [],
      isFeatured: false,
      creationDate: new Date(data.created_at),
      media: [],
      tags: [],
      techStacks: data.language ? [{ tech: data.language }] : [],
      visibility: 'Public',
    };
  }
}
