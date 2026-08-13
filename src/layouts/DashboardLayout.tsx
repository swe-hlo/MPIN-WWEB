import { useState, type ReactNode } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Building2,
  ShieldCheck,
  Search,
  FileText,
  Bell,
  LogOut,
  Menu,
  X,
  ChevronDown,
  UserCircle2,
  ScrollText,
  ClipboardList,
  MapPin,
  Settings,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Logo } from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';
import type { UserRole } from '@/types';

interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  roles?: UserRole[];
  end?: boolean;
}

const allNav: NavItem[] = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true, roles: ['SUPER_ADMIN'] },
  { to: '/admin/users', label: 'Manage Users', icon: Users, roles: ['SUPER_ADMIN'] },
  { to: '/admin/departments', label: 'Departments', icon: Building2, roles: ['SUPER_ADMIN'] },
  { to: '/admin/stations', label: 'Police Stations', icon: ShieldCheck, roles: ['SUPER_ADMIN'] },
  { to: '/admin/volunteers', label: 'Volunteers', icon: UserCircle2, roles: ['SUPER_ADMIN'] },
  { to: '/admin/logs', label: 'System Logs', icon: ScrollText, roles: ['SUPER_ADMIN'] },

  { to: '/police', label: 'Overview', icon: LayoutDashboard, end: true, roles: ['POLICE_OFFICER'] },
  { to: '/police/cases', label: 'Missing Persons', icon: Search, roles: ['POLICE_OFFICER'] },
  { to: '/police/register', label: 'Register Case', icon: FileText, roles: ['POLICE_OFFICER'] },
  { to: '/police/reports', label: 'Citizen Reports', icon: ClipboardList, roles: ['POLICE_OFFICER'] },
  { to: '/police/nearby', label: 'Nearby Cases', icon: MapPin, roles: ['POLICE_OFFICER'] },

  { to: '/volunteer', label: 'Overview', icon: LayoutDashboard, end: true, roles: ['VOLUNTEER'] },
  { to: '/volunteer/cases', label: 'Nearby Cases', icon: MapPin, roles: ['VOLUNTEER'] },
  { to: '/volunteer/assigned', label: 'Assigned Cases', icon: ClipboardList, roles: ['VOLUNTEER'] },
];

function initials(name: string) {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
}

const roleLabel: Record<UserRole, string> = {
  SUPER_ADMIN: 'Super Admin',
  POLICE_OFFICER: 'Police Officer',
  VOLUNTEER: 'Volunteer',
  PUBLIC_USER: 'Public User',
};

export function DashboardLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  if (!user) {
    navigate('/login');
    return null;
  }

  const navItems = allNav.filter((n) => !n.roles || n.roles.includes(user.role));
  const basePath = user.role === 'SUPER_ADMIN' ? '/admin' : user.role === 'POLICE_OFFICER' ? '/police' : '/volunteer';
  const title = navItems.find((n) => location.pathname === n.to || (n.end ? false : location.pathname.startsWith(n.to)))?.label ?? 'Dashboard';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const Sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center border-b border-border px-5">
        <Link to="/" className="flex items-center">
          <Logo size="sm" />
        </Link>
      </div>
      <div className="px-3 py-4">
        <div className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {roleLabel[user.role]} Panel
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                cn(
                  'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/30'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                )
              }
            >
              <item.icon className="h-[18px] w-[18px] shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
      <div className="mt-auto border-t border-border p-3">
        <Link to="/" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          <Settings className="h-[18px] w-[18px]" />
          Public Portal
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-border bg-card lg:block">
        {Sidebar}
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-foreground/40 backdrop-blur-sm lg:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 26, stiffness: 240 }}
              className="fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-card lg:hidden"
            >
              <button
                onClick={() => setSidebarOpen(false)}
                className="absolute right-3 top-4 z-10 rounded-md p-1.5 text-muted-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
              {Sidebar}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="lg:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-xl sm:px-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="font-display text-lg font-bold tracking-tight">{title}</h1>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <ThemeToggle />
            <Button asChild variant="ghost" size="icon" className="relative">
              <Link to={basePath}>
                <Bell className="h-5 w-5" />
                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
              </Link>
            </Button>

            <div className="relative">
              <button
                onClick={() => setProfileOpen((o) => !o)}
                className="flex items-center gap-2 rounded-full border border-border bg-card py-1 pl-1 pr-2 transition-colors hover:bg-muted"
              >
                <Avatar className="h-7 w-7">
                  <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">{initials(user.fullName)}</AvatarFallback>
                </Avatar>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </button>
              <AnimatePresence>
                {profileOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.96 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-12 z-50 w-60 overflow-hidden rounded-xl border border-border bg-popover shadow-xl shadow-foreground/10"
                    >
                      <div className="border-b border-border p-3">
                        <p className="truncate text-sm font-semibold">{user.fullName}</p>
                        <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                        <Badge variant="secondary" className="mt-2">{roleLabel[user.role]}</Badge>
                      </div>
                      <div className="p-1.5">
                        <button
                          onClick={handleLogout}
                          className="flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign out
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function DashboardPageHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="font-display text-2xl font-bold tracking-tight">{title}</h2>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}
