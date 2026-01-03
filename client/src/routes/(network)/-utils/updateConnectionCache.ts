export function updateConnectionInCache({
  oldData,
  connectionId,
  dataKey,
  updateData,
}: {
  oldData: any;
  connectionId: string;
  dataKey: 'profiles' | 'connections';
  updateData: any;
}) {
  if (!oldData) return;

  return {
    ...oldData,
    pages: oldData.pages.map(page => ({
      ...page,
      [dataKey]: page[dataKey].map(item => {
        if (item.connection?._id === connectionId) {
          return { ...item, connection: updateData };
        }
        return item;
      }),
    })),
  };
}
