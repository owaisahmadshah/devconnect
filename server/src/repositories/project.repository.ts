import mongoose from 'mongoose';
import { Project } from '../models/project.model.js';

export class ProjectRepository {
  create(projectData: any) {
    return Project.create(projectData);
  }

  findById(projectId: string) {
    return Project.findById(projectId).populate({
      path: 'createdBy',
      select: '_id username email firstName lastName role profilePictureUrl bio isVerified',
    });
  }

  findByIdWithUser(projectId: string) {
    return Project.findById(projectId).populate({
      path: 'createdBy',
      select: '_id username email firstName lastName role profilePictureUrl bio isVerified user',
    });
  }

  findByIdWithUserOnly(projectId: string) {
    return Project.findById(projectId).populate({
      path: 'createdBy',
      select: 'user',
    });
  }

  deleteOne(filter: any, session?: mongoose.ClientSession) {
    if (session) {
      return Project.deleteOne(filter, { session });
    }
    return Project.deleteOne(filter);
  }

  findPaginated(filter: any, limit: number) {
    return Project.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate({
        path: 'createdBy',
        select:
          '_id username email firstName lastName role profilePictureUrl bio isVerified profileUrls',
      })
      .select('_id title description createdBy tags techStacks creationDate createdAt');
  }

  findOneAndUpdate(filter: any, update: any, options?: any) {
    return Project.findOneAndUpdate(filter, update, options).populate({
      path: 'createdBy',
      select: '_id username email firstName lastName role profilePictureUrl bio isVerified',
    });
  }

  save(doc: any) {
    return doc.save();
  }
}