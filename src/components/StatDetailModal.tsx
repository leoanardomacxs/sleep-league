import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { type LucideIcon } from "lucide-react";

interface StatDetail {
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
  description: string;
  trend?: "up" | "down" | "stable";
  trendValue?: string;
  details: { label: string; value: string }[];
}

interface StatDetailModalProps {
  stat: StatDetail | null;
  onClose: () => void;
}

const StatDetailModal = ({ stat, onClose }: StatDetailModalProps) => {
  if (!stat) return null;

  const TrendIcon = stat.trend === "up" ? TrendingUp : stat.trend === "down" ? TrendingDown : Minus;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center"
      >
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-card rounded-t-3xl p-6 pb-10"
        >
          <div className="w-10 h-1 rounded-full bg-muted mx-auto mb-5" />

          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: `${stat.color}20` }}
            >
              <stat.icon size={20} style={{ color: stat.color }} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-display text-foreground">{stat.label}</h3>
              <p className="text-xs text-muted-foreground font-body">{stat.description}</p>
            </div>
          </div>

          {/* Big value */}
          <div className="text-center my-6">
            <p
              className="text-4xl font-display tabular-nums"
              style={{ color: stat.color }}
            >
              {stat.value}
            </p>
            {stat.trend && stat.trendValue && (
              <div className="flex items-center justify-center gap-1 mt-2">
                <TrendIcon
                  size={14}
                  className={
                    stat.trend === "up"
                      ? "text-accent"
                      : stat.trend === "down"
                      ? "text-destructive"
                      : "text-muted-foreground"
                  }
                />
                <span
                  className={`text-xs font-ui ${
                    stat.trend === "up"
                      ? "text-accent"
                      : stat.trend === "down"
                      ? "text-destructive"
                      : "text-muted-foreground"
                  }`}
                >
                  {stat.trendValue} vs semana passada
                </span>
              </div>
            )}
          </div>

          {/* Detail rows */}
          <div className="space-y-2">
            {stat.details.map((d) => (
              <div
                key={d.label}
                className="flex items-center justify-between bg-surface-elevated rounded-xl px-4 py-3"
              >
                <span className="text-xs text-muted-foreground font-ui">{d.label}</span>
                <span className="text-sm font-display text-foreground tabular-nums">{d.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default StatDetailModal;
export type { StatDetail };
