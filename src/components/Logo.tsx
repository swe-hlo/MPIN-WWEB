import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className, showText = true, size = 'md' }: { className?: string; showText?: boolean; size?: 'sm' | 'md' | 'lg' }) {
  const box = size === 'sm' ? 'h-8 w-8' : size === 'lg' ? 'h-12 w-12' : 'h-10 w-10';
  const icon = size === 'sm' ? 16 : size === 'lg' ? 24 : 20;
  const text = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-lg';
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <div className={cn('relative grid place-items-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/30', box)}>
        <Search size={icon} strokeWidth={2.5} />
        <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-success ring-2 ring-background" />
      </div>
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={cn('font-display font-extrabold tracking-tight text-foreground', text)}>MPIN</span>
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Missing Person Network</span>
        </div>
      )}
    </div>
  );
}
