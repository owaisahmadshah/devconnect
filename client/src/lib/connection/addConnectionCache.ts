export function addConnectionInCache({
  oldData,
  receiverId,
  dataKey,
  updateData,
}: {
  oldData: any;
  receiverId: string;
  dataKey: 'profiles' | 'connections';
  updateData: any;
}) {
  if (!oldData) return;

  return {
    ...oldData,
    pages: oldData.pages.map((page: any) => ({
      ...page,
      [dataKey]: page[dataKey].map((item: any) => {
        if (item._id === receiverId) {
          return { ...item, connection: updateData };
        }
        return item;
      }),
    })),
  };
}
