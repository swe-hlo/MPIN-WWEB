import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Search, MapPin, Clock, Eye, Filter, X } from 'lucide-react';
import { missingPersonsApi, type MissingPersonQuery } from '@/lib/api';
import { DashboardPageHeader } from '@/layouts/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MissingPersonCard, MissingPersonCardSkeleton, EmptyState } from '@/components/MissingPersonCard';
import type { CaseStatus } from '@/types';

const statuses: CaseStatus[] = ['MISSING', 'INVESTIGATING', 'FOUND', 'CLOSED', 'DECEASED'];

export default function VolunteerCases() {
  const [q, setQ] = useState<MissingPersonQuery>({ size: 24 });
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading } = useQuery({ queryKey: ['missingPersons', q], queryFn: () => missingPersonsApi.list(q) });
  const set = (k: keyof MissingPersonQuery, v: string | number | undefined) => setQ((prev) => ({ ...prev, [k]: v === '' || v == null ? undefined : v }));

  return (
    <div className="space-y-6">
      <DashboardPageHeader title="Browse Cases" description="Search and browse all missing persons cases. Click a card to view full details." />

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search by name or case number..." value={q.search ?? ''} onChange={(e) => set('search', e.target.value)} className="pl-9" />
            </div>
            <Button variant="outline" onClick={() => setShowFilters((s) => !s)}><Filter className="mr-2 h-4 w-4" />Filters</Button>
          </div>
          {showFilters && (
            <div className="mt-4 grid gap-4 rounded-lg border border-border bg-muted/30 p-4 sm:grid-cols-3 lg:grid-cols-4">
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={q.status ?? ''} onValueChange={(v) => set('status', v as CaseStatus)}>
                  <SelectTrigger><SelectValue placeholder="Any" /></SelectTrigger>
                  <SelectContent>{statuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>State</Label>
                <Select value={q.state ?? ''} onValueChange={(v) => set('state', v)}>
                  <SelectTrigger><SelectValue placeholder="Any" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Delhi">Delhi</SelectItem>
                    <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                    <SelectItem value="Karnataka">Karnataka</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5"><Label>Min Age</Label><Input type="number" value={q.minAge ?? ''} onChange={(e) => set('minAge', Number(e.target.value))} /></div>
              <div className="space-y-1.5"><Label>Max Age</Label><Input type="number" value={q.maxAge ?? ''} onChange={(e) => set('maxAge', Number(e.target.value))} /></div>
              <Button variant="ghost" onClick={() => setQ({ size: 24 })} className="sm:col-span-3 lg:col-span-1"><X className="mr-2 h-4 w-4" />Clear</Button>
            </div>
          )}
        </CardContent>
      </Card>

      <p className="text-sm text-muted-foreground">{isLoading ? 'Searching...' : `${data?.totalElements ?? 0} ${data?.totalElements === 1 ? 'person' : 'persons'} found`}</p>

      {isLoading ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => <MissingPersonCardSkeleton key={i} />)}
        </div>
      ) : !data || data.content.length === 0 ? (
        <EmptyState icon={Search} title="No cases found" message="Try adjusting your search or filters." />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.content.map((p, i) => <MissingPersonCard key={p.id} person={p} index={i} />)}
        </div>
      )}
    </div>
  );
}
