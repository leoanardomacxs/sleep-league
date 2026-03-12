import { motion } from "framer-motion";
import { Shield, Flame, Star, Zap, Moon, Target, Settings } from "lucide-react";
import { useRank } from "@/contexts/RankContext";
import RankSimulator from "@/components/RankSimulator";

const badges = [
  { name: "Early Bird", icon: "🌅", unlocked: true },
  { name: "Night Owl", icon: "🦉", unlocked: true },
  { name: "7-Day Streak", icon: "🔥", unlocked: true },
  { name: "Perfect Score", icon: "💯", unlocked: true },
  { name: "30-Day Streak", icon: "⚡", unlocked: false },
  { name: "Lucid", icon: "💎", unlocked: false },
];

const stats = [
  { label: "Total SP", value: "2,847", icon: Star },
  { label: "Best Score", value: "94", icon: Zap },
  { label: "Longest Streak", value: "14", icon: Flame },
  { label: "Avg Score", value: "83", icon: Moon },
];

const ProfileScreen = () => {
  const { rank } = useRank();

  return (
    <div className="relative z-10 px-5 pt-14 pb-24 max-w-md mx-auto">
      {/* Avatar + Rank */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.3, 0, 0.2, 1] }}
        className="flex flex-col items-center mb-8"
      >
        <div className="relative mb-4">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-display text-foreground"
            style={{
              background: `linear-gradient(135deg, ${rank.colors.gradientFrom}20, ${rank.colors.gradientTo}20)`,
              boxShadow: `0 0 0 3px ${rank.colors.gradientFrom}40, 0 0 30px ${rank.colors.gradientFrom}15`,
            }}
          >
            D
          </div>
          <div
            className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: rank.colors.gradientFrom }}
          >
            <Shield size={14} className="text-primary-foreground" />
          </div>
        </div>
        <h1 className="text-xl font-display text-foreground">Dreamer</h1>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="text-sm">{rank.symbol}</span>
          <p
            className="text-sm font-ui font-bold"
            style={{ color: rank.colors.gradientFrom }}
          >
            {rank.name} Tier
          </p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.08, duration: 0.3 }}
            className="card-dormio p-4 text-center cursor-pointer active:scale-[0.97] transition-transform"
          >
            <stat.icon size={18} className="text-primary mx-auto mb-2" />
            <p className="text-xl font-display tabular-nums text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground font-ui uppercase mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Rank Simulator */}
      <div className="mb-6">
        <RankSimulator />
      </div>

      {/* Badges */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-lg font-display text-foreground mb-4">Badges</h2>
        <div className="grid grid-cols-3 gap-3">
          {badges.map((badge, i) => (
            <motion.div
              key={badge.name}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.06, duration: 0.25 }}
              className={`card-dormio p-3 flex flex-col items-center gap-2 cursor-pointer active:scale-[0.95] transition-transform ${
                !badge.unlocked ? "opacity-30" : ""
              }`}
            >
              <span className="text-2xl">{badge.icon}</span>
              <p className="text-[10px] text-muted-foreground font-ui text-center leading-tight">{badge.name}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Challenges */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="mt-6"
      >
        <h2 className="text-lg font-display text-foreground mb-4">Active Challenges</h2>
        <div className="space-y-3">
          <div className="card-dormio p-4 flex items-center gap-3 cursor-pointer active:scale-[0.98] transition-transform">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Target size={18} className="text-accent" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-display text-foreground">Sleep before 11 PM</p>
              <p className="text-xs text-muted-foreground">3/5 nights completed</p>
              <div className="mt-2 h-1.5 rounded-full bg-surface-elevated overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: "60%",
                    background: `linear-gradient(90deg, ${rank.colors.gradientFrom}, ${rank.colors.gradientTo})`,
                  }}
                />
              </div>
            </div>
            <span className="text-xs font-ui" style={{ color: rank.colors.gradientFrom }}>+50 SP</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileScreen;
