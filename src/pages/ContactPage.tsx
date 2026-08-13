import { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send, MessageSquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

export default function ContactPage() {
  const { toast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast({ title: 'Message sent', description: 'We will get back to you within 24 hours.' });
      (e.target as HTMLFormElement).reset();
    }, 800);
  };

  const cards = [
    { icon: Phone, title: 'Helpline', value: '1800-200-1200', sub: '24x7, toll-free' },
    { icon: Mail, title: 'Email', value: 'helpdesk@mpin.gov.in', sub: 'Response within 24 hours' },
    { icon: MapPin, title: 'Office', value: 'Ministry of Home Affairs', sub: 'New Delhi, 110001' },
    { icon: Clock, title: 'Hours', value: 'Monday – Sunday', sub: 'Round the clock support' },
  ];

  return (
    <div>
      <section className="relative border-b border-border bg-card/40 py-16 lg:py-20">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="container-page relative text-center">
          <Badge variant="secondary" className="mb-4">Contact</Badge>
          <h1 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">We are here to help</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">Reach out for support, partnerships, or to report an issue. Our team responds around the clock.</p>
        </div>
      </section>

      <section className="py-16 lg:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-5">
          <div className="space-y-4 lg:col-span-2">
            {cards.map((c, i) => (
              <motion.div key={c.title} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <Card><CardContent className="flex items-center gap-4 p-5">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"><c.icon className="h-6 w-6" /></div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{c.title}</p>
                    <p className="font-display text-lg font-bold">{c.value}</p>
                    <p className="text-xs text-muted-foreground">{c.sub}</p>
                  </div>
                </CardContent></Card>
              </motion.div>
            ))}
          </div>

          <div className="lg:col-span-3">
            <Card><CardContent className="p-6 lg:p-8">
              <div className="mb-6 flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary text-primary-foreground"><MessageSquare className="h-5 w-5" /></div>
                <div>
                  <h2 className="font-display text-xl font-bold">Send us a message</h2>
                  <p className="text-sm text-muted-foreground">Fill the form and we will respond shortly.</p>
                </div>
              </div>
              <form onSubmit={onSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="Your name" required />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="you@example.com" required />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="How can we help?" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Tell us more..." rows={5} required />
                </div>
                <Button type="submit" disabled={submitting} className="w-full sm:w-auto">
                  {submitting ? 'Sending...' : <><Send className="mr-2 h-4 w-4" />Send Message</>}
                </Button>
              </form>
            </CardContent></Card>
          </div>
        </div>
      </section>
    </div>
  );
}
