// API configuration and utilities
const API_BASE_URL = '/api';

// API Error types
export interface ApiError {
  message: string;
  code?: string;
  statusCode?: number;
  details?: any;
}

export class ApiException extends Error {
  public statusCode: number;
  public code?: string;
  public details?: any;

  constructor(message: string, statusCode: number, code?: string, details?: any) {
    super(message);
    this.name = 'ApiException';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

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
  
  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });
    
    const contentType = response.headers.get('content-type');
    const hasJsonContent = contentType && contentType.includes('application/json');
    
    let responseData: any;
    if (hasJsonContent) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }
    
    if (!response.ok) {
      // Handle specific error responses
      let errorMessage = 'An error occurred';
      let errorCode: string | undefined;
      let errorDetails: any;
      
      if (hasJsonContent && responseData) {
        errorMessage = responseData.message || responseData.error || errorMessage;
        errorCode = responseData.code;
        errorDetails = responseData.details;
      } else if (typeof responseData === 'string') {
        errorMessage = responseData;
      }
      
      if (response.status === 401) {
        removeToken();
        // Don't redirect automatically, let components handle it
        throw new ApiException('Authentication required', response.status, 'UNAUTHORIZED');
      }
      
      throw new ApiException(errorMessage, response.status, errorCode, errorDetails);
    }
    
    return hasJsonContent ? responseData : responseData as T;
  } catch (error) {
    if (error instanceof ApiException) {
      throw error;
    }
    
    // Network or other errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new ApiException('Network error - please check your connection', 0, 'NETWORK_ERROR');
    }
    
    throw new ApiException('An unexpected error occurred', 0, 'UNKNOWN_ERROR', error);
  }
};

// Authentication API
export const authAPI = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await apiRequest<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    setToken(response.accessToken);
    return response;
  },
  
  register: async (userData: RegisterRequest): Promise<{ message: string; user?: User }> => {
    try {
      const response = await apiRequest<{ message: string; user?: User }>('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      
      return response;
    } catch (error) {
      if (error instanceof ApiException) {
        // Handle common registration errors
        if (error.statusCode === 409) {
          throw new ApiException('An account with this email already exists', error.statusCode, 'EMAIL_EXISTS');
        }
        if (error.statusCode === 400) {
          throw new ApiException(error.message || 'Invalid registration data provided', error.statusCode, 'VALIDATION_ERROR', error.details);
        }
      }
      throw error;
    }
  },
  
  getProfile: async (): Promise<User> => {
    return apiRequest<User>('/auth/profile');
  },

  refreshToken: async (): Promise<AuthResponse> => {
    const response = await apiRequest<AuthResponse>('/auth/refresh', {
      method: 'POST',
    });
    
    setToken(response.accessToken);
    return response;
  },

  logout: async (): Promise<void> => {
    try {
      await apiRequest('/auth/logout', {
        method: 'POST',
      });
    } finally {
      // Always remove token, even if the request fails
      removeToken();
    }
  },
};

// Blocks API (keeping existing functionality)
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
