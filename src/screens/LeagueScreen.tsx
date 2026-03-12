import { motion } from "framer-motion";
import { useState } from "react";
import { Crown, ChevronRight } from "lucide-react";
import { RANK_TIERS, getRankByName, getRankForSp } from "@/lib/ranks";

const tabs = ["Friends", "Global"];

const leaderboardData = [
  { rank: 1, name: "Luna", score: 96, sp: 4210 },
  { rank: 2, name: "Atlas", score: 93, sp: 3890 },
  { rank: 3, name: "Nova", score: 91, sp: 3650 },
  { rank: 4, name: "You", score: 87, sp: 2847, isUser: true },
  { rank: 5, name: "Orion", score: 85, sp: 2700 },
  { rank: 6, name: "Selene", score: 82, sp: 2540 },
  { rank: 7, name: "Cosmo", score: 79, sp: 2300 },
  { rank: 8, name: "Stella", score: 76, sp: 2100 },
];

const LeagueScreen = () => {
  const [activeTab, setActiveTab] = useState("Friends");
  const [expandedRank, setExpandedRank] = useState<string | null>(null);

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

      {/* Rank tiers legend */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="card-dormio p-3 mb-4"
      >
        <button
          onClick={() => setExpandedRank(expandedRank === "legend" ? null : "legend")}
          className="w-full flex items-center justify-between"
        >
          <span className="text-xs font-ui text-muted-foreground uppercase">Rank Tiers</span>
          <motion.div
            animate={{ rotate: expandedRank === "legend" ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight size={14} className="text-muted-foreground" />
          </motion.div>
        </button>
        {expandedRank === "legend" && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-3 grid grid-cols-3 gap-2"
          >
            {RANK_TIERS.map((tier) => (
              <div
                key={tier.name}
                className="flex items-center gap-1.5 py-1"
              >
                <span className="text-sm">{tier.symbol}</span>
                <span
                  className="text-[10px] font-ui font-bold"
                  style={{ color: tier.colors.gradientFrom }}
                >
                  {tier.name}
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Leaderboard */}
      <div className="space-y-2">
        {leaderboardData.map((user, i) => {
          const userRank = getRankForSp(user.sp);
          return (
            <motion.div
              key={user.rank}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.05, duration: 0.3, ease: [0.3, 0, 0.2, 1] }}
              className={`card-dormio p-4 flex items-center gap-3 cursor-pointer active:scale-[0.98] transition-transform ${
                user.isUser ? "ring-1" : ""
              }`}
              style={user.isUser ? { borderColor: `${userRank.colors.gradientFrom}40` } : {}}
            >
              {/* Position */}
              <div className="w-6 flex items-center justify-center">
                {user.rank <= 3 ? (
                  <Crown
                    size={16}
                    style={{
                      color:
                        user.rank === 1
                          ? "hsl(45 100% 65%)"
                          : user.rank === 2
                          ? "hsl(0 0% 70%)"
                          : "hsl(25 70% 50%)",
                    }}
                  />
                ) : (
                  <span className="text-xs font-display tabular-nums text-muted-foreground">
                    {user.rank}
                  </span>
                )}
              </div>

              {/* Avatar with rank color ring */}
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${userRank.colors.gradientFrom}30, ${userRank.colors.gradientTo}30)`,
                  boxShadow: `0 0 0 2px ${userRank.colors.gradientFrom}50`,
                }}
              >
                <span className="text-sm font-display text-foreground">
                  {user.name[0]}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p
                    className="text-sm font-display truncate"
                    style={user.isUser ? { color: userRank.colors.gradientFrom } : { color: "hsl(var(--foreground))" }}
                  >
                    {user.name}
                  </p>
                  <span className="text-xs">{userRank.symbol}</span>
                </div>
                <p
                  className="text-[10px] font-ui font-bold"
                  style={{ color: userRank.colors.gradientFrom }}
                >
                  {userRank.name}
                </p>
              </div>

              {/* Score */}
              <div className="text-right">
                <p className="text-lg font-display tabular-nums text-foreground">{user.score}</p>
                <p className="text-xs text-muted-foreground tabular-nums">
                  {user.sp.toLocaleString()} SP
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default LeagueScreen;
