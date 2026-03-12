import { useRank } from "@/contexts/RankContext";

const CosmicBackground = () => {
  const { rank } = useRank();

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-background" />
      <div
        className="absolute top-1/4 -left-1/4 w-96 h-96 rounded-full opacity-[0.06] animate-pulse-glow transition-all duration-1000"
        style={{ background: `radial-gradient(circle, ${rank.colors.gradientFrom}, transparent 70%)` }}
      />
      <div
        className="absolute bottom-1/3 -right-1/4 w-80 h-80 rounded-full opacity-[0.04] animate-pulse-glow transition-all duration-1000"
        style={{ background: `radial-gradient(circle, ${rank.colors.gradientTo}, transparent 70%)`, animationDelay: "1s" }}
      />
      <div
        className="absolute top-2/3 left-1/3 w-64 h-64 rounded-full opacity-[0.03] animate-pulse-glow transition-all duration-1000"
        style={{ background: `radial-gradient(circle, ${rank.colors.gradientFrom}, transparent 70%)`, animationDelay: "2s" }}
      />
    </div>
  );
};

export default CosmicBackground;
