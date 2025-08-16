// API configuration and utilities
const API_BASE_URL = '/api';

// Token management
export const getToken = (): string | null => {
  return localStorage.getItem('authToken');
};

export const setToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

export const removeToken = (): void => {
  localStorage.removeItem('authToken');
};

// API request utility
const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getToken();
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  
  const response = await fetch(url, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    if (response.status === 401) {
      removeToken();
      // Redirect to login or refresh token
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  
  return response.text() as unknown as T;
};

// Authentication API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await apiRequest<{
      user: any;
      accessToken: string;
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    setToken(response.accessToken);
    return response;
  },
  
  register: async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },
  
  getProfile: async () => {
    return apiRequest('/auth/profile');
  },
};

// Blocks API
export const blocksAPI = {
  getAll: async (params?: {
    status?: 'ongoing' | 'resolved';
    search?: string;
    tagIds?: string;
    page?: number;
    limit?: number;
  }) => {
    const queryString = params ? new URLSearchParams(params as Record<string, string>).toString() : '';
    return apiRequest<{
      data: any[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>(`/blocks${queryString ? `?${queryString}` : ''}`);
  },
  
  create: async (blockData: {
    title: string;
    reason: string;
    tagIds?: string[];
  }) => {
    return apiRequest('/blocks', {
      method: 'POST',
      body: JSON.stringify(blockData),
    });
  },
  
  update: async (id: string, blockData: any) => {
    return apiRequest(`/blocks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(blockData),
    });
  },
  
  resolve: async (id: string) => {
    return apiRequest(`/blocks/${id}/resolve`, {
      method: 'PATCH',
    });
  },
  
  delete: async (id: string) => {
    return apiRequest(`/blocks/${id}`, {
      method: 'DELETE',
    });
  },
};

// Tags API
export const tagsAPI = {
  getAll: async () => {
    return apiRequest<any[]>('/tags');
  },
  
  create: async (tagData: {
    name: string;
    description?: string;
    color?: string;
  }) => {
    return apiRequest('/tags', {
      method: 'POST',
      body: JSON.stringify(tagData),
    });
  },
  
  update: async (id: string, tagData: any) => {
    return apiRequest(`/tags/${id}`, {
      method: 'PUT',
      body: JSON.stringify(tagData),
    });
  },
  
  delete: async (id: string) => {
    return apiRequest(`/tags/${id}`, {
      method: 'DELETE',
    });
  },
};

// Analytics API
export const analyticsAPI = {
  getDashboard: async () => {
    return apiRequest('/analytics/dashboard');
  },
  
  getMonthly: async (year: number) => {
    return apiRequest(`/analytics/monthly?year=${year}`);
  },
  
  getDaily: async (year: number, month: number) => {
    return apiRequest(`/analytics/daily?year=${year}&month=${month}`);
  },
  
  exportData: async () => {
    return apiRequest('/analytics/export');
  },
};
