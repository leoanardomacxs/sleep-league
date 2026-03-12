import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { RankTier, getRankForSp, getNextRank, RANK_TIERS } from "@/lib/ranks";

interface RankContextType {
  sp: number;
  setSp: (sp: number) => void;
  rank: RankTier;
  nextRank: RankTier | null;
  progress: number; // 0-100 to next rank
  rankEvent: RankEvent | null;
  clearRankEvent: () => void;
  simulateRankChange: (newSp: number) => void;
}

export type RankEvent = {
  type: "rank_up" | "rank_down";
  fromRank: RankTier;
  toRank: RankTier;
};

const RankContext = createContext<RankContextType | null>(null);

export function RankProvider({ children }: { children: ReactNode }) {
  const [sp, setSpState] = useState(2847);
  const [rankEvent, setRankEvent] = useState<RankEvent | null>(null);

  const rank = getRankForSp(sp);
  const nextRank = getNextRank(rank);

  const currentIdx = RANK_TIERS.findIndex((r) => r.name === rank.name);
  const currentMin = rank.minSp;
  const nextMin = nextRank ? nextRank.minSp : rank.minSp + 1000;
  const progress = Math.min(100, ((sp - currentMin) / (nextMin - currentMin)) * 100);

  // Apply rank theme to CSS variables
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--primary", rank.colors.primary);
    root.style.setProperty("--glow-primary", rank.colors.primary);
    root.style.setProperty("--ring", rank.colors.primary);
    root.style.setProperty("--sidebar-primary", rank.colors.primary);
    root.style.setProperty("--sidebar-ring", rank.colors.primary);
    root.style.setProperty("--shadow-glow-primary", `0 0 20px ${rank.colors.glow} / 0.3`);
  }, [rank]);

  const setSp = useCallback(
    (newSp: number) => {
      const oldRank = getRankForSp(sp);
      const newRank = getRankForSp(newSp);
      if (oldRank.name !== newRank.name) {
        const oldIdx = RANK_TIERS.findIndex((r) => r.name === oldRank.name);
        const newIdx = RANK_TIERS.findIndex((r) => r.name === newRank.name);
        setRankEvent({
          type: newIdx > oldIdx ? "rank_up" : "rank_down",
          fromRank: oldRank,
          toRank: newRank,
        });
      }
      setSpState(newSp);
    },
    [sp]
  );

  const simulateRankChange = useCallback(
    (newSp: number) => {
      setSp(newSp);
    },
    [setSp]
  );

  const clearRankEvent = useCallback(() => setRankEvent(null), []);

  return (
    <RankContext.Provider
      value={{ sp, setSp, rank, nextRank, progress, rankEvent, clearRankEvent, simulateRankChange }}
    >
      {children}
    </RankContext.Provider>
  );
}

export function useRank() {
  const ctx = useContext(RankContext);
  if (!ctx) throw new Error("useRank must be used within RankProvider");
  return ctx;
}
