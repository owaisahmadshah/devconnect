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
import { Project } from '../models/project.model.js';
import { ProjectMapper } from '../mapper/project.mapper.js';
import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError.js';
import logger from '../utils/logger.js';
import { uploadMultipleImages } from '../utils/uploadImages.js';
import { ProfileService } from './profile.service.js';

export class ProjectService {
  static async createProject(projectData: TCreateProjectBackend): Promise<TProjectResponse> {
    let paths: string[] = [];
    projectData.media.forEach(path => paths.push(path.path));

    // Uploading images to cloudinary
    const { urls, success } = await uploadMultipleImages(paths);

    if (!success) {
      throw new ApiError(401, 'Error uploading project images');
    }

    let uploadedMedia: { url: string; mediaType: string }[] = [];

    urls.forEach(url => {
      uploadedMedia.push({
        url,
        mediaType: 'image',
      });
    });

    const project = await Project.create({ ...projectData, media: uploadedMedia });

    const responseProject = ProjectMapper.toPublicProject(project);

    return responseProject;
  }

  static async deleteProject(deleteProject: TDeleteProject, user: IRequestUser) {
    // TODO Update validation
    // ------Start validation
    const project = await Project.findById(deleteProject._id).populate({
      path: 'createdBy',
      select: 'user', // Get user for update validation
    });

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
      await Project.deleteOne({ _id: deleteProject._id, createdBy: user._id }, { session });
      // TODO: Delete all the documents from all the collections related to this particular document

      // Explicitly commit the transaction
      await session.commitTransaction();
    } catch (error) {
      // Abort the transaction on error
      await session.abortTransaction();

      if (error instanceof ApiError) {
        throw error;
      } else {
        logger.error('Error in user creation transaction:', error);
        throw new ApiError(
          HttpStatus.INTERNAL_SERVER_ERROR,
          'Faild to create user. Please try again',
        );
      }
    } finally {
      session.endSession();
    }
  }

  static async fetchProjectById(projectId: TProjectById): Promise<TProjectResponse> {
    const project = await Project.findById(projectId.projectId).populate({
      path: 'createdBy',
      select: '_id username email firstName lastName role profilePictureUrl bio isVerified',
    });

    if (!project) {
      throw new ApiError(404, 'Project not found');
    }

    const responseProject = ProjectMapper.toPublicProject(project);

    return responseProject;
  }

  static async fetchPaginatedProjectsSummary({
    filter,
    limit = 10,
    cursor,
  }: {
    filter: any;
    limit: number;
    cursor?: string;
  }): Promise<TProjectsSummaryWithCursorPaginationResponse> {
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

    const projects = await Project.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate({
        path: 'createdBy',
        select:
          '_id username email firstName lastName role profilePictureUrl bio isVerified profileUrls',
      })
      .select('_id title description createdBy tags techStacks creationDate createdAt');

    const responseProjects = projects.map(project => ProjectMapper.toProjectSummary(project));

    const hasMore = responseProjects.length === limit;
    const lastProject = responseProjects.at(-1); // same as array[array.length - 1]
    const nextCursor: string | null = lastProject?.createdAt
      ? lastProject.createdAt.toISOString()
      : null;

    return { projects: responseProjects, hasMore, nextCursor };
  }

  static async searchProjectsByTitle(
    projectTitle: TProjectByTitle,
    limit = 10,
    cursor?: string,
  ): Promise<TProjectsSummaryWithCursorPaginationResponse> {
    const filter: any = {
      title: { $regex: projectTitle.title, $options: 'i' },
    };

    return this.fetchPaginatedProjectsSummary({ filter, limit, cursor });
  }

  static async filterProjectsByTechStack(
    techStacks: TProjectByTechStack,
    limit: number = 10,
    cursor?: string,
  ): Promise<TProjectsSummaryWithCursorPaginationResponse> {
    const filter: any = {
      'techStacks.tech': { $in: techStacks.techStacks },
    };

    return this.fetchPaginatedProjectsSummary({ filter, limit, cursor });
  }

  /**
   * Retrieves a user's profile using the provided profile URL,
   * then fetches all projects created by that user.
   */
  static async fetchUserProjectsByProfileUrls(
    profileUrl: TProjectsOfUser,
    limit: number = 15,
    cursor?: string,
  ): Promise<TProjectsSummaryWithCursorPaginationResponse> {
    const profile = await ProfileService.getUserProfileSummary(profileUrl.profileUrl);

    const filter: any = { createdBy: profile._id };

    return this.fetchPaginatedProjectsSummary({ filter, limit, cursor });
  }

  static async createProjectArrayFieldItem(
    addData: TAddProjectArrayItem,
    user: IRequestUser,
  ): Promise<TProjectResponse> {
    const { fieldName, fieldData, projectId } = addData;

    const project = await Project.findById(projectId).populate({
      path: 'createdBy',
      select: '_id username email firstName lastName role profilePictureUrl bio isVerified user', // Get user too for update validation
    });

    if (!project) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Project not found');
    }

    if ((project.createdBy as any).user.toString() !== user._id.toString()) {
      throw new ApiError(HttpStatus.FORBIDDEN, 'You are not authorized to modify this project');
    }

    (project as any)[fieldName].unshift(fieldData);

    await project.save();

    return ProjectMapper.toPublicProject(project);
  }

  static async updateProjectFieldItem(updateData: TUpdateProjectField, user: IRequestUser) {
    const { fieldName, fieldData, projectId } = updateData;

    const project = await Project.findById(projectId).populate({
      path: 'createdBy',
      select: '_id username email firstName lastName role profilePictureUrl bio isVerified user', // Get user too for update validation
    });

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

    await project.save();

    return ProjectMapper.toPublicProject(project);
  }

  static async deleteProjectArrayItem(deleteData: TDeleteProjectArrayItem, user: IRequestUser) {
    const { fieldName, deleteObjectId, projectId } = deleteData;

    const project = await Project.findById(projectId).populate({
      path: 'createdBy',
      select: 'user', // Get user for update validation
    });

    if (!project) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Project not found');
    }

    if ((project.createdBy as any).user.toString() !== user._id.toString()) {
      throw new ApiError(HttpStatus.FORBIDDEN, 'You are not authorized to modify this project');
    }

    const updatedProject = await Project.findOneAndUpdate(
      {
        _id: projectId,
      },
      { $pull: { [fieldName]: { _id: deleteObjectId } } },
      { new: true },
    ).populate({
      path: 'createdBy',
      select: '_id username email firstName lastName role profilePictureUrl bio isVerified',
    });

    if (!updatedProject) {
      throw new ApiError(HttpStatus.NOT_FOUND, 'Project not found in findOneAndUpdate');
    }

    return ProjectMapper.toPublicProject(updatedProject);
  }
}
