import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Shield, Heart } from 'lucide-react';
import { Logo } from '@/components/Logo';

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container-page py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Logo size="md" />
            <p className="max-w-xs text-sm text-muted-foreground">
              A centralized platform helping police, agencies, NGOs, volunteers, and citizens reunite missing persons with their families.
            </p>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Shield className="h-3.5 w-3.5 text-success" />
              <span>Secured platform · Government-grade encryption</span>
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-foreground">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/about" className="text-muted-foreground transition-colors hover:text-primary">About Us</Link></li>
              <li><Link to="/features" className="text-muted-foreground transition-colors hover:text-primary">Features</Link></li>
              <li><Link to="/search" className="text-muted-foreground transition-colors hover:text-primary">Search Missing Persons</Link></li>
              <li><Link to="/report-sighting" className="text-muted-foreground transition-colors hover:text-primary">Report a Sighting</Link></li>
              <li><Link to="/contact" className="text-muted-foreground transition-colors hover:text-primary">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-foreground">For Officials</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/login" className="text-muted-foreground transition-colors hover:text-primary">Police Login</Link></li>
              <li><Link to="/login" className="text-muted-foreground transition-colors hover:text-primary">Admin Login</Link></li>
              <li><Link to="/register" className="text-muted-foreground transition-colors hover:text-primary">Volunteer Registration</Link></li>
              <li><Link to="/features" className="text-muted-foreground transition-colors hover:text-primary">How It Works</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-foreground">Contact</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2.5">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>1800-200-1200 (24x7 Helpline)</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>helpdesk@mpin.gov.in</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>Ministry of Home Affairs, New Delhi, 110001</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>&copy; {new Date().getFullYear()} MPIN - Missing Person Information Network. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Built with <Heart className="h-3.5 w-3.5 text-destructive" fill="currentColor" /> for reuniting families
          </p>
        </div>
      </div>
    </footer>
  );
}
