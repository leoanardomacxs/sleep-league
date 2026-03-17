import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlarmClock, Plus, Moon } from "lucide-react";
import SleepScoreRing from "../components/SleepScoreRing";
import PointsBreakdown from "../components/PointsBreakdown";
import StreakBadge from "../components/StreakBadge";
import RankCard from "../components/RankCard";
import WakeUpModal from "../components/WakeUpModal";
import LogSleepModal from "../components/LogSleepModal";
import EmptyState from "../components/EmptyState";
import RankIcon from "../components/RankIcon";
import SleepDetectionBanner from "../components/SleepDetectionBanner";
import { useRank } from "@/contexts/RankContext";
import { useLastNight, useStreak } from "@/hooks/useSleepData";
import { useSleepDetection } from "@/hooks/useSleepDetection";

const HomeScreen = () => {
  const [showWakeUp, setShowWakeUp] = useState(false);
  const [showLogSleep, setShowLogSleep] = useState(false);
  const { rank, sp, nextRank } = useRank();
  const { data: lastNight, isLoading } = useLastNight();
  const { data: streak } = useStreak();
  const { estimate, isVisible: showDetection, confirm: confirmDetection, dismiss: dismissDetection } = useSleepDetection();

  const score = lastNight?.score || 0;
  const hasData = !!lastNight;

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
          <p className="text-sm text-muted-foreground font-ui">Bom dia</p>
          <h1 className="text-2xl font-display text-foreground">Noite Passada</h1>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1.5 justify-end mb-0.5">
            <RankIcon rank={rank} size={14} />
            <span className="text-xs font-ui font-bold" style={{ color: rank.colors.gradientFrom }}>
              {rank.name}
            </span>
          </div>
          <p className="text-xs text-muted-foreground font-ui uppercase">Total SP</p>
          <p
            className="text-lg font-display tabular-nums"
            style={{
              background: `linear-gradient(135deg, ${rank.colors.gradientFrom}, ${rank.colors.gradientTo})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {sp.toLocaleString()}
          </p>
        </div>
      </motion.div>

      {/* Score Ring or Empty State */}
      {isLoading ? (
        <div className="flex justify-center mb-8">
          <div className="w-[220px] h-[220px] rounded-full bg-surface-elevated animate-pulse" />
        </div>
      ) : hasData ? (
        <>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="flex justify-center mb-8"
          >
            <SleepScoreRing score={score} rankColors={rank.colors} />
          </motion.div>

          <div className="mb-5">
            <PointsBreakdown session={lastNight} />
          </div>
        </>
      ) : (
        <div className="mb-6">
          <EmptyState
            icon={Moon}
            title="Nenhum dado de sono"
            description="Registre sua primeira noite de sono para ver seu score e acumular SP."
            action={{ label: "Registrar Sono", onClick: () => setShowLogSleep(true) }}
            gradientFrom={rank.colors.gradientFrom}
            gradientTo={rank.colors.gradientTo}
          />
        </div>
      )}

      {/* Streak + Rank */}
      <div className="space-y-3 mb-6">
        <StreakBadge count={streak?.current || 0} />
        <RankCard
          rank={rank.name}
          sp={sp}
          nextSp={nextRank ? nextRank.minSp : sp + 1000}
          rankColors={rank.colors}
        />
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowWakeUp(true)}
          className="flex-1 h-14 rounded-2xl flex items-center justify-center gap-3 font-ui text-sm uppercase text-primary-foreground"
          style={{
            background: `linear-gradient(135deg, ${rank.colors.gradientFrom}, ${rank.colors.gradientTo})`,
          }}
        >
          <AlarmClock size={18} />
          Melhor Hora
        </motion.button>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowLogSleep(true)}
          className="h-14 w-14 rounded-2xl flex items-center justify-center bg-card border border-border"
        >
          <Plus size={20} className="text-primary" />
        </motion.button>
      </div>

      <WakeUpModal isOpen={showWakeUp} onClose={() => setShowWakeUp(false)} />
      <LogSleepModal isOpen={showLogSleep} onClose={() => setShowLogSleep(false)} />
    </div>
  );
};

export default HomeScreen;
