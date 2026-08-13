import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { MapPin, Phone, ShieldCheck, UserCircle2, Navigation, AlertCircle, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { stationsApi, usersApi, missingPersonsApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { DashboardPageHeader } from '@/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { StatCard } from '@/components/StatCard';
import { EmptyState } from '@/components/MissingPersonCard';
import { cn } from '@/lib/utils';

const statusVariant: Record<string, string> = {
  MISSING: 'bg-destructive/10 text-destructive border-destructive/30',
  INVESTIGATING: 'bg-warning/10 text-warning border-warning/30',
  FOUND: 'bg-success/10 text-success border-success/30',
  CLOSED: 'bg-muted text-muted-foreground border-border',
  DECEASED: 'bg-foreground/10 text-foreground/70 border-border',
};

const emergencyContacts = [
  { label: 'National Emergency', number: '112', icon: AlertCircle, color: 'text-destructive' },
  { label: 'Women Helpline', number: '1091', icon: Phone, color: 'text-primary' },
  { label: 'Child Helpline', number: '1098', icon: Phone, color: 'text-info' },
  { label: 'Police Control Room', number: '100', icon: ShieldCheck, color: 'text-warning' },
];

function initials(name: string) {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
}

export default function PoliceNearby() {
  const { user } = useAuth();
  const { data: stations } = useQuery({ queryKey: ['stations'], queryFn: stationsApi.list });
  const { data: volunteersData } = useQuery({ queryKey: ['users', { role: 'VOLUNTEER' }], queryFn: () => usersApi.list({ role: 'VOLUNTEER', size: 50 }) });
  const { data: cases } = useQuery({ queryKey: ['missingPersons', { size: 100 }], queryFn: () => missingPersonsApi.list({ size: 100 }) });

  const myStation = stations?.find((s) => s.id === user?.stationId);
  const nearbyStations = stations?.filter((s) => s.id !== user?.stationId) ?? [];
  const volunteers = volunteersData?.content ?? [];
  const activeCases = (cases?.content ?? []).filter((c) => c.status === 'MISSING' || c.status === 'INVESTIGATING');

  return (
    <div className="space-y-6">
      <DashboardPageHeader title="Nearby Resources" description="Stations, volunteers, and emergency contacts near your jurisdiction." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard index={0} label="Nearby Stations" value={nearbyStations.length} icon={ShieldCheck} color="primary" />
        <StatCard index={1} label="Available Volunteers" value={volunteers.filter((v) => v.active).length} icon={UserCircle2} color="success" />
        <StatCard index={2} label="Active Cases" value={activeCases.length} icon={AlertCircle} color="warning" />
        <StatCard index={3} label="My Station" value={myStation?.name ?? 'N/A'} icon={Navigation} color="info" />
      </div>

      {/* Map placeholder */}
      <Card className="overflow-hidden">
        <div className="relative h-64 bg-gradient-to-br from-primary/5 via-info/5 to-success/5">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(hsl(215 28% 17%) 1px, transparent 1px), linear-gradient(90deg, hsl(215 28% 17%) 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-primary/10 text-primary">
              <Navigation className="h-8 w-8" />
            </div>
            <p className="font-display text-lg font-bold">Interactive Map</p>
            <p className="text-sm text-muted-foreground">Map integration shows stations, volunteers, and recent sightings near you.</p>
          </div>
          <div className="absolute bottom-4 left-4 flex gap-2">
            <Badge variant="secondary" className="gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" />Stations</Badge>
            <Badge variant="secondary" className="gap-1.5"><span className="h-2 w-2 rounded-full bg-success" />Volunteers</Badge>
            <Badge variant="secondary" className="gap-1.5"><span className="h-2 w-2 rounded-full bg-destructive" />Active Cases</Badge>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Nearby stations */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><ShieldCheck className="h-4 w-4 text-primary" />Nearby Police Stations</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {myStation && (
              <div className="rounded-lg border-2 border-primary/30 bg-primary/5 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold">{myStation.name}</p>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{myStation.district}, {myStation.state}</p>
                  </div>
                  <Badge variant="default" className="bg-primary/10 text-primary">Your Station</Badge>
                </div>
                {myStation.contact && <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><Phone className="h-3 w-3" />{myStation.contact}</p>}
              </div>
            )}
            {nearbyStations.slice(0, 5).map((s, i) => (
              <motion.div key={s.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:border-primary/30">
                <div>
                  <p className="text-sm font-medium">{s.name}</p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{s.district}, {s.state}</p>
                  {s.contact && <p className="flex items-center gap-1 text-xs text-muted-foreground"><Phone className="h-3 w-3" />{s.contact}</p>}
                </div>
                <Button asChild variant="ghost" size="sm">
                  <a href={`tel:${s.contact ?? ''}`}><Phone className="h-4 w-4" /></a>
                </Button>
              </motion.div>
            ))}
            {nearbyStations.length === 0 && !myStation && <p className="py-6 text-center text-sm text-muted-foreground">No stations registered yet.</p>}
          </CardContent>
        </Card>

        {/* Nearby volunteers */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><UserCircle2 className="h-4 w-4 text-success" />Volunteers in Area</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {volunteers.slice(0, 6).map((v, i) => (
              <motion.div key={v.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex items-center gap-3 rounded-lg border border-border p-3">
                <Avatar className="h-10 w-10"><AvatarFallback className="bg-success/10 text-xs font-semibold text-success">{initials(v.fullName)}</AvatarFallback></Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{v.fullName}</p>
                  {v.phone && <p className="flex items-center gap-1 text-xs text-muted-foreground"><Phone className="h-3 w-3" />{v.phone}</p>}
                </div>
                <Badge variant={v.active ? 'default' : 'secondary'} className={v.active ? 'bg-success/10 text-success' : ''}>{v.active ? 'Active' : 'Inactive'}</Badge>
              </motion.div>
            ))}
            {volunteers.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">No volunteers available.</p>}
          </CardContent>
        </Card>
      </div>

      {/* Emergency contacts */}
      <Card>
        <CardHeader><CardTitle className="flex items-center gap-2 text-base"><AlertCircle className="h-4 w-4 text-destructive" />Emergency Contacts</CardTitle></CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {emergencyContacts.map((c, i) => {
              const Icon = c.icon;
              return (
                <motion.a
                  key={c.number}
                  href={`tel:${c.number}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group flex items-center gap-3 rounded-xl border border-border p-4 transition-all hover:border-primary/40 hover:shadow-md"
                >
                  <div className={cn('grid h-10 w-10 place-items-center rounded-lg bg-muted', c.color)}><Icon className="h-5 w-5" /></div>
                  <div>
                    <p className="text-xs text-muted-foreground">{c.label}</p>
                    <p className="font-display text-lg font-bold">{c.number}</p>
                  </div>
                </motion.a>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent nearby cases */}
      <Card>
        <CardHeader><CardTitle className="text-base">Recent Active Cases</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          {activeCases.slice(0, 5).map((c) => (
            <Link key={c.id} to={`/police/cases/${c.id}`} className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:border-primary/40 hover:bg-primary/5">
              <div className="flex items-center gap-3">
                <img src={c.images[0]} alt="" className="h-10 w-10 rounded-lg object-cover" />
                <div>
                  <p className="text-sm font-medium">{c.fullName}</p>
                  <p className="text-xs text-muted-foreground">{c.caseNumber} · {c.lastSeenLocation}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn('rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase', statusVariant[c.status])}>{c.status}</span>
                <ExternalLink className="h-4 w-4 text-muted-foreground" />
              </div>
            </Link>
          ))}
          {activeCases.length === 0 && <EmptyState icon={ShieldCheck} title="No active cases" message="There are no missing or investigating cases right now." />}
        </CardContent>
      </Card>
    </div>
  );
}
