import {
  seedDepartments,
  seedLogs,
  seedMissingPersons,
  seedNotes,
  seedNotifications,
  seedSightings,
  seedStations,
  seedTimeline,
  seedUsers,
} from './seed';
import type {
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
} from '@/types';

const KEY = 'mpin:db:v1';

interface DB {
  users: User[];
  departments: Department[];
  stations: PoliceStation[];
  missingPersons: MissingPerson[];
  sightings: SightingReport[];
  notifications: Notification[];
  notes: InvestigationNote[];
  timeline: TimelineEvent[];
  logs: SystemLog[];
  passwords: Record<string, string>;
}

function freshDB(): DB {
  return {
    users: structuredClone(seedUsers),
    departments: structuredClone(seedDepartments),
    stations: structuredClone(seedStations),
    missingPersons: structuredClone(seedMissingPersons),
    sightings: structuredClone(seedSightings),
    notifications: structuredClone(seedNotifications),
    notes: structuredClone(seedNotes),
    timeline: structuredClone(seedTimeline),
    logs: structuredClone(seedLogs),
    passwords: {
      'admin@mpin.gov.in': 'admin123',
      'police@mpin.gov.in': 'police123',
      'volunteer@mpin.gov.in': 'volunteer123',
      'public@mpin.gov.in': 'public123',
    },
  };
}

function load(): DB {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      const db = freshDB();
      localStorage.setItem(KEY, JSON.stringify(db));
      return db;
    }
    return JSON.parse(raw) as DB;
  } catch {
    const db = freshDB();
    localStorage.setItem(KEY, JSON.stringify(db));
    return db;
  }
}

function save(db: DB) {
  localStorage.setItem(KEY, JSON.stringify(db));
}

export const db = {
  load,
  save,
  reset() {
    const db = freshDB();
    localStorage.setItem(KEY, JSON.stringify(db));
  },
};

export function uid(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-3)}`;
}

export function delay<T>(value: T, ms = 350): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export function paginate<T>(items: T[], page = 0, size = 10): Paginated<T> {
  const start = page * size;
  const content = items.slice(start, start + size);
  return {
    content,
    totalElements: items.length,
    page,
    size,
    totalPages: Math.max(1, Math.ceil(items.length / size)),
  };
}

export function fakeJwt(user: User): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.fullName,
      exp: Date.now() + 1000 * 60 * 60 * 8,
    }),
  );
  return `${header}.${payload}.signature`;
}
