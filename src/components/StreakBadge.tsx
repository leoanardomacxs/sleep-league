import { Flame } from "lucide-react";
import { motion } from "framer-motion";

interface StreakBadgeProps {
  count: number;
}

const StreakBadge = ({ count }: StreakBadgeProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5, duration: 0.35, ease: [0.3, 0, 0.2, 1] }}
      className="card-dormio p-4 flex items-center gap-4"
    >
      <div className="relative">
        <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center glow-accent">
          <Flame size={22} className="text-accent" />
        </div>
      </div>
      <div className="flex-1">
        <p className="text-xs text-muted-foreground font-ui uppercase">Current Streak</p>
        <p className="text-2xl font-display tabular-nums text-foreground">
          {count} <span className="text-sm text-muted-foreground font-ui">nights</span>
        </p>
      </div>
      <div className="h-8 w-px bg-border" />
      <div className="text-right">
        <p className="text-xs text-muted-foreground font-ui">Next</p>
        <p className="text-sm font-display text-accent tabular-nums">14</p>
      </div>
    </motion.div>
  );
};

export default StreakBadge;
