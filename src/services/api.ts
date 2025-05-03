import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for authentication
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Match {
  id: number;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  venue: string;
  competition: string;
}

export interface Ticket {
  id: number;
  matchId: number;
  userId: number;
  quantity: number;
  category: string;
  purchaseDate: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

// Match API calls
export const matchApi = {
  getAll: () => api.get<Match[]>('/match'),
  getById: (id: number) => api.get<Match>(`/match/${id}`),
  create: (match: Omit<Match, 'id'>) => api.post<Match>('/match', match),
  update: (id: number, match: Match) => api.put(`/match/${id}`, match),
  delete: (id: number) => api.delete(`/match/${id}`),
};

// Ticket API calls
export const ticketApi = {
  getAll: () => api.get<Ticket[]>('/ticket'),
  getById: (id: number) => api.get<Ticket>(`/ticket/${id}`),
  create: (ticket: Omit<Ticket, 'id'>) => api.post<Ticket>('/ticket', ticket),
  update: (id: number, ticket: Ticket) => api.put(`/ticket/${id}`, ticket),
  delete: (id: number) => api.delete(`/ticket/${id}`),
};

// User API calls
export const userApi = {
  login: (email: string, password: string) => 
    api.post<{ token: string; user: User }>('/user/login', { email, password }),
  register: (userData: { username: string; email: string; password: string }) =>
    api.post<User>('/user/register', userData),
  getProfile: () => api.get<User>('/user/profile'),
};

export default api; 