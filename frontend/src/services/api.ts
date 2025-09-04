import type { 
  User, 
  Quiz, 
  LoginCredentials, 
  RegisterCredentials, 
  CreateQuizData,
  QuizSession,
  QuizResult,
  UserInfoResponse,
  CreateQuizResponse,
  QuizLobby,
  LobbyJoinResponse,
  LobbyStartResponse
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiError extends Error {
  status: number;
  
  constructor(status: number, message: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Network error' }));
    throw new ApiError(response.status, errorData.message || 'Request failed');
  }
  return response.json();
};

const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = localStorage.getItem('auth_token');
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  return handleResponse<T>(response);
};

// Authentication API calls
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<{ user: User; user_id: string }> => {
    return apiRequest('/auth', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  register: async (credentials: RegisterCredentials): Promise<{ user: User; token: string }> => {
    return apiRequest('/user', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  logout: async (): Promise<void> => {
    return apiRequest('/auth/logout', {
      method: 'POST',
    });
  },

  getCurrentUser: async (): Promise<User> => {
    return apiRequest('/auth/me');
  },

  refreshToken: async (): Promise<{ token: string }> => {
    return apiRequest('/auth/refresh', {
      method: 'POST',
    });
  },
};

//todo: definire il tipo di ritorno
export const userApi = {
  getUserById: async (id: string): Promise<UserInfoResponse> => {
    return apiRequest(`/user/${id}`);
  },
};

// Quiz API calls
export const quizApi = {
  getQuizzes: async (params?: {
    category?: string;
    difficulty?: string;
    page?: number;
    limit?: number;
  }): Promise<{ quizzes: Quiz[]; total: number; page: number }> => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.append('category', params.category);
    if (params?.difficulty) searchParams.append('difficulty', params.difficulty);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    const query = searchParams.toString();
    return apiRequest(`/quizzes${query ? `?${query}` : ''}`);
  },

  getQuizById: async (id: string): Promise<Quiz> => {
    return apiRequest(`/quizzes/${id}`);
  },

  createQuiz: async (quizData: CreateQuizData): Promise<CreateQuizResponse> => {
    return apiRequest('/quiz', {
      method: 'POST',
      body: JSON.stringify(quizData),
    });
  },

  updateQuiz: async (id: string, quizData: Partial<CreateQuizData>): Promise<Quiz> => {
    return apiRequest(`/quizzes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(quizData),
    });
  },

  deleteQuiz: async (id: string): Promise<void> => {
    return apiRequest(`/quizzes/${id}`, {
      method: 'DELETE',
    });
  },

  getFeaturedQuizzes: async (): Promise<Quiz[]> => {
    return apiRequest('/quizzes/featured');
  },

  getQuizzesByCategory: async (category: string): Promise<Quiz[]> => {
    return apiRequest(`/quizzes/category/${category}`);
  },

  getMyQuizzes: async (): Promise<Quiz[]> => {
    return apiRequest('/quizzes/my');
  },

  getQuizzesByUser: async (userId: number): Promise<{ quizzes: Quiz[]; message: string }> => {
    return apiRequest(`/user/${userId}/quizzes`);
  },
};

// Game session API calls
export const gameApi = {
  startQuiz: async (quizId: string): Promise<QuizSession> => {
    return apiRequest('/game/start', {
      method: 'POST',
      body: JSON.stringify({ quizId }),
    });
  },

  submitAnswer: async (
    sessionId: string,
    questionId: string,
    answerId: string
  ): Promise<{ correct: boolean; correctAnswerId: string }> => {
    return apiRequest('/game/answer', {
      method: 'POST',
      body: JSON.stringify({ sessionId, questionId, answerId }),
    });
  },

  getQuizSession: async (sessionId: string): Promise<QuizSession> => {
    return apiRequest(`/game/session/${sessionId}`);
  },

  finishQuiz: async (sessionId: string): Promise<QuizResult> => {
    return apiRequest('/game/finish', {
      method: 'POST',
      body: JSON.stringify({ sessionId }),
    });
  },

  getQuizResults: async (sessionId: string): Promise<QuizResult> => {
    return apiRequest(`/game/results/${sessionId}`);
  },
};

// User statistics API calls
export const statsApi = {
  getUserStats: async (): Promise<{
    totalQuizzesPlayed: number;
    averageScore: number;
    bestScore: number;
    favoriteCategory: string;
    totalTimeSpent: number;
  }> => {
    return apiRequest('/stats/user');
  },

  getQuizHistory: async (params?: {
    page?: number;
    limit?: number;
  }): Promise<{ results: QuizResult[]; total: number; page: number }> => {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());

    const query = searchParams.toString();
    return apiRequest(`/stats/history${query ? `?${query}` : ''}`);
  },

  getLeaderboard: async (category?: string): Promise<{
    users: Array<{
      userId: string;
      username: string;
      score: number;
      rank: number;
    }>;
  }> => {
    const query = category ? `?category=${category}` : '';
    return apiRequest(`/stats/leaderboard${query}`);
  },
};

// Categories API calls
export const categoryApi = {
  getCategories: async (): Promise<string[]> => {
    return apiRequest('/categories');
  },

  getCategoryStats: async (category: string): Promise<{
    totalQuizzes: number;
    averageDifficulty: number;
    popularQuizzes: Quiz[];
  }> => {
    return apiRequest(`/categories/${category}/stats`);
  },
};

// Upload API calls (for images, etc.)
export const uploadApi = {
  uploadImage: async (file: File): Promise<{ url: string }> => {
    const formData = new FormData();
    formData.append('image', file);

    return apiRequest('/upload/image', {
      method: 'POST',
      body: formData,
      headers: {}, // Let browser set Content-Type for FormData
    });
  },
};

// Export the ApiError class for use in components
export { ApiError };

// Helper function to handle API errors in components
export const handleApiError = (error: unknown): string => {
  if (error instanceof ApiError) {
    switch (error.status) {
      case 401:
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
        return 'Session expired. Please log in again.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 422:
        return 'Invalid input data. Please check your entries.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return error.message || 'An unexpected error occurred.';
    }
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred.';
};

// Quiz Lobby API calls
export const lobbyApi = {
  getLobby: async (quizId: string): Promise<QuizLobby> => {
    return apiRequest(`/quiz/${quizId}/lobby`);
  },

  joinLobby: async (quizId: string, userId: number): Promise<LobbyJoinResponse> => {
    return apiRequest(`/quiz/${quizId}/lobby/join`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  },

  startQuiz: async (quizId: string, userId: number): Promise<LobbyStartResponse> => {
    return apiRequest(`/quiz/${quizId}/lobby/start`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  },
};

export const tokenManager = {
  setToken: (token: string): void => {
    localStorage.setItem('auth_token', token);
  },

  getToken: (): string | null => {
    return localStorage.getItem('auth_token');
  },

  removeToken: (): void => {
    localStorage.removeItem('auth_token');
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('auth_token');
  },
};