import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FileText, ImagePlus, X, Save, AlertCircle, ShieldCheck } from 'lucide-react';
import { missingPersonsApi, stationsApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { DashboardPageHeader } from '@/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

const photoPresets = [
  'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1040626/pexels-photo-1040626.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/2698935/pexels-photo-2698935.jpeg?auto=compress&cs=tinysrgb&w=600',
];

export default function RegisterCasePage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [error, setError] = useState('');
  const [images, setImages] = useState<string[]>([photoPresets[0]]);

  const { data: stations } = useQuery({ queryKey: ['stations'], queryFn: stationsApi.list });

  const [form, setForm] = useState({
    fullName: '', nickName: '', gender: 'MALE' as 'MALE' | 'FEMALE' | 'OTHER',
    dob: '', age: '', height: '', weight: '', bloodGroup: '', skinTone: '',
    hairColor: '', eyeColor: '', identificationMarks: '', medicalConditions: '',
    mentalHealthCondition: '', lastSeenDate: '', lastSeenTime: '', lastSeenLocation: '',
    state: '', district: '', city: '', missingCircumstances: '', clothingDescription: '',
    guardianName: '', guardianContact: '', policeStationId: user?.stationId ?? '',
    firNumber: '', priority: 'HIGH' as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
  });

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const createMutation = useMutation({
    mutationFn: () => missingPersonsApi.create({
      ...form,
      gender: form.gender,
      age: Number(form.age) || 0,
      height: form.height ? Number(form.height) : undefined,
      weight: form.weight ? Number(form.weight) : undefined,
      priority: form.priority,
      status: 'MISSING',
      images,
      registeredByUserId: user?.id,
      assignedVolunteerIds: [],
    }),
    onSuccess: (created) => {
      qc.invalidateQueries({ queryKey: ['missingPersons'] });
      qc.invalidateQueries({ queryKey: ['stats'] });
      toast({ title: 'Case registered', description: `${created.caseNumber} created successfully.` });
      navigate(`/police/cases/${created.id}`);
    },
    onError: (err) => setError(err instanceof Error ? err.message : 'Failed to register case.'),
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!form.fullName || !form.age || !form.lastSeenDate || !form.lastSeenLocation || !form.policeStationId) {
      setError('Please fill all required fields.');
      return;
    }
    createMutation.mutate();
  };

  const addImage = () => setImages((imgs) => imgs.length < 5 ? [...imgs, photoPresets[imgs.length % photoPresets.length]] : imgs);
  const removeImage = (i: number) => setImages((imgs) => imgs.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-6">
      <DashboardPageHeader title="Register Missing Person" description="File a new missing person report with full identifying details." />

      {error && (
        <div className="flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /><span>{error}</span>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Personal Information */}
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2 text-base"><FileText className="h-4 w-4 text-primary" />Personal Information</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1.5 lg:col-span-2"><Label>Full Name *</Label><Input value={form.fullName} onChange={(e) => set('fullName', e.target.value)} required /></div>
            <div className="space-y-1.5"><Label>Nick Name</Label><Input value={form.nickName} onChange={(e) => set('nickName', e.target.value)} /></div>
            <div className="space-y-1.5"><Label>Gender *</Label><Select value={form.gender} onValueChange={(v) => set('gender', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="MALE">Male</SelectItem><SelectItem value="FEMALE">Female</SelectItem><SelectItem value="OTHER">Other</SelectItem></SelectContent></Select></div>
            <div className="space-y-1.5"><Label>Date of Birth</Label><Input type="date" value={form.dob} onChange={(e) => set('dob', e.target.value)} /></div>
            <div className="space-y-1.5"><Label>Age *</Label><Input type="number" value={form.age} onChange={(e) => set('age', e.target.value)} required /></div>
            <div className="space-y-1.5"><Label>Blood Group</Label><Select value={form.bloodGroup} onValueChange={(v) => set('bloodGroup', v)}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-1.5"><Label>Height (cm)</Label><Input type="number" value={form.height} onChange={(e) => set('height', e.target.value)} /></div>
            <div className="space-y-1.5"><Label>Weight (kg)</Label><Input type="number" value={form.weight} onChange={(e) => set('weight', e.target.value)} /></div>
            <div className="space-y-1.5"><Label>Skin Tone</Label><Input value={form.skinTone} onChange={(e) => set('skinTone', e.target.value)} placeholder="e.g. Fair, Wheatish" /></div>
            <div className="space-y-1.5"><Label>Hair Color</Label><Input value={form.hairColor} onChange={(e) => set('hairColor', e.target.value)} /></div>
            <div className="space-y-1.5"><Label>Eye Color</Label><Input value={form.eyeColor} onChange={(e) => set('eyeColor', e.target.value)} /></div>
            <div className="space-y-1.5 lg:col-span-3"><Label>Identification Marks</Label><Input value={form.identificationMarks} onChange={(e) => set('identificationMarks', e.target.value)} placeholder="Scars, moles, tattoos..." /></div>
          </CardContent>
        </Card>

        {/* Medical */}
        <Card>
          <CardHeader><CardTitle className="text-base">Medical Information</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5"><Label>Medical Conditions</Label><Input value={form.medicalConditions} onChange={(e) => set('medicalConditions', e.target.value)} placeholder="e.g. Diabetes, Asthma" /></div>
            <div className="space-y-1.5"><Label>Mental Health Condition</Label><Input value={form.mentalHealthCondition} onChange={(e) => set('mentalHealthCondition', e.target.value)} /></div>
          </CardContent>
        </Card>

        {/* Last Seen */}
        <Card>
          <CardHeader><CardTitle className="text-base">Last Seen & Circumstances</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1.5"><Label>Last Seen Date *</Label><Input type="date" value={form.lastSeenDate} onChange={(e) => set('lastSeenDate', e.target.value)} required /></div>
            <div className="space-y-1.5"><Label>Last Seen Time</Label><Input type="time" value={form.lastSeenTime} onChange={(e) => set('lastSeenTime', e.target.value)} /></div>
            <div className="space-y-1.5"><Label>Last Seen Location *</Label><Input value={form.lastSeenLocation} onChange={(e) => set('lastSeenLocation', e.target.value)} required /></div>
            <div className="space-y-1.5"><Label>State</Label><Select value={form.state} onValueChange={(v) => set('state', v)}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent><SelectItem value="Delhi">Delhi</SelectItem><SelectItem value="Maharashtra">Maharashtra</SelectItem><SelectItem value="Karnataka">Karnataka</SelectItem></SelectContent></Select></div>
            <div className="space-y-1.5"><Label>District</Label><Input value={form.district} onChange={(e) => set('district', e.target.value)} /></div>
            <div className="space-y-1.5"><Label>City</Label><Input value={form.city} onChange={(e) => set('city', e.target.value)} /></div>
            <div className="space-y-1.5 lg:col-span-3"><Label>Missing Circumstances</Label><Textarea rows={3} value={form.missingCircumstances} onChange={(e) => set('missingCircumstances', e.target.value)} /></div>
            <div className="space-y-1.5 lg:col-span-3"><Label>Clothing Description</Label><Input value={form.clothingDescription} onChange={(e) => set('clothingDescription', e.target.value)} /></div>
          </CardContent>
        </Card>

        {/* Guardian & Police */}
        <Card>
          <CardHeader><CardTitle className="text-base">Guardian & Police Details</CardTitle></CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-1.5"><Label>Guardian Name</Label><Input value={form.guardianName} onChange={(e) => set('guardianName', e.target.value)} /></div>
            <div className="space-y-1.5"><Label>Guardian Contact</Label><Input value={form.guardianContact} onChange={(e) => set('guardianContact', e.target.value)} placeholder="+91 ..." /></div>
            <div className="space-y-1.5"><Label>Police Station *</Label><Select value={form.policeStationId} onValueChange={(v) => set('policeStationId', v)}><SelectTrigger><SelectValue placeholder="Select station" /></SelectTrigger><SelectContent>{stations?.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-1.5"><Label>FIR Number</Label><Input value={form.firNumber} onChange={(e) => set('firNumber', e.target.value)} placeholder="FIR-1234/2025" /></div>
            <div className="space-y-1.5"><Label>Priority</Label><Select value={form.priority} onValueChange={(v) => set('priority', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent></Select></div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader><CardTitle className="text-base">Person Photos</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {images.map((img, i) => (
                <div key={i} className="group relative h-28 w-28 overflow-hidden rounded-lg border border-border">
                  <img src={img} alt="" className="h-full w-full object-cover" />
                  <button type="button" onClick={() => removeImage(i)} className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-destructive text-destructive-foreground opacity-0 transition-opacity group-hover:opacity-100">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
              {images.length < 5 && (
                <button type="button" onClick={addImage} className="grid h-28 w-28 place-items-center rounded-lg border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary">
                  <ImagePlus className="h-6 w-6" />
                </button>
              )}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">Up to 5 photos. Click + to add a sample image (in production, upload from your device).</p>
          </CardContent>
        </Card>

        <Separator />
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => navigate('/police/cases')}>Cancel</Button>
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? 'Registering...' : <><Save className="mr-2 h-4 w-4" />Register Case</>}
          </Button>
        </div>
      </form>
    </div>
  );
}
