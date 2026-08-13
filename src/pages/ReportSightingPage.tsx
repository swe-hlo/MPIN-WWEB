import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Eye, Send, AlertCircle, CheckCircle2, MapPin, User, Phone, Calendar, Clock, FileText, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { sightingsApi, missingPersonsApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';

export default function ReportSightingPage() {
  const [params] = useSearchParams();
  const presetCaseId = params.get('caseId');
  const { toast } = useToast();
  const [form, setForm] = useState({
    reporterName: '', contactNumber: '', date: '', time: '', location: '',
    mapsLink: '', description: '', caseId: presetCaseId ?? '', imageUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const { data: cases } = useQuery({
    queryKey: ['missingPersons', { size: 100 }],
    queryFn: () => missingPersonsApi.list({ size: 100 }),
  });

  useEffect(() => {
    if (presetCaseId) setForm((f) => ({ ...f, caseId: presetCaseId }));
  }, [presetCaseId]);

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await sightingsApi.create({
        caseId: form.caseId || null,
        reporterName: form.reporterName,
        contactNumber: form.contactNumber,
        date: form.date,
        time: form.time || undefined,
        location: form.location,
        mapsLink: form.mapsLink || undefined,
        description: form.description || undefined,
        imageUrl: form.imageUrl || undefined,
      });
      setDone(true);
      toast({ title: 'Report submitted', description: 'Thank you. Authorities have been notified.' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Submission failed.');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="container-page py-20">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mx-auto max-w-md text-center">
          <div className="mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-success/10 text-success">
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <h1 className="font-display text-2xl font-extrabold">Report submitted</h1>
          <p className="mt-3 text-muted-foreground">Thank you for your contribution. The relevant police station and assigned volunteers have been notified. If more information is needed, an officer may contact you.</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button onClick={() => { setDone(false); setForm({ reporterName: '', contactNumber: '', date: '', time: '', location: '', mapsLink: '', description: '', caseId: '', imageUrl: '' }); }}>Submit another report</Button>
            <Button asChild variant="outline"><Link to="/search">Back to search</Link></Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <section className="border-b border-border bg-card/40 py-10">
        <div className="container-page">
          <Badge variant="secondary" className="mb-3 gap-1.5"><Eye className="h-3.5 w-3.5" />Public Report</Badge>
          <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Report a Sighting</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">If you believe you've seen a missing person, report it here. No login required. Your report goes directly to the assigned police team.</p>
        </div>
      </section>

      <section className="py-10">
        <div className="container-page mx-auto max-w-2xl">
          <Card>
            <CardContent className="p-6 lg:p-8">
              {presetCaseId && (
                <div className="mb-6 rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm">
                  Reporting a sighting for a specific case. The case is pre-selected below.
                </div>
              )}
              {error && (
                <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /><span>{error}</span>
                </div>
              )}
              <form onSubmit={onSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <Label htmlFor="caseId">Related Missing Person (optional)</Label>
                  <Select value={form.caseId} onValueChange={(v) => set('caseId', v)}>
                    <SelectTrigger id="caseId"><SelectValue placeholder="Select a case if you recognize them" /></SelectTrigger>
                    <SelectContent>
                      {cases?.content.map((c) => <SelectItem key={c.id} value={c.id}>{c.fullName} — {c.caseNumber}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="reporterName">Your Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input id="reporterName" className="pl-9" placeholder="Your name" value={form.reporterName} onChange={(e) => set('reporterName', e.target.value)} required />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="contactNumber">Contact Number</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input id="contactNumber" className="pl-9" placeholder="+91 90000 00000" value={form.contactNumber} onChange={(e) => set('contactNumber', e.target.value)} required />
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label htmlFor="date">Date of Sighting</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input id="date" type="date" className="pl-9" value={form.date} onChange={(e) => set('date', e.target.value)} required />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="time">Time of Sighting</Label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input id="time" type="time" className="pl-9" value={form.time} onChange={(e) => set('time', e.target.value)} />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="location">Location</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="location" className="pl-9" placeholder="Where did you see them?" value={form.location} onChange={(e) => set('location', e.target.value)} required />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="mapsLink">Google Maps Link (optional)</Label>
                  <Input id="mapsLink" placeholder="https://maps.google.com/?q=..." value={form.mapsLink} onChange={(e) => set('mapsLink', e.target.value)} />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="description">Description</Label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea id="description" className="pl-9" rows={4} placeholder="Describe what you saw, what they were wearing, direction they were heading..." value={form.description} onChange={(e) => set('description', e.target.value)} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="imageUrl">Photo URL (optional)</Label>
                  <div className="relative">
                    <ImageIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input id="imageUrl" className="pl-9" placeholder="https://..." value={form.imageUrl} onChange={(e) => set('imageUrl', e.target.value)} />
                  </div>
                  <p className="text-xs text-muted-foreground">Paste a direct image link if you have one.</p>
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={loading}>
                  {loading ? 'Submitting...' : <><Send className="mr-2 h-4 w-4" />Submit Sighting Report</>}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
