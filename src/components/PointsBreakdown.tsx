import { motion } from "framer-motion";
import { Clock, Zap, TrendingUp, Smartphone, Minus } from "lucide-react";
import type { SleepSession } from "@/hooks/useSleepData";

interface PointsBreakdownProps {
  session?: SleepSession | null;
}

const PointsBreakdown = ({ session }: PointsBreakdownProps) => {
  const duration = session?.duration_minutes || 0;
  const score = session?.score || 0;
  const phoneFree = session?.phone_before_bed === false;

  const durationPts = duration >= 420 ? 40 : duration >= 360 ? 30 : duration >= 300 ? 20 : Math.max(5, Math.floor(duration / 30));
  const cyclePts = Math.min(30, Math.floor(duration / 90) * 6);
  const phonePts = phoneFree ? 20 : 0;
  const consistencyPts = Math.max(0, score - durationPts - cyclePts - phonePts);

  const items = [
    { label: "Duracao", points: session ? durationPts : null, icon: Clock },
    { label: "Ciclos", points: session ? cyclePts : null, icon: Zap },
    { label: "Consistencia", points: session ? consistencyPts : null, icon: TrendingUp },
    { label: "Sem Celular", points: session ? phonePts : null, icon: SmartphoneOff },
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 + i * 0.1 }}
          className="card-dormio p-3 flex items-center gap-3"
        >
          <div className="w-8 h-8 rounded-lg bg-surface-elevated flex items-center justify-center">
            <item.icon size={16} className="text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-ui">{item.label}</p>
            {item.points !== null ? (
              <p className="text-sm font-display tabular-nums text-foreground">+{item.points} SP</p>
            ) : (
              <Minus size={14} className="text-muted-foreground mt-0.5" />
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default PointsBreakdown;
