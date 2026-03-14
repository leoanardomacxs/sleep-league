import { motion, AnimatePresence } from "framer-motion";
import { X, Moon, Sun, Clock, Zap, Flame, Target, TrendingUp, Activity } from "lucide-react";
import { getRankForSp } from "@/lib/ranks";

interface FriendData {
  name: string;
  score: number;
  sp: number;
  rank?: number;
}

// Generate mock detailed stats for a friend
function generateFriendStats(friend: FriendData) {
  const rank = getRankForSp(friend.sp);
  const avgScore = Math.max(50, friend.score - Math.floor(Math.random() * 8));
  const streak = Math.floor(Math.random() * 20) + 1;
  const avgHours = (6.5 + Math.random() * 2).toFixed(1);
  const consistency = Math.floor(65 + Math.random() * 30);
  const sleepTime = `${22 + Math.floor(Math.random() * 2)}:${Math.floor(Math.random() * 60).toString().padStart(2, "0")}`;
  const wakeTime = `${6 + Math.floor(Math.random() * 2)}:${Math.floor(Math.random() * 60).toString().padStart(2, "0")}`;
  const totalNights = Math.floor(30 + Math.random() * 60);
  const bestScore = Math.min(100, friend.score + Math.floor(Math.random() * 10));

  return { rank, avgScore, streak, avgHours, consistency, sleepTime, wakeTime, totalNights, bestScore };
}

// Weekly mock chart data
function generateWeeklyScores(baseScore: number) {
  const days = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"];
  return days.map((day) => ({
    day,
    score: Math.max(40, Math.min(100, baseScore + Math.floor((Math.random() - 0.5) * 20))),
  }));
}

interface FriendProfileModalProps {
  friend: FriendData | null;
  onClose: () => void;
}

const FriendProfileModal = ({ friend, onClose }: FriendProfileModalProps) => {
  if (!friend) return null;

  const stats = generateFriendStats(friend);
  const weeklyScores = generateWeeklyScores(friend.score);
  const maxScore = Math.max(...weeklyScores.map((d) => d.score));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm flex items-end justify-center"
      >
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md bg-card rounded-t-3xl p-6 pb-10 max-h-[85vh] overflow-y-auto"
        >
          {/* Handle */}
          <div className="w-10 h-1 rounded-full bg-muted mx-auto mb-4" />

          {/* Close */}
          <button onClick={onClose} className="absolute top-6 right-6 text-muted-foreground">
            <X size={20} />
          </button>

          {/* Avatar + Name */}
          <div className="flex flex-col items-center mb-6">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-display text-foreground mb-3"
              style={{
                background: `linear-gradient(135deg, ${stats.rank.colors.gradientFrom}25, ${stats.rank.colors.gradientTo}25)`,
                boxShadow: `0 0 0 3px ${stats.rank.colors.gradientFrom}50`,
              }}
            >
              {friend.name[0]}
            </div>
            <h2 className="text-xl font-display text-foreground">{friend.name}</h2>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-sm">{stats.rank.symbol}</span>
              <span className="text-xs font-ui font-bold" style={{ color: stats.rank.colors.gradientFrom }}>
                {stats.rank.name}
              </span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-2 mb-5">
            {[
              { label: "Score Atual", value: `${friend.score}`, icon: Target },
              { label: "Score Médio", value: `${stats.avgScore}`, icon: TrendingUp },
              { label: "Streak", value: `${stats.streak}🔥`, icon: Flame },
              { label: "Horas/Noite", value: `${stats.avgHours}h`, icon: Clock },
              { label: "Consistência", value: `${stats.consistency}%`, icon: Activity },
              { label: "Melhor Score", value: `${stats.bestScore}`, icon: Zap },
            ].map((s) => (
              <div key={s.label} className="bg-surface-elevated rounded-xl p-3 text-center">
                <s.icon size={14} className="mx-auto mb-1 text-muted-foreground" />
                <p className="text-sm font-display text-foreground">{s.value}</p>
                <p className="text-[9px] text-muted-foreground font-ui uppercase mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Sleep/Wake times */}
          <div className="flex gap-2 mb-5">
            <div className="flex-1 bg-surface-elevated rounded-xl p-3 flex items-center gap-2">
              <Moon size={14} className="text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground font-ui">Dorme às</p>
                <p className="text-sm font-display text-foreground">{stats.sleepTime}</p>
              </div>
            </div>
            <div className="flex-1 bg-surface-elevated rounded-xl p-3 flex items-center gap-2">
              <Sun size={14} className="text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground font-ui">Acorda às</p>
                <p className="text-sm font-display text-foreground">{stats.wakeTime}</p>
              </div>
            </div>
          </div>

          {/* Weekly mini chart */}
          <div className="mb-4">
            <p className="text-xs font-ui text-muted-foreground uppercase mb-3">Score esta semana</p>
            <div className="flex items-end gap-1.5 h-20">
              {weeklyScores.map((d) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className="w-full rounded-md"
                    style={{
                      height: `${(d.score / maxScore) * 100}%`,
                      minHeight: 8,
                      background: `linear-gradient(180deg, ${stats.rank.colors.gradientFrom}, ${stats.rank.colors.gradientTo})`,
                      opacity: 0.8,
                    }}
                  />
                  <span className="text-[9px] text-muted-foreground font-ui">{d.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* SP + Nights */}
          <div className="flex items-center justify-between text-xs text-muted-foreground font-ui px-1">
            <span>{friend.sp.toLocaleString()} SP total</span>
            <span>{stats.totalNights} noites registradas</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FriendProfileModal;
