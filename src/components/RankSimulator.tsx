import { motion } from "framer-motion";
import { Beaker } from "lucide-react";
import { useRank } from "@/contexts/RankContext";
import { RANK_TIERS } from "@/lib/ranks";
import RankIcon from "./RankIcon";

const RankSimulator = () => {
  const { simulateRankChange, rank } = useRank();

  const quickJumps = RANK_TIERS.filter(
    (t) => t.name !== rank.name
  ).slice(0, 11);

  return (
    <motion.div className="card-dormio p-4">
      <div className="flex items-center gap-2 mb-3">
        <Beaker size={14} />
        <p className="text-xs uppercase">Simular Rank</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {quickJumps.map((tier) => (
          <button
            key={tier.name}
            onClick={() => simulateRankChange(tier.minSp + 50)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs"
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