import { apiClient } from './apiClient';

export const getClients = async (params: any) => {
  const { data } = await apiClient.get('/crm/clients', { params });
  return data.data;
};

export const updateClientStage = async (id: string, stage: string) => {
  const { data } = await apiClient.patch(`/crm/clients/${id}/stage`, { stage });
  return data.data;
};

export const getClientDetails = async (id: string) => {
  const { data } = await apiClient.get(`/crm/clients/${id}`);
  return data.data;
};
