import { createContext, useContext, useState } from "react";
import { getRankForSp } from "@/lib/ranks";

type RankContextType = {
  sp: number | null;
  simulateRankChange: (sp: number) => void;
  rank: any;
};

const RankContext = createContext<RankContextType | null>(null);

export const RankProvider = ({ children }: { children: React.ReactNode }) => {
  const [sp, setSp] = useState<number | null>(null);

  const simulateRankChange = (newSp: number) => {
    setSp(newSp);
  };

  const rank = getRankForSp(sp ?? 0);

  return (
    <RankContext.Provider value={{ sp, simulateRankChange, rank }}>
      {children}
    </RankContext.Provider>
  );
};

export const useRank = () => {
  const context = useContext(RankContext);
  if (!context) {
    throw new Error("useRank must be used inside RankProvider");
  }
  return context;
};