import { apiClient } from './client';
import type { Task, CreateTaskDto, UpdateTaskDto } from '../types';

export const taskApi = {
  getAll: async () => {
    const response = await apiClient.get<Task[]>('/tasks/');
    return response.data;
  },

  create: async (data: CreateTaskDto) => {
    const response = await apiClient.post<Task>('/tasks/', data);
    return response.data;
  },

  update: async (id: number, data: UpdateTaskDto) => {
    const response = await apiClient.put<Task>(`/tasks/${id}`, data);
    return response.data;
  },

  delete: async (id: number) => {
    await apiClient.delete(`/tasks/${id}`);
  },
};
