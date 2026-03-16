import { motion, AnimatePresence } from "framer-motion";
import { Instagram, X, Moon } from "lucide-react";
import type { RankTier } from "@/lib/ranks";
import RankIcon from "./RankIcon";

interface ShareToStoriesProps {
  visible: boolean;
  onClose: () => void;
  type: "rank_change" | "task_complete";
  title: string;
  subtitle: string;
  rank?: RankTier;
  gradientFrom: string;
  gradientTo: string;
}

const ShareToStories = ({
  visible,
  onClose,
  title,
  subtitle,
  rank,
  gradientFrom,
  gradientTo,
}: ShareToStoriesProps) => {
  const shareToInstagram = () => {
    const text = `${title} - ${subtitle} | Dormio Sleep App`;
    navigator.clipboard.writeText(text);
    window.open("https://instagram.com/stories/create", "_blank");
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[110] flex items-center justify-center px-6"
          onClick={onClose}
        >
          <div className="absolute inset-0 bg-black/80" />

          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 22, stiffness: 300 }}
            className="relative z-10 w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={onClose} className="absolute -top-10 right-0 text-muted-foreground">
              <X size={24} />
            </button>

            <div
              className="w-full aspect-[9/16] rounded-3xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden"
              style={{ background: `linear-gradient(180deg, ${gradientFrom}20, hsl(var(--background)))` }}
            >
              <div
                className="absolute top-1/4 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full"
                style={{ background: `radial-gradient(circle, ${gradientFrom}30, transparent 70%)`, filter: "blur(40px)" }}
              />

              <div className="relative z-10 mb-6">
                {rank ? (
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto"
                    style={{ background: `linear-gradient(135deg, ${gradientFrom}30, ${gradientTo}30)` }}
                  >
                    <RankIcon rank={rank} size={32} />
                  </div>
                ) : (
                  <Moon size={48} style={{ color: gradientFrom }} />
                )}
              </div>

              <h2 className="text-2xl font-display relative z-10 mb-2" style={{ color: gradientFrom }}>
                {title}
              </h2>
              <p className="text-sm text-muted-foreground font-body relative z-10 mb-8">{subtitle}</p>

              <div className="absolute bottom-8 left-0 right-0 text-center">
                <div className="flex items-center justify-center gap-1.5">
                  <Moon size={12} className="text-muted-foreground opacity-60" />
                  <p className="text-xs text-muted-foreground font-ui opacity-60">Dormio</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                onClick={shareToInstagram}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white text-sm font-ui active:scale-95 transition-transform"
                style={{ background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` }}
              >
                <Instagram size={18} />
                Compartilhar no Stories
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ShareToStories;
