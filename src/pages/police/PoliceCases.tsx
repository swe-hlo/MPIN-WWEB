import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Search, Plus, Filter, X, Download } from 'lucide-react';
import { missingPersonsApi, type MissingPersonQuery } from '@/lib/api';
import { DashboardPageHeader } from '@/layouts/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { EmptyState } from '@/components/MissingPersonCard';
import { cn } from '@/lib/utils';
import type { CaseStatus } from '@/types';
import { useToast } from '@/hooks/use-toast';

const statuses: CaseStatus[] = ['MISSING', 'INVESTIGATING', 'FOUND', 'CLOSED', 'DECEASED'];
const statusVariant: Record<string, string> = {
  MISSING: 'bg-destructive/10 text-destructive border-destructive/30',
  INVESTIGATING: 'bg-warning/10 text-warning border-warning/30',
  FOUND: 'bg-success/10 text-success border-success/30',
  CLOSED: 'bg-muted text-muted-foreground border-border',
  DECEASED: 'bg-foreground/10 text-foreground/70 border-border',
};

export default function PoliceCases() {
  const { toast } = useToast();
  const [q, setQ] = useState<MissingPersonQuery>({ size: 50 });
  const [showFilters, setShowFilters] = useState(false);

  const { data, isLoading } = useQuery({ queryKey: ['missingPersons', q], queryFn: () => missingPersonsApi.list(q) });
  const set = (k: keyof MissingPersonQuery, v: string | number | undefined) => setQ((prev) => ({ ...prev, [k]: v === '' || v == null ? undefined : v }));

  const exportCsv = () => {
    const rows = data?.content ?? [];
    const header = ['Case Number', 'Name', 'Age', 'Gender', 'Status', 'Last Seen', 'Location'];
    const csv = [header.join(','), ...rows.map((r) => [r.caseNumber, r.fullName, r.age, r.gender, r.status, r.lastSeenDate, r.lastSeenLocation].join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'mpin-cases.csv'; a.click();
    URL.revokeObjectURL(url);
    toast({ title: 'Report downloaded', description: 'Cases exported as CSV.' });
  };

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Missing Persons"
        description="All registered cases in the system."
        action={
          <div className="flex gap-2">
            <Button variant="outline" onClick={exportCsv}><Download className="mr-2 h-4 w-4" />Export</Button>
            <Button asChild><Link to="/police/register"><Plus className="mr-2 h-4 w-4" />Register Case</Link></Button>
          </div>
        }
      />

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
              <div className="space-y-1.5"><Label>Status</Label><Select value={q.status ?? ''} onValueChange={(v) => set('status', v as CaseStatus)}><SelectTrigger><SelectValue placeholder="Any" /></SelectTrigger><SelectContent>{statuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
              <div className="space-y-1.5"><Label>State</Label><Select value={q.state ?? ''} onValueChange={(v) => set('state', v)}><SelectTrigger><SelectValue placeholder="Any" /></SelectTrigger><SelectContent><SelectItem value="Delhi">Delhi</SelectItem><SelectItem value="Maharashtra">Maharashtra</SelectItem><SelectItem value="Karnataka">Karnataka</SelectItem></SelectContent></Select></div>
              <div className="space-y-1.5"><Label>Min Age</Label><Input type="number" value={q.minAge ?? ''} onChange={(e) => set('minAge', Number(e.target.value))} /></div>
              <div className="space-y-1.5"><Label>Max Age</Label><Input type="number" value={q.maxAge ?? ''} onChange={(e) => set('maxAge', Number(e.target.value))} /></div>
              <Button variant="ghost" onClick={() => setQ({ size: 50 })} className="sm:col-span-3 lg:col-span-1"><X className="mr-2 h-4 w-4" />Clear</Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <p className="py-10 text-center text-sm text-muted-foreground">Loading cases...</p>
          ) : !data || data.content.length === 0 ? (
            <EmptyState title="No cases found" message="Try adjusting filters or register a new case." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Person</TableHead>
                  <TableHead className="hidden md:table-cell">Case No.</TableHead>
                  <TableHead className="hidden lg:table-cell">Last Seen</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden sm:table-cell">Priority</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.content.map((c) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img src={c.images[0]} alt="" className="h-10 w-10 rounded-lg object-cover" />
                        <div><p className="text-sm font-medium">{c.fullName}</p><p className="text-xs text-muted-foreground">{c.age} yrs · {c.gender}</p></div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden font-mono text-xs md:table-cell">{c.caseNumber}</TableCell>
                    <TableCell className="hidden text-xs text-muted-foreground lg:table-cell">{new Date(c.lastSeenDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</TableCell>
                    <TableCell><span className={cn('rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase', statusVariant[c.status])}>{c.status}</span></TableCell>
                    <TableCell className="hidden sm:table-cell"><Badge variant="outline">{c.priority}</Badge></TableCell>
                    <TableCell><Button asChild variant="ghost" size="sm"><Link to={`/police/cases/${c.id}`}>View</Link></Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
