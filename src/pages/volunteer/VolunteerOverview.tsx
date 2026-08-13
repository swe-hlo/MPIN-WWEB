import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ClipboardList, Search, HeartHandshake, Eye, ArrowRight, Bell, MapPin, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { missingPersonsApi, notificationsApi, sightingsApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { StatCard } from '@/components/StatCard';
import { DashboardPageHeader } from '@/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { EmptyState } from '@/components/MissingPersonCard';

const statusVariant: Record<string, string> = {
  MISSING: 'bg-destructive/10 text-destructive border-destructive/30',
  INVESTIGATING: 'bg-warning/10 text-warning border-warning/30',
  FOUND: 'bg-success/10 text-success border-success/30',
  CLOSED: 'bg-muted text-muted-foreground border-border',
  DECEASED: 'bg-foreground/10 text-foreground/70 border-border',
};

export default function VolunteerOverview() {
  const { user } = useAuth();
  const { data: allCases } = useQuery({ queryKey: ['missingPersons', { size: 100 }], queryFn: () => missingPersonsApi.list({ size: 100 }) });
  const { data: notifications } = useQuery({ queryKey: ['notifications', user?.id], queryFn: () => notificationsApi.forUser(user!.id), enabled: !!user?.id });
  const { data: reports } = useQuery({ queryKey: ['sightings'], queryFn: sightingsApi.list });

  const cases = allCases?.content ?? [];
  const assignedCases = cases.filter((c) => c.assignedVolunteerIds?.includes(user?.id ?? ''));
  const activeAssigned = assignedCases.filter((c) => c.status === 'MISSING' || c.status === 'INVESTIGATING');
  const nearbyActive = cases.filter((c) => c.status === 'MISSING' || c.status === 'INVESTIGATING').slice(0, 6);
  const newReports = reports?.filter((r) => r.status === 'NEW') ?? [];
  const unreadNotifs = notifications?.filter((n) => !n.read) ?? [];

  return (
    <div className="space-y-6">
      <DashboardPageHeader title={`Welcome, ${user?.fullName.split(' ')[0]}`} description="Your assigned cases and latest updates." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard index={0} label="Assigned Cases" value={assignedCases.length} icon={ClipboardList} color="primary" />
        <StatCard index={1} label="Active Assignments" value={activeAssigned.length} icon={Search} color="warning" />
        <StatCard index={2} label="Persons Found" value={assignedCases.filter((c) => c.status === 'FOUND').length} icon={HeartHandshake} color="success" />
        <StatCard index={3} label="New Notifications" value={unreadNotifs.length} icon={Bell} color="info" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Assigned cases */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">My Assigned Cases</CardTitle>
              <Button asChild variant="ghost" size="sm"><Link to="/volunteer/assigned">View all <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link></Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {assignedCases.slice(0, 5).map((c, i) => (
              <motion.div key={c.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Link to={`/volunteer/cases`} className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:border-primary/40 hover:bg-primary/5">
                  <div className="flex items-center gap-3">
                    <img src={c.images[0]} alt="" className="h-11 w-11 rounded-lg object-cover" />
                    <div>
                      <p className="text-sm font-medium">{c.fullName}</p>
                      <p className="text-xs text-muted-foreground">{c.caseNumber} · {c.age} yrs</p>
                    </div>
                  </div>
                  <span className={cn('rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase', statusVariant[c.status])}>{c.status}</span>
                </Link>
              </motion.div>
            ))}
            {assignedCases.length === 0 && <EmptyState icon={ClipboardList} title="No assignments yet" message="Cases assigned to you will appear here." />}
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Bell className="h-4 w-4 text-primary" />Notifications</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {(notifications ?? []).slice(0, 6).map((n) => (
              <div key={n.id} className={cn('rounded-lg border p-3', n.read ? 'border-border' : 'border-primary/30 bg-primary/5')}>
                <p className="text-sm font-medium">{n.title}</p>
                <p className="text-xs text-muted-foreground">{n.message}</p>
                <p className="mt-1 text-[10px] text-muted-foreground">{new Date(n.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
              </div>
            ))}
            {(!notifications || notifications.length === 0) && <p className="py-6 text-center text-sm text-muted-foreground">No notifications.</p>}
          </CardContent>
        </Card>
      </div>

      {/* Nearby active cases */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Active Cases Nearby</CardTitle>
            <Button asChild variant="ghost" size="sm"><Link to="/volunteer/cases">Browse all <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link></Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {nearbyActive.map((c, i) => (
              <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                <Link to={`/person/${c.id}`} className="group block overflow-hidden rounded-xl border border-border transition-all hover:border-primary/40 hover:shadow-lg">
                  <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <img src={c.images[0]} alt={c.fullName} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                    <span className={cn('absolute left-2 top-2 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase backdrop-blur-md', statusVariant[c.status])}>{c.status}</span>
                  </div>
                  <div className="p-3">
                    <p className="truncate text-sm font-semibold">{c.fullName}</p>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{c.lastSeenLocation}</p>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3 w-3" />{new Date(c.lastSeenDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          {nearbyActive.length === 0 && <EmptyState icon={Search} title="No active cases" message="There are no missing or investigating cases right now." />}
        </CardContent>
      </Card>

      {/* Pending sighting reports */}
      {newReports.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Eye className="h-4 w-4 text-warning" />Pending Sighting Reports</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {newReports.slice(0, 4).map((r) => (
              <div key={r.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <p className="text-sm font-medium">{r.reporterName}</p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{r.location} · {r.date}</p>
                </div>
                <Badge variant="secondary" className="bg-warning/10 text-warning">NEW</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
