export const NOTIFICATION_FIELDS_PROJECTION = {
  SUMMARY: {
    _id: 1,
    actor: 1,
    recipient: 1,
    type: 1,
    isRead: 1,
    message: 1,
    redirectURL: 1,
    createdAt: 1,
  },
} as const;
