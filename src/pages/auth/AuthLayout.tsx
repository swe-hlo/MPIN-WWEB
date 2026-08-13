import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShieldCheck, HeartHandshake, Eye, Search } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';
import type { ReactNode } from 'react';

export function AuthLayout({ children, title, subtitle }: { children: ReactNode; title: string; subtitle: string }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-primary to-primary/80 p-10 text-primary-foreground lg:flex">
        <div className="absolute inset-0 grid-pattern opacity-10" />
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
        <Link to="/" className="relative">
          <Logo className="[&_span]:text-primary-foreground [&_.text-muted-foreground]:text-primary-foreground/70" />
        </Link>
        <div className="relative space-y-8">
          <motion.h2 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display text-3xl font-extrabold leading-tight">
            Every missing person deserves to be found.
          </motion.h2>
          <div className="space-y-4">
            {[
              { icon: Search, text: 'Search the national missing persons database' },
              { icon: Eye, text: 'Report sightings and help reunite families' },
              { icon: ShieldCheck, text: 'Secure, role-based access for officials' },
              { icon: HeartHandshake, text: 'Join a network of 9,500+ volunteers' },
            ].map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.1 }} className="flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-white/15"><f.icon className="h-5 w-5" /></div>
                <span className="text-primary-foreground/90">{f.text}</span>
              </motion.div>
            ))}
          </div>
        </div>
        <p className="relative text-sm text-primary-foreground/70">© {new Date().getFullYear()} MPIN — Missing Person Information Network</p>
      </div>

      {/* Form panel */}
      <div className="relative flex flex-col">
        <div className="flex items-center justify-between p-4">
          <Link to="/" className="lg:hidden"><Logo size="sm" /></Link>
          <div className="ml-auto"><ThemeToggle /></div>
        </div>
        <div className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
            <h1 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h1>
            <p className="mt-2 text-muted-foreground">{subtitle}</p>
            <div className="mt-8">{children}</div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
