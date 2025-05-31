import api from '@/lib/axios';

export const getCurrentUser = async () => {
  const response = await api.get('/api/v1/profile');
  return response.data;
};
