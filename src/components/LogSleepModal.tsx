import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, Moon, Sun, Smartphone, SmartphoneOff, Loader2, NotebookPen } from "lucide-react";
import { useLogSleep } from "@/hooks/useSleepData";
import { toast } from "sonner";

interface LogSleepModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LogSleepModal = ({ isOpen, onClose }: LogSleepModalProps) => {
  const [sleepTime, setSleepTime] = useState("23:00");
  const [wakeTime, setWakeTime] = useState("07:00");
  const [phoneBefore, setPhoneBefore] = useState(false);
  const [notes, setNotes] = useState("");

  const logSleep = useLogSleep();

  const handleSubmit = async () => {
    const now = new Date();
    const [sh, sm] = sleepTime.split(":").map(Number);
    const [wh, wm] = wakeTime.split(":").map(Number);

    const sleepStart = new Date(now);
    sleepStart.setDate(sleepStart.getDate() - 1);
    sleepStart.setHours(sh, sm, 0, 0);

    const sleepEnd = new Date(now);
    sleepEnd.setHours(wh, wm, 0, 0);

    if (sleepEnd <= sleepStart) {
      sleepEnd.setDate(sleepEnd.getDate() + 1);
    }

    try {
      await logSleep.mutateAsync({ sleepStart, sleepEnd, phoneBefore, notes });
      toast.success("Sono registrado com sucesso!");
      onClose();
    } catch {
      toast.error("Erro ao registrar sono");
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-md z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.35, ease: [0.3, 0, 0.2, 1] }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-3xl max-w-md mx-auto"
            style={{ boxShadow: "0 -8px 40px rgba(0,0,0,0.5)" }}
          >
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
            </div>

            <div className="px-6 pt-3 pb-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-primary/15 flex items-center justify-center">
                    <NotebookPen size={20} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-display text-foreground">Registrar Sono</h3>
                    <p className="text-xs text-muted-foreground font-body">Como foi sua noite?</p>
                  </div>
                </div>
                <button onClick={onClose} className="w-8 h-8 rounded-full bg-surface-elevated flex items-center justify-center">
                  <X size={16} className="text-muted-foreground" />
                </button>
              </div>

              {/* Time inputs */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-surface rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Moon size={14} className="text-primary" />
                    <span className="text-xs font-ui text-muted-foreground uppercase">Dormiu</span>
                  </div>
                  <input
                    type="time"
                    value={sleepTime}
                    onChange={(e) => setSleepTime(e.target.value)}
                    className="w-full text-xl font-display text-foreground bg-transparent focus:outline-none"
                  />
                </div>
                <div className="bg-surface rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Sun size={14} className="text-accent" />
                    <span className="text-xs font-ui text-muted-foreground uppercase">Acordou</span>
                  </div>
                  <input
                    type="time"
                    value={wakeTime}
                    onChange={(e) => setWakeTime(e.target.value)}
                    className="w-full text-xl font-display text-foreground bg-transparent focus:outline-none"
                  />
                </div>
              </div>

              {/* Phone toggle */}
              <button
                onClick={() => setPhoneBefore(!phoneBefore)}
                className={`w-full bg-surface rounded-2xl p-4 flex items-center gap-3 mb-5 transition-all ${
                  phoneBefore ? "ring-1 ring-destructive/30" : "ring-1 ring-accent/30"
                }`}
              >
                {phoneBefore ? (
                  <Smartphone size={18} className="text-destructive" />
                ) : (
                  <SmartphoneOff size={18} className="text-accent" />
                )}
                <div className="text-left flex-1">
                  <p className="text-sm font-display text-foreground">
                    {phoneBefore ? "Usei celular antes de dormir" : "Não usei celular antes"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {phoneBefore ? "Reduz pontuação" : "+20 SP bônus"}
                  </p>
                </div>
              </button>

              {/* Notes */}
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Observações (opcional)"
                rows={2}
                className="w-full bg-surface rounded-2xl p-4 text-sm text-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 resize-none mb-5"
              />

              {/* Submit */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleSubmit}
                disabled={logSleep.isPending}
                className="w-full h-14 rounded-2xl flex items-center justify-center gap-2 font-ui text-sm uppercase text-primary-foreground disabled:opacity-50"
                style={{
                  background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--accent)))",
                }}
              >
                {logSleep.isPending ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  "Registrar Sono"
                )}
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default LogSleepModal;
