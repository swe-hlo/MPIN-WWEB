import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Eye, EyeOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import { AuthLayout } from './AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { departmentsApi, stationsApi } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';
import type { UserRole } from '@/types';

const roles: { value: UserRole; label: string; desc: string }[] = [
  { value: 'VOLUNTEER', label: 'Volunteer', desc: 'Track cases, report sightings' },
  { value: 'POLICE_OFFICER', label: 'Police Officer', desc: 'Register & manage cases' },
  { value: 'PUBLIC_USER', label: 'Public User', desc: 'Report sightings' },
];

export default function RegisterPage() {
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '', email: '', password: '', confirm: '', phone: '',
    role: 'VOLUNTEER' as UserRole, departmentId: '', stationId: '',
  });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { data: departments } = useQuery({ queryKey: ['departments'], queryFn: departmentsApi.list });
  const { data: stations } = useQuery({ queryKey: ['stations'], queryFn: stationsApi.list });

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const user = await register({
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        role: form.role,
        phone: form.phone,
        departmentId: form.departmentId || undefined,
        stationId: form.stationId || undefined,
      });
      toast({ title: 'Account created', description: `Welcome to MPIN, ${user.fullName.split(' ')[0]}.` });
      const path = user.role === 'SUPER_ADMIN' ? '/admin' : user.role === 'POLICE_OFFICER' ? '/police' : user.role === 'VOLUNTEER' ? '/volunteer' : '/';
      navigate(path);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Create your account" subtitle="Join the MPIN network and help reunite families.">
      <form onSubmit={onSubmit} className="space-y-4">
        {error && (
          <div className="flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="fullName">Full Name</Label>
          <Input id="fullName" placeholder="Your full name" value={form.fullName} onChange={(e) => set('fullName', e.target.value)} required />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" value={form.email} onChange={(e) => set('email', e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" placeholder="+91 90000 00000" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
          </div>
        </div>

        <div className="space-y-2">
          <Label>I am registering as a</Label>
          <div className="grid gap-2.5 sm:grid-cols-3">
            {roles.map((r) => (
              <button
                key={r.value}
                type="button"
                onClick={() => set('role', r.value)}
                className={`rounded-lg border p-3 text-left transition-all ${form.role === r.value ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border hover:border-primary/40'}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">{r.label}</span>
                  {form.role === r.value && <CheckCircle2 className="h-4 w-4 text-primary" />}
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">{r.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {form.role === 'POLICE_OFFICER' && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="department">Department</Label>
              <Select value={form.departmentId} onValueChange={(v) => set('departmentId', v)}>
                <SelectTrigger id="department"><SelectValue placeholder="Select department" /></SelectTrigger>
                <SelectContent>{departments?.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="station">Police Station</Label>
              <Select value={form.stationId} onValueChange={(v) => set('stationId', v)}>
                <SelectTrigger id="station"><SelectValue placeholder="Select station" /></SelectTrigger>
                <SelectContent>{stations?.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input id="password" type={show ? 'text' : 'password'} placeholder="Min 6 characters" value={form.password} onChange={(e) => set('password', e.target.value)} required />
              <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirm">Confirm Password</Label>
            <Input id="confirm" type={show ? 'text' : 'password'} placeholder="Re-enter password" value={form.confirm} onChange={(e) => set('confirm', e.target.value)} required />
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Creating account...' : <><UserPlus className="mr-2 h-4 w-4" />Create Account</>}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-primary hover:underline">Sign in</Link>
      </p>
    </AuthLayout>
  );
}
