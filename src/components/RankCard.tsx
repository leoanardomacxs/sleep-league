import { motion } from "framer-motion";
import { Shield } from "lucide-react";

interface RankCardProps {
  rank: string;
  sp: number;
  nextSp: number;
}

const RankCard = ({ rank, sp, nextSp }: RankCardProps) => {
  const progress = (sp / nextSp) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.6, duration: 0.35, ease: [0.3, 0, 0.2, 1] }}
      className="card-dormio p-4 flex items-center gap-4"
    >
      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center glow-primary">
        <Shield size={22} className="text-primary" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-muted-foreground font-ui uppercase">Rank</p>
        <p className="text-lg font-display text-foreground">{rank}</p>
        <div className="mt-2 h-2 rounded-full bg-surface-elevated overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, hsl(265 100% 70%), hsl(190 100% 65%))" }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ delay: 0.8, duration: 1, ease: [0.3, 0, 0.2, 1] }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1 tabular-nums">{sp} / {nextSp} SP</p>
      </div>
    </motion.div>
  );
};

export default RankCard;
