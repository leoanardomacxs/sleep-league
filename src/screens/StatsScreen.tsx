import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Moon,
  Sun,
  Clock,
  Zap,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  Target,
  BedDouble,
  Activity,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { useRank } from "@/contexts/RankContext";
import {
  generateSleepHistory,
  getWeeklyStats,
  generateInsights,
  type SleepNight,
  type SleepInsight,
} from "@/lib/sleepData";

type ViewPeriod = "week" | "month";

const StatsScreen = () => {
  const { rank } = useRank();
  const [period, setPeriod] = useState<ViewPeriod>("week");
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedNight, setSelectedNight] = useState<SleepNight | null>(null);

  const allHistory = useMemo(() => generateSleepHistory(90), []);

  const displayData = useMemo(() => {
    if (period === "week") {
      const end = allHistory.length - weekOffset * 7;
      const start = Math.max(0, end - 7);
      return allHistory.slice(start, end);
    }
    return allHistory.slice(-30);
  }, [allHistory, period, weekOffset]);

  const weeklyStats = useMemo(() => getWeeklyStats(displayData), [displayData]);
  const insights = useMemo(() => generateInsights(allHistory), [allHistory]);

  const chartData = displayData.map((n) => {
    const d = new Date(n.date);
    const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    return {
      day: period === "week" ? dayNames[d.getDay()] : `${d.getDate()}/${d.getMonth() + 1}`,
      score: n.score,
      hours: n.hoursSlept,
      date: n.date,
      full: n,
    };
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const data = payload[0].payload;
    return (
      <div className="card-dormio p-3 text-xs space-y-1">
        <p className="font-display text-foreground">{data.day}</p>
        <p className="text-muted-foreground">
          Score: <span className="text-foreground font-bold">{data.score}</span>
        </p>
        <p className="text-muted-foreground">
          Horas: <span className="text-foreground font-bold">{data.hours?.toFixed(1)}h</span>
        </p>
      </div>
    );
  };

  return (
    <div className="relative z-10 px-5 pt-14 pb-24 max-w-md mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-display text-foreground">Estatísticas</h1>
        <p className="text-sm text-muted-foreground font-ui">Análise do seu sono</p>
      </motion.div>

      {/* Period Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-2 mb-6"
      >
        {(["week", "month"] as ViewPeriod[]).map((p) => (
          <button
            key={p}
            onClick={() => {
              setPeriod(p);
              setWeekOffset(0);
            }}
            className={`flex-1 h-10 rounded-xl font-ui text-sm uppercase transition-all ${
              period === p
                ? "text-primary-foreground"
                : "bg-card text-muted-foreground"
            }`}
            style={
              period === p
                ? {
                    background: `linear-gradient(135deg, ${rank.colors.gradientFrom}, ${rank.colors.gradientTo})`,
                  }
                : undefined
            }
          >
            {p === "week" ? "Semana" : "Mês"}
          </button>
        ))}
      </motion.div>

      {/* Week navigation */}
      {period === "week" && (
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setWeekOffset((o) => Math.min(o + 1, 11))}
            className="w-8 h-8 rounded-lg bg-card flex items-center justify-center text-muted-foreground active:scale-95 transition-transform"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm font-ui text-muted-foreground">
            {weekOffset === 0
              ? "Esta semana"
              : weekOffset === 1
              ? "Semana passada"
              : `${weekOffset} semanas atrás`}
          </span>
          <button
            onClick={() => setWeekOffset((o) => Math.max(o - 1, 0))}
            disabled={weekOffset === 0}
            className="w-8 h-8 rounded-lg bg-card flex items-center justify-center text-muted-foreground disabled:opacity-30 active:scale-95 transition-transform"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Score Chart */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="card-dormio p-4 mb-4"
      >
        <div className="flex items-center gap-2 mb-3">
          <BarChart3 size={16} className="text-primary" />
          <h3 className="text-sm font-display text-foreground">Score de Sono</h3>
        </div>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 5% 15%)" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 10, fill: "hsl(240 5% 50%)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 10, fill: "hsl(240 5% 50%)" }}
                axisLine={false}
                tickLine={false}
                width={30}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="score"
                radius={[6, 6, 0, 0]}
                fill={rank.colors.gradientFrom}
                fillOpacity={0.8}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Hours Chart */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="card-dormio p-4 mb-4"
      >
        <div className="flex items-center gap-2 mb-3">
          <Activity size={16} className="text-accent" />
          <h3 className="text-sm font-display text-foreground">Horas de Sono</h3>
        </div>
        <div className="h-36">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="hoursGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={rank.colors.gradientTo} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={rank.colors.gradientTo} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(240 5% 15%)" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 10, fill: "hsl(240 5% 50%)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[4, 12]}
                tick={{ fontSize: 10, fill: "hsl(240 5% 50%)" }}
                axisLine={false}
                tickLine={false}
                width={30}
                tickFormatter={(v) => `${v}h`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="hours"
                stroke={rank.colors.gradientTo}
                strokeWidth={2}
                fill="url(#hoursGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Summary Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="grid grid-cols-2 gap-3 mb-6"
      >
        {[
          { label: "Score Médio", value: `${weeklyStats.avgScore}`, icon: Target, color: rank.colors.gradientFrom },
          { label: "Horas Médias", value: `${weeklyStats.avgHours}h`, icon: Clock, color: rank.colors.gradientTo },
          { label: "Consistência", value: `${weeklyStats.consistency}%`, icon: TrendingUp, color: rank.colors.gradientFrom },
          { label: "Total SP", value: weeklyStats.totalSp.toLocaleString(), icon: Zap, color: rank.colors.gradientTo },
          { label: "Hora de Dormir", value: weeklyStats.avgSleepTime, icon: Moon, color: rank.colors.gradientFrom },
          { label: "Hora de Acordar", value: weeklyStats.avgWakeTime, icon: Sun, color: rank.colors.gradientTo },
        ].map((stat, i) => (
          <div
            key={stat.label}
            className="card-dormio p-4 text-center cursor-pointer active:scale-[0.97] transition-transform"
          >
            <stat.icon size={16} className="mx-auto mb-2" style={{ color: stat.color }} />
            <p className="text-lg font-display tabular-nums text-foreground">{stat.value}</p>
            <p className="text-[10px] text-muted-foreground font-ui uppercase mt-1">{stat.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Best / Worst */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex gap-3 mb-6"
      >
        <div className="flex-1 card-dormio p-4 text-center">
          <p className="text-[10px] text-muted-foreground font-ui uppercase mb-1">Melhor Dia</p>
          <p className="text-lg font-display text-foreground">{weeklyStats.bestDay}</p>
        </div>
        <div className="flex-1 card-dormio p-4 text-center">
          <p className="text-[10px] text-muted-foreground font-ui uppercase mb-1">Pior Dia</p>
          <p className="text-lg font-display text-foreground">{weeklyStats.worstDay}</p>
        </div>
      </motion.div>

      {/* Insights */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb size={18} className="text-accent" />
          <h2 className="text-lg font-display text-foreground">Insights</h2>
        </div>
        <div className="space-y-3">
          {insights.map((insight, i) => (
            <InsightCard key={insight.id} insight={insight} index={i} rankColors={rank.colors} />
          ))}
        </div>
      </motion.div>

      {/* Selected Night Detail Modal */}
      <AnimatePresence>
        {selectedNight && (
          <NightDetailModal night={selectedNight} onClose={() => setSelectedNight(null)} rankColors={rank.colors} />
        )}
      </AnimatePresence>
    </div>
  );
};

function InsightCard({
  insight,
  index,
  rankColors,
}: {
  insight: SleepInsight;
  index: number;
  rankColors: any;
}) {
  const borderColor =
    insight.type === "positive"
      ? rankColors.gradientFrom
      : insight.type === "warning"
      ? "hsl(40 80% 50%)"
      : rankColors.gradientTo;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 + index * 0.08 }}
      className="card-dormio p-4 flex items-start gap-3 cursor-pointer active:scale-[0.98] transition-transform"
      style={{ borderLeft: `3px solid ${borderColor}` }}
    >
      <span className="text-xl mt-0.5">{insight.icon}</span>
      <div className="flex-1">
        <p className="text-sm font-display text-foreground">{insight.title}</p>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{insight.description}</p>
      </div>
    </motion.div>
  );
}

function NightDetailModal({
  night,
  onClose,
  rankColors,
}: {
  night: SleepNight;
  onClose: () => void;
  rankColors: any;
}) {
  const d = new Date(night.date);
  const dayNames = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end justify-center"
    >
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-card rounded-t-3xl p-6 pb-10"
      >
        <div className="w-10 h-1 rounded-full bg-muted mx-auto mb-6" />
        <h3 className="text-lg font-display text-foreground mb-1">
          {dayNames[d.getDay()]}, {d.getDate()}/{d.getMonth() + 1}
        </h3>
        <div
          className="text-3xl font-display tabular-nums mb-6"
          style={{
            background: `linear-gradient(135deg, ${rankColors.gradientFrom}, ${rankColors.gradientTo})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          {night.score} pontos
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Dormiu às", value: night.sleepTime, icon: Moon },
            { label: "Acordou às", value: night.wakeTime, icon: Sun },
            { label: "Horas dormidas", value: `${night.hoursSlept.toFixed(1)}h`, icon: BedDouble },
            { label: "Ciclos completos", value: `${night.cycles}`, icon: Activity },
            { label: "Celular antes", value: `${night.phoneUseBefore}min`, icon: Clock },
            { label: "Interrupções", value: `${night.interruptions}`, icon: Zap },
          ].map((item) => (
            <div key={item.label} className="bg-surface-elevated rounded-xl p-3">
              <item.icon size={14} className="text-muted-foreground mb-1" />
              <p className="text-sm font-display text-foreground">{item.value}</p>
              <p className="text-[10px] text-muted-foreground font-ui uppercase">{item.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 text-center">
          <p className="text-xs text-muted-foreground font-ui">
            +{night.spEarned} SP ganhos nesta noite
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default StatsScreen;
