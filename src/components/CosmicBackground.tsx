import { useRank } from "@/contexts/RankContext";
import { useMemo } from "react";

type Behavior = {
  base: number;
  variance: number;
  smoothness: number;
  density: number;
};

function getPulseBehavior(rankName: string): Behavior {
  const map: Record<string, Behavior> = {
    Chaotic: { base: 0.5, variance: 2.5, smoothness: 0, density: 11 },
    Unstable: { base: 1.5, variance: 0.7, smoothness: 0.4, density: 7 },
    Drowsy: { base: 1.8, variance: 0.6, smoothness: 0.5, density: 6 },
    Balanced: { base: 2.2, variance: 0.5, smoothness: 0.7, density: 5 },
    Restored: { base: 2.5, variance: 0.4, smoothness: 0.8, density: 4 },
    Zen: { base: 2.8, variance: 0.3, smoothness: 0.9, density: 4 },
    Harmonic: { base: 3.0, variance: 0.25, smoothness: 0.95, density: 4 },
    Dreamer: { base: 3.2, variance: 0.2, smoothness: 1, density: 3 },
    Astral: { base: 3.5, variance: 0.15, smoothness: 1, density: 3 },
    Lucid: { base: 3.8, variance: 0.1, smoothness: 1, density: 3 },
    Nirvana: { base: 4.2, variance: 0, smoothness: 1, density: 1 },
  };

  return map[rankName] || map["Chaotic"];
}

const CosmicBackground = () => {
  const { rank } = useRank();

  const behavior = getPulseBehavior(rank?.name || "Chaotic");

  const easing =
    behavior.smoothness > 0.85
      ? "cubic-bezier(0.4, 0, 0.2, 1)"
      : "ease-in-out";

  // 🔒 geração estável (não muda a cada render)
  const elements = useMemo(() => {
    return Array.from({ length: behavior.density }).map((_, i) => {
      const size = 180 + Math.random() * 260;

      return {
        id: i,
        size,
        top: 10 + Math.random() * 80,
        left: 10 + Math.random() * 80,
        opacity: 0.04 + Math.random() * 0.04,
        duration: behavior.base + i * behavior.variance,
        delay: i * 0.6,
        colorType: i % 2 === 0 ? "from" : "to",
      };
    });
  }, [behavior.density, behavior.base, behavior.variance]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* fundo */}
      <div className="absolute inset-0 bg-background" />

      {/* bolas cósmicas */}
      {elements.map((el) => (
        <div
          key={el.id}
          className="absolute rounded-full"
          style={{
            width: `${el.size}px`,
            height: `${el.size}px`,
            top: `${el.top}%`,
            left: `${el.left}%`,
            transform: "translate(-50%, -50%)",
            opacity: el.opacity,
            background: `radial-gradient(circle, ${
              el.colorType === "from"
                ? rank?.colors?.gradientFrom || "#8b5cf6"
                : rank?.colors?.gradientTo || "#22d3ee"
            }, transparent 70%)`,
            animation: `cosmicBreath ${el.duration}s ${easing} infinite`,
            animationDelay: `${el.delay}s`,
          }}
        />
      ))}
    </div>
  );
};

export default CosmicBackground;