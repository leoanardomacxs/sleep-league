import { motion, AnimatePresence } from "framer-motion";
import { X, Sun, Moon, Clock, Star, Sparkles, CloudMoon } from "lucide-react";

interface WakeUpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const formatTime = (date: Date) =>
  date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

const getCycles = () => {
  const now = new Date();
  const fallAsleepMinutes = 15;

  return [4, 5, 6].map((count) => {
    const wakeTime = new Date(now.getTime() + (fallAsleepMinutes + count * 90) * 60000);
    const totalHours = (fallAsleepMinutes + count * 90) / 60;
    return {
      count,
      time: formatTime(wakeTime),
      hours: `${totalHours.toFixed(1)}h`,
      quality: count === 6 ? "Otimo" : count === 5 ? "Bom" : "Ok",
      icon: count === 6 ? Star : count === 5 ? Sparkles : CloudMoon,
    };
  });
};

const WakeUpModal = ({ isOpen, onClose }: WakeUpModalProps) => {
  const cycles = getCycles();

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
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-accent/15 flex items-center justify-center">
                    <Moon size={20} className="text-accent" />
                  </div>
                  <div>
                    <h3 className="text-lg font-display text-foreground">Melhor Hora de Acordar</h3>
                    <p className="text-xs text-muted-foreground font-body">Baseado em ciclos de 90 min</p>
                  </div>
                </div>
                <button onClick={onClose} className="w-8 h-8 rounded-full bg-surface-elevated flex items-center justify-center">
                  <X size={16} className="text-muted-foreground" />
                </button>
              </div>

              <div className="bg-surface rounded-2xl p-3.5 mb-5 flex items-start gap-3">
                <Clock size={16} className="text-muted-foreground mt-0.5 shrink-0" />
                <p className="text-xs text-muted-foreground font-body leading-relaxed">
                  Considerando ~15 min para adormecer. Acordar no final de um ciclo completo reduz a sensacao de cansaco.
                </p>
              </div>

              <div className="space-y-3">
                {cycles.map((cycle, i) => {
                  const CycleIcon = cycle.icon;
                  return (
                    <motion.button
                      key={cycle.count}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + i * 0.08 }}
                      className="w-full rounded-2xl p-5 flex items-center justify-between active:scale-[0.97] transition-transform border border-border/50"
                      style={{
                        background:
                          cycle.count === 6
                            ? "linear-gradient(135deg, hsl(var(--accent) / 0.08), hsl(var(--accent) / 0.02))"
                            : cycle.count === 5
                            ? "linear-gradient(135deg, hsl(var(--primary) / 0.06), hsl(var(--primary) / 0.02))"
                            : "hsl(var(--surface))",
                        borderColor:
                          cycle.count === 6 ? "hsl(var(--accent) / 0.25)"
                          : cycle.count === 5 ? "hsl(var(--primary) / 0.2)" : undefined,
                      }}
                      onClick={onClose}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-surface-elevated flex items-center justify-center">
                          <CycleIcon size={20} className={cycle.count === 6 ? "text-accent" : cycle.count === 5 ? "text-primary" : "text-muted-foreground"} />
                        </div>
                        <div className="text-left">
                          <p className="text-2xl font-display tabular-nums text-foreground tracking-tight">{cycle.time}</p>
                          <p className="text-xs text-muted-foreground font-body mt-0.5">{cycle.hours} de sono · {cycle.count} ciclos</p>
                        </div>
                      </div>
                      <span className={`text-xs font-ui font-bold px-3 py-1.5 rounded-full ${
                        cycle.count === 6 ? "bg-accent/15 text-accent"
                        : cycle.count === 5 ? "bg-primary/15 text-primary"
                        : "bg-surface-elevated text-muted-foreground"
                      }`}>
                        {cycle.quality}
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              <div className="mt-4 flex items-center justify-center gap-2">
                <Sun size={14} className="text-accent" />
                <p className="text-xs text-muted-foreground font-body">
                  Recomendado: <span className="text-accent font-bold">5-6 ciclos</span> para melhor recuperacao
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default WakeUpModal;
