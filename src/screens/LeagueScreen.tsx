import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Crown, ChevronRight, Users } from "lucide-react";
import { RANK_TIERS, getRankForSp } from "@/lib/ranks";
import FriendProfileModal from "@/components/FriendProfileModal";
import InviteFriends from "@/components/InviteFriends";
import RankIcon from "@/components/RankIcon";
import EmptyState from "@/components/EmptyState";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useRank } from "@/contexts/RankContext";

const LeagueScreen = () => {
  const { user } = useAuth();
  const { sp: simulatedSp } = useRank();

  const [expandedRank, setExpandedRank] = useState<string | null>(null);
  const [selectedFriend, setSelectedFriend] = useState<any>(null);
  const [selectedTier, setSelectedTier] = useState<any | null>(null);

  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ["leaderboard", user?.id],
    queryFn: async () => {
      if (!user) return [];

      const { data, error } = await supabase.rpc(
        "get_friends_leaderboard",
        { _user_id: user.id }
      );

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

  const userEntry = leaderboard?.find((e: any) => e.isUser);

  const realSp = userEntry?.sp ?? null;
  const effectiveSp = simulatedSp ?? realSp;

  const getXpMessage = (tier: any) => {
    if (effectiveSp === null) return "Carregando progresso...";

    if (effectiveSp < tier.minSp) {
      return `Faltam ${(tier.minSp - effectiveSp).toLocaleString()} SP para chegar neste elo`;
    }

    if (effectiveSp > tier.maxSp) {
      return `Você precisaria perder ${(effectiveSp - tier.maxSp).toLocaleString()} SP para cair para este elo`;
    }

    return "Você está neste elo!";
  };

  return (
    <div className="relative z-10 px-5 pt-14 pb-24 max-w-md mx-auto">

      {/* HEADER */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-display text-foreground mb-1">
          Sleep League
        </h1>
        <p className="text-sm text-muted-foreground font-body mb-6">
          Rankings dos seus amigos
        </p>
      </motion.div>

      <InviteFriends />

      {/* RANK TIERS */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="card-dormio p-3 mb-4"
      >
        <button
          onClick={() =>
            setExpandedRank(expandedRank === "legend" ? null : "legend")
          }
          className="w-full flex items-center justify-between"
        >
          <span className="text-xs font-ui text-muted-foreground uppercase">
            Rank Tiers
          </span>

          <motion.div animate={{ rotate: expandedRank === "legend" ? 90 : 0 }}>
            <ChevronRight size={14} className="text-muted-foreground" />
          </motion.div>
        </button>

        <AnimatePresence>
          {expandedRank === "legend" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-3 grid grid-cols-3 gap-2 overflow-hidden"
            >
              {RANK_TIERS.map((tier) => (
                <motion.div
                  key={tier.name}
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setSelectedTier(tier)}
                  className="flex items-center gap-1.5 py-1 cursor-pointer rounded-md px-2 hover:bg-surface-elevated transition"
                >
                  <RankIcon rank={tier} size={14} />
                  <span
                    className="text-[10px] font-ui font-bold"
                    style={{ color: tier.colors.gradientFrom }}
                  >
                    {tier.name}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* PAINEL DO TIER */}
      <AnimatePresence>
        {selectedTier && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="card-dormio p-4 mb-4 relative overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${selectedTier.colors.gradientFrom}20, ${selectedTier.colors.gradientTo}60)`
              
            }}
          >
            {/* glow */}
            <div
              className="absolute inset-0 opacity-20 blur-2xl"
              style={{
                background: `linear-gradient(135deg, ${selectedTier.colors.gradientFrom}, ${selectedTier.colors.gradientTo})`
                
              }}
            />

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-3">
                <RankIcon rank={selectedTier} size={20} />
                <h3
                  className="text-lg font-display"
                  style={{ color: selectedTier.colors.gradientFrom }}
                >
                  {selectedTier.name}
                </h3>
              </div>

              <p className="text-sm text-muted-foreground">
                {getXpMessage(selectedTier)}
              </p>

              {/* barra animada */}
              {effectiveSp !== null && (
                <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.min(
                        100,
                        Math.max(
                          0,
                          ((effectiveSp - selectedTier.minSp) /
                            (selectedTier.maxSp - selectedTier.minSp)) *
                            100
                        )
                      )}%`,
                    }}
                    className="h-full"
                    style={{
                      background: `linear-gradient(90deg, ${selectedTier.colors.gradientFrom}, ${selectedTier.colors.gradientTo})`
                    }}
                  />
                </div>
              )}

              <button
                onClick={() => setSelectedTier(null)}
                className="mt-4 text-xs text-muted-foreground"
              >
                Fechar
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* LEADERBOARD */}
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
            const spToUse = entry.isUser ? effectiveSp : entry.sp;
            const userRank = getRankForSp(spToUse);

            return (
              <motion.div
                key={entry.friendId || i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                whileTap={{ scale: 0.97 }}
                className={`card-dormio p-4 flex items-center gap-3 cursor-pointer ${
                  entry.isUser ? "ring-1" : ""
                }`}
                style={
                  entry.isUser
                    ? { borderColor: `${userRank.colors.gradientFrom}50` }
                    : {}
                }
                onClick={() => !entry.isUser && setSelectedFriend(entry)}
              >
                {/* posição */}
                <div className="w-6 flex items-center justify-center">
                  {entry.rank <= 3 ? (
                    <Crown
                      size={16}
                      style={{
                        color:
                          entry.rank === 1
                            ? "hsl(45 100% 65%)"
                            : entry.rank === 2
                            ? "hsl(0 0% 70%)"
                            : "hsl(25 70% 50%)",
                      }}
                    />
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      {entry.rank}
                    </span>
                  )}
                </div>

                {/* avatar */}
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${userRank.colors.gradientFrom}30, ${userRank.colors.gradientTo}30)`
                  }}
                >
                  {entry.name[0]}
                </div>

                {/* info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm truncate">{entry.name}</p>
                    <RankIcon rank={userRank} size={12} />
                  </div>

                  <p
                    className="text-[10px] font-bold"
                    style={{ color: userRank.colors.gradientFrom }}
                  >
                    {userRank.name}
                  </p>
                </div>

                {/* score */}
                <div className="text-right">
                  <p className="text-lg">{entry.score}</p>
                  <p className="text-xs text-muted-foreground">
                    {entry.sp.toLocaleString()} SP
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      <FriendProfileModal
        friend={selectedFriend}
        onClose={() => setSelectedFriend(null)}
      />
    </div>
  );
};

export default LeagueScreen;