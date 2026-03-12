import { useState } from "react";
import { motion } from "framer-motion";
import { AlarmClock } from "lucide-react";
import SleepScoreRing from "../components/SleepScoreRing";
import PointsBreakdown from "../components/PointsBreakdown";
import StreakBadge from "../components/StreakBadge";
import RankCard from "../components/RankCard";
import WakeUpModal from "../components/WakeUpModal";

const HomeScreen = () => {
  const [showWakeUp, setShowWakeUp] = useState(false);

  return (
    <div className="relative z-10 px-5 pt-14 pb-24 max-w-md mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between mb-8"
      >
        <div>
          <p className="text-sm text-muted-foreground font-ui">Good morning</p>
          <h1 className="text-2xl font-display text-foreground">Last Night</h1>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground font-ui uppercase">Total SP</p>
          <p className="text-lg font-display tabular-nums gradient-text">2,847</p>
        </div>
      </motion.div>

      {/* Score Ring */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5, ease: [0.3, 0, 0.2, 1] }}
        className="flex justify-center mb-8"
      >
        <SleepScoreRing score={87} />
      </motion.div>

      {/* Points Breakdown */}
      <div className="mb-5">
        <PointsBreakdown />
      </div>

      {/* Streak + Rank */}
      <div className="space-y-3 mb-6">
        <StreakBadge count={7} />
        <RankCard rank="Astral" sp={2847} nextSp={3500} />
      </div>

      {/* Set Alarm Button */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.4, ease: [0.3, 0, 0.2, 1] }}
        whileTap={{ scale: 0.97 }}
        onClick={() => setShowWakeUp(true)}
        className="w-full h-14 rounded-full flex items-center justify-center gap-3 font-ui text-sm uppercase text-primary-foreground"
        style={{ background: "linear-gradient(135deg, hsl(265 100% 70%), hsl(290 80% 60%))" }}
      >
        <AlarmClock size={18} />
        Best Time To Wake Up
      </motion.button>

      <WakeUpModal isOpen={showWakeUp} onClose={() => setShowWakeUp(false)} />
    </div>
  );
};

export default HomeScreen;
