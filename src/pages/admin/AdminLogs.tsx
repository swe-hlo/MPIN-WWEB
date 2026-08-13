import { useQuery } from '@tanstack/react-query';
import { ScrollText, Info, AlertTriangle, AlertOctagon } from 'lucide-react';
import { logsApi } from '@/lib/api';
import { DashboardPageHeader } from '@/layouts/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

const levelConfig = {
  INFO: { icon: Info, color: 'text-info', bg: 'bg-info/10', border: 'border-info/30' },
  WARN: { icon: AlertTriangle, color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/30' },
  ERROR: { icon: AlertOctagon, color: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/30' },
};

export default function AdminLogs() {
  const { data } = useQuery({ queryKey: ['logs'], queryFn: logsApi.list });

  return (
    <div className="space-y-6">
      <DashboardPageHeader title="System Logs" description="Audit trail of all actions on the platform." />

      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {data?.map((log, i) => {
              const cfg = levelConfig[log.level] ?? levelConfig.INFO;
              const Icon = cfg.icon;
              return (
                <motion.div key={log.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }} className="flex items-center gap-4 px-5 py-3.5">
                  <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${cfg.bg} ${cfg.color}`}><Icon className="h-4.5 w-4.5" /></div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{log.userName ?? 'System'} · <span className="text-muted-foreground">{log.action.replace(/_/g, ' ').toLowerCase()}</span></p>
                    {log.entity && <p className="text-xs text-muted-foreground">{log.entity}: {log.entityId}</p>}
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <Badge variant="outline" className={cfg.border}>{log.level}</Badge>
                    <span className="text-xs text-muted-foreground">{new Date(log.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                  </div>
                </motion.div>
              );
            })}
            {data?.length === 0 && (
              <div className="flex flex-col items-center gap-3 py-16 text-center">
                <ScrollText className="h-10 w-10 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">No system logs yet.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
