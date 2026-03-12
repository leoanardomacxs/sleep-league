import { motion } from "framer-motion";
import { useState } from "react";
import { Crown, Medal, Award } from "lucide-react";

const tabs = ["Friends", "Global"];

const leaderboardData = [
  { rank: 1, name: "Luna", score: 96, sp: 4210, tier: "Lucid" },
  { rank: 2, name: "Atlas", score: 93, sp: 3890, tier: "Astral" },
  { rank: 3, name: "Nova", score: 91, sp: 3650, tier: "Astral" },
  { rank: 4, name: "You", score: 87, sp: 2847, tier: "Astral", isUser: true },
  { rank: 5, name: "Orion", score: 85, sp: 2700, tier: "Dreamer" },
  { rank: 6, name: "Selene", score: 82, sp: 2540, tier: "Dreamer" },
  { rank: 7, name: "Cosmo", score: 79, sp: 2300, tier: "Harmonic" },
  { rank: 8, name: "Stella", score: 76, sp: 2100, tier: "Harmonic" },
];

const getRankIcon = (rank: number) => {
  if (rank === 1) return <Crown size={16} className="text-yellow-400" />;
  if (rank === 2) return <Medal size={16} className="text-foreground/60" />;
  if (rank === 3) return <Award size={16} className="text-amber-600" />;
  return <span className="text-xs font-display tabular-nums text-muted-foreground w-4 text-center">{rank}</span>;
};

const LeagueScreen = () => {
  const [activeTab, setActiveTab] = useState("Friends");

  return (
    <div className="relative z-10 px-5 pt-14 pb-24 max-w-md mx-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-display text-foreground mb-1">Sleep League</h1>
        <p className="text-sm text-muted-foreground font-body mb-6">This week's rankings</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex bg-surface rounded-xl p-1 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-ui transition-all duration-200 ${
              activeTab === tab
                ? "bg-surface-elevated text-foreground"
                : "text-muted-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Leaderboard */}
      <div className="space-y-2">
        {leaderboardData.map((user, i) => (
          <motion.div
            key={user.rank}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + i * 0.05, duration: 0.3, ease: [0.3, 0, 0.2, 1] }}
            className={`card-dormio p-4 flex items-center gap-4 ${
              user.isUser ? "ring-1 ring-primary/30" : ""
            }`}
          >
            <div className="w-8 flex items-center justify-center">
              {getRankIcon(user.rank)}
            </div>
            <div className="w-9 h-9 rounded-full bg-surface-elevated flex items-center justify-center">
              <span className="text-sm font-display text-foreground">
                {user.name[0]}
              </span>
            </div>
            <div className="flex-1">
              <p className={`text-sm font-display ${user.isUser ? "gradient-text" : "text-foreground"}`}>
                {user.name}
              </p>
              <p className="text-xs text-muted-foreground">{user.tier}</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-display tabular-nums text-foreground">{user.score}</p>
              <p className="text-xs text-muted-foreground tabular-nums">{user.sp.toLocaleString()} SP</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default LeagueScreen;
