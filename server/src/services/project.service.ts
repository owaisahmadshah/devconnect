import {
  HttpStatus,
  type TAddProjectArrayItem,
  type TCreateProjectBackend,
  type TDeleteProject,
  type TDeleteProjectArrayItem,
  type TProjectById,
  type TProjectByTechStack,
  type TProjectByTitle,
  type TProjectResponse,
  type TProjectsOfUser,
  type TProjectsSummaryWithCursorPaginationResponse,
  type TUpdateProjectField,
} from 'shared';
import type { IRequestUser } from '../types/index.js';
import { ProjectMapper } from '../mapper/project.mapper.js';
import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError.js';
import logger from '../utils/logger.js';
import { uploadMultipleImages } from '../utils/uploadImages.js';
import type { ProfileService } from './profile.service.js';
import type { ProjectRepository } from '../repositories/project.repository.js';

export class ProjectService {
  constructor(
    private repo: ProjectRepository,
    private profileServ: ProfileService,
  ) {}

  createProject = async (projectData: TCreateProjectBackend): Promise<TProjectResponse> => {
    let paths: string[] = [];
    projectData.media.forEach(path => paths.push(path.path));

    // Uploading images to cloudinary
    const { urls, success } = await uploadMultipleImages(paths);

    if (!success) {
      throw new ApiError(HttpStatus.UNAUTHORIZED, 'Error uploading project images');
    }

    let uploadedMedia: { url: string; mediaType: string }[] = [];

    urls.forEach(url => {
      uploadedMedia.push({
        url,
        mediaType: 'image',
      });
    });

    const project = await this.repo.create({ ...projectData, media: uploadedMedia });

    const responseProject = ProjectMapper.toPublicProject(project);

    return responseProject;
  };

  deleteProject = async (deleteProject: TDeleteProject, user: IRequestUser) => {
    // TODO Update validation
    // ------Start validation
    const project = await this.repo.findByIdWithUserOnly(deleteProject._id);

    if (!project) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Project not found');
    }

    if ((project.createdBy as any).user.toString() !== user._id.toString()) {
      throw new ApiError(HttpStatus.FORBIDDEN, 'You are not authorized to modify this project');
    }
    // ------End Validation

    // Start transaction
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      await this.repo.deleteOne({ _id: deleteProject._id, createdBy: user._id }, session);
      // TODO: Delete all the documents from all the collections related to this particular document

      // Explicitly commit the transaction
      await session.commitTransaction();
    } catch (error) {
      // Abort the transaction on error
      await session.abortTransaction();

      if (error instanceof ApiError) {
        throw error;
      } else {
        logger.error('Error in project delete transaction:', error);
        throw new ApiError(
          HttpStatus.INTERNAL_SERVER_ERROR,
          'Failed to delete project. Please try again',
        );
      }
    } finally {
      session.endSession();
    }
  };

  fetchProjectById = async (projectId: TProjectById): Promise<TProjectResponse> => {
    const project = await this.repo.findById(projectId.projectId);

    if (!project) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Project not found');
    }

    const responseProject = ProjectMapper.toPublicProject(project);

    return responseProject;
  };

  fetchPaginatedProjectsSummary = async ({
    filter,
    limit = 10,
    cursor,
  }: {
    filter: any;
    limit: number;
    cursor?: string;
  }): Promise<TProjectsSummaryWithCursorPaginationResponse> => {
    /**
     * Cursor-Based Pagination Explained
     *
     * Instead of skipping a number of documents (which gets slow and unstable),
     * we use a "cursor" — the `createdAt` of the last item previously fetched.
     *
     * On the first request: we just filter normally (no cursor).
     * On next pages: we also add `createdAt: { $lt: cursor }` to get only items
     * that are *older* than the last one we already showed.
     *
     * 🔍 Why `$lt`?
     *   - Because we're sorting by `createdAt` in descending order (newest first),
     *     and we want to get older items on each scroll.
     *   - So `$lt` ensures we fetch items with `createdAt` LESS THAN the last one.
     *
     * This approach:
     *   Avoids performance issues of `.skip()`
     *   Works great for infinite scroll
     *   Keeps results consistent even if new items are added/removed
     *   Prevents duplicates
     *
     * Frontend sends the last `createdAt` as `cursor`, backend uses it to paginate.
     */

    // Return the paginated results along with:
    // - nextCursor: the createdAt of the last project (for fetching more)
    // - hasMore: whether there might be more results to load
    // This keeps the frontend scroll seamless and efficient

    if (cursor) {
      filter.createdAt = { $lt: new Date(cursor) };
    }

    const projects = await this.repo.findPaginated(filter, limit);

    const responseProjects = projects.map(project => ProjectMapper.toProjectSummary(project));

    const hasMore = responseProjects.length === limit;
    const lastProject = responseProjects.at(-1); // same as array[array.length - 1]
    const nextCursor: string | null = lastProject?.createdAt
      ? lastProject.createdAt.toISOString()
      : null;

    return { projects: responseProjects, hasMore, nextCursor };
  };

  searchProjectsByTitle = async (
    projectTitle: TProjectByTitle,
    limit = 10,
    cursor?: string,
  ): Promise<TProjectsSummaryWithCursorPaginationResponse> => {
    const filter: any = {
      title: { $regex: projectTitle.title, $options: 'i' },
    };

    return this.fetchPaginatedProjectsSummary({ filter, limit, cursor });
  };

  filterProjectsByTechStack = async (
    techStacks: TProjectByTechStack,
    limit: number = 10,
    cursor?: string,
  ): Promise<TProjectsSummaryWithCursorPaginationResponse> => {
    const filter: any = {
      'techStacks.tech': { $in: techStacks.techStacks },
    };

    return this.fetchPaginatedProjectsSummary({ filter, limit, cursor });
  };

  /**
   * Retrieves a user's profile using the provided profile URL,
   * then fetches all projects created by that user.
   */
  fetchUserProjectsByProfileUrls = async (
    profileUrl: TProjectsOfUser,
    limit: number = 15,
    cursor?: string,
  ): Promise<TProjectsSummaryWithCursorPaginationResponse> => {
    const profile = await this.profileServ.getUserProfileSummary(profileUrl.profileUrl);

    const filter: any = { createdBy: profile._id };

    return this.fetchPaginatedProjectsSummary({ filter, limit, cursor });
  };

  createProjectArrayFieldItem = async (
    addData: TAddProjectArrayItem,
    user: IRequestUser,
  ): Promise<TProjectResponse> => {
    const { fieldName, fieldData, projectId } = addData;

    const project = await this.repo.findByIdWithUser(projectId);

    if (!project) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Project not found');
    }

    if ((project.createdBy as any).user.toString() !== user._id.toString()) {
      throw new ApiError(HttpStatus.FORBIDDEN, 'You are not authorized to modify this project');
    }

    (project as any)[fieldName].unshift(fieldData);

    await this.repo.save(project);

    return ProjectMapper.toPublicProject(project);
  };

  updateProjectFieldItem = async (updateData: TUpdateProjectField, user: IRequestUser) => {
    const { fieldName, fieldData, projectId } = updateData;

    const project = await this.repo.findByIdWithUser(projectId);

    if (!project) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Project not found');
    }

    if ((project.createdBy as any).user.toString() !== user._id.toString()) {
      throw new ApiError(HttpStatus.FORBIDDEN, 'You are not authorized to modify this project');
    }

    // If-else for typescript warning: types have no overlaps
    if (fieldName === 'isFeatured') {
      project[fieldName] = fieldData;
    } else if (fieldName === 'visibility') {
      project[fieldName] = fieldData;
    } else {
      project[fieldName] = fieldData;
    }

    await this.repo.save(project);

    return ProjectMapper.toPublicProject(project);
  };

  deleteProjectArrayItem = async (deleteData: TDeleteProjectArrayItem, user: IRequestUser) => {
    const { fieldName, deleteObjectId, projectId } = deleteData;

    const project = await this.repo.findByIdWithUserOnly(projectId);

    if (!project) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Project not found');
    }

    if ((project.createdBy as any).user.toString() !== user._id.toString()) {
      throw new ApiError(HttpStatus.FORBIDDEN, 'You are not authorized to modify this project');
    }

    const updatedProject = await this.repo.findOneAndUpdate(
      { _id: projectId },
      { $pull: { [fieldName]: { _id: deleteObjectId } } },
      { new: true },
    );

    if (!updatedProject) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Project not found in findOneAndUpdate');
    }

    return ProjectMapper.toPublicProject(updatedProject);
  };
}