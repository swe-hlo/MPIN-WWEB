import { motion } from 'framer-motion';
import { Target, Eye, Heart, ShieldCheck, Users, TrendingUp, Building2, Award } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const values = [
  { icon: ShieldCheck, title: 'Security & Trust', text: 'Government-grade encryption, JWT auth, and role-based access keep sensitive data protected at every layer.' },
  { icon: Users, title: 'Collaboration', text: 'We unite police, agencies, NGOs, volunteers, and citizens on a single, real-time platform.' },
  { icon: TrendingUp, title: 'Transparency', text: 'Open data, public search, and live analytics build public trust and accountability.' },
  { icon: Heart, title: 'Compassion', text: 'Behind every case is a family. We design every feature around reuniting loved ones.' },
];

export default function AboutPage() {
  return (
    <div>
      <section className="relative border-b border-border bg-card/40 py-16 lg:py-24">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="container-page relative">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mx-auto max-w-3xl text-center">
            <Badge variant="secondary" className="mb-4">About MPIN</Badge>
            <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">A national mission to reunite families</h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
              The Missing Person Information Network (MPIN) is a centralized web platform that empowers police departments, government agencies, NGOs, volunteers, and citizens to collaborate in reporting, tracking, identifying, and reuniting missing persons with their families.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <div className="space-y-5">
            <Badge variant="secondary" className="w-fit">Our Mission</Badge>
            <h2 className="font-display text-3xl font-bold tracking-tight">Reduce the time it takes to find the missing</h2>
            <p className="text-muted-foreground">Every minute matters. MPIN replaces fragmented, paper-based reporting with a real-time, searchable, and secure network that connects the people who care with the information they need.</p>
            <div className="space-y-3 pt-2">
              {['Real-time case broadcasting to nearby volunteers', 'Centralized, searchable national database', 'Verified sighting reports from citizens', 'Analytics to allocate resources effectively'].map((p) => (
                <div key={p} className="flex items-start gap-3 text-sm">
                  <Target className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                  <span>{p}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-5">
            <Badge variant="secondary" className="w-fit">Our Vision</Badge>
            <h2 className="font-display text-3xl font-bold tracking-tight">No missing person goes unfound</h2>
            <p className="text-muted-foreground">We envision a future where every reported missing person is located quickly through coordinated community action, technology, and trusted institutional support.</p>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <Card><CardContent className="p-5 text-center"><Building2 className="mx-auto mb-2 h-7 w-7 text-primary" /><p className="text-2xl font-extrabold">1,840+</p><p className="text-xs text-muted-foreground">Police stations</p></CardContent></Card>
              <Card><CardContent className="p-5 text-center"><Users className="mx-auto mb-2 h-7 w-7 text-primary" /><p className="text-2xl font-extrabold">9,500+</p><p className="text-xs text-muted-foreground">Volunteers</p></CardContent></Card>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-card/40 py-16 lg:py-24">
        <div className="container-page">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <Badge variant="secondary" className="mb-4">Our Values</Badge>
            <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">What we stand for</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <motion.div key={v.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                <Card className="h-full"><CardContent className="p-6">
                  <div className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary"><v.icon className="h-6 w-6" /></div>
                  <h3 className="mb-2 font-display text-base font-bold">{v.title}</h3>
                  <p className="text-sm text-muted-foreground">{v.text}</p>
                </CardContent></Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="container-page">
          <div className="mx-auto max-w-3xl rounded-3xl border border-border bg-card p-8 text-center lg:p-12">
            <Award className="mx-auto mb-4 h-10 w-10 text-primary" />
            <h2 className="font-display text-2xl font-bold tracking-tight">Built with public service at heart</h2>
            <p className="mt-3 text-muted-foreground">MPIN is developed as a secure, scalable, and modern government portal — open to citizens and trusted by institutions.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
