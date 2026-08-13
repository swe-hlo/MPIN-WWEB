import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Users, Search, ShieldCheck, UserCircle2, Eye, MoreVertical, Trash2, UserCheck, UserX } from 'lucide-react';
import { usersApi } from '@/lib/api';
import { DashboardPageHeader } from '@/layouts/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import type { User, UserRole } from '@/types';

const roleVariant: Record<UserRole, string> = {
  SUPER_ADMIN: 'bg-primary/10 text-primary border-primary/30',
  POLICE_OFFICER: 'bg-info/10 text-info border-info/30',
  VOLUNTEER: 'bg-success/10 text-success border-success/30',
  PUBLIC_USER: 'bg-muted text-muted-foreground border-border',
};
const roleIcon = { SUPER_ADMIN: ShieldCheck, POLICE_OFFICER: Users, VOLUNTEER: UserCircle2, PUBLIC_USER: Eye };

function initials(name: string) {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
}

export default function AdminUsers() {
  const { toast } = useToast();
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [role, setRole] = useState<string>('');

  const { data } = useQuery({
    queryKey: ['users', { role }],
    queryFn: () => usersApi.list({ role: role ? (role as UserRole) : undefined, size: 100 }),
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => usersApi.toggleActive(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); toast({ title: 'User status updated' }); },
  });
  const roleMutation = useMutation({
    mutationFn: ({ id, r }: { id: string; r: UserRole }) => usersApi.updateRole(id, r),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); toast({ title: 'Role updated' }); },
  });
  const removeMutation = useMutation({
    mutationFn: (id: string) => usersApi.remove(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); toast({ title: 'User removed' }); },
  });

  const filtered = (data?.content ?? []).filter((u) =>
    !search || u.fullName.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <DashboardPageHeader title="Manage Users" description="View, activate, and manage roles for all platform users." />

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="w-full sm:w-48"><SelectValue placeholder="All roles" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="SUPER_ADMIN">Super Admin</SelectItem>
                <SelectItem value="POLICE_OFFICER">Police Officer</SelectItem>
                <SelectItem value="VOLUNTEER">Volunteer</SelectItem>
                <SelectItem value="PUBLIC_USER">Public User</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="hidden md:table-cell">Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden lg:table-cell">Joined</TableHead>
                <TableHead className="w-10" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((u: User) => {
                const RoleIcon = roleIcon[u.role];
                return (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar><AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">{initials(u.fullName)}</AvatarFallback></Avatar>
                        <div>
                          <p className="text-sm font-medium">{u.fullName}</p>
                          <p className="text-xs text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold', roleVariant[u.role])}>
                        <RoleIcon className="h-3 w-3" />{u.role.replace(/_/g, ' ').toLowerCase()}
                      </span>
                    </TableCell>
                    <TableCell className="hidden text-sm text-muted-foreground md:table-cell">{u.phone ?? '—'}</TableCell>
                    <TableCell>
                      <Badge variant={u.active ? 'default' : 'secondary'} className={u.active ? 'bg-success/10 text-success' : ''}>
                        {u.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden text-sm text-muted-foreground lg:table-cell">{new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => toggleMutation.mutate(u.id)}>
                            {u.active ? <><UserX className="mr-2 h-4 w-4" />Deactivate</> : <><UserCheck className="mr-2 h-4 w-4" />Activate</>}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => roleMutation.mutate({ id: u.id, r: 'POLICE_OFFICER' })}>Make Police Officer</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => roleMutation.mutate({ id: u.id, r: 'VOLUNTEER' })}>Make Volunteer</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => roleMutation.mutate({ id: u.id, r: 'PUBLIC_USER' })}>Make Public User</DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive" onClick={() => removeMutation.mutate(u.id)}>
                            <Trash2 className="mr-2 h-4 w-4" />Remove user
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          {filtered.length === 0 && <p className="py-10 text-center text-sm text-muted-foreground">No users found.</p>}
        </CardContent>
      </Card>
    </div>
  );
}
