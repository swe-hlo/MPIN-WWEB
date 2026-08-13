import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft, Save, X, Plus, Activity, Eye, MapPin, Phone, User, Shield,
  Calendar, Clock, Droplet, Ruler, Weight, Shirt, FileText, Heart, Accessibility,
  Flag, Hash, ClipboardList, Send, Images,
} from 'lucide-react';
import { missingPersonsApi, notesApi, timelineApi, usersApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { CaseStatus, MissingPerson } from '@/types';

const statuses: CaseStatus[] = ['MISSING', 'INVESTIGATING', 'FOUND', 'CLOSED', 'DECEASED'];
const statusVariant: Record<string, string> = {
  MISSING: 'bg-destructive/10 text-destructive border-destructive/30',
  INVESTIGATING: 'bg-warning/10 text-warning border-warning/30',
  FOUND: 'bg-success/10 text-success border-success/30',
  CLOSED: 'bg-muted text-muted-foreground border-border',
  DECEASED: 'bg-foreground/10 text-foreground/70 border-border',
};
const timelineIcon: Record<string, typeof Activity> = {
  REGISTERED: FileText, STATUS_CHANGE: Activity, NOTE_ADDED: FileText,
  SIGHTING_REPORTED: Eye, ASSIGNMENT: User, IMAGE_ADDED: Images, FOUND: Heart,
};

function InfoRow({ icon: Icon, label, value }: { icon: typeof User; label: string; value?: string | number | null }) {
  if (value == null || value === '') return null;
  return <div className="flex items-start gap-3 py-2"><Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">{label}</p><p className="text-sm font-medium">{value}</p></div></div>;
}

export default function CaseDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [note, setNote] = useState('');
  const [editForm, setEditForm] = useState<Partial<MissingPerson>>({});

  const { data: person } = useQuery({ queryKey: ['person', id], queryFn: () => missingPersonsApi.get(id!), enabled: !!id });
  const { data: timeline } = useQuery({ queryKey: ['timeline', id], queryFn: () => timelineApi.forCase(id!), enabled: !!id });
  const { data: notes } = useQuery({ queryKey: ['notes', id], queryFn: () => notesApi.forCase(id!), enabled: !!id });
  const { data: volunteersData } = useQuery({ queryKey: ['users', { role: 'VOLUNTEER' }], queryFn: () => usersApi.list({ role: 'VOLUNTEER', size: 50 }) });

  const statusMutation = useMutation({
    mutationFn: (status: CaseStatus) => missingPersonsApi.updateStatus(id!, status),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['person', id] }); qc.invalidateQueries({ queryKey: ['timeline', id] }); toast({ title: 'Status updated' }); },
  });
  const noteMutation = useMutation({
    mutationFn: () => missingPersonsApi.addNote(id!, note, user!),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['notes', id] }); qc.invalidateQueries({ queryKey: ['timeline', id] }); setNote(''); toast({ title: 'Note added' }); },
  });
  const assignMutation = useMutation({
    mutationFn: (volunteerId: string) => missingPersonsApi.assignVolunteer(id!, volunteerId),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['person', id] }); qc.invalidateQueries({ queryKey: ['timeline', id] }); toast({ title: 'Volunteer assigned' }); },
  });
  const updateMutation = useMutation({
    mutationFn: () => missingPersonsApi.update(id!, editForm),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['person', id] }); setEditing(false); toast({ title: 'Case updated' }); },
  });

  if (!person) return <div className="py-20 text-center text-muted-foreground">Loading case...</div>;

  const volunteers = volunteersData?.content ?? [];
  const setEdit = (k: keyof MissingPerson, v: string | number) => setEditForm((f) => ({ ...f, [k]: v }));
  const startEdit = () => { setEditForm(person); setEditing(true); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate('/police/cases')}><ArrowLeft className="mr-2 h-4 w-4" />Back to cases</Button>
        <div className="flex gap-2">
          {editing ? (
            <>
              <Button variant="outline" size="sm" onClick={() => setEditing(false)}><X className="mr-2 h-4 w-4" />Cancel</Button>
              <Button size="sm" onClick={() => updateMutation.mutate()} disabled={updateMutation.isPending}><Save className="mr-2 h-4 w-4" />Save</Button>
            </>
          ) : (
            <Button size="sm" variant="outline" onClick={startEdit}><FileText className="mr-2 h-4 w-4" />Edit Case</Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-5">
          <Card className="overflow-hidden">
            <div className="relative aspect-square bg-muted">
              <img src={person.images[0]} alt={person.fullName} className="h-full w-full object-cover" />
              <span className={cn('absolute left-3 top-3 rounded-full border px-3 py-1 text-xs font-bold uppercase backdrop-blur-md', statusVariant[person.status])}>{person.status}</span>
            </div>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary" className="gap-1"><Hash className="h-3 w-3" />{person.caseNumber}</Badge>
                <Badge variant="outline" className="gap-1"><Flag className="h-3 w-3" />{person.priority}</Badge>
              </div>
              <h1 className="mt-3 font-display text-2xl font-extrabold">{person.fullName}</h1>
              <p className="text-sm text-muted-foreground">{person.age} years · {person.gender}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Update Status</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <Select value={person.status} onValueChange={(v) => statusMutation.mutate(v as CaseStatus)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{statuses.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Changing status notifies assigned volunteers and updates the public profile.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-base">Assign Volunteer</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              {person.assignedVolunteerIds && person.assignedVolunteerIds.length > 0 && (
                <div className="mb-2 space-y-1">
                  {person.assignedVolunteerIds.map((vid) => {
                    const v = volunteers.find((x) => x.id === vid);
                    return v ? <Badge key={vid} variant="secondary" className="mr-1">{v.fullName}</Badge> : null;
                  })}
                </div>
              )}
              {volunteers.map((v) => (
                <Button key={v.id} variant="outline" size="sm" className="w-full justify-start" disabled={person.assignedVolunteerIds?.includes(v.id)} onClick={() => assignMutation.mutate(v.id)}>
                  <Plus className="mr-2 h-3.5 w-3.5" />{v.fullName}
                </Button>
              ))}
              {volunteers.length === 0 && <p className="text-xs text-muted-foreground">No volunteers available.</p>}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6 lg:col-span-2">
          {/* Editable fields */}
          <Card>
            <CardHeader><CardTitle className="text-base">Personal Information</CardTitle></CardHeader>
            <CardContent className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
              {editing ? (
                <>
                  <div className="space-y-1.5 py-2"><Label>Full Name</Label><Input value={editForm.fullName ?? person.fullName} onChange={(e) => setEdit('fullName', e.target.value)} /></div>
                  <div className="space-y-1.5 py-2"><Label>Nick Name</Label><Input value={editForm.nickName ?? ''} onChange={(e) => setEdit('nickName', e.target.value)} /></div>
                  <div className="space-y-1.5 py-2"><Label>Height (cm)</Label><Input type="number" value={editForm.height ?? ''} onChange={(e) => setEdit('height', Number(e.target.value))} /></div>
                  <div className="space-y-1.5 py-2"><Label>Weight (kg)</Label><Input type="number" value={editForm.weight ?? ''} onChange={(e) => setEdit('weight', Number(e.target.value))} /></div>
                  <div className="space-y-1.5 py-2"><Label>Identification Marks</Label><Input value={editForm.identificationMarks ?? ''} onChange={(e) => setEdit('identificationMarks', e.target.value)} /></div>
                  <div className="space-y-1.5 py-2"><Label>Medical Conditions</Label><Input value={editForm.medicalConditions ?? ''} onChange={(e) => setEdit('medicalConditions', e.target.value)} /></div>
                  <div className="space-y-1.5 py-2 sm:col-span-2"><Label>Last Seen Location</Label><Input value={editForm.lastSeenLocation ?? person.lastSeenLocation} onChange={(e) => setEdit('lastSeenLocation', e.target.value)} /></div>
                </>
              ) : (
                <>
                  <InfoRow icon={User} label="Nick Name" value={person.nickName} />
                  <InfoRow icon={Calendar} label="Date of Birth" value={person.dob} />
                  <InfoRow icon={Ruler} label="Height" value={person.height ? `${person.height} cm` : null} />
                  <InfoRow icon={Weight} label="Weight" value={person.weight ? `${person.weight} kg` : null} />
                  <InfoRow icon={Droplet} label="Blood Group" value={person.bloodGroup} />
                  <InfoRow icon={Eye} label="Eye Color" value={person.eyeColor} />
                  <InfoRow icon={User} label="Skin Tone" value={person.skinTone} />
                  <InfoRow icon={User} label="Hair Color" value={person.hairColor} />
                  <InfoRow icon={Activity} label="Identification Marks" value={person.identificationMarks} />
                </>
              )}
            </CardContent>
          </Card>

          {!editing && (
            <>
              <Card>
                <CardHeader><CardTitle className="text-base">Missing Circumstances</CardTitle></CardHeader>
                <CardContent className="space-y-1">
                  <InfoRow icon={Calendar} label="Last Seen Date" value={new Date(person.lastSeenDate).toLocaleDateString('en-IN', { dateStyle: 'long' })} />
                  <InfoRow icon={Clock} label="Last Seen Time" value={person.lastSeenTime} />
                  <InfoRow icon={MapPin} label="Last Seen Location" value={person.lastSeenLocation} />
                  <InfoRow icon={Shirt} label="Clothing" value={person.clothingDescription} />
                  {person.missingCircumstances && <div className="mt-2 rounded-lg bg-muted/50 p-3 text-sm"><p className="mb-1 text-xs text-muted-foreground">Circumstances</p><p>{person.missingCircumstances}</p></div>}
                </CardContent>
              </Card>

              {(person.medicalConditions || person.mentalHealthCondition) && (
                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Accessibility className="h-4 w-4 text-warning" />Medical</CardTitle></CardHeader>
                  <CardContent className="space-y-1">
                    <InfoRow icon={Activity} label="Medical Conditions" value={person.medicalConditions} />
                    <InfoRow icon={Accessibility} label="Mental Health" value={person.mentalHealthCondition} />
                  </CardContent>
                </Card>
              )}

              <div className="grid gap-6 sm:grid-cols-2">
                <Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><Heart className="h-4 w-4 text-destructive" />Family Contact</CardTitle></CardHeader><CardContent className="space-y-1"><InfoRow icon={User} label="Guardian" value={person.guardianName} /><InfoRow icon={Phone} label="Contact" value={person.guardianContact} /></CardContent></Card>
                <Card><CardHeader><CardTitle className="flex items-center gap-2 text-base"><Shield className="h-4 w-4 text-primary" />Police</CardTitle></CardHeader><CardContent className="space-y-1"><InfoRow icon={Shield} label="Station" value={person.policeStationName} /><InfoRow icon={FileText} label="FIR" value={person.firNumber} /></CardContent></Card>
              </div>
            </>
          )}

          {/* Investigation Notes */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2 text-base"><ClipboardList className="h-4 w-4 text-primary" />Investigation Notes</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} placeholder="Add an investigation note..." />
                <Button onClick={() => noteMutation.mutate()} disabled={!note || noteMutation.isPending} size="icon" className="h-10 w-10 shrink-0"><Send className="h-4 w-4" /></Button>
              </div>
              <Separator />
              <div className="space-y-3">
                {notes?.map((n) => (
                  <div key={n.id} className="rounded-lg border border-border p-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-semibold">{n.authorName}</p>
                      <p className="text-xs text-muted-foreground">{new Date(n.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                    </div>
                    <p className="mt-1.5 text-sm">{n.note}</p>
                  </div>
                ))}
                {(!notes || notes.length === 0) && <p className="text-sm text-muted-foreground">No notes yet.</p>}
              </div>
            </CardContent>
          </Card>

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
                      <div className="absolute -left-[1.15rem] grid h-4 w-4 place-items-center rounded-full bg-primary ring-4 ring-background"><Icon className="h-2.5 w-2.5 text-primary-foreground" /></div>
                      <p className="text-sm font-medium">{ev.message}</p>
                      <p className="text-xs text-muted-foreground">{new Date(ev.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button asChild variant="outline"><Link to={`/person/${person.id}`} target="_blank"><Eye className="mr-2 h-4 w-4" />View Public Profile</Link></Button>
          </div>
        </div>
      </div>
    </div>
  );
}
