import axios, { AxiosError } from 'axios';
import type {
  AuthTokens,
  CaseStatus,
  Department,
  InvestigationNote,
  MissingPerson,
  Notification,
  Paginated,
  PoliceStation,
  SightingReport,
  SystemLog,
  TimelineEvent,
  User,
  UserRole,
} from '@/types';

export const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('mpin:token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; errors?: string[] }>) => {
    let message = 'An error occurred. Please try again.';
    if (error.response?.data) {
      if (error.response.data.message) {
        message = error.response.data.message;
      } else if (error.response.data.errors && error.response.data.errors.length > 0) {
        message = error.response.data.errors[0];
      }
    } else if (error.message) {
      message = error.message;
    }

    if (error.response?.status === 401 && !error.config?.url?.includes('/auth/login')) {
      localStorage.removeItem('mpin:token');
      localStorage.removeItem('mpin:user');
    }

    return Promise.reject(new Error(message));
  },
);

export const authApi = {
  async login(email: string, password: string): Promise<{ user: User; tokens: AuthTokens }> {
    const { data } = await api.post<{ user: User; tokens: AuthTokens }>('/auth/login', { email, password });
    if (data.tokens?.accessToken) {
      localStorage.setItem('mpin:token', data.tokens.accessToken);
      localStorage.setItem('mpin:user', JSON.stringify(data.user));
    }
    return data;
  },

  async register(input: {
    fullName: string;
    email: string;
    password: string;
    role: UserRole;
    phone?: string;
    departmentId?: string;
    stationId?: string;
  }): Promise<{ user: User; tokens: AuthTokens }> {
    const { data } = await api.post<{ user: User; tokens: AuthTokens }>('/auth/register', input);
    if (data.tokens?.accessToken) {
      localStorage.setItem('mpin:token', data.tokens.accessToken);
      localStorage.setItem('mpin:user', JSON.stringify(data.user));
    }
    return data;
  },

  async me(): Promise<User | null> {
    const token = localStorage.getItem('mpin:token');
    if (!token) return null;
    try {
      const { data } = await api.get<User>('/users/me');
      localStorage.setItem('mpin:user', JSON.stringify(data));
      return data;
    } catch {
      localStorage.removeItem('mpin:token');
      localStorage.removeItem('mpin:user');
      return null;
    }
  },

  async logout(): Promise<void> {
    localStorage.removeItem('mpin:token');
    localStorage.removeItem('mpin:user');
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    const { data } = await api.post<{ message: string }>('/auth/forgot-password', { email });
    return data;
  },

  async changePassword(current: string, next: string): Promise<{ message: string }> {
    const { data } = await api.post<{ message: string }>('/auth/change-password', {
      currentPassword: current,
      newPassword: next,
    });
    return data;
  },
};

export const usersApi = {
  async list(params?: { role?: UserRole; page?: number; size?: number }): Promise<Paginated<User>> {
    const { data } = await api.get<Paginated<User>>('/users', {
      params: {
        role: params?.role,
        page: params?.page ?? 0,
        size: params?.size ?? 50,
      },
    });
    return data;
  },

  async toggleActive(id: string): Promise<User> {
    const { data } = await api.patch<User>(`/users/${id}/toggle-active`);
    return data;
  },

  async updateRole(id: string, role: UserRole): Promise<User> {
    const { data } = await api.patch<User>(`/users/${id}/role`, { role });
    return data;
  },

  async remove(id: string): Promise<{ message: string }> {
    const { data } = await api.delete<{ message: string }>(`/users/${id}`);
    return data;
  },
};

export const departmentsApi = {
  async list(): Promise<Department[]> {
    const { data } = await api.get<Department[]>('/departments');
    return data;
  },

  async create(input: Omit<Department, 'id' | 'createdAt'>): Promise<Department> {
    const { data } = await api.post<Department>('/departments', input);
    return data;
  },

  async remove(id: string): Promise<{ message: string }> {
    const { data } = await api.delete<{ message: string }>(`/departments/${id}`);
    return data;
  },
};

export const stationsApi = {
  async list(): Promise<PoliceStation[]> {
    const { data } = await api.get<PoliceStation[]>('/stations');
    return data;
  },

  async get(id: string): Promise<PoliceStation> {
    const { data } = await api.get<PoliceStation>(`/stations/${id}`);
    return data;
  },

  async create(input: Omit<PoliceStation, 'id' | 'createdAt'>): Promise<PoliceStation> {
    const { data } = await api.post<PoliceStation>('/stations', input);
    return data;
  },

  async remove(id: string): Promise<{ message: string }> {
    const { data } = await api.delete<{ message: string }>(`/stations/${id}`);
    return data;
  },
};

export interface MissingPersonQuery {
  search?: string;
  gender?: string;
  state?: string;
  district?: string;
  city?: string;
  status?: CaseStatus | '';
  minAge?: number;
  maxAge?: number;
  from?: string;
  to?: string;
  stationId?: string;
  page?: number;
  size?: number;
}

export const missingPersonsApi = {
  async list(q: MissingPersonQuery = {}): Promise<Paginated<MissingPerson>> {
    const token = localStorage.getItem('mpin:token');
    const endpoint = token ? '/cases' : '/public/cases';
    const { data } = await api.get<Paginated<MissingPerson>>(endpoint, {
      params: {
        search: q.search || undefined,
        gender: q.gender || undefined,
        state: q.state || undefined,
        district: q.district || undefined,
        city: q.city || undefined,
        status: q.status || undefined,
        minAge: q.minAge != null ? q.minAge : undefined,
        maxAge: q.maxAge != null ? q.maxAge : undefined,
        from: q.from || undefined,
        to: q.to || undefined,
        stationId: q.stationId || undefined,
        page: q.page ?? 0,
        size: q.size ?? 12,
      },
    });
    return data;
  },

  async get(id: string): Promise<MissingPerson> {
    const token = localStorage.getItem('mpin:token');
    const endpoint = token ? `/cases/${id}` : `/public/cases/${id}`;
    const { data } = await api.get<MissingPerson>(endpoint);
    return data;
  },

  async create(input: Omit<MissingPerson, 'id' | 'createdAt' | 'updatedAt' | 'caseNumber'>): Promise<MissingPerson> {
    const { data } = await api.post<MissingPerson>('/cases', input);
    return data;
  },

  async update(id: string, patch: Partial<MissingPerson>): Promise<MissingPerson> {
    const { data } = await api.put<MissingPerson>(`/cases/${id}`, patch);
    return data;
  },

  async updateStatus(id: string, status: CaseStatus): Promise<MissingPerson> {
    const { data } = await api.patch<MissingPerson>(`/cases/${id}/status`, { status });
    return data;
  },

  async addNote(caseId: string, note: string, author?: User): Promise<InvestigationNote> {
    const { data } = await api.post<InvestigationNote>(`/cases/${caseId}/notes`, { note });
    return data;
  },

  async assignVolunteer(caseId: string, volunteerId: string): Promise<MissingPerson> {
    const { data } = await api.post<MissingPerson>(`/cases/${caseId}/assign-volunteer`, { volunteerId });
    return data;
  },

  async getAssignedCases(): Promise<MissingPerson[]> {
    const { data } = await api.get<MissingPerson[]>('/volunteer/assigned-cases');
    return data;
  },
};

export const sightingsApi = {
  async list(): Promise<SightingReport[]> {
    const { data } = await api.get<SightingReport[]>('/sightings');
    return data;
  },

  async forCase(caseId: string): Promise<SightingReport[]> {
    const { data } = await api.get<SightingReport[]>(`/cases/${caseId}/sightings`);
    return data;
  },

  async create(input: Omit<SightingReport, 'id' | 'createdAt' | 'status'>): Promise<SightingReport> {
    const { data } = await api.post<SightingReport>('/sightings', input);
    return data;
  },

  async updateStatus(id: string, status: SightingReport['status']): Promise<SightingReport> {
    const { data } = await api.patch<SightingReport>(`/sightings/${id}/status`, { status });
    return data;
  },
};

export const notificationsApi = {
  async forUser(userId?: string): Promise<Notification[]> {
    const endpoint = userId ? `/notifications/user/${userId}` : '/notifications';
    const { data } = await api.get<Notification[]>(endpoint);
    return data;
  },

  async markRead(id: string): Promise<Notification> {
    const { data } = await api.patch<Notification>(`/notifications/${id}/read`);
    return data;
  },
};

export const timelineApi = {
  async forCase(caseId: string): Promise<TimelineEvent[]> {
    const { data } = await api.get<TimelineEvent[]>(`/cases/${caseId}/timeline`);
    return data;
  },
};

export const notesApi = {
  async forCase(caseId: string): Promise<InvestigationNote[]> {
    const { data } = await api.get<InvestigationNote[]>(`/cases/${caseId}/notes`);
    return data;
  },
};

export const logsApi = {
  async list(): Promise<SystemLog[]> {
    const { data } = await api.get<SystemLog[]>('/logs');
    return data;
  },
};

export const statsApi = {
  async dashboard(): Promise<{
    totalMissing: number;
    totalFound: number;
    activeCases: number;
    closedCases: number;
    totalStations: number;
    totalVolunteers: number;
    totalReports: number;
    totalUsers: number;
    byState: { name: string; value: number }[];
    byGender: { name: string; value: number }[];
    byAge: { range: string; value: number }[];
    monthly: { month: string; missing: number; found: number }[];
  }> {
    const token = localStorage.getItem('mpin:token');
    const endpoint = token ? '/stats/dashboard' : '/public/stats';
    const { data } = await api.get<{
      totalMissing: number;
      totalFound: number;
      activeCases: number;
      closedCases: number;
      totalStations: number;
      totalVolunteers: number;
      totalReports: number;
      totalUsers: number;
      byState: { name: string; value: number }[];
      byGender: { name: string; value: number }[];
      byAge: { range: string; value: number }[];
      monthly: { month: string; missing: number; found: number }[];
    }>(endpoint);
    return data;
  },
};
