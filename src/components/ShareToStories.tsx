import { motion, AnimatePresence } from "framer-motion";
import { Instagram, X } from "lucide-react";

interface ShareToStoriesProps {
  visible: boolean;
  onClose: () => void;
  type: "rank_change" | "task_complete";
  title: string;
  subtitle: string;
  emoji: string;
  gradientFrom: string;
  gradientTo: string;
}

const ShareToStories = ({
  visible,
  onClose,
  type: _type,
  title,
  subtitle,
  emoji,
  gradientFrom,
  gradientTo,
}: ShareToStoriesProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  const shareToInstagram = () => {
    // In a real app, this would generate an image and open Instagram stories
    // For now we show the card as a preview
    const text = `${emoji} ${title} - ${subtitle} | Dormio Sleep App`;
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
            {/* Close */}
            <button onClick={onClose} className="absolute -top-10 right-0 text-muted-foreground">
              <X size={24} />
            </button>

            {/* Story Card Preview */}
            <div
              ref={cardRef}
              className="w-full aspect-[9/16] rounded-3xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden"
              style={{
                background: `linear-gradient(180deg, ${gradientFrom}20, hsl(var(--background)))`,
              }}
            >
              {/* Glow */}
              <div
                className="absolute top-1/4 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full"
                style={{
                  background: `radial-gradient(circle, ${gradientFrom}30, transparent 70%)`,
                  filter: "blur(40px)",
                }}
              />

              <span className="text-6xl mb-6 relative z-10">{emoji}</span>
              <h2
                className="text-2xl font-display relative z-10 mb-2"
                style={{ color: gradientFrom }}
              >
                {title}
              </h2>
              <p className="text-sm text-muted-foreground font-body relative z-10 mb-8">
                {subtitle}
              </p>

              {/* Dormio branding */}
              <div className="absolute bottom-8 left-0 right-0 text-center">
                <p className="text-xs text-muted-foreground font-ui opacity-60">
                  🌙 Dormio
                </p>
              </div>
            </div>

            {/* Share buttons */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={shareToInstagram}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl text-white text-sm font-ui active:scale-95 transition-transform"
                style={{
                  background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
                }}
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
