import axios from 'axios';

export const getUsers = async () => {
  const response = await axios.get('/api/users');
  return response.data;
};

export const registerUser = async (userData: any) => {
  const response = await axios.post('/api/users', userData);
  return response.data;
};

export const updateUser = async (userId: string, userData: any) => {
  const response = await axios.put(`/api/users/${userId}`, userData);
  return response.data;
};

export const deleteUser = async (userId: string) => {
  const response = await axios.delete(`/api/users/${userId}`);
  return response.data;
};
