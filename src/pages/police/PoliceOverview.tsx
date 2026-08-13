import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Search, Activity, FileText, HeartHandshake, ClipboardList, Plus, ArrowRight, MapPin, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { statsApi, missingPersonsApi, sightingsApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { StatCard } from '@/components/StatCard';
import { DashboardPageHeader } from '@/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const statusVariant: Record<string, string> = {
  MISSING: 'bg-destructive/10 text-destructive border-destructive/30',
  INVESTIGATING: 'bg-warning/10 text-warning border-warning/30',
  FOUND: 'bg-success/10 text-success border-success/30',
  CLOSED: 'bg-muted text-muted-foreground border-border',
  DECEASED: 'bg-foreground/10 text-foreground/70 border-border',
};

export default function PoliceOverview() {
  const { user } = useAuth();
  const { data: stats } = useQuery({ queryKey: ['stats'], queryFn: statsApi.dashboard });
  const { data: cases } = useQuery({ queryKey: ['missingPersons', { stationId: user?.stationId ?? undefined, size: 100 }], queryFn: () => missingPersonsApi.list({ stationId: user?.stationId ?? undefined, size: 100 }) });
  const { data: reports } = useQuery({ queryKey: ['sightings'], queryFn: sightingsApi.list });

  const stationCases = cases?.content ?? [];
  const newReports = reports?.filter((r) => r.status === 'NEW') ?? [];

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title={`Welcome, ${user?.fullName.split(' ')[0]}`}
        description="Your station overview and active investigations."
        action={<Button asChild><Link to="/police/register"><Plus className="mr-2 h-4 w-4" />Register Case</Link></Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard index={0} label="My Station Cases" value={stationCases.length} icon={FileText} color="primary" />
        <StatCard index={1} label="Active Investigations" value={stationCases.filter((c) => c.status === 'INVESTIGATING').length} icon={Activity} color="warning" />
        <StatCard index={2} label="Persons Found" value={stationCases.filter((c) => c.status === 'FOUND').length} icon={HeartHandshake} color="success" />
        <StatCard index={3} label="New Reports" value={newReports.length} icon={ClipboardList} color="info" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Recent Cases at Your Station</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {stationCases.slice(0, 6).map((c) => (
              <Link key={c.id} to={`/police/cases/${c.id}`} className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:border-primary/40 hover:bg-primary/5">
                <div className="flex items-center gap-3">
                  <img src={c.images[0]} alt="" className="h-11 w-11 rounded-lg object-cover" />
                  <div>
                    <p className="text-sm font-medium">{c.fullName}</p>
                    <p className="text-xs text-muted-foreground">{c.caseNumber} · {c.age} yrs</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={cn('rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase', statusVariant[c.status])}>{c.status}</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </Link>
            ))}
            {stationCases.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">No cases at your station yet.</p>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Pending Sighting Reports</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {newReports.slice(0, 5).map((r) => (
              <div key={r.id} className="rounded-lg border border-border p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{r.reporterName}</p>
                  <Badge variant="secondary" className="bg-warning/10 text-warning">NEW</Badge>
                </div>
                <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{r.location}</p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="h-3 w-3" />{r.date} {r.time}</p>
              </div>
            ))}
            {newReports.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">No pending reports.</p>}
            <Button asChild variant="outline" size="sm" className="w-full"><Link to="/police/reports">View all reports</Link></Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Cases by Status</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={[
              { name: 'Missing', value: stationCases.filter((c) => c.status === 'MISSING').length },
              { name: 'Investigating', value: stationCases.filter((c) => c.status === 'INVESTIGATING').length },
              { name: 'Found', value: stationCases.filter((c) => c.status === 'FOUND').length },
              { name: 'Closed', value: stationCases.filter((c) => c.status === 'CLOSED').length },
            ]}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'hsl(215 16% 47%)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(215 16% 47%)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, fontSize: 13 }} cursor={{ fill: 'hsl(214 32% 88%)', fillOpacity: 0.2 }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="hsl(217 91% 45%)" barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
