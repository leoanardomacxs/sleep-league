import { motion } from "framer-motion";
import { useState } from "react";
import { Crown, ChevronRight, Trophy, Users } from "lucide-react";
import { RANK_TIERS, getRankForSp } from "@/lib/ranks";
import FriendProfileModal from "@/components/FriendProfileModal";
import InviteFriends from "@/components/InviteFriends";
import RankIcon from "@/components/RankIcon";
import EmptyState from "@/components/EmptyState";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const LeagueScreen = () => {
  const { user } = useAuth();
  const [expandedRank, setExpandedRank] = useState<string | null>(null);
  const [selectedFriend, setSelectedFriend] = useState<any>(null);

  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ["leaderboard", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase.rpc("get_friends_leaderboard", { _user_id: user.id });
      if (error) throw error;
      return (data || []).map((entry: any, i: number) => ({
        rank: i + 1,
        name: entry.display_name || "Sem nome",
        score: Math.round(entry.avg_score || 0),
        sp: Number(entry.total_sp) || 0,
        streak: entry.current_streak || 0,
        isUser: entry.friend_id === user.id,
        friendId: entry.friend_id,
      }));
    },
    enabled: !!user,
  });

  return (
    <div className="relative z-10 px-5 pt-14 pb-24 max-w-md mx-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-display text-foreground mb-1">Sleep League</h1>
        <p className="text-sm text-muted-foreground font-body mb-6">Rankings dos seus amigos</p>
      </motion.div>

      <InviteFriends />

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
          <motion.div animate={{ rotate: expandedRank === "legend" ? 90 : 0 }}>
            <ChevronRight size={14} className="text-muted-foreground" />
          </motion.div>
        </button>
        {expandedRank === "legend" && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="mt-3 grid grid-cols-3 gap-2"
          >
            {RANK_TIERS.map((tier) => (
              <div key={tier.name} className="flex items-center gap-1.5 py-1">
                <RankIcon rank={tier} size={14} />
                <span className="text-[10px] font-ui font-bold" style={{ color: tier.colors.gradientFrom }}>
                  {tier.name}
                </span>
              </div>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Leaderboard */}
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card-dormio p-4 h-16 animate-pulse" />
          ))}
        </div>
      ) : !leaderboard || leaderboard.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Nenhum amigo ainda"
          description="Convide amigos para competir na Sleep League!"
        />
      ) : (
        <div className="space-y-2">
          {leaderboard.map((entry: any, i: number) => {
            const userRank = getRankForSp(entry.sp);
            return (
              <motion.div
                key={entry.friendId || i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className={`card-dormio p-4 flex items-center gap-3 cursor-pointer active:scale-[0.98] transition-transform ${
                  entry.isUser ? "ring-1" : ""
                }`}
                style={entry.isUser ? { borderColor: `${userRank.colors.gradientFrom}40` } : {}}
                onClick={() => !entry.isUser && setSelectedFriend(entry)}
              >
                <div className="w-6 flex items-center justify-center">
                  {entry.rank <= 3 ? (
                    <Crown
                      size={16}
                      style={{
                        color:
                          entry.rank === 1 ? "hsl(45 100% 65%)" :
                          entry.rank === 2 ? "hsl(0 0% 70%)" : "hsl(25 70% 50%)",
                      }}
                    />
                  ) : (
                    <span className="text-xs font-display tabular-nums text-muted-foreground">{entry.rank}</span>
                  )}
                </div>

                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${userRank.colors.gradientFrom}30, ${userRank.colors.gradientTo}30)`,
                    boxShadow: `0 0 0 2px ${userRank.colors.gradientFrom}50`,
                  }}
                >
                  <span className="text-sm font-display text-foreground">{entry.name[0]}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p
                      className="text-sm font-display truncate"
                      style={entry.isUser ? { color: userRank.colors.gradientFrom } : { color: "hsl(var(--foreground))" }}
                    >
                      {entry.name}
                    </p>
                    <RankIcon rank={userRank} size={12} />
                  </div>
                  <p className="text-[10px] font-ui font-bold" style={{ color: userRank.colors.gradientFrom }}>
                    {userRank.name}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-lg font-display tabular-nums text-foreground">{entry.score}</p>
                  <p className="text-xs text-muted-foreground tabular-nums">{entry.sp.toLocaleString()} SP</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <FriendProfileModal friend={selectedFriend} onClose={() => setSelectedFriend(null)} />
    </div>
  );
};

export default LeagueScreen;
