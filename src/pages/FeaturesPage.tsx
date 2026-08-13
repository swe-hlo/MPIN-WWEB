import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Search, Eye, ShieldCheck, QrCode, Bell, TrendingUp, FileText, MapPin, Users,
  Download, Moon, Smartphone, Lock, ArrowRight, ClipboardList,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const groups = [
  {
    title: 'Public Portal',
    icon: Eye,
    features: [
      { icon: Search, title: 'Advanced Search', text: 'Filter by name, gender, age, state, district, city, and last-seen date.' },
      { icon: Eye, title: 'Report a Sighting', text: 'Submit photos, location pins, and timestamps — no login required.' },
      { icon: QrCode, title: 'QR Code Profiles', text: 'Every case has a scannable QR code for instant offline sharing.' },
      { icon: FileText, title: 'Full Case Details', text: 'Family contact, police contact, timeline, and photo gallery.' },
    ],
  },
  {
    title: 'Police Dashboard',
    icon: ShieldCheck,
    features: [
      { icon: FileText, title: 'Register & Edit Cases', text: 'File detailed missing person reports with all identifying fields.' },
      { icon: ClipboardList, title: 'Investigation Notes', text: 'Add timestamped notes and track the full investigation timeline.' },
      { icon: Users, title: 'Assign Volunteers', text: 'Assign nearby volunteers and notify them instantly.' },
      { icon: Download, title: 'Download Reports', text: 'Export case and sighting reports for offline records.' },
    ],
  },
  {
    title: 'Admin & Analytics',
    icon: TrendingUp,
    features: [
      { icon: TrendingUp, title: 'Live Analytics', text: 'State-wise, gender, and age distribution with monthly trends.' },
      { icon: Users, title: 'User Management', text: 'Manage officers, volunteers, departments, and stations.' },
      { icon: Bell, title: 'Activity & Logs', text: 'System logs and recent activity for full auditability.' },
      { icon: MapPin, title: 'Nearby Cases', text: 'Geo-contextual case discovery for faster response.' },
    ],
  },
];

const tech = [
  { icon: Lock, label: 'JWT Authentication' },
  { icon: ShieldCheck, label: 'Role-Based Authorization' },
  { icon: Moon, label: 'Dark Mode' },
  { icon: Smartphone, label: 'Fully Responsive' },
];

export default function FeaturesPage() {
  return (
    <div>
      <section className="relative border-b border-border bg-card/40 py-16 lg:py-20">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="container-page relative text-center">
          <Badge variant="secondary" className="mb-4">Features</Badge>
          <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">A complete toolkit for missing person cases</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">From the first report to a reunion — MPIN covers search, reporting, investigation, analytics, and coordination in one secure platform.</p>
        </div>
      </section>

      {groups.map((g, gi) => (
        <section key={g.title} className={`py-16 lg:py-20 ${gi % 2 ? 'bg-card/40 border-y border-border' : ''}`}>
          <div className="container-page">
            <div className="mb-10 flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary"><g.icon className="h-6 w-6" /></div>
              <div>
                <h2 className="font-display text-2xl font-bold tracking-tight">{g.title}</h2>
                <p className="text-sm text-muted-foreground">{g.features.length} capabilities</p>
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {g.features.map((f, i) => (
                <motion.div key={f.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                  <Card className="h-full"><CardContent className="p-6">
                    <div className="mb-4 grid h-11 w-11 place-items-center rounded-lg bg-accent/10 text-accent"><f.icon className="h-5 w-5" /></div>
                    <h3 className="mb-1.5 font-display text-base font-bold">{f.title}</h3>
                    <p className="text-sm text-muted-foreground">{f.text}</p>
                  </CardContent></Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="py-16 lg:py-20">
        <div className="container-page">
          <div className="grid gap-8 rounded-3xl border border-border bg-card p-8 lg:grid-cols-2 lg:p-12">
            <div>
              <Badge variant="secondary" className="mb-4">Built for trust</Badge>
              <h2 className="font-display text-3xl font-bold tracking-tight">Security & accessibility by default</h2>
              <p className="mt-4 text-muted-foreground">MPIN is engineered with government-grade security standards and a responsive, accessible interface that works on any device.</p>
              <Button asChild className="mt-6">
                <Link to="/search">Start searching <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {tech.map((t) => (
                <div key={t.label} className="flex items-center gap-3 rounded-xl border border-border bg-background p-4">
                  <t.icon className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">{t.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
