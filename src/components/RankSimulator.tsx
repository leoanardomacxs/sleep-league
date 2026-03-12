import { motion } from "framer-motion";
import { Shield } from "lucide-react";
import { useRank } from "@/contexts/RankContext";
import { RANK_TIERS } from "@/lib/ranks";

const RankSimulator = () => {
  const { sp, simulateRankChange, rank } = useRank();

  const quickJumps = RANK_TIERS.filter((t) => t.name !== rank.name).slice(0, 6);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="card-dormio p-4"
    >
      <p className="text-xs font-ui text-muted-foreground uppercase mb-3">
        🧪 Simulate Rank (Demo)
      </p>
      <div className="flex flex-wrap gap-2">
        {quickJumps.map((tier) => (
          <button
            key={tier.name}
            onClick={() => simulateRankChange(tier.minSp + 50)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-ui transition-all active:scale-95"
            style={{
              background: `${tier.colors.gradientFrom}20`,
              color: tier.colors.gradientFrom,
              border: `1px solid ${tier.colors.gradientFrom}30`,
            }}
          >
            <span>{tier.symbol}</span>
            {tier.name}
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default RankSimulator;
