import { PROFILE_FIELDS_PROJECTION } from '../constants/profileProjections.js';

export const profileSummaryLookupPipeline = ({
  localField = 'createdBy',
  asField = 'createdBy',
  projectionFields = PROFILE_FIELDS_PROJECTION.SUMMARY,
}: {
  localField: string;
  asField: string;
  projectionFields?: Record<string, 1 | 0>;
}) => ({
  $lookup: {
    from: 'profiles',
    let: {
      creatorId: `$${localField}`,
    },
    pipeline: [
      {
        $match: {
          $expr: {
            $eq: ['$_id', '$$creatorId'],
          },
        },
      },
      {
        $project: projectionFields,
      },
    ],
    as: asField,
  },
});

export const unwindField = ({ asField = 'createdBy' }: { asField: string }) => ({
  $unwind: {
    path: `$${asField}`,
    preserveNullAndEmptyArrays: true,
  },
});

export const paginateCursorPipeline = ({
  // cursor,
  limit,
  sortField = 'createdAt',
  sortOrder = -1,
}: {
  // cursor: string | null;
  limit: number;
  sortField?: string;
  sortOrder?: 1 | -1;
}) => {
  const pipeline: any[] = [];

  // if (cursor) {
  //   pipeline.push({
  //     $match: {
  //       [sortField]: sortOrder === -1 ? { $lt: new Date(cursor) } : { $gt: new Date(cursor) },
  //     },
  //   });
  // }

  pipeline.push({
    $sort: { [sortField]: sortOrder },
  });

  pipeline.push({
    $limit: limit,
  });

  return pipeline;
};

export const projectStage = (fields: Record<string, 1 | 0>) => ({
  $project: fields,
});

export const lookupPipeline = ({
  localField,
  foreignField,
  from,
  as,
}: {
  localField: string;
  foreignField: string;
  from: string;
  as: string;
}) => ({
  $lookup: {
    from,
    localField,
    foreignField,
    as,
  },
});
