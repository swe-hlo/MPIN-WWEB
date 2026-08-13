import { useQuery } from '@tanstack/react-query';
import { UserCircle2, Phone, Mail, MapPin, ClipboardList } from 'lucide-react';
import { usersApi, missingPersonsApi } from '@/lib/api';
import { DashboardPageHeader } from '@/layouts/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { motion } from 'framer-motion';

function initials(name: string) {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
}

export default function AdminVolunteers() {
  const { data } = useQuery({ queryKey: ['users', { role: 'VOLUNTEER' }], queryFn: () => usersApi.list({ role: 'VOLUNTEER', size: 100 }) });
  const { data: cases } = useQuery({ queryKey: ['missingPersons', { size: 100 }], queryFn: () => missingPersonsApi.list({ size: 100 }) });

  const volunteers = data?.content ?? [];
  const allCases = cases?.content ?? [];

  return (
    <div className="space-y-6">
      <DashboardPageHeader title="Manage Volunteers" description={`${volunteers.length} volunteers registered on the network.`} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {volunteers.map((v, i) => {
          const assignedCount = allCases.filter((c) => c.assignedVolunteerIds?.includes(v.id)).length;
          return (
            <motion.div key={v.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="h-full">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12"><AvatarFallback className="bg-success/10 font-semibold text-success">{initials(v.fullName)}</AvatarFallback></Avatar>
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{v.fullName}</p>
                      <Badge variant={v.active ? 'default' : 'secondary'} className={v.active ? 'bg-success/10 text-success' : ''}>{v.active ? 'Active' : 'Inactive'}</Badge>
                    </div>
                  </div>
                  <div className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                    {v.phone && <p className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" />{v.phone}</p>}
                    <p className="flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" /><span className="truncate">{v.email}</span></p>
                    <p className="flex items-center gap-1.5"><ClipboardList className="h-3.5 w-3.5" />{assignedCount} assigned {assignedCount === 1 ? 'case' : 'cases'}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
        {volunteers.length === 0 && <p className="text-sm text-muted-foreground">No volunteers registered yet.</p>}
      </div>
    </div>
  );
}
