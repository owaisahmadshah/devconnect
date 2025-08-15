import type { TCreateProject } from 'shared';

export const buildProjectFormData = (data: TCreateProject): FormData => {
  const formData = new FormData();

  // Basic fields
  formData.append('title', data.title);
  formData.append('description', data.description);
  formData.append('githubUrl', data.githubUrl);
  formData.append('liveDemoUrl', data.liveDemoUrl);
  formData.append('createdBy', data.createdBy);
  formData.append('visibility', data.visibility);
  formData.append('isFeatured', data.isFeatured.toString());
  formData.append('creationDate', data.creationDate.toISOString());

  // Array fields
  data.tags.forEach((tag, i) => {
    formData.append(`tags[${i}][tag]`, tag.tag);
  });

  data.techStacks.forEach((tech, i) => {
    formData.append(`techStacks[${i}][tech]`, tech.tech);
  });

  data.collaborators.forEach((collab, i) => {
    formData.append(`collaborators[${i}][user]`, collab.user);
  });

  data.media.forEach(mediaObj => {
    formData.append('media', mediaObj.image);
  });

  return formData;
};
