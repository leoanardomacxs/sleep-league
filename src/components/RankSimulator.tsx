import { motion } from "framer-motion";
import { Beaker } from "lucide-react";
import { useRank } from "@/contexts/RankContext";
import { RANK_TIERS } from "@/lib/ranks";
import RankIcon from "./RankIcon";

const RankSimulator = () => {
  const { sp, simulateRankChange, rank } = useRank();
  const quickJumps = RANK_TIERS.filter((t) => t.name !== rank.name).slice(0, 6);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="card-dormio p-4">
      <div className="flex items-center gap-2 mb-3">
        <Beaker size={14} className="text-muted-foreground" />
        <p className="text-xs font-ui text-muted-foreground uppercase">Simular Rank (Demo)</p>
      </div>
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
            <RankIcon rank={tier} size={12} />
            {tier.name}
          </button>
        ))}
      </div>
    </motion.div>
  );
};

export default RankSimulator;
