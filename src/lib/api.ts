import axios from 'axios';
import { db, delay, fakeJwt, paginate, uid } from './db';
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
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function err(status: number, message: string): Promise<never> {
  return Promise.reject(new ApiError(status, message));
}

function publicUser(): User {
  const u: User = {
    id: 'guest',
    fullName: 'Guest',
    email: 'guest@mpin.gov.in',
    role: 'PUBLIC_USER',
    active: true,
    createdAt: new Date().toISOString(),
  };
  return u;
}

export const authApi = {
  async login(email: string, password: string): Promise<{ user: User; tokens: AuthTokens }> {
    const data = db.load();
    const user = data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return err(404, 'No account found with this email.');
    if (data.passwords[user.email] !== password) return err(401, 'Incorrect password.');
    if (!user.active) return err(403, 'Your account has been deactivated. Contact support.');
    const tokens = { accessToken: fakeJwt(user), expiresIn: 28800 };
    await delay({ user, tokens });
    localStorage.setItem('mpin:token', tokens.accessToken);
    localStorage.setItem('mpin:user', JSON.stringify(user));
    return { user, tokens };
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
    const data = db.load();
    if (data.users.some((u) => u.email.toLowerCase() === input.email.toLowerCase())) {
      return err(409, 'An account with this email already exists.');
    }
    const user: User = {
      id: uid('u'),
      fullName: input.fullName,
      email: input.email,
      role: input.role,
      phone: input.phone,
      departmentId: input.departmentId ?? null,
      stationId: input.stationId ?? null,
      active: true,
      createdAt: new Date().toISOString(),
    };
    data.users.push(user);
    data.passwords[user.email] = input.password;
    data.logs.unshift({
      id: uid('log'),
      userId: user.id,
      userName: user.fullName,
      action: 'REGISTER',
      level: 'INFO',
      createdAt: user.createdAt,
    });
    db.save(data);
    const tokens = { accessToken: fakeJwt(user), expiresIn: 28800 };
    localStorage.setItem('mpin:token', tokens.accessToken);
    localStorage.setItem('mpin:user', JSON.stringify(user));
    return delay({ user, tokens });
  },

  async me(): Promise<User | null> {
    const raw = localStorage.getItem('mpin:user');
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  },

  async logout(): Promise<void> {
    localStorage.removeItem('mpin:token');
    localStorage.removeItem('mpin:user');
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    const data = db.load();
    const exists = data.users.some((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!exists) return err(404, 'No account found with this email.');
    return delay({ message: 'Password reset link sent to your email.' });
  },

  async changePassword(current: string, next: string): Promise<{ message: string }> {
    const me = await this.me();
    if (!me) return err(401, 'Not authenticated.');
    const data = db.load();
    if (data.passwords[me.email] !== current) return err(400, 'Current password is incorrect.');
    data.passwords[me.email] = next;
    db.save(data);
    return delay({ message: 'Password changed successfully.' });
  },
};

export const usersApi = {
  async list(params?: { role?: UserRole; page?: number; size?: number }): Promise<Paginated<User>> {
    const data = db.load();
    let items = [...data.users];
    if (params?.role) items = items.filter((u) => u.role === params.role);
    items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return delay(paginate(items, params?.page ?? 0, params?.size ?? 50));
  },
  async toggleActive(id: string): Promise<User> {
    const data = db.load();
    const u = data.users.find((x) => x.id === id);
    if (!u) return err(404, 'User not found.');
    u.active = !u.active;
    db.save(data);
    return delay(u);
  },
  async updateRole(id: string, role: UserRole): Promise<User> {
    const data = db.load();
    const u = data.users.find((x) => x.id === id);
    if (!u) return err(404, 'User not found.');
    u.role = role;
    db.save(data);
    return delay(u);
  },
  async remove(id: string): Promise<{ message: string }> {
    const data = db.load();
    data.users = data.users.filter((u) => u.id !== id);
    db.save(data);
    return delay({ message: 'User removed.' });
  },
};

export const departmentsApi = {
  async list(): Promise<Department[]> {
    return delay(db.load().departments);
  },
  async create(input: Omit<Department, 'id' | 'createdAt'>): Promise<Department> {
    const data = db.load();
    const d: Department = { ...input, id: uid('d'), createdAt: new Date().toISOString() };
    data.departments.push(d);
    db.save(data);
    return delay(d);
  },
  async remove(id: string): Promise<{ message: string }> {
    const data = db.load();
    data.departments = data.departments.filter((d) => d.id !== id);
    db.save(data);
    return delay({ message: 'Department removed.' });
  },
};

export const stationsApi = {
  async list(): Promise<PoliceStation[]> {
    return delay(db.load().stations);
  },
  async create(input: Omit<PoliceStation, 'id' | 'createdAt'>): Promise<PoliceStation> {
    const data = db.load();
    const s: PoliceStation = { ...input, id: uid('ps'), createdAt: new Date().toISOString() };
    data.stations.push(s);
    db.save(data);
    return delay(s);
  },
  async remove(id: string): Promise<{ message: string }> {
    const data = db.load();
    data.stations = data.stations.filter((s) => s.id !== id);
    db.save(data);
    return delay({ message: 'Station removed.' });
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
    const data = db.load();
    let items = [...data.missingPersons];
    if (q.search) {
      const s = q.search.toLowerCase();
      items = items.filter(
        (m) =>
          m.fullName.toLowerCase().includes(s) ||
          m.caseNumber.toLowerCase().includes(s) ||
          (m.nickName ?? '').toLowerCase().includes(s),
      );
    }
    if (q.gender) items = items.filter((m) => m.gender === q.gender);
    if (q.state) items = items.filter((m) => m.state === q.state);
    if (q.district) items = items.filter((m) => m.district === q.district);
    if (q.city) items = items.filter((m) => m.city === q.city);
    if (q.status) items = items.filter((m) => m.status === q.status);
    if (q.stationId) items = items.filter((m) => m.policeStationId === q.stationId);
    if (q.minAge != null) items = items.filter((m) => m.age >= q.minAge!);
    if (q.maxAge != null) items = items.filter((m) => m.age <= q.maxAge!);
    if (q.from) items = items.filter((m) => m.lastSeenDate >= q.from!);
    if (q.to) items = items.filter((m) => m.lastSeenDate <= q.to!);
    items.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return delay(paginate(items, q.page ?? 0, q.size ?? 12));
  },
  async get(id: string): Promise<MissingPerson> {
    const data = db.load();
    const m = data.missingPersons.find((x) => x.id === id);
    if (!m) return err(404, 'Case not found.');
    return delay(m);
  },
  async create(input: Omit<MissingPerson, 'id' | 'createdAt' | 'updatedAt' | 'caseNumber'>): Promise<MissingPerson> {
    const data = db.load();
    const id = uid('mp');
    const now = new Date().toISOString();
    const num = `MPN/2025/${100 + data.missingPersons.length + 1}`;
    const m: MissingPerson = { ...input, id, caseNumber: num, createdAt: now, updatedAt: now };
    data.missingPersons.unshift(m);
    data.timeline.unshift({
      id: uid('tl'),
      caseId: id,
      type: 'REGISTERED',
      message: `Case ${num} registered.`,
      createdAt: now,
    });
    data.logs.unshift({
      id: uid('log'),
      action: 'CREATE_CASE',
      entity: 'MissingPerson',
      entityId: id,
      level: 'INFO',
      createdAt: now,
    });
    db.save(data);
    return delay(m);
  },
  async update(id: string, patch: Partial<MissingPerson>): Promise<MissingPerson> {
    const data = db.load();
    const m = data.missingPersons.find((x) => x.id === id);
    if (!m) return err(404, 'Case not found.');
    Object.assign(m, patch, { updatedAt: new Date().toISOString() });
    db.save(data);
    return delay(m);
  },
  async updateStatus(id: string, status: CaseStatus): Promise<MissingPerson> {
    const data = db.load();
    const m = data.missingPersons.find((x) => x.id === id);
    if (!m) return err(404, 'Case not found.');
    m.status = status;
    m.updatedAt = new Date().toISOString();
    data.timeline.unshift({
      id: uid('tl'),
      caseId: id,
      type: 'STATUS_CHANGE',
      message: `Status updated to ${status}.`,
      createdAt: m.updatedAt,
    });
    data.logs.unshift({
      id: uid('log'),
      action: 'UPDATE_STATUS',
      entity: 'MissingPerson',
      entityId: id,
      level: 'INFO',
      createdAt: m.updatedAt,
    });
    db.save(data);
    return delay(m);
  },
  async addNote(caseId: string, note: string, author: User): Promise<InvestigationNote> {
    const data = db.load();
    const n: InvestigationNote = {
      id: uid('note'),
      caseId,
      authorId: author.id,
      authorName: author.fullName,
      note,
      createdAt: new Date().toISOString(),
    };
    data.notes.unshift(n);
    data.timeline.unshift({
      id: uid('tl'),
      caseId,
      type: 'NOTE_ADDED',
      message: `Investigation note added by ${author.fullName}.`,
      createdAt: n.createdAt,
    });
    db.save(data);
    return delay(n);
  },
  async assignVolunteer(caseId: string, volunteerId: string): Promise<MissingPerson> {
    const data = db.load();
    const m = data.missingPersons.find((x) => x.id === caseId);
    if (!m) return err(404, 'Case not found.');
    m.assignedVolunteerIds = [...new Set([...(m.assignedVolunteerIds ?? []), volunteerId])];
    m.updatedAt = new Date().toISOString();
    const v = data.users.find((u) => u.id === volunteerId);
    data.notifications.unshift({
      id: uid('n'),
      userId: volunteerId,
      type: 'ASSIGNMENT',
      title: 'New case assigned',
      message: `You have been assigned to case ${m.caseNumber}.`,
      caseId,
      read: false,
      createdAt: m.updatedAt,
    });
    data.timeline.unshift({
      id: uid('tl'),
      caseId,
      type: 'ASSIGNMENT',
      message: `Volunteer ${v?.fullName ?? volunteerId} assigned to case.`,
      createdAt: m.updatedAt,
    });
    db.save(data);
    return delay(m);
  },
};

export const sightingsApi = {
  async list(): Promise<SightingReport[]> {
    return delay(db.load().sightings);
  },
  async create(input: Omit<SightingReport, 'id' | 'createdAt' | 'status'>): Promise<SightingReport> {
    const data = db.load();
    const s: SightingReport = { ...input, id: uid('sr'), status: 'NEW', createdAt: new Date().toISOString() };
    data.sightings.unshift(s);
    if (s.caseId) {
      data.timeline.unshift({
        id: uid('tl'),
        caseId: s.caseId,
        type: 'SIGHTING_REPORTED',
        message: `New sighting reported at ${s.location}.`,
        createdAt: s.createdAt,
      });
    }
    data.logs.unshift({
      id: uid('log'),
      action: 'REPORT_SIGHTING',
      entity: 'SightingReport',
      entityId: s.id,
      level: 'INFO',
      createdAt: s.createdAt,
    });
    db.save(data);
    return delay(s);
  },
  async updateStatus(id: string, status: SightingReport['status']): Promise<SightingReport> {
    const data = db.load();
    const s = data.sightings.find((x) => x.id === id);
    if (!s) return err(404, 'Report not found.');
    s.status = status;
    db.save(data);
    return delay(s);
  },
};

export const notificationsApi = {
  async forUser(userId: string): Promise<Notification[]> {
    return delay(db.load().notifications.filter((n) => n.userId === userId));
  },
  async markRead(id: string): Promise<Notification> {
    const data = db.load();
    const n = data.notifications.find((x) => x.id === id);
    if (!n) return err(404, 'Notification not found.');
    n.read = true;
    db.save(data);
    return delay(n);
  },
};

export const timelineApi = {
  async forCase(caseId: string): Promise<TimelineEvent[]> {
    return delay(db.load().timeline.filter((t) => t.caseId === caseId).sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
  },
};

export const notesApi = {
  async forCase(caseId: string): Promise<InvestigationNote[]> {
    return delay(db.load().notes.filter((n) => n.caseId === caseId).sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
  },
};

export const logsApi = {
  async list(): Promise<SystemLog[]> {
    return delay(db.load().logs);
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
    const data = db.load();
    const mp = data.missingPersons;
    const totalMissing = mp.filter((m) => m.status === 'MISSING' || m.status === 'INVESTIGATING').length;
    const totalFound = mp.filter((m) => m.status === 'FOUND').length;
    const activeCases = mp.filter((m) => m.status === 'INVESTIGATING').length;
    const closedCases = mp.filter((m) => m.status === 'CLOSED').length;
    const totalStations = data.stations.length;
    const totalVolunteers = data.users.filter((u) => u.role === 'VOLUNTEER').length;
    const totalReports = data.sightings.length;
    const totalUsers = data.users.length;

    const stateMap = new Map<string, number>();
    mp.forEach((m) => stateMap.set(m.state, (stateMap.get(m.state) ?? 0) + 1));
    const byState = [...stateMap.entries()].map(([name, value]) => ({ name, value }));

    const genderMap = new Map<string, number>();
    mp.forEach((m) => genderMap.set(m.gender, (genderMap.get(m.gender) ?? 0) + 1));
    const byGender = [...genderMap.entries()].map(([name, value]) => ({ name, value }));

    const ranges = [
      { range: '0-12', min: 0, max: 12 },
      { range: '13-18', min: 13, max: 18 },
      { range: '19-30', min: 19, max: 30 },
      { range: '31-50', min: 31, max: 50 },
      { range: '51+', min: 51, max: 200 },
    ];
    const byAge = ranges.map((r) => ({ range: r.range, value: mp.filter((m) => m.age >= r.min && m.age <= r.max).length }));

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
    const monthly = months.map((month, i) => {
      const created = mp.filter((m) => new Date(m.createdAt).getMonth() === i).length;
      const found = mp.filter((m) => m.status === 'FOUND' && new Date(m.updatedAt).getMonth() === i).length;
      return { month, missing: created, found };
    });

    return delay({
      totalMissing,
      totalFound,
      activeCases,
      closedCases,
      totalStations,
      totalVolunteers,
      totalReports,
      totalUsers,
      byState,
      byGender,
      byAge,
      monthly,
    });
  },
};
