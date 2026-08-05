import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // For cookies
});

// Interceptor to handle token refresh can be added here

export const getClients = async (params: any) => {
  const { data } = await api.get('/crm/clients', { params });
  return data.data;
};

export const updateClientStage = async (id: string, stage: string) => {
  const { data } = await api.patch(`/crm/clients/${id}/stage`, { stage });
  return data.data;
};

export const getClientDetails = async (id: string) => {
  const { data } = await api.get(`/crm/clients/${id}`);
  return data.data;
};
