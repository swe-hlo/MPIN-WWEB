import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, LogIn, UserPlus, Search, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { ThemeToggle } from '@/components/ThemeToggle';
import { cn } from '@/lib/utils';

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/features', label: 'Features' },
  { to: '/search', label: 'Search' },
  { to: '/report-sighting', label: 'Report Sighting' },
  { to: '/contact', label: 'Contact' },
];

export function PublicNavbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const scrolled = location.pathname !== '/';

  return (
    <header className={cn('sticky top-0 z-50 w-full border-b backdrop-blur-xl transition-colors', scrolled ? 'border-border bg-background/85' : 'border-transparent bg-background/60')}>
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link to="/" className="shrink-0">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                cn(
                  'relative rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground',
                )
              }
            >
              {({ isActive }) => (
                <>
                  {l.label}
                  {isActive && (
                    <motion.span layoutId="nav-active" className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-primary" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <Button asChild variant="ghost" size="sm">
            <Link to="/login"><LogIn className="mr-1.5 h-4 w-4" />Login</Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/register"><UserPlus className="mr-1.5 h-4 w-4" />Register</Link>
          </Button>
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={() => setOpen((o) => !o)} aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-border bg-background md:hidden"
          >
            <div className="container-page flex flex-col gap-1 py-4">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.to === '/'}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn('rounded-md px-3 py-2.5 text-sm font-medium', isActive ? 'bg-primary/10 text-primary' : 'text-foreground hover:bg-muted')
                  }
                >
                  {l.label}
                </NavLink>
              ))}
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link to="/login" onClick={() => setOpen(false)}><LogIn className="mr-1.5 h-4 w-4" />Login</Link>
                </Button>
                <Button asChild size="sm" className="w-full">
                  <Link to="/register" onClick={() => setOpen(false)}><UserPlus className="mr-1.5 h-4 w-4" />Register</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Emergency strip */}
      <div className="hidden h-9 items-center gap-2 bg-primary px-4 text-xs font-medium text-primary-foreground lg:flex">
        <AlertTriangle className="h-3.5 w-3.5" />
        <span>National Helpline: 1800-200-1200</span>
        <span className="mx-2 h-3 w-px bg-primary-foreground/30" />
        <Search className="h-3.5 w-3.5" />
        <Link to="/search" className="underline-offset-2 hover:underline">Search missing persons database</Link>
      </div>
    </header>
  );
}
