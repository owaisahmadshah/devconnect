import api from '@/lib/axios';

export const getCurrentUser = async () => {
  const response = await api.get('/api/v1/users/profile');
  return response.data;
};
