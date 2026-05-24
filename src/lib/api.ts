import { ApiResponse } from '../types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const config: RequestInit = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    const result: ApiResponse<T> = await response.json();

    if (!response.ok || !result.success) {
      const errorMsg = result.message || `Request failed with status ${response.status}`;
      const err = new Error(errorMsg) as any;
      err.errors = result.errors;
      err.status = response.status;
      throw err;
    }

    return result.data;
  } catch (error: any) {
    console.error(`API Error on ${endpoint}:`, error);
    throw error;
  }
}

export const api = {
  // Auth
  getMe: () => request<any>('/users/me'),
  getUsers: () => request<any[]>('/users'),

  // Organizations
  getOrganizations: () => request<any[]>('/organizations'),
  getOrganizationDetails: (id: string) => request<any>(`/organizations/${id}`),
  createOrganization: (name: string) =>
    request<any>('/organizations', {
      method: 'POST',
      body: JSON.stringify({ name }),
    }),
  inviteMember: (orgId: string, email: string, role: string) =>
    request<any>(`/organizations/${orgId}/invite`, {
      method: 'POST',
      body: JSON.stringify({ email, role }),
    }),

  // Projects
  getProjects: (orgId: string) => request<any[]>(`/projects?organizationId=${orgId}`),
  getProjectDetails: (id: string) => request<any>(`/projects/${id}`),
  createProject: (data: { name: string; description?: string; organizationId: string }) =>
    request<any>('/projects', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateProject: (id: string, data: { name?: string; description?: string }) =>
    request<any>(`/projects/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  deleteProject: (id: string) =>
    request<{ id: string }>(`/projects/${id}`, {
      method: 'DELETE',
    }),

  // Tasks
  getTasks: (params: {
    projectId?: string;
    organizationId?: string;
    status?: string;
    priority?: string;
    assigneeId?: string;
  }) => {
    const query = new URLSearchParams();
    if (params.projectId) query.append('projectId', params.projectId);
    if (params.organizationId) query.append('organizationId', params.organizationId);
    if (params.status) query.append('status', params.status);
    if (params.priority) query.append('priority', params.priority);
    if (params.assigneeId) query.append('assigneeId', params.assigneeId);

    const queryString = query.toString();
    return request<any[]>(`/tasks?${queryString}`);
  },
  getTaskDetails: (id: string) => request<any>(`/tasks/${id}`),
  createTask: (data: {
    title: string;
    description?: string;
    status?: string;
    priority?: string;
    projectId: string;
    assigneeId?: string;
  }) =>
    request<any>('/tasks', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateTask: (
    id: string,
    data: {
      title?: string;
      description?: string;
      status?: string;
      priority?: string;
      assigneeId?: string | null;
    }
  ) =>
    request<any>(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  deleteTask: (id: string) =>
    request<{ id: string }>(`/tasks/${id}`, {
      method: 'DELETE',
    }),
  addTaskComment: (taskId: string, content: string) =>
    request<any>(`/tasks/${taskId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    }),

  // Activity Logs
  getActivityLogs: (limit = 15) => request<any[]>(`/activity-logs?limit=${limit}`),
};
