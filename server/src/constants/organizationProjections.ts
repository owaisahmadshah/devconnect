export const ORGANIZATION_FIELDS_PROJECTION = {
  SUMMARY: {
    _id: 1,
    name: 1,
    logo: 1,
    organizationURL: 1,
  },
  DETAIL: {
    _id: 1,
    name: 1,
    logo: 1,
    websiteURL: 1,
    description: 1,
    createdBy: 1,
    createdAt: 1,
    organizationURL: 1,
  },
} as const;
