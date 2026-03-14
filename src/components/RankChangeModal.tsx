import { motion, AnimatePresence } from "framer-motion";
import { useRank, RankEvent } from "@/contexts/RankContext";
import { useEffect, useState } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import ShareToStories from "./ShareToStories";

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
            {/* Backdrop */}
            <div
              className="absolute inset-0"
              style={{
                background: isUp
                  ? `radial-gradient(circle at center, ${event.toRank.colors.gradientFrom}20, transparent 70%), rgba(0,0,0,0.85)`
                  : "rgba(0,0,0,0.9)",
              }}
            />

            {/* Content */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 40 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 20, stiffness: 300, duration: 0.6 }}
              className="relative z-10 flex flex-col items-center text-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Glow ring */}
              {isUp && (
                <motion.div
                  className="absolute w-40 h-40 rounded-full"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: [0, 1.3, 1], opacity: [0, 0.6, 0.3] }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  style={{
                    background: `radial-gradient(circle, ${event.toRank.colors.gradientFrom}40, transparent 70%)`,
                    filter: "blur(20px)",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                />
              )}

              {/* Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.1, type: "spring", damping: 12, stiffness: 200 }}
                className="text-7xl mb-4 relative z-10"
              >
                {event.toRank.symbol}
              </motion.div>

              {/* Arrow */}
              <motion.div
                initial={{ opacity: 0, y: isUp ? 10 : -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-3"
              >
                {isUp ? (
                  <ArrowUp size={28} style={{ color: event.toRank.colors.gradientFrom }} />
                ) : (
                  <ArrowDown size={28} className="text-destructive" />
                )}
              </motion.div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-display mb-1"
                style={{ color: isUp ? event.toRank.colors.gradientFrom : "hsl(var(--destructive))" }}
              >
                {isUp ? "Rank Up!" : "Rank Down"}
              </motion.h2>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="text-sm text-muted-foreground font-body mb-6"
              >
                {isUp
                  ? `You ascended to ${event.toRank.name} tier`
                  : `You dropped to ${event.toRank.name} tier`}
              </motion.p>

              {/* From → To */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.45 }}
                className="flex items-center gap-4 mb-8"
              >
                <div className="flex flex-col items-center opacity-50">
                  <span className="text-2xl">{event.fromRank.symbol}</span>
                  <span className="text-xs text-muted-foreground font-ui mt-1">{event.fromRank.name}</span>
                </div>
                <span className="text-muted-foreground text-lg">→</span>
                <div className="flex flex-col items-center">
                  <span className="text-3xl">{event.toRank.symbol}</span>
                  <span
                    className="text-xs font-ui mt-1 font-bold"
                    style={{ color: isUp ? event.toRank.colors.gradientFrom : "hsl(var(--destructive))" }}
                  >
                    {event.toRank.name}
                  </span>
                </div>
              </motion.div>

              {/* CTA */}
              <motion.button
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClose}
                className="px-8 py-3 rounded-full text-sm font-ui uppercase"
                style={{
                  background: isUp
                    ? `linear-gradient(135deg, ${event.toRank.colors.gradientFrom}, ${event.toRank.colors.gradientTo})`
                    : "hsl(var(--surface-elevated))",
                  color: isUp ? "white" : "hsl(var(--foreground))",
                }}
              >
                {isUp ? "Let's Go!" : "I'll Do Better"}
              </motion.button>
            </motion.div>

            {/* Particles */}
            {isUp && (
              <>
                {Array.from({ length: 12 }).map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full"
                    style={{
                      background: i % 2 === 0 ? event.toRank.colors.gradientFrom : event.toRank.colors.gradientTo,
                    }}
                    initial={{ x: 0, y: 0, opacity: 1, scale: 1, top: "50%", left: "50%" }}
                    animate={{
                      x: (Math.random() - 0.5) * 300,
                      y: (Math.random() - 0.5) * 400,
                      opacity: 0,
                      scale: Math.random() * 2 + 0.5,
                    }}
                    transition={{
                      delay: 0.2 + Math.random() * 0.3,
                      duration: 1 + Math.random() * 0.5,
                      ease: "easeOut",
                    }}
                  />
                ))}
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Share to Stories prompt */}
      <ShareToStories
        visible={showShare}
        onClose={handleShareClose}
        type="rank_change"
        title={isUp ? "Rank Up!" : "Rank Down"}
        subtitle={`${event.fromRank.name} → ${event.toRank.name}`}
        emoji={event.toRank.symbol}
        gradientFrom={event.toRank.colors.gradientFrom}
        gradientTo={event.toRank.colors.gradientTo}
      />
    </>
  );
};

export default RankChangeModal;
