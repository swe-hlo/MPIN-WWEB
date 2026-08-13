import type {
  Department,
  MissingPerson,
  Notification,
  PoliceStation,
  SightingReport,
  SystemLog,
  User,
  InvestigationNote,
  TimelineEvent,
} from '@/types';

export const seedUsers: User[] = [
  {
    id: 'u-admin',
    fullName: 'System Administrator',
    email: 'admin@mpin.gov.in',
    role: 'SUPER_ADMIN',
    phone: '+91 90000 00001',
    active: true,
    createdAt: '2025-01-05T09:00:00Z',
  },
  {
    id: 'u-officer',
    fullName: 'Inspector Rajesh Kumar',
    email: 'police@mpin.gov.in',
    role: 'POLICE_OFFICER',
    phone: '+91 90000 00002',
    departmentId: 'd-1',
    stationId: 'ps-1',
    active: true,
    createdAt: '2025-01-10T09:00:00Z',
  },
  {
    id: 'u-volunteer',
    fullName: 'Anita Sharma',
    email: 'volunteer@mpin.gov.in',
    role: 'VOLUNTEER',
    phone: '+91 90000 00003',
    active: true,
    createdAt: '2025-02-01T09:00:00Z',
  },
  {
    id: 'u-public',
    fullName: 'Ravi Verma',
    email: 'public@mpin.gov.in',
    role: 'PUBLIC_USER',
    phone: '+91 90000 00004',
    active: true,
    createdAt: '2025-02-15T09:00:00Z',
  },
];

export const seedDepartments: Department[] = [
  { id: 'd-1', name: 'Delhi Police', state: 'Delhi', description: 'National Capital Territory', createdAt: '2025-01-05T09:00:00Z' },
  { id: 'd-2', name: 'Maharashtra Police', state: 'Maharashtra', description: 'State police force', createdAt: '2025-01-05T09:00:00Z' },
  { id: 'd-3', name: 'Karnataka State Police', state: 'Karnataka', description: 'State police force', createdAt: '2025-01-05T09:00:00Z' },
];

export const seedStations: PoliceStation[] = [
  { id: 'ps-1', name: 'Connaught Place PS', state: 'Delhi', district: 'New Delhi', city: 'New Delhi', contact: '+91 11 2345 6789', officerInCharge: 'Inspector Rajesh Kumar', createdAt: '2025-01-05T09:00:00Z' },
  { id: 'ps-2', name: 'Bandra PS', state: 'Maharashtra', district: 'Mumbai Suburban', city: 'Mumbai', contact: '+91 22 2645 1122', officerInCharge: 'PI Suresh Patil', createdAt: '2025-01-05T09:00:00Z' },
  { id: 'ps-3', name: 'Indiranagar PS', state: 'Karnataka', district: 'Bengaluru Urban', city: 'Bengaluru', contact: '+91 80 2294 3300', officerInCharge: 'SI Meena Rao', createdAt: '2025-01-05T09:00:00Z' },
  { id: 'ps-4', name: 'Karol Bagh PS', state: 'Delhi', district: 'Central Delhi', city: 'New Delhi', contact: '+91 11 2871 5500', officerInCharge: 'Inspector Vikram Singh', createdAt: '2025-01-06T09:00:00Z' },
];

const photos = [
  'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1040626/pexels-photo-1040626.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/2698935/pexels-photo-2698935.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=600',
];

const indianStates = ['Delhi', 'Maharashtra', 'Karnataka'];
const districts: Record<string, string[]> = {
  Delhi: ['New Delhi', 'Central Delhi', 'South Delhi'],
  Maharashtra: ['Mumbai Suburban', 'Pune'],
  Karnataka: ['Bengaluru Urban', 'Mysuru'],
};
const cities: Record<string, string[]> = {
  'New Delhi': ['New Delhi', 'Connaught Place'],
  'Central Delhi': ['Karol Bagh', 'Daryaganj'],
  'South Delhi': ['Saket', 'Hauz Khas'],
  'Mumbai Suburban': ['Bandra', 'Andheri'],
  Pune: ['Pune City', 'Kothrud'],
  'Bengaluru Urban': ['Indiranagar', 'Koramangala'],
  Mysuru: ['Mysuru City'],
};

function pick<T>(arr: T[], i: number): T {
  return arr[i % arr.length];
}

export const seedMissingPersons: MissingPerson[] = Array.from({ length: 14 }, (_, i) => {
  const state = pick(indianStates, i);
  const district = pick(districts[state], i);
  const city = pick(cities[district] ?? [district], i);
  const station = seedStations.filter((s) => s.state === state)[0] ?? seedStations[0];
  const gender = i % 3 === 0 ? 'FEMALE' : i % 3 === 1 ? 'MALE' : 'OTHER';
  const age = 6 + ((i * 7) % 60);
  const statuses: MissingPerson['status'][] = ['MISSING', 'INVESTIGATING', 'FOUND', 'CLOSED', 'DECEASED'];
  const priorities: MissingPerson['priority'][] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  const status = pick(statuses, i);
  const names = ['Aarav Sharma', 'Priya Nair', 'Mohit Gupta', 'Sneha Reddy', 'Karan Mehta', 'Diya Patel', 'Vikas Yadav', 'Anjali Iyer', 'Rohit Das', 'Meera Joshi', 'Arjun Rao', 'Nisha Bhat', 'Sahil Khan', 'Pooja Malhotra'];
  const created = new Date(2025, (i * 1) % 12, ((i * 5) % 27) + 1).toISOString();
  return {
    id: `mp-${i + 1}`,
    fullName: names[i],
    nickName: i % 2 === 0 ? names[i].split(' ')[0].toLowerCase() : undefined,
    gender: gender as MissingPerson['gender'],
    dob: `${1990 + (i % 20)}-0${(i % 9) + 1}-1${i % 9}`,
    age,
    height: 140 + (i * 3) % 50,
    weight: 35 + (i * 4) % 50,
    bloodGroup: ['A+', 'B+', 'O+', 'AB+', 'A-', 'O-'][i % 6],
    skinTone: ['Fair', 'Wheatish', 'Dusky'][i % 3],
    hairColor: ['Black', 'Brown', 'Dark Brown'][i % 3],
    eyeColor: ['Black', 'Brown', 'Hazel'][i % 3],
    identificationMarks: i % 2 ? 'Scar on left cheek' : 'Mole on right arm',
    medicalConditions: i % 3 === 0 ? 'Diabetes' : i % 3 === 1 ? 'Asthma' : undefined,
    mentalHealthCondition: i % 4 === 0 ? 'Autism spectrum' : undefined,
    lastSeenDate: created.slice(0, 10),
    lastSeenTime: '18:30',
    lastSeenLocation: `${city} railway station`,
    state,
    district,
    city,
    missingCircumstances: 'Left home for work and did not return. Family lost contact.',
    clothingDescription: 'Blue shirt, dark jeans, white sneakers',
    guardianName: `Guardian of ${names[i].split(' ')[0]}`,
    guardianContact: `+91 9${10000 + i} 0${20000 + i}`,
    policeStationId: station.id,
    policeStationName: station.name,
    firNumber: `FIR-${1000 + i}/2025`,
    caseNumber: `MPN/${2025}/${100 + i}`,
    status: status as MissingPerson['status'],
    priority: pick(priorities, i) as MissingPerson['priority'],
    images: [photos[i % photos.length], photos[(i + 2) % photos.length]],
    assignedVolunteerIds: i % 3 === 0 ? ['u-volunteer'] : [],
    registeredByUserId: 'u-officer',
    createdAt: created,
    updatedAt: created,
  };
});

export const seedSightings: SightingReport[] = [
  {
    id: 'sr-1',
    caseId: 'mp-1',
    reporterName: 'Suresh Kumar',
    contactNumber: '+91 98765 43210',
    date: '2025-08-01',
    time: '10:30',
    location: 'Connaught Place, New Delhi',
    mapsLink: 'https://maps.google.com/?q=Connaught+Place+New+Delhi',
    description: 'Saw a person matching the photo near the metro station exit.',
    imageUrl: photos[0],
    status: 'NEW',
    createdAt: '2025-08-01T10:35:00Z',
  },
  {
    id: 'sr-2',
    caseId: 'mp-2',
    reporterName: 'Lakshmi R',
    contactNumber: '+91 99876 54321',
    date: '2025-08-03',
    time: '19:00',
    location: 'Bandra Worli Sea Link, Mumbai',
    mapsLink: 'https://maps.google.com/?q=Bandra+Worli+Sea+Link',
    description: 'Walking alone near the promenade.',
    status: 'VERIFIED',
    createdAt: '2025-08-03T19:10:00Z',
  },
];

export const seedNotifications: Notification[] = [
  {
    id: 'n-1',
    userId: 'u-officer',
    type: 'NEW_REPORT',
    title: 'New sighting report',
    message: 'A new sighting was reported for case MPN/2025/100.',
    caseId: 'mp-1',
    read: false,
    createdAt: '2025-08-01T10:36:00Z',
  },
  {
    id: 'n-2',
    userId: 'u-volunteer',
    type: 'ASSIGNMENT',
    title: 'New case assigned',
    message: 'You have been assigned to case MPN/2025/102.',
    caseId: 'mp-3',
    read: false,
    createdAt: '2025-08-02T08:00:00Z',
  },
  {
    id: 'n-3',
    userId: 'u-admin',
    type: 'NEW_CASE',
    title: 'New case registered',
    message: 'A new missing person case was registered at Connaught Place PS.',
    caseId: 'mp-1',
    read: true,
    createdAt: '2025-07-15T09:00:00Z',
  },
];

export const seedNotes: InvestigationNote[] = [
  {
    id: 'note-1',
    caseId: 'mp-1',
    authorId: 'u-officer',
    authorName: 'Inspector Rajesh Kumar',
    note: 'Visited last seen location. Collected CCTV footage from nearby shops.',
    createdAt: '2025-07-16T11:00:00Z',
  },
  {
    id: 'note-2',
    caseId: 'mp-1',
    authorId: 'u-officer',
    authorName: 'Inspector Rajesh Kumar',
    note: 'Interviewed family members. No disputes reported. Following up with local hospitals.',
    createdAt: '2025-07-18T15:30:00Z',
  },
];

export const seedTimeline: TimelineEvent[] = seedMissingPersons.flatMap((mp) => [
  {
    id: `tl-${mp.id}-1`,
    caseId: mp.id,
    type: 'REGISTERED',
    message: `Case ${mp.caseNumber} registered at ${mp.policeStationName}.`,
    createdAt: mp.createdAt,
  },
  ...(mp.status !== 'MISSING'
    ? [
        {
          id: `tl-${mp.id}-2`,
          caseId: mp.id,
          type: 'STATUS_CHANGE' as const,
          message: `Status updated to ${mp.status}.`,
          createdAt: mp.updatedAt,
        },
      ]
    : []),
]);

export const seedLogs: SystemLog[] = [
  { id: 'log-1', userId: 'u-admin', userName: 'System Administrator', action: 'LOGIN', level: 'INFO', createdAt: '2025-08-04T08:00:00Z' },
  { id: 'log-2', userId: 'u-officer', userName: 'Inspector Rajesh Kumar', action: 'CREATE_CASE', entity: 'MissingPerson', entityId: 'mp-1', level: 'INFO', createdAt: '2025-07-15T09:00:00Z' },
  { id: 'log-3', userId: 'u-public', userName: 'Ravi Verma', action: 'REPORT_SIGHTING', entity: 'SightingReport', entityId: 'sr-1', level: 'INFO', createdAt: '2025-08-01T10:35:00Z' },
  { id: 'log-4', userId: 'u-officer', userName: 'Inspector Rajesh Kumar', action: 'UPDATE_STATUS', entity: 'MissingPerson', entityId: 'mp-2', level: 'WARN', createdAt: '2025-08-03T12:00:00Z' },
  { id: 'log-5', action: 'FAILED_LOGIN', level: 'WARN', createdAt: '2025-08-05T03:14:00Z' },
];
