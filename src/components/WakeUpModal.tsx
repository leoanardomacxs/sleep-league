import { motion, AnimatePresence } from "framer-motion";
import { X, Sun } from "lucide-react";

interface WakeUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const cycles = [
  { count: 4, time: "1:30 AM", hours: "6h", quality: "Good" },
  { count: 5, time: "3:00 AM", hours: "7.5h", quality: "Great" },
  { count: 6, time: "4:30 AM", hours: "9h", quality: "Optimal" },
];

const WakeUpModal = ({ isOpen, onClose }: WakeUpModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.35, ease: [0.3, 0, 0.2, 1] }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-3xl p-6 pb-10 max-w-md mx-auto"
            style={{ boxShadow: "0 -4px 30px rgba(0,0,0,0.4)" }}
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Sun size={20} className="text-accent" />
                <h3 className="text-lg font-display text-foreground">Best Wake-Up Times</h3>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-full bg-surface-elevated flex items-center justify-center">
                <X size={16} className="text-muted-foreground" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground font-body mb-5">
              Based on 90-minute sleep cycles starting now
            </p>
            <div className="space-y-3">
              {cycles.map((cycle, i) => (
                <motion.button
                  key={cycle.count}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.08, duration: 0.3, ease: [0.3, 0, 0.2, 1] }}
                  className="w-full card-dormio p-4 flex items-center justify-between active:scale-[0.97] transition-transform"
                  onClick={onClose}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <span className="text-sm font-display text-primary">{cycle.count}</span>
                    </div>
                    <div className="text-left">
                      <p className="text-base font-display tabular-nums text-foreground">{cycle.time}</p>
                      <p className="text-xs text-muted-foreground">{cycle.hours} · {cycle.count} cycles</p>
                    </div>
                  </div>
                  <span className={`text-xs font-ui px-2.5 py-1 rounded-full ${
                    cycle.quality === "Optimal" 
                      ? "bg-accent/10 text-accent" 
                      : cycle.quality === "Great"
                      ? "bg-primary/10 text-primary"
                      : "bg-surface-elevated text-muted-foreground"
                  }`}>
                    {cycle.quality}
                  </span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default WakeUpModal;
