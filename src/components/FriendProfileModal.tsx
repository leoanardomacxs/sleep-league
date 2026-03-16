import { motion, AnimatePresence } from "framer-motion";
import { X, Moon, Sun, Clock, Zap, Flame, Target, TrendingUp, Activity, Minus } from "lucide-react";
import { getRankForSp } from "@/lib/ranks";
import RankIcon from "./RankIcon";

interface FriendData {
  name: string;
  score: number;
  sp: number;
  streak?: number;
  rank?: number;
}

interface FriendProfileModalProps {
  friend: FriendData | null;
  onClose: () => void;
}

const FriendProfileModal = ({ friend, onClose }: FriendProfileModalProps) => {
  if (!friend) return null;

  const friendRank = getRankForSp(friend.sp);
  const hasData = friend.sp > 0 || friend.score > 0;

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
          <div className="w-10 h-1 rounded-full bg-muted mx-auto mb-4" />

          <button onClick={onClose} className="absolute top-6 right-6 text-muted-foreground">
            <X size={20} />
          </button>

          {/* Avatar + Name */}
          <div className="flex flex-col items-center mb-6">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-display text-foreground mb-3"
              style={{
                background: `linear-gradient(135deg, ${friendRank.colors.gradientFrom}25, ${friendRank.colors.gradientTo}25)`,
                boxShadow: `0 0 0 3px ${friendRank.colors.gradientFrom}50`,
              }}
            >
              {friend.name[0]}
            </div>
            <h2 className="text-xl font-display text-foreground">{friend.name}</h2>
            <div className="flex items-center gap-1.5 mt-1">
              <RankIcon rank={friendRank} size={14} />
              <span className="text-xs font-ui font-bold" style={{ color: friendRank.colors.gradientFrom }}>
                {friendRank.name}
              </span>
            </div>
          </div>

          {/* Stats Grid */}
          {hasData ? (
            <div className="grid grid-cols-3 gap-2 mb-5">
              {[
                { label: "Score Atual", value: `${friend.score}`, icon: Target },
                { label: "Streak", value: `${friend.streak || 0}`, icon: Flame },
                { label: "Total SP", value: `${friend.sp}`, icon: Zap },
              ].map((s) => (
                <div key={s.label} className="bg-surface-elevated rounded-xl p-3 text-center">
                  <s.icon size={14} className="mx-auto mb-1 text-muted-foreground" />
                  <p className="text-sm font-display text-foreground">{s.value}</p>
                  <p className="text-[9px] text-muted-foreground font-ui uppercase mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-surface-elevated rounded-xl p-6 text-center mb-5">
              <Minus size={24} className="text-muted-foreground mx-auto mb-2" />
              <p className="text-xs text-muted-foreground font-body">Sem dados de sono ainda</p>
            </div>
          )}

          <div className="flex items-center justify-center text-xs text-muted-foreground font-ui">
            <span>{friend.sp.toLocaleString()} SP total</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FriendProfileModal;
