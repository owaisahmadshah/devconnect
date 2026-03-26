import mongoose, { Document } from 'mongoose';

import { Profile } from '../models/profile.model.js';
import type { TAddProfileArrayField } from 'shared';

export class ProfileRepository {
  findSummaryByProfileId(profileId: string) {
    return Profile.findById(profileId).select(
      '_id firstName lastName profilePictureUrl profileUrls isVerified',
    );
  }

  findByUserIdOrProfileUrl(queryText: string) {
    const conditions: any[] = [];

    if (mongoose.Types.ObjectId.isValid(queryText)) {
      conditions.push({ user: queryText });
    }

    conditions.push({ 'profileUrls.url': queryText });

    return Profile.findOne({
      $or: conditions,
    })
      .populate({
        path: 'user',
        select: 'username email role',
      })
      .select('_id user firstName lastName profilePictureUrl bio isVerified profileUrls');
  }

  findByProfileUrl(profileUrl: string) {
    return Profile.findOne({ 'profileUrls.url': profileUrl }).populate({
      path: 'user',
      select: 'username email role',
    });
  }

  findByUserId(userId: string) {
    return Profile.findOne({ user: userId }).populate({
      path: 'user',
      select: 'username email role',
    });
  }

  /**
   * viewerProfileId  - Profile ID of the user who is viewing/searching the profile
   * subjectProfileId - Profile ID of the profile being viewed
   */
  findProfileByIdWithConnection({
    viewerProfileId,
    subjectProfileId,
  }: {
    viewerProfileId: string;
    subjectProfileId: string;
  }) {
    const viewerProfileObjectId = new mongoose.Types.ObjectId(viewerProfileId);
    const subjectProfileObjectId = new mongoose.Types.ObjectId(subjectProfileId);

    return Profile.aggregate([
      {
        $match: {
          _id: subjectProfileObjectId,
        },
      },
      {
        $lookup: {
          from: 'users',
          let: {
            userId: '$user',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$userId'],
                },
              },
            },
            {
              $project: {
                username: 1,
                email: 1,
                role: 1,
              },
            },
          ],
          as: 'user',
        },
      },
      {
        $lookup: {
          from: 'connections',
          let: {
            profileId: '$_id',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $or: [
                        {
                          $eq: ['$sender', '$$profileId'],
                        },
                        {
                          $eq: ['$receiver', '$$profileId'],
                        },
                      ],
                    },
                    {
                      $eq: ['$state', 'accepted'],
                    },
                  ],
                },
              },
            },
          ],
          as: 'connections',
        },
      },
      {
        $lookup: {
          from: 'connections',
          let: {
            profileId: '$_id',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    {
                      $and: [
                        {
                          $eq: ['$sender', viewerProfileObjectId],
                        },
                        {
                          $eq: ['$receiver', '$$profileId'],
                        },
                        {
                          $ne: ['$state', 'rejected'],
                        },
                      ],
                    },
                    {
                      $and: [
                        {
                          $eq: ['$sender', '$$profileId'],
                        },
                        {
                          $eq: ['$receiver', viewerProfileObjectId],
                        },
                        {
                          $ne: ['$state', 'rejected'],
                        },
                      ],
                    },
                  ],
                },
              },
            },
          ],
          as: 'connection',
        },
      },
      {
        $addFields: {
          connections: {
            $size: '$connections',
          },
          connection: {
            $ifNull: [{ $arrayElemAt: ['$connection', 0] }, {}],
          },
          user: {
            $arrayElemAt: ['$user', 0],
          },
        },
      },
    ]);
  }

  updateField(userId: string, fieldName: string, fieldData: any) {
    return Profile.findOneAndUpdate(
      { user: userId },
      { [fieldName]: fieldData },
      { new: true, runValidators: true },
    ).populate({
      path: 'user',
      select: 'username email role',
    });
  }

  addArrayItem(userId: string, updateData: TAddProfileArrayField) {
    return Profile.findOneAndUpdate(
      { user: userId },
      { $push: { [updateData.fieldName]: { $each: [updateData.fieldData], $position: 0 } } },
      {
        new: true,
        runValidators: true,
      },
    );
  }

  removeArrayItem(userId: string, fieldName: string, deleteObjectId: string) {
    return Profile.findOneAndUpdate(
      { user: userId },
      { $pull: { [fieldName]: { _id: deleteObjectId } } },
      { new: true },
    );
  }

  save(doc: Document) {
    return doc.save();
  }

  searchProfiles(input: string, matchStage: any, limit: number) {
    return Profile.aggregate([
      {
        $search: {
          index: 'name_autocomplete',
          compound: {
            should: [
              {
                autocomplete: {
                  query: input,
                  path: 'firstName',
                  fuzzy: { maxEdits: 1, prefixLength: 1 },
                },
              },
              {
                autocomplete: {
                  query: input,
                  path: 'lastName',
                  fuzzy: { maxEdits: 1, prefixLength: 1 },
                },
              },
            ],
          },
        },
      },
      { $sort: { _id: -1 } }, // Ensure descending order for pagination
      ...(matchStage ? [matchStage] : []),
      { $limit: limit + 1 }, // Fetch one extra to determine if there's a next page
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user',
        },
      },
      { $unwind: '$user' },
      {
        $project: {
          _id: 1,
          firstName: 1,
          lastName: 1,
          profilePictureUrl: 1,
          bio: 1,
          role: 1,
          username: 1,
          isVerified: 1,
          email: 1,
          profileUrls: 1,
          user: 1,
          score: { $meta: 'searchScore' },
        },
      },
    ]);
  }

  recommendPaginatedProfiles({
    profileId,
    limit,
    cursor,
  }: {
    profileId: string;
    limit: number;
    cursor: null | string;
  }) {
    const profileObjectId = new mongoose.Types.ObjectId(profileId);

    const filter: any = {
      _id: {
        $ne: profileObjectId,
      },
    };

    if (cursor) {
      filter.createdAt = { $lt: new Date(cursor) };
    }

    return Profile.aggregate([
      {
        $match: filter,
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $limit: limit,
      },
      {
        $lookup: {
          from: 'users',
          let: {
            userId: '$user',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$_id', '$$userId'],
                },
              },
            },
            {
              $project: {
                username: 1,
                email: 1,
                role: 1,
              },
            },
          ],
          as: 'user',
        },
      },
      {
        $lookup: {
          from: 'connections',
          let: {
            profileId: '$_id',
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    {
                      $or: [
                        {
                          $and: [
                            { $eq: ['$sender', profileObjectId] },
                            { $eq: ['$receiver', '$$profileId'] },
                          ],
                        },
                        {
                          $and: [
                            { $eq: ['$sender', '$$profileId'] },
                            { $eq: ['$receiver', profileObjectId] },
                          ],
                        },
                      ],
                    },
                    {
                      $or: [
                        {
                          $eq: ['$state', 'pending'],
                        },
                        {
                          $eq: ['$state', 'accepted'],
                        },
                      ],
                    },
                  ],
                },
              },
            },
            { $limit: 1 },
            {
              $project: {
                _id: 1,
                state: 1,
                sender: 1,
                receiver: 1,
              },
            },
          ],
          as: 'connection',
        },
      },
      {
        $match: {
          $or: [
            {
              connection: { $size: 0 },
            },
            {
              'connection.0.state': 'pending',
            },
          ],
        },
      },
      {
        $addFields: {
          connection: {
            $ifNull: [{ $arrayElemAt: ['$connection', 0] }, {}],
          },
          user: {
            $arrayElemAt: ['$user', 0],
          },
        },
      },
      {
        $project: {
          _id: 1,
          user: 1,
          firstName: 1,
          lastName: 1,
          profilePictureUrl: 1,
          bio: 1,
          role: 1,
          username: 1,
          isVerified: 1,
          email: 1,
          profileUrls: 1,
          connection: 1,
          createdAt: 1,
        },
      },
    ]);
  }
}
