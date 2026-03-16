import { motion } from "framer-motion";
import { Moon, type LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  gradientFrom?: string;
  gradientTo?: string;
}

const EmptyState = ({
  icon: Icon = Moon,
  title,
  description,
  action,
  gradientFrom = "hsl(265 100% 70%)",
  gradientTo = "hsl(190 100% 65%)",
}: EmptyStateProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-dormio p-8 flex flex-col items-center text-center"
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{
          background: `linear-gradient(135deg, ${gradientFrom}15, ${gradientTo}15)`,
          boxShadow: `0 0 30px ${gradientFrom}10`,
        }}
      >
        <Icon size={28} style={{ color: gradientFrom }} />
      </div>
      <h3 className="text-base font-display text-foreground mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground font-body leading-relaxed max-w-[240px]">
        {description}
      </p>
      {action && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={action.onClick}
          className="mt-4 px-5 py-2.5 rounded-xl text-xs font-ui uppercase text-primary-foreground"
          style={{
            background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
          }}
        >
          {action.label}
        </motion.button>
      )}
    </motion.div>
  );
};

export default EmptyState;
