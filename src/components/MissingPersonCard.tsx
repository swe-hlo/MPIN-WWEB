import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Calendar, User, Eye, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { MissingPerson } from '@/types';

const statusVariant: Record<MissingPerson['status'], string> = {
  MISSING: 'bg-destructive/10 text-destructive border-destructive/30',
  INVESTIGATING: 'bg-warning/10 text-warning border-warning/30',
  FOUND: 'bg-success/10 text-success border-success/30',
  CLOSED: 'bg-muted text-muted-foreground border-border',
  DECEASED: 'bg-foreground/10 text-foreground/70 border-border',
};

const priorityDot: Record<MissingPerson['priority'], string> = {
  LOW: 'bg-muted-foreground',
  MEDIUM: 'bg-info',
  HIGH: 'bg-warning',
  CRITICAL: 'bg-destructive',
};

export function MissingPersonCard({ person, index = 0 }: { person: MissingPerson; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.04, 0.3) }}
    >
      <Link to={`/person/${person.id}`} className="group block">
        <div className="overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/40 hover:shadow-xl hover:shadow-foreground/5">
          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
            <img
              src={person.images[0]}
              alt={person.fullName}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
            <div className="absolute left-3 top-3 flex gap-1.5">
              <span className={cn('rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md', statusVariant[person.status])}>
                {person.status}
              </span>
            </div>
            <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full border border-white/20 bg-background/80 px-2 py-0.5 text-[10px] font-semibold backdrop-blur-md">
              <span className={cn('h-1.5 w-1.5 rounded-full', priorityDot[person.priority])} />
              {person.priority}
            </div>
            <div className="absolute bottom-3 left-3 right-3">
              <p className="truncate font-display text-base font-bold text-white drop-shadow">{person.fullName}</p>
              <p className="text-xs text-white/80">{person.caseNumber}</p>
            </div>
          </div>
          <div className="space-y-2.5 p-4">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><User className="h-3.5 w-3.5" />{person.age} yrs · {person.gender}</span>
              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{person.city ?? person.district}</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span>Missing since {new Date(person.lastSeenDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-2.5">
              <span className="truncate text-xs text-muted-foreground">{person.lastSeenLocation}</span>
              <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-primary transition-colors group-hover:gap-1.5">
                <Eye className="h-3.5 w-3.5" />View
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export function MissingPersonCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      <div className="aspect-[4/3] animate-pulse bg-muted" />
      <div className="space-y-2.5 p-4">
        <div className="h-4 w-2/3 animate-pulse rounded bg-muted" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
        <div className="h-3 w-3/4 animate-pulse rounded bg-muted" />
      </div>
    </div>
  );
}

export function EmptyState({ icon: Icon = AlertCircle, title, message, children }: { icon?: typeof AlertCircle; title: string; message: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border py-16 text-center">
      <div className="grid h-14 w-14 place-items-center rounded-full bg-muted text-muted-foreground">
        <Icon className="h-7 w-7" />
      </div>
      <div>
        <p className="font-display text-lg font-bold">{title}</p>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">{message}</p>
      </div>
      {children}
    </div>
  );
}
