import { type RankTier } from "@/lib/ranks";

interface RankIconProps {
  rank: RankTier;
  size?: number;
  className?: string;
}

const RankIcon = ({ rank, size = 16, className = "" }: RankIconProps) => {
  const IconComponent = rank.icon;
  return <IconComponent size={size} className={className} style={{ color: rank.colors.gradientFrom }} />;
};

export default RankIcon;
