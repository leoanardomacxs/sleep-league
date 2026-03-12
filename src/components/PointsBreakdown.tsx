import { motion } from "framer-motion";
import { Flame, TrendingUp, Moon, Zap } from "lucide-react";

const pointBreakdown = [
  { label: "Duration", points: 40, icon: Moon },
  { label: "Cycles", points: 30, icon: Zap },
  { label: "Schedule", points: 20, icon: TrendingUp },
  { label: "No Phone", points: 20, icon: Flame },
];

const PointsBreakdown = () => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {pointBreakdown.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 + i * 0.1, duration: 0.35, ease: [0.3, 0, 0.2, 1] }}
          className="card-dormio p-3 flex items-center gap-3"
        >
          <div className="w-8 h-8 rounded-lg bg-surface-elevated flex items-center justify-center">
            <item.icon size={16} className="text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-ui">{item.label}</p>
            <p className="text-sm font-display tabular-nums text-foreground">+{item.points} SP</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default PointsBreakdown;
