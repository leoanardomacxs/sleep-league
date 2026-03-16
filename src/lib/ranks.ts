import { Skull, AlertTriangle, CloudMoon, Scale, Leaf, Waves, Music, Moon, Sparkles, Diamond, Eye, type LucideIcon } from "lucide-react";

export interface RankTier {
  name: string;
  iconName: string;
  icon: LucideIcon;
  minSp: number;
  colors: {
    primary: string;
    accent: string;
    glow: string;
    gradientFrom: string;
    gradientTo: string;
  };
}

export const RANK_TIERS: RankTier[] = [
  {
    name: "Chaotic",
    iconName: "Skull",
    icon: Skull,
    minSp: 0,
    colors: {
      primary: "0 60% 45%",
      accent: "15 80% 50%",
      glow: "hsl(0 60% 45%)",
      gradientFrom: "hsl(0 60% 45%)",
      gradientTo: "hsl(15 80% 50%)",
    },
  },
  {
    name: "Unstable",
    iconName: "AlertTriangle",
    icon: AlertTriangle,
    minSp: 300,
    colors: {
      primary: "20 85% 50%",
      accent: "35 90% 55%",
      glow: "hsl(20 85% 50%)",
      gradientFrom: "hsl(20 85% 50%)",
      gradientTo: "hsl(35 90% 55%)",
    },
  },
  {
    name: "Drowsy",
    iconName: "CloudMoon",
    icon: CloudMoon,
    minSp: 700,
    colors: {
      primary: "40 80% 50%",
      accent: "55 75% 55%",
      glow: "hsl(40 80% 50%)",
      gradientFrom: "hsl(40 80% 50%)",
      gradientTo: "hsl(55 75% 55%)",
    },
  },
  {
    name: "Balanced",
    iconName: "Scale",
    icon: Scale,
    minSp: 1200,
    colors: {
      primary: "140 55% 45%",
      accent: "160 60% 50%",
      glow: "hsl(140 55% 45%)",
      gradientFrom: "hsl(140 55% 45%)",
      gradientTo: "hsl(160 60% 50%)",
    },
  },
  {
    name: "Restored",
    iconName: "Leaf",
    icon: Leaf,
    minSp: 1700,
    colors: {
      primary: "160 65% 45%",
      accent: "180 70% 50%",
      glow: "hsl(160 65% 45%)",
      gradientFrom: "hsl(160 65% 45%)",
      gradientTo: "hsl(180 70% 50%)",
    },
  },
  {
    name: "Zen",
    iconName: "Waves",
    icon: Waves,
    minSp: 2100,
    colors: {
      primary: "200 70% 55%",
      accent: "220 65% 60%",
      glow: "hsl(200 70% 55%)",
      gradientFrom: "hsl(200 70% 55%)",
      gradientTo: "hsl(220 65% 60%)",
    },
  },
  {
    name: "Harmonic",
    iconName: "Music",
    icon: Music,
    minSp: 2500,
    colors: {
      primary: "240 70% 65%",
      accent: "260 65% 60%",
      glow: "hsl(240 70% 65%)",
      gradientFrom: "hsl(240 70% 65%)",
      gradientTo: "hsl(260 65% 60%)",
    },
  },
  {
    name: "Dreamer",
    iconName: "Moon",
    icon: Moon,
    minSp: 2800,
    colors: {
      primary: "265 80% 65%",
      accent: "285 70% 60%",
      glow: "hsl(265 80% 65%)",
      gradientFrom: "hsl(265 80% 65%)",
      gradientTo: "hsl(285 70% 60%)",
    },
  },
  {
    name: "Astral",
    iconName: "Sparkles",
    icon: Sparkles,
    minSp: 3200,
    colors: {
      primary: "265 100% 70%",
      accent: "190 100% 65%",
      glow: "hsl(265 100% 70%)",
      gradientFrom: "hsl(265 100% 70%)",
      gradientTo: "hsl(190 100% 65%)",
    },
  },
  {
    name: "Lucid",
    iconName: "Diamond",
    icon: Diamond,
    minSp: 4000,
    colors: {
      primary: "280 100% 75%",
      accent: "320 80% 70%",
      glow: "hsl(280 100% 75%)",
      gradientFrom: "hsl(280 100% 75%)",
      gradientTo: "hsl(320 80% 70%)",
    },
  },
  {
    name: "Nirvana",
    iconName: "Eye",
    icon: Eye,
    minSp: 5000,
    colors: {
      primary: "45 100% 65%",
      accent: "30 100% 60%",
      glow: "hsl(45 100% 65%)",
      gradientFrom: "hsl(45 100% 65%)",
      gradientTo: "hsl(30 100% 60%)",
    },
  },
];

export function getRankForSp(sp: number): RankTier {
  for (let i = RANK_TIERS.length - 1; i >= 0; i--) {
    if (sp >= RANK_TIERS[i].minSp) return RANK_TIERS[i];
  }
  return RANK_TIERS[0];
}

export function getNextRank(currentRank: RankTier): RankTier | null {
  const idx = RANK_TIERS.findIndex((r) => r.name === currentRank.name);
  return idx < RANK_TIERS.length - 1 ? RANK_TIERS[idx + 1] : null;
}

export function getRankByName(name: string): RankTier | undefined {
  return RANK_TIERS.find((r) => r.name === name);
}
