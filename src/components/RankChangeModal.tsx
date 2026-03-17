import { motion, AnimatePresence } from "framer-motion";
import { useRank, RankEvent } from "@/contexts/RankContext";
import { useEffect, useState } from "react";
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
    setTimeout(() => {
      clearRankEvent();
      setEvent(null);
    }, 300);
  };

  if (!event) return null;

  const isUp = event.type === "rank_up";

  return (
    <>
      <AnimatePresence>
        {visible && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">

            {/* BACKGROUND */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="absolute inset-0 z-0"
              style={{
                background: isUp
                  ? `radial-gradient(circle at center, ${event.toRank.colors.gradientFrom}30, transparent 70%), rgba(0,0,0,0.9)`
                  : "rgba(0,0,0,0.95)",
              }}
            />

            {/* CONTEÚDO */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 80 }}
              animate={
                isUp
                  ? {
                      scale: [0.4, 1.2, 1],
                      y: [80, -10, 0],
                      opacity: 1,
                    }
                  : {
                      scale: [1, 0.9],
                      y: [0, 20],
                      opacity: 1,
                    }
              }
              transition={{ duration: 0.9, ease: "easeOut" }}
              className="relative z-10 flex flex-col items-center text-center pointer-events-auto"
            >

              {/* ICON */}
              <div className="mb-4">
                <div
                  className="w-24 h-24 rounded-3xl flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${event.toRank.colors.gradientFrom}30, ${event.toRank.colors.gradientTo}30)`,
                    boxShadow: `0 0 60px ${event.toRank.colors.glow}`,
                  }}
                >
                  <RankIcon rank={event.toRank} size={48} />
                </div>
              </div>

              {/* TITULO */}
              <h2
                className="text-3xl font-display mb-2"
                style={{ color: event.toRank.colors.gradientFrom }}
              >
                {isUp ? "RANK UP!" : "RANK DOWN"}
              </h2>

              {/* TEXTO */}
              <p className="text-sm text-muted-foreground mb-6">
                {isUp
                  ? `Você subiu para ${event.toRank.name}`
                  : `Você caiu para ${event.toRank.name}`}
              </p>

              {/* BOTÃO */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleClose();
                }}
                className="px-8 py-3 rounded-full text-sm uppercase"
                style={{
                  background: `linear-gradient(135deg, ${event.toRank.colors.gradientFrom}, ${event.toRank.colors.gradientTo})`,
                  color: "white",
                }}
              >
                {isUp ? "Continuar" : "Vou melhorar"}
              </button>
            </motion.div>

            {/* PARTICULAS */}
            {isUp &&
              Array.from({ length: 40 }).map((_, i) => {
                const angle = (i / 40) * Math.PI * 2;
                const radius = 300;

                return (
                  <motion.div
                    key={i}
                    className="absolute w-2 h-2 rounded-full pointer-events-none"
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
                    }}
                    transition={{ duration: 1.2 }}
                  />
                );
              })}
          </div>
        )}
      </AnimatePresence>

      {/* SHARE */}
      {event && (
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
      )}
    </>
  );
};

export default RankChangeModal;