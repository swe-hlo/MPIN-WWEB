import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Building2, Plus, Trash2, MapPin } from 'lucide-react';
import { departmentsApi } from '@/lib/api';
import { DashboardPageHeader } from '@/layouts/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

export default function AdminDepartments() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', state: '', description: '' });

  const { data } = useQuery({ queryKey: ['departments'], queryFn: departmentsApi.list });
  const createMutation = useMutation({
    mutationFn: () => departmentsApi.create({ name: form.name, state: form.state, description: form.description || undefined }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['departments'] }); setOpen(false); setForm({ name: '', state: '', description: '' }); toast({ title: 'Department created' }); },
  });
  const removeMutation = useMutation({
    mutationFn: (id: string) => departmentsApi.remove(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['departments'] }); toast({ title: 'Department removed' }); },
  });

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Manage Departments"
        description="Police departments registered on the platform."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Add Department</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>New Department</DialogTitle></DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-1.5"><Label htmlFor="name">Department Name</Label><Input id="name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Delhi Police" /></div>
                <div className="space-y-1.5"><Label htmlFor="state">State</Label><Input id="state" value={form.state} onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))} placeholder="e.g. Delhi" /></div>
                <div className="space-y-1.5"><Label htmlFor="desc">Description (optional)</Label><Input id="desc" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} /></div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={() => createMutation.mutate()} disabled={!form.name || !form.state || createMutation.isPending}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data?.map((d, i) => (
          <motion.div key={d.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="group h-full">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary"><Building2 className="h-5 w-5" /></div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive" onClick={() => removeMutation.mutate(d.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <h3 className="mt-3 font-display text-base font-bold">{d.name}</h3>
                <Badge variant="secondary" className="mt-2 gap-1"><MapPin className="h-3 w-3" />{d.state}</Badge>
                {d.description && <p className="mt-2 text-xs text-muted-foreground">{d.description}</p>}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
