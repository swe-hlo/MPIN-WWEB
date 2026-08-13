import { useQuery } from '@tanstack/react-query';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area,
} from 'recharts';
import { Users, Search, ShieldCheck, HeartHandshake, Building2, ClipboardList, FileText, TrendingUp, Activity } from 'lucide-react';
import { statsApi, logsApi } from '@/lib/api';
import { StatCard } from '@/components/StatCard';
import { DashboardPageHeader } from '@/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

const COLORS = ['hsl(217 91% 45%)', 'hsl(142 71% 45%)', 'hsl(38 92% 50%)', 'hsl(199 89% 48%)', 'hsl(280 65% 60%)'];
const GENDER_COLORS = ['hsl(217 91% 45%)', 'hsl(280 65% 60%)', 'hsl(38 92% 50%)'];

export default function AdminOverview() {
  const { data: stats } = useQuery({ queryKey: ['stats'], queryFn: statsApi.dashboard });
  const { data: logs } = useQuery({ queryKey: ['logs'], queryFn: logsApi.list });

  return (
    <div className="space-y-6">
      <DashboardPageHeader title="System Overview" description="National missing persons network at a glance." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard index={0} label="Missing Persons" value={stats?.totalMissing ?? 0} icon={Search} color="destructive" />
        <StatCard index={1} label="Found Persons" value={stats?.totalFound ?? 0} icon={HeartHandshake} color="success" trend="this month" trendUp />
        <StatCard index={2} label="Active Cases" value={stats?.activeCases ?? 0} icon={Activity} color="warning" />
        <StatCard index={3} label="Closed Cases" value={stats?.closedCases ?? 0} icon={FileText} color="info" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard index={4} label="Police Stations" value={stats?.totalStations ?? 0} icon={ShieldCheck} color="primary" />
        <StatCard index={5} label="Volunteers" value={stats?.totalVolunteers ?? 0} icon={Users} color="info" />
        <StatCard index={6} label="Sighting Reports" value={stats?.totalReports ?? 0} icon={ClipboardList} color="warning" />
        <StatCard index={7} label="Total Users" value={stats?.totalUsers ?? 0} icon={Building2} color="primary" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><TrendingUp className="h-4 w-4 text-primary" />Monthly Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={stats?.monthly ?? []}>
                <defs>
                  <linearGradient id="gMissing" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(217 91% 45%)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(217 91% 45%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gFound" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(142 71% 45%)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(142 71% 45%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(214 32% 88%)" strokeOpacity={0.3} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(215 16% 47%)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'hsl(215 16% 47%)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid hsl(214 32% 88%)', fontSize: 13 }} />
                <Legend wrapperStyle={{ fontSize: 13 }} />
                <Area type="monotone" dataKey="missing" name="Missing" stroke="hsl(217 91% 45%)" strokeWidth={2} fill="url(#gMissing)" />
                <Area type="monotone" dataKey="found" name="Found" stroke="hsl(142 71% 45%)" strokeWidth={2} fill="url(#gFound)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Gender Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={stats?.byGender ?? []} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3}>
                  {(stats?.byGender ?? []).map((_, i) => <Cell key={i} fill={GENDER_COLORS[i % GENDER_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 13 }} />
                <Legend wrapperStyle={{ fontSize: 13 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">Missing Persons by State</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={stats?.byState ?? []} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 12, fill: 'hsl(215 16% 47%)' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: 'hsl(215 16% 47%)' }} axisLine={false} tickLine={false} width={90} />
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 13 }} cursor={{ fill: 'hsl(214 32% 88%)', fillOpacity: 0.2 }} />
                <Bar dataKey="value" name="Cases" radius={[0, 6, 6, 0]} fill="hsl(217 91% 45%)" barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Age Distribution</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={stats?.byAge ?? []}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} vertical={false} />
                <XAxis dataKey="range" tick={{ fontSize: 12, fill: 'hsl(215 16% 47%)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'hsl(215 16% 47%)' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 12, fontSize: 13 }} cursor={{ fill: 'hsl(214 32% 88%)', fillOpacity: 0.2 }} />
                <Bar dataKey="value" name="Persons" radius={[6, 6, 0, 0]} fill="hsl(199 89% 48%)" barSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-base">Recent Activity</CardTitle></CardHeader>
        <CardContent className="space-y-1">
          {logs?.slice(0, 8).map((log, i) => (
            <motion.div key={log.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }} className="flex items-center justify-between border-b border-border py-2.5 last:border-0">
              <div className="flex items-center gap-3">
                <div className={`h-2 w-2 rounded-full ${log.level === 'ERROR' ? 'bg-destructive' : log.level === 'WARN' ? 'bg-warning' : 'bg-success'}`} />
                <div>
                  <p className="text-sm font-medium">{log.userName ?? 'System'} · {log.action.replace(/_/g, ' ').toLowerCase()}</p>
                  {log.entity && <p className="text-xs text-muted-foreground">{log.entity} {log.entityId}</p>}
                </div>
              </div>
              <Badge variant="outline" className="text-xs">{new Date(log.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</Badge>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
