import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Eye, EyeOff, AlertCircle, ShieldCheck } from 'lucide-react';
import { AuthLayout } from './AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

const demoAccounts = [
  { role: 'Super Admin', email: 'admin@mpin.gov.in', password: 'admin123' },
  { role: 'Police Officer', email: 'police@mpin.gov.in', password: 'police123' },
  { role: 'Volunteer', email: 'volunteer@mpin.gov.in', password: 'volunteer123' },
];

export default function LoginPage() {
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      toast({ title: `Welcome back, ${user.fullName.split(' ')[0]}`, description: 'Signed in successfully.' });
      const path = user.role === 'SUPER_ADMIN' ? '/admin' : user.role === 'POLICE_OFFICER' ? '/police' : user.role === 'VOLUNTEER' ? '/volunteer' : '/';
      navigate(path);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (acc: { email: string; password: string }) => {
    setEmail(acc.email);
    setPassword(acc.password);
  };

  return (
    <AuthLayout title="Sign in to MPIN" subtitle="Access your dashboard to manage cases and coordinate reunions.">
      <form onSubmit={onSubmit} className="space-y-5">
        {error && (
          <div className="flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        <div className="space-y-1.5">
          <Label htmlFor="email">Email Address</Label>
          <Input id="email" type="email" placeholder="you@mpin.gov.in" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link to="/forgot-password" className="text-xs font-medium text-primary hover:underline">Forgot password?</Link>
          </div>
          <div className="relative">
            <Input id="password" type={show ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
            <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="remember" defaultChecked />
          <Label htmlFor="remember" className="text-sm font-normal text-muted-foreground">Keep me signed in</Label>
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Signing in...' : <><LogIn className="mr-2 h-4 w-4" />Sign In</>}
        </Button>
      </form>

      <div className="mt-6 rounded-xl border border-border bg-muted/30 p-4">
        <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <ShieldCheck className="h-3.5 w-3.5" /> Demo accounts
        </p>
        <div className="grid gap-2">
          {demoAccounts.map((a) => (
            <button key={a.email} onClick={() => fillDemo(a)} className="flex items-center justify-between rounded-lg border border-border bg-background px-3 py-2 text-left text-sm transition-colors hover:border-primary/40 hover:bg-primary/5">
              <div>
                <p className="font-medium">{a.role}</p>
                <p className="text-xs text-muted-foreground">{a.email}</p>
              </div>
              <span className="text-xs font-medium text-primary">Use →</span>
            </button>
          ))}
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don't have an account?{' '}
        <Link to="/register" className="font-semibold text-primary hover:underline">Create one</Link>
      </p>
    </AuthLayout>
  );
}
