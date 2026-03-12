import { motion } from "framer-motion";
import { Flame, Trophy, TrendingUp, Zap } from "lucide-react";

const feedItems = [
  {
    id: 1,
    user: "Luna",
    action: "achieved a 14-day streak!",
    icon: Flame,
    iconColor: "text-accent",
    time: "2h ago",
    reactions: ["🔥", "💪"],
    reactionCount: 12,
  },
  {
    id: 2,
    user: "Atlas",
    action: "ranked up to Astral",
    icon: Trophy,
    iconColor: "text-primary",
    time: "4h ago",
    reactions: ["⭐", "🎉"],
    reactionCount: 8,
  },
  {
    id: 3,
    user: "Nova",
    action: "scored 96 last night",
    icon: TrendingUp,
    iconColor: "text-accent",
    time: "5h ago",
    reactions: ["😱"],
    reactionCount: 5,
  },
  {
    id: 4,
    user: "Orion",
    action: "completed the Early Bird challenge",
    icon: Zap,
    iconColor: "text-primary",
    time: "8h ago",
    reactions: ["🙌"],
    reactionCount: 3,
  },
];

const reactionOptions = ["🔥", "💪", "⭐", "😱"];

const FeedScreen = () => {
  return (
    <div className="relative z-10 px-5 pt-14 pb-24 max-w-md mx-auto">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <h1 className="text-2xl font-display text-foreground mb-1">Feed</h1>
        <p className="text-sm text-muted-foreground font-body mb-6">See what your friends achieved</p>
      </motion.div>

      <div className="space-y-3">
        {feedItems.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08, duration: 0.35, ease: [0.3, 0, 0.2, 1] }}
            className="card-dormio p-4"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-surface-elevated flex items-center justify-center shrink-0">
                <span className="text-sm font-display text-foreground">{item.user[0]}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-body text-foreground">
                  <span className="font-display">{item.user}</span> {item.action}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
                <div className="flex items-center gap-2 mt-3">
                  {reactionOptions.map((r) => (
                    <button
                      key={r}
                      className="w-8 h-8 rounded-lg bg-surface-elevated flex items-center justify-center text-sm hover:bg-muted transition-colors active:scale-95"
                    >
                      {r}
                    </button>
                  ))}
                  {item.reactionCount > 0 && (
                    <span className="text-xs text-muted-foreground ml-auto tabular-nums">
                      {item.reactions.join("")} {item.reactionCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FeedScreen;
