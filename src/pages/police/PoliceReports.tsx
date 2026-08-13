import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ClipboardList, MapPin, Clock, User, Phone, Eye, CheckCircle2, XCircle, ExternalLink } from 'lucide-react';
import { sightingsApi, missingPersonsApi } from '@/lib/api';
import { DashboardPageHeader } from '@/layouts/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { EmptyState } from '@/components/MissingPersonCard';

const statusConfig = {
  NEW: { label: 'New', class: 'bg-warning/10 text-warning border-warning/30' },
  VERIFIED: { label: 'Verified', class: 'bg-success/10 text-success border-success/30' },
  REJECTED: { label: 'Rejected', class: 'bg-destructive/10 text-destructive border-destructive/30' },
};

export default function PoliceReports() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const { data: reports } = useQuery({ queryKey: ['sightings'], queryFn: sightingsApi.list });
  const { data: cases } = useQuery({ queryKey: ['missingPersons', { size: 100 }], queryFn: () => missingPersonsApi.list({ size: 100 }) });

  const verifyMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'VERIFIED' | 'REJECTED' }) => sightingsApi.updateStatus(id, status),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['sightings'] }); toast({ title: 'Report status updated' }); },
  });

  const findCase = (caseId: string | null) => cases?.content.find((c) => c.id === caseId);

  return (
    <div className="space-y-6">
      <DashboardPageHeader title="Citizen Reports" description="Sighting reports submitted by the public and volunteers." />

      {(!reports || reports.length === 0) ? (
        <EmptyState icon={ClipboardList} title="No reports yet" message="Sighting reports from citizens will appear here." />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {reports.map((r, i) => {
            const linkedCase = findCase(r.caseId);
            const cfg = statusConfig[r.status];
            return (
              <motion.div key={r.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {r.imageUrl ? <img src={r.imageUrl} alt="" className="h-14 w-14 rounded-lg object-cover" /> : <div className="grid h-14 w-14 place-items-center rounded-lg bg-muted"><Eye className="h-6 w-6 text-muted-foreground" /></div>}
                        <div>
                          <p className="font-semibold">{r.reporterName}</p>
                          <p className="text-xs text-muted-foreground">{new Date(r.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className={cn('border', cfg.class)}>{cfg.label}</Badge>
                    </div>

                    <div className="mt-4 space-y-1.5 text-sm">
                      <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" />{r.location}</p>
                      <p className="flex items-center gap-2"><Clock className="h-4 w-4 text-muted-foreground" />{r.date} {r.time && `at ${r.time}`}</p>
                      <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" />{r.contactNumber}</p>
                      {r.description && <p className="rounded-lg bg-muted/50 p-2.5 text-xs">{r.description}</p>}
                    </div>

                    {r.mapsLink && (
                      <Button asChild variant="ghost" size="sm" className="mt-2">
                        <a href={r.mapsLink} target="_blank" rel="noreferrer"><ExternalLink className="mr-2 h-3.5 w-3.5" />Open in Maps</a>
                      </Button>
                    )}

                    {linkedCase && (
                      <div className="mt-3 rounded-lg border border-border p-2.5">
                        <p className="text-xs text-muted-foreground">Linked case</p>
                        <Link to={`/police/cases/${linkedCase.id}`} className="flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                          <User className="h-3.5 w-3.5" />{linkedCase.fullName} — {linkedCase.caseNumber}
                        </Link>
                      </div>
                    )}

                    {r.status === 'NEW' && (
                      <div className="mt-4 flex gap-2">
                        <Button size="sm" className="flex-1" onClick={() => verifyMutation.mutate({ id: r.id, status: 'VERIFIED' })}>
                          <CheckCircle2 className="mr-2 h-4 w-4" />Verify
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 text-destructive" onClick={() => verifyMutation.mutate({ id: r.id, status: 'REJECTED' })}>
                          <XCircle className="mr-2 h-4 w-4" />Reject
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
