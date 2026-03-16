import { motion } from "framer-motion";
import { Flame, Trophy, TrendingUp, Zap, Heart, ThumbsUp, Star, Award, Rss } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import EmptyState from "@/components/EmptyState";
import { getRankForSp } from "@/lib/ranks";
import RankIcon from "@/components/RankIcon";

const reactionIcons = [
  { icon: ThumbsUp, label: "like" },
  { icon: Heart, label: "love" },
  { icon: Star, label: "star" },
  { icon: Flame, label: "fire" },
];

const FeedScreen = () => {
  const { user } = useAuth();

  // Fetch recent friend activity from sleep_sessions via leaderboard
  const { data: friendActivity, isLoading } = useQuery({
    queryKey: ["friend_feed", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data, error } = await supabase.rpc("get_friends_leaderboard", { _user_id: user.id });
      if (error) throw error;
      return (data || [])
        .filter((f: any) => f.friend_id !== user.id && f.total_sp > 0)
        .map((f: any) => ({
          id: f.friend_id,
          user: f.display_name || "Amigo",
          action: f.current_streak > 3
            ? `alcancou ${f.current_streak} dias de streak!`
            : f.avg_score > 85
            ? `teve score medio de ${Math.round(f.avg_score)} esta semana`
            : `acumulou ${f.total_sp} SP total`,
          icon: f.current_streak > 3 ? Flame : f.avg_score > 85 ? TrendingUp : Zap,
          sp: f.total_sp,
        }));
    },
    enabled: !!user,
  });

  return (
    <div className="relative z-10 px-5 pt-14 pb-24 max-w-md mx-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-display text-foreground mb-1">Feed</h1>
        <p className="text-sm text-muted-foreground font-body mb-6">Veja o que seus amigos conquistaram</p>
      </motion.div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card-dormio p-4 h-24 animate-pulse" />
          ))}
        </div>
      ) : !friendActivity || friendActivity.length === 0 ? (
        <EmptyState
          icon={Rss}
          title="Nenhuma atividade"
          description="Adicione amigos na aba League para ver suas conquistas aqui."
        />
      ) : (
        <div className="space-y-3">
          {friendActivity.map((item: any, i: number) => {
            const friendRank = getRankForSp(item.sp);
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                className="card-dormio p-4"
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${friendRank.colors.gradientFrom}25, ${friendRank.colors.gradientTo}25)`,
                    }}
                  >
                    <span className="text-sm font-display text-foreground">{item.user[0]}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-body text-foreground">
                      <span className="font-display">{item.user}</span> {item.action}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      {reactionIcons.map((r) => (
                        <button
                          key={r.label}
                          className="w-8 h-8 rounded-lg bg-surface-elevated flex items-center justify-center hover:bg-muted transition-colors active:scale-95"
                        >
                          <r.icon size={14} className="text-muted-foreground" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FeedScreen;
