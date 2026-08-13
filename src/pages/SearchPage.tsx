import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, SlidersHorizontal, X, SearchX } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MissingPersonCard, MissingPersonCardSkeleton, EmptyState } from '@/components/MissingPersonCard';
import { missingPersonsApi, stationsApi, type MissingPersonQuery } from '@/lib/api';
import type { CaseStatus } from '@/types';

const states = ['Delhi', 'Maharashtra', 'Karnataka'];
const districtMap: Record<string, string[]> = {
  Delhi: ['New Delhi', 'Central Delhi', 'South Delhi'],
  Maharashtra: ['Mumbai Suburban', 'Pune'],
  Karnataka: ['Bengaluru Urban', 'Mysuru'],
};
const statuses: CaseStatus[] = ['MISSING', 'INVESTIGATING', 'FOUND', 'CLOSED', 'DECEASED'];
const genders = ['MALE', 'FEMALE', 'OTHER'];

export default function SearchPage() {
  const [q, setQ] = useState<MissingPersonQuery>({ search: '', size: 24 });
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['missingPersons', q],
    queryFn: () => missingPersonsApi.list(q),
  });
  const { data: stations } = useQuery({ queryKey: ['stations'], queryFn: stationsApi.list });

  const activeFilterCount = useMemo(
    () => Object.entries(q).filter(([k, v]) => !['search', 'size', 'page'].includes(k) && v != null && v !== '').length,
    [q],
  );

  const set = (k: keyof MissingPersonQuery, v: string | number | undefined) =>
    setQ((prev) => ({ ...prev, [k]: v === '' || v == null ? undefined : v }));

  const clear = () => setQ({ search: '', size: 24 });

  return (
    <div className="bg-background">
      <section className="border-b border-border bg-card/40 py-10">
        <div className="container-page">
          <Badge variant="secondary" className="mb-3">Public Search</Badge>
          <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Search Missing Persons</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">Search the national database by name, age, gender, location, and last-seen date. No login required.</p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by name or case number..."
                value={q.search ?? ''}
                onChange={(e) => set('search', e.target.value)}
                className="h-12 pl-11 text-base"
              />
            </div>
            <Button
              variant="outline"
              size="lg"
              className="h-12 gap-2"
              onClick={() => setShowFilters((s) => !s)}
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && <Badge variant="default" className="ml-1">{activeFilterCount}</Badge>}
            </Button>
          </div>

          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              className="mt-4 overflow-hidden"
            >
              <div className="grid gap-4 rounded-2xl border border-border bg-card p-5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="space-y-1.5">
                  <Label>Gender</Label>
                  <Select value={q.gender ?? ''} onValueChange={(v) => set('gender', v)}>
                    <SelectTrigger><SelectValue placeholder="Any" /></SelectTrigger>
                    <SelectContent>
                      {genders.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>State</Label>
                  <Select value={q.state ?? ''} onValueChange={(v) => { set('state', v); set('district', ''); }}>
                    <SelectTrigger><SelectValue placeholder="Any" /></SelectTrigger>
                    <SelectContent>
                      {states.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>District</Label>
                  <Select value={q.district ?? ''} onValueChange={(v) => set('district', v)} disabled={!q.state}>
                    <SelectTrigger><SelectValue placeholder={q.state ? 'Any' : 'Select state first'} /></SelectTrigger>
                    <SelectContent>
                      {(q.state ? districtMap[q.state] ?? [] : []).map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Status</Label>
                  <Select value={q.status ?? ''} onValueChange={(v) => set('status', v as CaseStatus)}>
                    <SelectTrigger><SelectValue placeholder="Any" /></SelectTrigger>
                    <SelectContent>
                      {statuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Min Age</Label>
                  <Input type="number" min={0} max={120} placeholder="0" value={q.minAge ?? ''} onChange={(e) => set('minAge', Number(e.target.value))} />
                </div>
                <div className="space-y-1.5">
                  <Label>Max Age</Label>
                  <Input type="number" min={0} max={120} placeholder="120" value={q.maxAge ?? ''} onChange={(e) => set('maxAge', Number(e.target.value))} />
                </div>
                <div className="space-y-1.5">
                  <Label>From Date</Label>
                  <Input type="date" value={q.from ?? ''} onChange={(e) => set('from', e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label>To Date</Label>
                  <Input type="date" value={q.to ?? ''} onChange={(e) => set('to', e.target.value)} />
                </div>
                <div className="space-y-1.5 lg:col-span-2">
                  <Label>Police Station</Label>
                  <Select value={q.stationId ?? ''} onValueChange={(v) => set('stationId', v)}>
                    <SelectTrigger><SelectValue placeholder="Any station" /></SelectTrigger>
                    <SelectContent>
                      {stations?.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button variant="ghost" onClick={clear} className="w-full gap-2">
                    <X className="h-4 w-4" />Clear all
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      <section className="py-10">
        <div className="container-page">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {isLoading ? 'Searching...' : `${data?.totalElements ?? 0} ${data?.totalElements === 1 ? 'person' : 'persons'} found`}
            </p>
          </div>

          {isLoading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => <MissingPersonCardSkeleton key={i} />)}
            </div>
          ) : !data || data.content.length === 0 ? (
            <EmptyState icon={SearchX} title="No results found" message="Try adjusting your search terms or filters. If you recognize someone, report a sighting." />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {data.content.map((p, i) => <MissingPersonCard key={p.id} person={p} index={i} />)}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
