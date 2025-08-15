import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { createProjectSchema, type TCreateProject } from 'shared';
import type { RootState } from '@/store/store';

export const useCreateProjectForm = () => {
  const currentLoggedInUser = useSelector((state: RootState) => state.profileSummary.user);

  return useForm<TCreateProject>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      title: '',
      description: '',
      githubUrl: '',
      liveDemoUrl: '',
      createdBy: currentLoggedInUser?._id ?? '',
      isFeatured: true,
      creationDate: new Date(),
      visibility: 'Public',
      collaborators: [{ user: currentLoggedInUser?._id ?? '' }],
      tags: [],
      media: [],
      techStacks: [],
    },
  });
};
