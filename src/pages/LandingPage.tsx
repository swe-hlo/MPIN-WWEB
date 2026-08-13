import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  ShieldCheck,
  Users,
  MapPin,
  FileText,
  Bell,
  QrCode,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Phone,
  HeartHandshake,
  Building2,
  Eye,
  Clock,
  Award,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useState } from 'react';

const stats = [
  { label: 'Persons Reunited', value: '12,480', icon: HeartHandshake },
  { label: 'Active Cases', value: '3,260', icon: Search },
  { label: 'Police Stations', value: '1,840', icon: Building2 },
  { label: 'Volunteers', value: '9,500', icon: Users },
];

const features = [
  {
    icon: Search,
    title: 'Centralized Search',
    description: 'Search the national missing persons database by name, age, gender, location, and last-seen date with advanced filters.',
  },
  {
    icon: Eye,
    title: 'Report a Sighting',
    description: 'Citizens can report possible sightings with photos, location pins, and timestamps — no login required.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure & Role-Based',
    description: 'JWT authentication with role-based access for admins, police officers, volunteers, and the public.',
  },
  {
    icon: QrCode,
    title: 'QR Code Profiles',
    description: 'Every missing person gets a shareable QR code linking to their full profile for offline distribution.',
  },
  {
    icon: Bell,
    title: 'Real-time Notifications',
    description: 'Instant alerts for new cases, sighting reports, status updates, and volunteer assignments.',
  },
  {
    icon: TrendingUp,
    title: 'Analytics & Reports',
    description: 'Interactive dashboards with state-wise, gender, and age distribution analytics plus PDF report exports.',
  },
];

const steps = [
  { icon: FileText, title: 'Register a Case', text: 'Police officers file a missing person report with full details and photos.' },
  { icon: Bell, title: 'Broadcast & Notify', text: 'The case is published publicly and nearby volunteers are notified instantly.' },
  { icon: Eye, title: 'Community Reports', text: 'Citizens report sightings; volunteers submit photos and location data.' },
  { icon: HeartHandshake, title: 'Reunite Families', text: 'Verified leads help investigators locate and reunite missing persons.' },
];

const testimonials = [
  {
    name: 'Inspector General Meera Nair',
    role: 'State Police, Karnataka',
    text: 'MPIN transformed how we coordinate across stations. Cases that once took weeks now close in days thanks to real-time sighting reports.',
  },
  {
    name: 'Sunil & Geeta Joshi',
    role: 'Parents, reunited',
    text: 'Our son was missing for 6 days. A volunteer saw his photo on MPIN, recognized him at a bus stand, and called us. We are forever grateful.',
  },
  {
    name: 'Anita Sharma',
    role: 'Volunteer Coordinator, NGO HopeLine',
    text: 'The assignment and notification system lets our 200+ volunteers act within minutes. It is the most effective tool we have used.',
  },
];

const faqs = [
  { q: 'Who can use MPIN?', a: 'Everyone. The public can search and report sightings without logging in. Police officers, volunteers, and administrators register for role-based access to case management tools.' },
  { q: 'Do I need to pay to use the platform?', a: 'No. MPIN is a government-grade public service platform. Searching, reporting sightings, and registering as a volunteer are completely free.' },
  { q: 'How are sighting reports verified?', a: 'Every sighting is reviewed by the assigned police officer. Reports include location, date, time, and optional photo. Officers mark reports as verified or rejected based on investigation.' },
  { q: 'Is my personal information secure?', a: 'Yes. MPIN uses JWT-based authentication, encrypted passwords, role-based authorization, and input validation to protect all data on the platform.' },
  { q: 'How does the QR code feature work?', a: 'Each missing person profile generates a unique QR code. Anyone can scan it with a phone camera to instantly open the full profile and report a sighting.' },
  { q: 'Can NGOs and volunteer groups participate?', a: 'Absolutely. Registered volunteers get a dedicated dashboard to track nearby cases, report sightings, and follow assigned cases with notifications.' },
];

function CountUp({ value }: { value: string }) {
  return <span className="tabular-nums">{value}</span>;
}

export default function LandingPage() {
  const [heroImg] = useState('https://images.pexels.com/photos/18113610/pexels-photo-18113610.jpeg?auto=compress&cs=tinysrgb&w=900');

  return (
    <div className="overflow-hidden">
      {/* HERO */}
      <section className="relative hero-gradient">
        <div className="absolute inset-0 grid-pattern opacity-40" />
        <div className="container-page relative grid items-center gap-12 py-16 lg:grid-cols-2 lg:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="secondary" className="mb-5 gap-1.5 border-primary/20 bg-primary/10 px-3 py-1.5 text-primary">
              <ShieldCheck className="h-3.5 w-3.5" />
              Government-grade public safety platform
            </Badge>
            <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Bringing missing persons
              <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">back home, together.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              MPIN is a centralized network connecting police, government agencies, NGOs, volunteers, and citizens to report, track, identify, and reunite missing persons with their families — securely and in real time.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="h-12 px-6 text-base shadow-lg shadow-primary/30">
                <Link to="/search">
                  <Search className="mr-2 h-5 w-5" />
                  Search Missing Persons
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-6 text-base">
                <Link to="/report-sighting">
                  <Eye className="mr-2 h-5 w-5" />
                  Report a Sighting
                </Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" />No login needed to search</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" />24x7 national helpline</span>
              <span className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" />Encrypted & secure</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative"
          >
            <div className="relative mx-auto max-w-md lg:ml-auto">
              <div className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-primary/20 to-accent/20 blur-2xl" />
              <div className="relative overflow-hidden rounded-[1.75rem] border border-border bg-card shadow-2xl shadow-foreground/20">
                <img src={heroImg} alt="Missing person awareness" className="aspect-[4/5] w-full object-cover" loading="eager" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/10 to-transparent" />
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/20 bg-background/80 p-4 backdrop-blur-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
                      <Bell className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">New sighting reported</p>
                      <p className="truncate text-xs text-muted-foreground">Connaught Place, New Delhi · 2 min ago</p>
                    </div>
                  </div>
                </motion.div>
              </div>
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -left-6 top-10 hidden rounded-2xl border border-border bg-card p-3.5 shadow-xl sm:block"
              >
                <div className="flex items-center gap-2.5">
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-success/15 text-success"><HeartHandshake className="h-4.5 w-4.5" /></div>
                  <div>
                    <p className="text-xs font-bold leading-none">12,480</p>
                    <p className="text-[10px] text-muted-foreground">Reunited</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-border bg-card/50">
        <div className="container-page grid grid-cols-2 gap-px overflow-hidden rounded-none lg:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex flex-col items-center gap-2 px-4 py-8 text-center lg:items-start lg:px-8 lg:text-left"
            >
              <s.icon className="h-7 w-7 text-primary" />
              <p className="font-display text-3xl font-extrabold tracking-tight text-foreground lg:text-4xl"><CountUp value={s.value} /></p>
              <p className="text-sm text-muted-foreground">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-20 lg:py-28">
        <div className="container-page">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <Badge variant="secondary" className="mb-4">Features</Badge>
            <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Everything needed to find the missing</h2>
            <p className="mt-4 text-lg text-muted-foreground">A unified toolkit for officers, volunteers, agencies, and the public — built for speed, trust, and scale.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
              >
                <Card className="group h-full border-border/60 transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
                  <CardContent className="p-6">
                    <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <f.icon className="h-6 w-6" />
                    </div>
                    <h3 className="mb-2 font-display text-lg font-bold">{f.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{f.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-y border-border bg-card/40 py-20 lg:py-28">
        <div className="container-page">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <Badge variant="secondary" className="mb-4">How it works</Badge>
            <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">From report to reunion in four steps</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-4">
            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative text-center"
              >
                <div className="relative mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/30">
                  <s.icon className="h-7 w-7" />
                  <span className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full bg-background text-xs font-bold text-primary ring-2 ring-primary/30">{i + 1}</span>
                </div>
                <h3 className="mb-2 font-display text-base font-bold">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.text}</p>
                {i < steps.length - 1 && (
                  <ArrowRight className="absolute -right-6 top-8 hidden h-5 w-5 text-muted-foreground/40 md:block" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ROLES */}
      <section className="py-20 lg:py-28">
        <div className="container-page">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <Badge variant="secondary" className="mb-4">For everyone</Badge>
            <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">One platform, four roles</h2>
            <p className="mt-4 text-lg text-muted-foreground">Tailored dashboards for every contributor in the network.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: ShieldCheck, title: 'Super Admin', text: 'Full control: users, departments, stations, volunteers, and system logs.' },
              { icon: Users, title: 'Police Officer', text: 'Register and manage cases, upload photos, add notes, assign volunteers.' },
              { icon: HeartHandshake, title: 'Volunteer', text: 'Track nearby cases, report sightings, and follow assigned cases.' },
              { icon: Eye, title: 'Public User', text: 'Search the database and report sightings — no account required.' },
            ].map((r, i) => (
              <motion.div key={r.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                <Card className="h-full">
                  <CardContent className="p-6 text-center">
                    <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl bg-accent/10 text-accent"><r.icon className="h-6 w-6" /></div>
                    <h3 className="mb-2 font-display text-base font-bold">{r.title}</h3>
                    <p className="text-sm text-muted-foreground">{r.text}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="border-y border-border bg-card/40 py-20 lg:py-28">
        <div className="container-page">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <Badge variant="secondary" className="mb-4">Testimonials</Badge>
            <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Trusted across the network</h2>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <Card className="h-full">
                  <CardContent className="flex h-full flex-col p-6">
                    <Award className="mb-4 h-8 w-8 text-primary/30" />
                    <p className="flex-1 text-sm leading-relaxed text-foreground/90">"{t.text}"</p>
                    <div className="mt-5 border-t border-border pt-4">
                      <p className="font-semibold">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 lg:py-28">
        <div className="container-page">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <Badge variant="secondary" className="mb-4">FAQ</Badge>
            <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Frequently asked questions</h2>
          </div>
          <div className="mx-auto max-w-3xl">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((f, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="border-b border-border">
                  <AccordionTrigger className="text-left text-base font-semibold hover:no-underline">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm leading-relaxed text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="pb-20 lg:pb-28">
        <div className="container-page">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary/80 px-6 py-14 text-center text-primary-foreground shadow-2xl shadow-primary/30 lg:px-12 lg:py-20">
            <div className="absolute inset-0 grid-pattern opacity-10" />
            <div className="relative">
              <Clock className="mx-auto mb-5 h-10 w-10" />
              <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Every second counts.</h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-primary-foreground/90">Join thousands of officers, volunteers, and citizens working to bring missing persons home.</p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Button asChild size="lg" variant="secondary" className="h-12 px-6 text-base">
                  <Link to="/register"><Users className="mr-2 h-5 w-5" />Join as Volunteer</Link>
                </Button>
                <Button asChild size="lg" className="h-12 border border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">
                  <Link to="/search"><Search className="mr-2 h-5 w-5" />Search Database</Link>
                </Button>
              </div>
              <p className="mt-8 flex items-center justify-center gap-2 text-sm text-primary-foreground/80">
                <Phone className="h-4 w-4" /> 24x7 Helpline: 1800-200-1200
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
