import { useQuery } from '@tanstack/react-query';
import { Link, useParams } from 'react-router-dom';
import QRCode from 'qrcode';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, MapPin, Calendar, Clock, Phone, User, Droplet, Ruler, Weight,
  Eye, Shirt, FileText, Shield, QrCode, Images, Activity, AlertTriangle,
  Heart, Accessibility, Flag, Hash,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { missingPersonsApi, timelineApi } from '@/lib/api';
import { cn } from '@/lib/utils';

const statusVariant: Record<string, string> = {
  MISSING: 'bg-destructive/10 text-destructive border-destructive/30',
  INVESTIGATING: 'bg-warning/10 text-warning border-warning/30',
  FOUND: 'bg-success/10 text-success border-success/30',
  CLOSED: 'bg-muted text-muted-foreground border-border',
  DECEASED: 'bg-foreground/10 text-foreground/70 border-border',
};

const timelineIcon: Record<string, typeof Activity> = {
  REGISTERED: FileText,
  STATUS_CHANGE: Activity,
  NOTE_ADDED: FileText,
  SIGHTING_REPORTED: Eye,
  ASSIGNMENT: User,
  IMAGE_ADDED: Images,
  FOUND: Heart,
};

function InfoRow({ icon: Icon, label, value }: { icon: typeof User; label: string; value?: string | number | null }) {
  if (value == null || value === '') return null;
  return (
    <div className="flex items-start gap-3 py-2">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

export default function PersonDetailPage() {
  const { id } = useParams();
  const [qr, setQr] = useState('');
  const [activeImg, setActiveImg] = useState(0);

  const { data: person, isLoading } = useQuery({
    queryKey: ['person', id],
    queryFn: () => missingPersonsApi.get(id!),
    enabled: !!id,
  });
  const { data: timeline } = useQuery({
    queryKey: ['timeline', id],
    queryFn: () => timelineApi.forCase(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (person) {
      QRCode.toDataURL(`${window.location.origin}/person/${person.id}`, { width: 200, margin: 1, color: { dark: '#1e40af', light: '#ffffff' } })
        .then(setQr)
        .catch(() => {});
    }
  }, [person]);

  if (isLoading || !person) {
    return (
      <div className="container-page py-20">
        <div className="animate-pulse space-y-6">
          <div className="h-6 w-32 rounded bg-muted" />
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="h-96 rounded-2xl bg-muted" />
            <div className="space-y-4 lg:col-span-2">
              <div className="h-8 w-2/3 rounded bg-muted" />
              <div className="h-32 rounded-2xl bg-muted" />
              <div className="h-32 rounded-2xl bg-muted" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const profileUrl = `${window.location.origin}/person/${person.id}`;

  return (
    <div className="bg-background">
      <div className="container-page py-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Button asChild variant="ghost" size="sm">
            <Link to="/search"><ArrowLeft className="mr-2 h-4 w-4" />Back to search</Link>
          </Button>
          <Button asChild size="sm">
            <Link to={`/report-sighting?caseId=${person.id}`}><Eye className="mr-2 h-4 w-4" />Report Sighting</Link>
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left: photos + QR */}
          <div className="space-y-5">
            <Card className="overflow-hidden">
              <div className="relative aspect-square bg-muted">
                <img src={person.images[activeImg]} alt={person.fullName} className="h-full w-full object-cover" />
                <span className={cn('absolute left-3 top-3 rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wider backdrop-blur-md', statusVariant[person.status])}>
                  {person.status}
                </span>
              </div>
              {person.images.length > 1 && (
                <div className="flex gap-2 p-3">
                  {person.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={cn('h-16 w-16 overflow-hidden rounded-lg border-2 transition-all', activeImg === i ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100')}
                    >
                      <img src={img} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base"><QrCode className="h-4 w-4 text-primary" />Share this profile</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-3">
                {qr && <img src={qr} alt="QR code" className="rounded-lg border border-border" width={180} height={180} />}
                <p className="text-center text-xs text-muted-foreground">Scan to view this profile and report a sighting</p>
                <Button variant="outline" size="sm" className="w-full" onClick={() => navigator.clipboard?.writeText(profileUrl)}>
                  Copy profile link
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right: details */}
          <div className="space-y-6 lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="gap-1"><Hash className="h-3 w-3" />{person.caseNumber}</Badge>
                <Badge variant="outline" className="gap-1"><Flag className="h-3 w-3" />{person.priority} priority</Badge>
              </div>
              <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">{person.fullName}</h1>
              {person.nickName && <p className="mt-1 text-muted-foreground">Also known as: {person.nickName}</p>}
              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><User className="h-4 w-4" />{person.age} years · {person.gender}</span>
                <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />{person.lastSeenLocation}</span>
                <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />{new Date(person.lastSeenDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
            </motion.div>

            {/* Physical description */}
            <Card>
              <CardHeader><CardTitle className="text-base">Physical Description</CardTitle></CardHeader>
              <CardContent className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
                <InfoRow icon={Calendar} label="Date of Birth" value={person.dob} />
                <InfoRow icon={User} label="Age" value={person.age} />
                <InfoRow icon={Ruler} label="Height" value={person.height ? `${person.height} cm` : null} />
                <InfoRow icon={Weight} label="Weight" value={person.weight ? `${person.weight} kg` : null} />
                <InfoRow icon={Droplet} label="Blood Group" value={person.bloodGroup} />
                <InfoRow icon={Eye} label="Eye Color" value={person.eyeColor} />
                <InfoRow icon={User} label="Skin Tone" value={person.skinTone} />
                <InfoRow icon={User} label="Hair Color" value={person.hairColor} />
                <InfoRow icon={AlertTriangle} label="Identification Marks" value={person.identificationMarks} />
              </CardContent>
            </Card>

            {/* Circumstances */}
            <Card>
              <CardHeader><CardTitle className="text-base">Missing Circumstances</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <InfoRow icon={Calendar} label="Last Seen Date" value={new Date(person.lastSeenDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })} />
                <InfoRow icon={Clock} label="Last Seen Time" value={person.lastSeenTime} />
                <InfoRow icon={MapPin} label="Last Seen Location" value={person.lastSeenLocation} />
                <InfoRow icon={Shirt} label="Clothing Description" value={person.clothingDescription} />
                {person.missingCircumstances && (
                  <div className="rounded-lg bg-muted/50 p-3 text-sm">
                    <p className="mb-1 text-xs text-muted-foreground">Circumstances</p>
                    <p>{person.missingCircumstances}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Medical */}
            {(person.medicalConditions || person.mentalHealthCondition) && (
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Accessibility className="h-4 w-4 text-warning" />Medical Information</CardTitle></CardHeader>
                <CardContent className="space-y-1">
                  <InfoRow icon={Activity} label="Medical Conditions" value={person.medicalConditions} />
                  <InfoRow icon={Accessibility} label="Mental Health Condition" value={person.mentalHealthCondition} />
                </CardContent>
              </Card>
            )}

            {/* Contacts */}
            <div className="grid gap-6 sm:grid-cols-2">
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Heart className="h-4 w-4 text-destructive" />Family Contact</CardTitle></CardHeader>
                <CardContent className="space-y-1">
                  <InfoRow icon={User} label="Guardian" value={person.guardianName} />
                  <InfoRow icon={Phone} label="Contact" value={person.guardianContact} />
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Shield className="h-4 w-4 text-primary" />Police Contact</CardTitle></CardHeader>
                <CardContent className="space-y-1">
                  <InfoRow icon={Shield} label="Police Station" value={person.policeStationName} />
                  <InfoRow icon={FileText} label="FIR Number" value={person.firNumber} />
                </CardContent>
              </Card>
            </div>

            {/* Timeline */}
            <Card>
              <CardHeader><CardTitle className="text-base">Case Timeline</CardTitle></CardHeader>
              <CardContent>
                <div className="relative space-y-5 pl-6">
                  <div className="absolute left-2 top-1 bottom-1 w-px bg-border" />
                  {timeline?.map((ev) => {
                    const Icon = timelineIcon[ev.type] ?? Activity;
                    return (
                      <div key={ev.id} className="relative">
                        <div className="absolute -left-[1.15rem] grid h-4 w-4 place-items-center rounded-full bg-primary ring-4 ring-background">
                          <Icon className="h-2.5 w-2.5 text-primary-foreground" />
                        </div>
                        <p className="text-sm font-medium">{ev.message}</p>
                        <p className="text-xs text-muted-foreground">{new Date(ev.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                      </div>
                    );
                  })}
                  {(!timeline || timeline.length === 0) && <p className="text-sm text-muted-foreground">No timeline events yet.</p>}
                </div>
              </CardContent>
            </Card>

            <Separator />
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild className="flex-1" size="lg">
                <Link to={`/report-sighting?caseId=${person.id}`}><Eye className="mr-2 h-5 w-5" />Report a Sighting of {person.fullName.split(' ')[0]}</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/search"><ArrowLeft className="mr-2 h-5 w-5" />Back to Search</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
