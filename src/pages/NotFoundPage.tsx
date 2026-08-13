import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { motion } from 'framer-motion';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background px-4 text-center">
      <Logo size="lg" />
      <motion.p initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="font-display text-8xl font-extrabold text-primary">404</motion.p>
      <div>
        <h1 className="font-display text-2xl font-bold">Page not found</h1>
        <p className="mt-2 text-muted-foreground">The page you are looking for doesn't exist or has moved.</p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild><Link to="/"><Home className="mr-2 h-4 w-4" />Back Home</Link></Button>
        <Button asChild variant="outline"><Link to="/search"><Search className="mr-2 h-4 w-4" />Search Missing Persons</Link></Button>
      </div>
    </div>
  );
}
