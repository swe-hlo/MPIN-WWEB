import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ShieldCheck, Plus, Trash2, MapPin, Phone, User } from 'lucide-react';
import { stationsApi } from '@/lib/api';
import { DashboardPageHeader } from '@/layouts/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

export default function AdminStations() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', state: '', district: '', city: '', contact: '', officerInCharge: '' });

  const { data } = useQuery({ queryKey: ['stations'], queryFn: stationsApi.list });
  const createMutation = useMutation({
    mutationFn: () => stationsApi.create({
      name: form.name, state: form.state, district: form.district, city: form.city || undefined,
      contact: form.contact || undefined, officerInCharge: form.officerInCharge || undefined,
    }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['stations'] }); setOpen(false); setForm({ name: '', state: '', district: '', city: '', contact: '', officerInCharge: '' }); toast({ title: 'Station created' }); },
  });
  const removeMutation = useMutation({
    mutationFn: (id: string) => stationsApi.remove(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['stations'] }); toast({ title: 'Station removed' }); },
  });

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Manage Police Stations"
        description="Police stations registered across the network."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Add Station</Button></DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader><DialogTitle>New Police Station</DialogTitle></DialogHeader>
              <div className="grid gap-4 py-2 sm:grid-cols-2">
                <div className="space-y-1.5 sm:col-span-2"><Label htmlFor="name">Station Name</Label><Input id="name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Connaught Place PS" /></div>
                <div className="space-y-1.5"><Label htmlFor="state">State</Label><Input id="state" value={form.state} onChange={(e) => setForm((f) => ({ ...f, state: e.target.value }))} /></div>
                <div className="space-y-1.5"><Label htmlFor="district">District</Label><Input id="district" value={form.district} onChange={(e) => setForm((f) => ({ ...f, district: e.target.value }))} /></div>
                <div className="space-y-1.5"><Label htmlFor="city">City</Label><Input id="city" value={form.city} onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))} /></div>
                <div className="space-y-1.5"><Label htmlFor="contact">Contact</Label><Input id="contact" value={form.contact} onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))} /></div>
                <div className="space-y-1.5 sm:col-span-2"><Label htmlFor="officer">Officer In Charge</Label><Input id="officer" value={form.officerInCharge} onChange={(e) => setForm((f) => ({ ...f, officerInCharge: e.target.value }))} /></div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button onClick={() => createMutation.mutate()} disabled={!form.name || !form.state || !form.district || createMutation.isPending}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data?.map((s, i) => (
          <motion.div key={s.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card className="group h-full">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-info/10 text-info"><ShieldCheck className="h-5 w-5" /></div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive" onClick={() => removeMutation.mutate(s.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <h3 className="mt-3 font-display text-base font-bold">{s.name}</h3>
                <div className="mt-2 space-y-1.5 text-xs text-muted-foreground">
                  <p className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{s.district}, {s.state}</p>
                  {s.contact && <p className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" />{s.contact}</p>}
                  {s.officerInCharge && <p className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" />{s.officerInCharge}</p>}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
