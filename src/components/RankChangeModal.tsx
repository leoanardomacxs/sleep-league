import { motion, AnimatePresence } from "framer-motion";
import { useRank, RankEvent } from "@/contexts/RankContext";
import { useEffect, useState } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import ShareToStories from "./ShareToStories";
import RankIcon from "./RankIcon";

const RankChangeModal = () => {
  const { rankEvent, clearRankEvent } = useRank();
  const [visible, setVisible] = useState(false);
  const [event, setEvent] = useState<RankEvent | null>(null);
  const [showShare, setShowShare] = useState(false);

  useEffect(() => {
    if (rankEvent) {
      setEvent(rankEvent);
      setVisible(true);
    }
  }, [rankEvent]);

  const handleClose = () => {
    setVisible(false);
    setShowShare(true);
  };

  const handleShareClose = () => {
    setShowShare(false);
    setTimeout(clearRankEvent, 300);
  };

  if (!event) return null;

  const isUp = event.type === "rank_up";

  return (
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center px-6"
            onClick={handleClose}
          >

            {/* BACKGROUND */}
            <div
              className="absolute inset-0"
              style={{
                background: isUp
                  ? `radial-gradient(circle at center, ${event.toRank.colors.gradientFrom}30, transparent 70%), rgba(0,0,0,0.9)`
                  : "rgba(0,0,0,0.95)",
              }}
            />

            {/* CONTAINER */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 80 }}
              animate={
                isUp
                  ? {
                      scale: [0.4, 1.2, 1],
                      y: [80, -10, 0],
                      x: [0, -6, 6, -4, 4, 0],
                      opacity: 1,
                    }
                  : {
                      scale: [1, 0.9],
                      y: [0, 20],
                      opacity: 1,
                    }
              }
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="relative z-10 flex flex-col items-center text-center"
              onClick={(e) => e.stopPropagation()}
            >

              {/* FLASH DE LUZ (Rank Up) */}
              {isUp && (
                <motion.div
                  initial={{ scale: 0, opacity: 1 }}
                  animate={{ scale: 3, opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="absolute w-48 h-48 bg-white rounded-full blur-3xl"
                />
              )}

              {/* RANK ICON */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={
                  isUp
                    ? { scale: [0.3, 1.4, 1], rotate: [0, 10, -10, 0] }
                    : { scale: [1, 0.8], rotate: -20 }
                }
                transition={{ duration: 0.8 }}
                className="mb-4"
              >
                <div
                  className="w-24 h-24 rounded-3xl flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${event.toRank.colors.gradientFrom}30, ${event.toRank.colors.gradientTo}30)`,
                    boxShadow: isUp
                      ? `0 0 60px ${event.toRank.colors.glow}`
                      : `0 0 20px rgba(0,0,0,0.5)`,
                  }}
                >
                  <RankIcon rank={event.toRank} size={48} />
                </div>
              </motion.div>

              {/* SETA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mb-3"
              >
                {isUp ? (
                  <ArrowUp size={30} style={{ color: event.toRank.colors.gradientFrom }} />
                ) : (
                  <ArrowDown size={30} className="text-red-500" />
                )}
              </motion.div>

              {/* TITULO */}
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-3xl font-display mb-1"
                style={{
                  color: isUp
                    ? event.toRank.colors.gradientFrom
                    : "hsl(var(--destructive))",
                }}
              >
                {isUp ? "RANK UP!" : "RANK DOWN"}
              </motion.h2>

              {/* TEXTO */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-sm text-muted-foreground mb-6"
              >
                {isUp
                  ? `Você subiu para ${event.toRank.name}`
                  : `Você caiu para ${event.toRank.name}`}
              </motion.p>

              {/* TRANSIÇÃO RANK */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="flex items-center gap-4 mb-8"
              >
                <div className="flex flex-col items-center opacity-50">
                  <RankIcon rank={event.fromRank} size={24} />
                  <span className="text-xs text-muted-foreground mt-1">
                    {event.fromRank.name}
                  </span>
                </div>

                <ArrowUp size={16} className="rotate-90 text-muted-foreground" />

                <div className="flex flex-col items-center">
                  <RankIcon rank={event.toRank} size={28} />
                  <span
                    className="text-xs font-bold mt-1"
                    style={{
                      color: isUp
                        ? event.toRank.colors.gradientFrom
                        : "hsl(var(--destructive))",
                    }}
                  >
                    {event.toRank.name}
                  </span>
                </div>
              </motion.div>

              {/* BOTÃO */}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClose}
                className="px-8 py-3 rounded-full text-sm uppercase"
                style={{
                  background: isUp
                    ? `linear-gradient(135deg, ${event.toRank.colors.gradientFrom}, ${event.toRank.colors.gradientTo})`
                    : "hsl(var(--surface-elevated))",
                  color: "white",
                }}
              >
                {isUp ? "Continuar" : "Vou melhorar"}
              </motion.button>
            </motion.div>

            {/* PARTICULAS */}

            {isUp &&
              Array.from({ length: 40 }).map((_, i) => {
                const angle = (i / 40) * Math.PI * 2;
                const radius = 300;

                return (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      background:
                        i % 2
                          ? event.toRank.colors.gradientFrom
                          : event.toRank.colors.gradientTo,
                      top: "50%",
                      left: "50%",
                    }}
                    initial={{ x: 0, y: 0, opacity: 1 }}
                    animate={{
                      x: Math.cos(angle) * radius,
                      y: Math.sin(angle) * radius,
                      opacity: 0,
                      scale: 1.5,
                    }}
                    transition={{ duration: 1.2 }}
                  />
                );
              })}

            {!isUp &&
              Array.from({ length: 20 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-gray-500 rounded-full"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: "-10px",
                  }}
                  initial={{ y: 0, opacity: 0.6 }}
                  animate={{
                    y: window.innerHeight + 50,
                    opacity: 0,
                  }}
                  transition={{
                    duration: 2 + Math.random(),
                    delay: Math.random() * 0.5,
                  }}
                />
              ))}
          </motion.div>
        )}
      </AnimatePresence>

      <ShareToStories
        visible={showShare}
        onClose={handleShareClose}
        type="rank_change"
        title={isUp ? "Rank Up!" : "Rank Down"}
        subtitle={`${event.fromRank.name} → ${event.toRank.name}`}
        rank={event.toRank}
        gradientFrom={event.toRank.colors.gradientFrom}
        gradientTo={event.toRank.colors.gradientTo}
      />
    </>
  );
};

export default RankChangeModal;