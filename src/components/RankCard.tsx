import { motion } from "framer-motion";
import { Shield } from "lucide-react";

interface RankCardProps {
  rank: string;
  sp: number;
  nextSp: number;
  rankColors?: {
    gradientFrom: string;
    gradientTo: string;
    glow: string;
  };
}

const RankCard = ({ rank, sp, nextSp, rankColors }: RankCardProps) => {
  const progress = (sp / nextSp) * 100;
  const from = rankColors?.gradientFrom || "hsl(265 100% 70%)";
  const to = rankColors?.gradientTo || "hsl(190 100% 65%)";
  const glow = rankColors?.glow || "hsl(265 100% 70%)";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.6, duration: 0.35, ease: [0.3, 0, 0.2, 1] }}
      className="card-dormio p-4 flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-transform"
    >
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center"
        style={{
          background: `${from}18`,
          boxShadow: `0 0 20px ${glow}30`,
        }}
      >
        <Shield size={22} style={{ color: from }} />
      </div>
      <div className="flex-1">
        <p className="text-xs text-muted-foreground font-ui uppercase">Rank</p>
        <p className="text-lg font-display text-foreground">{rank}</p>
        <div className="mt-2 h-2 rounded-full bg-surface-elevated overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg, ${from}, ${to})` }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ delay: 0.8, duration: 1, ease: [0.3, 0, 0.2, 1] }}
          />
        </div>
        <p className="text-xs text-muted-foreground mt-1 tabular-nums">{sp.toLocaleString()} / {nextSp.toLocaleString()} SP</p>
      </div>
    </motion.div>
  );
};

export default RankCard;
