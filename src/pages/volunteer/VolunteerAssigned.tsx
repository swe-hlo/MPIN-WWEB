import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ClipboardList, MapPin, Clock, Eye, ArrowRight, Phone, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { missingPersonsApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { DashboardPageHeader } from '@/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { EmptyState } from '@/components/MissingPersonCard';

const statusVariant: Record<string, string> = {
  MISSING: 'bg-destructive/10 text-destructive border-destructive/30',
  INVESTIGATING: 'bg-warning/10 text-warning border-warning/30',
  FOUND: 'bg-success/10 text-success border-success/30',
  CLOSED: 'bg-muted text-muted-foreground border-border',
  DECEASED: 'bg-foreground/10 text-foreground/70 border-border',
};

export default function VolunteerAssigned() {
  const { user } = useAuth();
  const { data } = useQuery({ queryKey: ['missingPersons', { size: 100 }], queryFn: () => missingPersonsApi.list({ size: 100 }) });

  const assigned = (data?.content ?? []).filter((c) => c.assignedVolunteerIds?.includes(user?.id ?? ''));
  const active = assigned.filter((c) => c.status === 'MISSING' || c.status === 'INVESTIGATING');
  const resolved = assigned.filter((c) => c.status === 'FOUND' || c.status === 'CLOSED' || c.status === 'DECEASED');

  return (
    <div className="space-y-6">
      <DashboardPageHeader title="My Assigned Cases" description={`${assigned.length} cases assigned to you — ${active.length} active, ${resolved.length} resolved.`} />

      {active.length > 0 && (
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground"><span className="h-2 w-2 rounded-full bg-warning" />Active Assignments</h3>
          <div className="grid gap-4 lg:grid-cols-2">
            {active.map((c, i) => (
              <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="overflow-hidden">
                  <div className="flex gap-4 p-4">
                    <img src={c.images[0]} alt={c.fullName} className="h-24 w-24 shrink-0 rounded-lg object-cover" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold">{c.fullName}</p>
                          <p className="text-xs text-muted-foreground">{c.caseNumber} · {c.age} yrs · {c.gender}</p>
                        </div>
                        <span className={cn('shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase', statusVariant[c.status])}>{c.status}</span>
                      </div>
                      <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                        <p className="flex items-center gap-1"><MapPin className="h-3 w-3" />{c.lastSeenLocation}</p>
                        <p className="flex items-center gap-1"><Clock className="h-3 w-3" />{new Date(c.lastSeenDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                        {c.guardianContact && <p className="flex items-center gap-1"><Phone className="h-3 w-3" />{c.guardianContact}</p>}
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Button asChild size="sm" variant="outline"><Link to={`/person/${c.id}`}><Eye className="mr-1.5 h-3.5 w-3.5" />View Profile</Link></Button>
                        <Button asChild size="sm"><Link to={`/report-sighting?caseId=${c.id}`}>Report Sighting</Link></Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {resolved.length > 0 && (
        <div>
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground"><span className="h-2 w-2 rounded-full bg-success" />Resolved Cases</h3>
          <div className="grid gap-4 lg:grid-cols-2">
            {resolved.map((c, i) => (
              <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="opacity-75">
                  <div className="flex gap-4 p-4">
                    <img src={c.images[0]} alt={c.fullName} className="h-20 w-20 shrink-0 rounded-lg object-cover grayscale" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-semibold">{c.fullName}</p>
                          <p className="text-xs text-muted-foreground">{c.caseNumber}</p>
                        </div>
                        <span className={cn('shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase', statusVariant[c.status])}>{c.status}</span>
                      </div>
                      <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3" />{c.lastSeenLocation}</p>
                      <Button asChild size="sm" variant="ghost" className="mt-2 -ml-2"><Link to={`/person/${c.id}`}>View profile <ArrowRight className="ml-1 h-3.5 w-3.5" /></Link></Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {assigned.length === 0 && (
        <EmptyState icon={ClipboardList} title="No cases assigned" message="When a police officer assigns you to a case, it will appear here. Browse all cases to find people you can help search for." >
          <Button asChild className="mt-4"><Link to="/volunteer/cases">Browse Cases</Link></Button>
        </EmptyState>
      )}
    </div>
  );
}
