import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { PublicLayout } from '@/layouts/PublicLayout';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { FullPageLoader } from '@/components/FullPageLoader';
import type { JSX } from 'react';
import type { UserRole } from '@/types';

const LandingPage = lazy(() => import('@/pages/LandingPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const FeaturesPage = lazy(() => import('@/pages/FeaturesPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const SearchPage = lazy(() => import('@/pages/SearchPage'));
const PersonDetailPage = lazy(() => import('@/pages/PersonDetailPage'));
const ReportSightingPage = lazy(() => import('@/pages/ReportSightingPage'));
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'));
const ChangePasswordPage = lazy(() => import('@/pages/auth/ChangePasswordPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

const AdminOverview = lazy(() => import('@/pages/admin/AdminOverview'));
const AdminUsers = lazy(() => import('@/pages/admin/AdminUsers'));
const AdminDepartments = lazy(() => import('@/pages/admin/AdminDepartments'));
const AdminStations = lazy(() => import('@/pages/admin/AdminStations'));
const AdminVolunteers = lazy(() => import('@/pages/admin/AdminVolunteers'));
const AdminLogs = lazy(() => import('@/pages/admin/AdminLogs'));

const PoliceOverview = lazy(() => import('@/pages/police/PoliceOverview'));
const PoliceCases = lazy(() => import('@/pages/police/PoliceCases'));
const RegisterCasePage = lazy(() => import('@/pages/police/RegisterCasePage'));
const CaseDetailPage = lazy(() => import('@/pages/police/CaseDetailPage'));
const PoliceReports = lazy(() => import('@/pages/police/PoliceReports'));
const PoliceNearby = lazy(() => import('@/pages/police/PoliceNearby'));

const VolunteerOverview = lazy(() => import('@/pages/volunteer/VolunteerOverview'));
const VolunteerCases = lazy(() => import('@/pages/volunteer/VolunteerCases'));
const VolunteerAssigned = lazy(() => import('@/pages/volunteer/VolunteerAssigned'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false },
  },
});

function Protected({ children, roles }: { children: JSX.Element; roles: UserRole[] }) {
  const { user, loading } = useAuth();
  if (loading) return <FullPageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

function HomeRedirect() {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  const path = user.role === 'SUPER_ADMIN' ? '/admin' : user.role === 'POLICE_OFFICER' ? '/police' : user.role === 'VOLUNTEER' ? '/volunteer' : '/';
  return <Navigate to={path} replace />;
}

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <LandingPage /> },
      { path: '/about', element: <AboutPage /> },
      { path: '/features', element: <FeaturesPage /> },
      { path: '/contact', element: <ContactPage /> },
      { path: '/search', element: <SearchPage /> },
      { path: '/person/:id', element: <PersonDetailPage /> },
      { path: '/report-sighting', element: <ReportSightingPage /> },
    ],
  },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
  { path: '/change-password', element: <ChangePasswordPage /> },
  {
    element: (
      <Protected roles={['SUPER_ADMIN']}>
        <DashboardLayout />
      </Protected>
    ),
    children: [
      { path: '/admin', element: <AdminOverview /> },
      { path: '/admin/users', element: <AdminUsers /> },
      { path: '/admin/departments', element: <AdminDepartments /> },
      { path: '/admin/stations', element: <AdminStations /> },
      { path: '/admin/volunteers', element: <AdminVolunteers /> },
      { path: '/admin/logs', element: <AdminLogs /> },
    ],
  },
  {
    element: (
      <Protected roles={['POLICE_OFFICER']}>
        <DashboardLayout />
      </Protected>
    ),
    children: [
      { path: '/police', element: <PoliceOverview /> },
      { path: '/police/cases', element: <PoliceCases /> },
      { path: '/police/register', element: <RegisterCasePage /> },
      { path: '/police/cases/:id', element: <CaseDetailPage /> },
      { path: '/police/reports', element: <PoliceReports /> },
      { path: '/police/nearby', element: <PoliceNearby /> },
    ],
  },
  {
    element: (
      <Protected roles={['VOLUNTEER']}>
        <DashboardLayout />
      </Protected>
    ),
    children: [
      { path: '/volunteer', element: <VolunteerOverview /> },
      { path: '/volunteer/cases', element: <VolunteerCases /> },
      { path: '/volunteer/assigned', element: <VolunteerAssigned /> },
    ],
  },
  { path: '/dashboard', element: <HomeRedirect /> },
  { path: '*', element: <NotFoundPage /> },
]);

export default function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <Suspense fallback={<FullPageLoader />}>
            <RouterProvider router={router} />
          </Suspense>
          <Toaster />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
