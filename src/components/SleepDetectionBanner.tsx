import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Check, X, ChevronDown, ChevronUp, Clock, Sparkles } from "lucide-react";
import { useLogSleep } from "@/hooks/useSleepData";
import { toast } from "sonner";
import type { SleepEstimate } from "@/hooks/useSleepDetection";

interface SleepDetectionBannerProps {
  estimate: SleepEstimate;
  onConfirm: () => void;
  onDismiss: () => void;
}

function formatTime(date: Date): string {
  return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m > 0 ? `${m}min` : ""}`.trim();
}

const SleepDetectionBanner = ({ estimate, onConfirm, onDismiss }: SleepDetectionBannerProps) => {
  const [expanded, setExpanded] = useState(false);
  const [sleepTime, setSleepTime] = useState("");
  const [wakeTime, setWakeTime] = useState("");
  const [phoneBefore, setPhoneBefore] = useState(false);

  const logSleep = useLogSleep();

  // 🔥 ATUALIZA OS INPUTS SEMPRE QUE O ESTIMATE MUDAR
  useEffect(() => {
    setSleepTime(formatTime(estimate.sleepStart));
    setWakeTime(formatTime(estimate.sleepEnd));
  }, [estimate]);

  const confidenceLabel = {
    high: "Alta precisão",
    medium: "Precisão moderada",
    low: "Estimativa aproximada",
  };

  const confidenceColor = {
    high: "text-accent",
    medium: "text-primary",
    low: "text-muted-foreground",
  };

  const handleConfirm = async () => {
    const [sh, sm] = sleepTime.split(":").map(Number);
    const [wh, wm] = wakeTime.split(":").map(Number);

    const sleepStart = new Date(estimate.sleepStart);
    sleepStart.setHours(sh, sm, 0, 0);

    const sleepEnd = new Date(estimate.sleepEnd);
    sleepEnd.setHours(wh, wm, 0, 0);

    // 🔥 CORREÇÃO: vira o dia automaticamente
    if (sleepEnd <= sleepStart) {
      sleepEnd.setDate(sleepEnd.getDate() + 1);
    }

    try {
      await logSleep.mutateAsync({ sleepStart, sleepEnd, phoneBefore });
      toast.success("Sono registrado automaticamente!");
      onConfirm();
    } catch {
      toast.error("Erro ao registrar sono");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.4, ease: [0.2, 0, 0.2, 1] }}
      className="relative overflow-hidden rounded-2xl border border-border bg-card"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "var(--gradient-primary)" }}
      />

      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Sparkles size={18} className="text-primary" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-display text-foreground">Sono detectado</p>
            <p className="text-xs text-muted-foreground font-body mt-0.5">
              Parece que você dormiu {formatDuration(estimate.durationMinutes)}
            </p>
          </div>

          <button
            onClick={onDismiss}
            className="w-7 h-7 rounded-full bg-surface-elevated flex items-center justify-center flex-shrink-0"
          >
            <X size={14} className="text-muted-foreground" />
          </button>
        </div>

        {/* Horários */}
        <div className="flex items-center gap-4 mt-4 px-1">
          <div className="flex items-center gap-2">
            <Moon size={14} className="text-primary" />
            <span className="text-sm font-display text-foreground tabular-nums">
              {formatTime(estimate.sleepStart)}
            </span>
          </div>

          <div className="flex-1 h-px bg-border relative">
            <div
              className="absolute inset-0"
              style={{ background: "var(--gradient-primary)", opacity: 0.3 }}
            />
          </div>

          <div className="flex items-center gap-2">
            <Sun size={14} className="text-accent" />
            <span className="text-sm font-display text-foreground tabular-nums">
              {formatTime(estimate.sleepEnd)}
            </span>
          </div>
        </div>

        {/* Confiança */}
        <div className="flex items-center gap-1.5 mt-3 px-1">
          <Clock size={11} className={confidenceColor[estimate.confidence]} />
          <span className={`text-[10px] font-ui uppercase tracking-wider ${confidenceColor[estimate.confidence]}`}>
            {confidenceLabel[estimate.confidence]}
          </span>
        </div>

        {/* Ajuste */}
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-surface rounded-xl p-3">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Moon size={12} className="text-primary" />
                      <span className="text-[10px] font-ui text-muted-foreground uppercase">Dormiu</span>
                    </div>
                    <input
                      type="time"
                      value={sleepTime}
                      onChange={(e) => setSleepTime(e.target.value)}
                      className="w-full text-lg font-display bg-transparent focus:outline-none"
                    />
                  </div>

                  <div className="bg-surface rounded-xl p-3">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <Sun size={12} className="text-accent" />
                      <span className="text-[10px] font-ui text-muted-foreground uppercase">Acordou</span>
                    </div>
                    <input
                      type="time"
                      value={wakeTime}
                      onChange={(e) => setWakeTime(e.target.value)}
                      className="w-full text-lg font-display bg-transparent focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={() => setPhoneBefore(!phoneBefore)}
                  className={`w-full bg-surface rounded-xl p-3 text-left ${
                    phoneBefore ? "ring-1 ring-destructive/30" : "ring-1 ring-accent/30"
                  }`}
                >
                  <span className="text-xs font-display">
                    {phoneBefore ? "Usei celular antes" : "Não usei celular antes"}
                  </span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ações */}
        <div className="flex items-center gap-2 mt-4">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleConfirm}
            disabled={logSleep.isPending}
            className="flex-1 h-11 rounded-xl flex items-center justify-center gap-2 text-sm font-ui text-primary-foreground disabled:opacity-50"
            style={{ background: "var(--gradient-primary)" }}
          >
            <Check size={16} />
            Confirmar
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => setExpanded(!expanded)}
            className="h-11 px-4 rounded-xl bg-surface-elevated flex items-center gap-1.5 text-xs font-ui text-muted-foreground"
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            Ajustar
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default SleepDetectionBanner;