export const JOB_FIELDS_PROJECTION = {
  SUMMARY: {
    _id: 1,
    title: 1,
    location: 1,
    createdAt: 1,
    organization: 1,
  },
  DETAIL: {
    _id: 1,
    title: 1,
    location: 1,
    createdAt: 1,
    organization: 1,
    description: 1,
    postedBy: 1,
    type: 1,
    status: 1,
  },
} as const;
