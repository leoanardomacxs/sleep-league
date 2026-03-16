import { motion } from "framer-motion";
import { Shield, Flame, Star, Zap, Moon, Target, Settings, Sunrise, Award, Lock, LogOut, Minus } from "lucide-react";
import { useRank } from "@/contexts/RankContext";
import RankSimulator from "@/components/RankSimulator";
import RankIcon from "@/components/RankIcon";
import { useProfile } from "@/hooks/useProfile";
import { useSleepSessions, useStreak } from "@/hooks/useSleepData";
import { useAuth } from "@/contexts/AuthContext";

const badgeDefinitions = [
  { name: "Early Bird", icon: Sunrise, requirement: "Dormir antes das 23h 5x" },
  { name: "Night Owl", icon: Moon, requirement: "Registrar 30 noites" },
  { name: "7-Day Streak", icon: Flame, requirement: "7 noites seguidas" },
  { name: "Perfect Score", icon: Star, requirement: "Score 100" },
  { name: "30-Day Streak", icon: Zap, requirement: "30 noites seguidas" },
  { name: "Diamond", icon: Award, requirement: "Rank Lucid" },
];

const ProfileScreen = () => {
  const { rank, sp } = useRank();
  const { data: profile } = useProfile();
  const { data: sessions } = useSleepSessions(365);
  const { data: streak } = useStreak();
  const { signOut } = useAuth();

  const totalSessions = sessions?.length || 0;
  const bestScore = sessions?.reduce((max, s) => Math.max(max, s.score || 0), 0) || 0;
  const avgScore = totalSessions > 0
    ? Math.round((sessions || []).reduce((sum, s) => sum + (s.score || 0), 0) / totalSessions)
    : 0;

  const unlockedBadges = [
    totalSessions >= 1, // Early Bird (simplified)
    totalSessions >= 30,
    (streak?.current || 0) >= 7,
    bestScore >= 100,
    (streak?.longest || 0) >= 30,
    sp >= 4000,
  ];

  const stats = [
    { label: "Total SP", value: sp > 0 ? sp.toLocaleString() : null, icon: Star },
    { label: "Melhor Score", value: bestScore > 0 ? `${bestScore}` : null, icon: Zap },
    { label: "Maior Streak", value: (streak?.longest || 0) > 0 ? `${streak?.longest}` : null, icon: Flame },
    { label: "Score Medio", value: avgScore > 0 ? `${avgScore}` : null, icon: Moon },
  ];

  const displayName = profile?.display_name || "Dormidor";

  return (
    <div className="relative z-10 px-5 pt-14 pb-24 max-w-md mx-auto">
      {/* Avatar + Rank */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center mb-8"
      >
        <div className="relative mb-4">
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-display text-foreground"
            style={{
              background: `linear-gradient(135deg, ${rank.colors.gradientFrom}20, ${rank.colors.gradientTo}20)`,
              boxShadow: `0 0 0 3px ${rank.colors.gradientFrom}40`,
            }}
          >
            {displayName[0]?.toUpperCase()}
          </div>
          <div
            className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center"
            style={{ background: rank.colors.gradientFrom }}
          >
            <Shield size={14} className="text-primary-foreground" />
          </div>
        </div>
        <h1 className="text-xl font-display text-foreground">{displayName}</h1>
        <div className="flex items-center gap-1.5 mt-1">
          <RankIcon rank={rank} size={14} />
          <p className="text-sm font-ui font-bold" style={{ color: rank.colors.gradientFrom }}>
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
            transition={{ delay: 0.2 + i * 0.08 }}
            className="card-dormio p-4 text-center"
          >
            <stat.icon size={18} className="text-primary mx-auto mb-2" />
            {stat.value ? (
              <p className="text-xl font-display tabular-nums text-foreground">{stat.value}</p>
            ) : (
              <Minus size={18} className="text-muted-foreground mx-auto" />
            )}
            <p className="text-xs text-muted-foreground font-ui uppercase mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Rank Simulator */}
      <div className="mb-6">
        <RankSimulator />
      </div>

      {/* Badges */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <h2 className="text-lg font-display text-foreground mb-4">Conquistas</h2>
        <div className="grid grid-cols-3 gap-3">
          {badgeDefinitions.map((badge, i) => {
            const unlocked = unlockedBadges[i];
            return (
              <motion.div
                key={badge.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + i * 0.06 }}
                className={`card-dormio p-3 flex flex-col items-center gap-2 ${!unlocked ? "opacity-30" : ""}`}
              >
                {unlocked ? (
                  <badge.icon size={22} className="text-primary" />
                ) : (
                  <Lock size={22} className="text-muted-foreground" />
                )}
                <p className="text-[10px] text-muted-foreground font-ui text-center leading-tight">{badge.name}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Challenges */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="mt-6">
        <h2 className="text-lg font-display text-foreground mb-4">Desafios Ativos</h2>
        <div className="space-y-3">
          <div className="card-dormio p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
              <Target size={18} className="text-accent" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-display text-foreground">Dormir antes das 23h</p>
              <p className="text-xs text-muted-foreground">
                {totalSessions > 0 ? `${Math.min(totalSessions, 5)}/5 noites` : "0/5 noites"}
              </p>
              <div className="mt-2 h-1.5 rounded-full bg-surface-elevated overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min(100, (Math.min(totalSessions, 5) / 5) * 100)}%`,
                    background: `linear-gradient(90deg, ${rank.colors.gradientFrom}, ${rank.colors.gradientTo})`,
                  }}
                />
              </div>
            </div>
            <span className="text-xs font-ui" style={{ color: rank.colors.gradientFrom }}>+50 SP</span>
          </div>
        </div>
      </motion.div>

      {/* Sign Out */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        onClick={signOut}
        className="w-full mt-6 card-dormio p-4 flex items-center justify-center gap-2 text-destructive font-ui text-sm"
      >
        <LogOut size={16} />
        Sair da conta
      </motion.button>
    </div>
  );
};

export default ProfileScreen;
