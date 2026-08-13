export type UserRole = 'SUPER_ADMIN' | 'POLICE_OFFICER' | 'VOLUNTEER' | 'PUBLIC_USER';

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  departmentId?: string | null;
  stationId?: string | null;
  active: boolean;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  departmentId?: string;
  stationId?: string;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
}

export type CaseStatus = 'MISSING' | 'INVESTIGATING' | 'FOUND' | 'CLOSED' | 'DECEASED';
export type CasePriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface MissingPerson {
  id: string;
  fullName: string;
  nickName?: string;
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  dob: string;
  age: number;
  height?: number;
  weight?: number;
  bloodGroup?: string;
  skinTone?: string;
  hairColor?: string;
  eyeColor?: string;
  identificationMarks?: string;
  medicalConditions?: string;
  mentalHealthCondition?: string;
  lastSeenDate: string;
  lastSeenTime?: string;
  lastSeenLocation: string;
  state: string;
  district: string;
  city?: string;
  missingCircumstances?: string;
  clothingDescription?: string;
  guardianName?: string;
  guardianContact?: string;
  policeStationId: string;
  policeStationName?: string;
  firNumber?: string;
  caseNumber: string;
  status: CaseStatus;
  priority: CasePriority;
  images: string[];
  assignedVolunteerIds?: string[];
  registeredByUserId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvestigationNote {
  id: string;
  caseId: string;
  authorId: string;
  authorName: string;
  note: string;
  createdAt: string;
}

export interface TimelineEvent {
  id: string;
  caseId: string;
  type: 'REGISTERED' | 'STATUS_CHANGE' | 'NOTE_ADDED' | 'SIGHTING_REPORTED' | 'ASSIGNMENT' | 'IMAGE_ADDED' | 'FOUND';
  message: string;
  createdAt: string;
}

export interface SightingReport {
  id: string;
  caseId: string | null;
  reporterName: string;
  contactNumber: string;
  date: string;
  time?: string;
  location: string;
  mapsLink?: string;
  description?: string;
  imageUrl?: string;
  status: 'NEW' | 'VERIFIED' | 'REJECTED';
  createdAt: string;
}

export interface PoliceStation {
  id: string;
  name: string;
  state: string;
  district: string;
  city?: string;
  contact?: string;
  officerInCharge?: string;
  createdAt: string;
}

export interface Department {
  id: string;
  name: string;
  state: string;
  description?: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'NEW_CASE' | 'NEW_REPORT' | 'CASE_UPDATED' | 'PERSON_FOUND' | 'ASSIGNMENT';
  title: string;
  message: string;
  caseId?: string;
  read: boolean;
  createdAt: string;
}

export interface SystemLog {
  id: string;
  userId?: string;
  userName?: string;
  action: string;
  entity?: string;
  entityId?: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  createdAt: string;
}

export interface Paginated<T> {
  content: T[];
  totalElements: number;
  page: number;
  size: number;
  totalPages: number;
}

export interface DashboardStats {
  totalMissing: number;
  totalFound: number;
  activeCases: number;
  closedCases: number;
  totalStations: number;
  totalVolunteers: number;
  totalReports: number;
  totalUsers: number;
}
