import type { SleepSession } from "@/hooks/useSleepData";

export interface SleepNight {
  date: string;
  score: number;
  sleepTime: string;
  wakeTime: string;
  hoursSlept: number;
  cycles: number;
  phoneUseBefore: number;
  interruptions: number;
  consistency: number;
  spEarned: number;
}

export interface SleepInsight {
  id: string;
  type: "positive" | "warning" | "tip";
  iconName: string; // Lucide icon name
  title: string;
  description: string;
}

export interface WeeklyStats {
  avgScore: number;
  avgHours: number;
  avgSleepTime: string;
  avgWakeTime: string;
  consistency: number;
  totalSp: number;
  bestDay: string;
  worstDay: string;
}

// Convert real DB sessions to SleepNight format
export function sessionsToNights(sessions: SleepSession[]): SleepNight[] {
  return sessions.map((s) => {
    const start = new Date(s.sleep_start);
    const end = s.sleep_end ? new Date(s.sleep_end) : new Date(start.getTime() + (s.duration_minutes || 420) * 60000);
    const durationMin = s.duration_minutes || Math.round((end.getTime() - start.getTime()) / 60000);
    const hours = durationMin / 60;

    return {
      date: start.toISOString().split("T")[0],
      score: s.score || 0,
      sleepTime: `${start.getHours().toString().padStart(2, "0")}:${start.getMinutes().toString().padStart(2, "0")}`,
      wakeTime: `${end.getHours().toString().padStart(2, "0")}:${end.getMinutes().toString().padStart(2, "0")}`,
      hoursSlept: parseFloat(hours.toFixed(1)),
      cycles: Math.floor(durationMin / 90),
      phoneUseBefore: s.phone_before_bed ? 30 : 0,
      interruptions: Math.floor((s.awake_minutes || 0) / 15),
      consistency: Math.min(100, Math.max(0, (s.score || 0) + 10)),
      spEarned: s.sp_earned || 0,
    };
  });
}

export function getWeeklyStats(history: SleepNight[]): WeeklyStats {
  if (history.length === 0) {
    return {
      avgScore: 0, avgHours: 0, avgSleepTime: "--:--", avgWakeTime: "--:--",
      consistency: 0, totalSp: 0, bestDay: "--", worstDay: "--",
    };
  }

  const last7 = history.slice(-7);
  const avgScore = Math.round(last7.reduce((s, n) => s + n.score, 0) / last7.length);
  const avgHours = parseFloat((last7.reduce((s, n) => s + n.hoursSlept, 0) / last7.length).toFixed(1));
  const totalSp = last7.reduce((s, n) => s + n.spEarned, 0);
  const consistency = Math.round(last7.reduce((s, n) => s + n.consistency, 0) / last7.length);

  const bestNight = last7.reduce((best, n) => (n.score > best.score ? n : best), last7[0]);
  const worstNight = last7.reduce((worst, n) => (n.score < worst.score ? n : worst), last7[0]);

  const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

  return {
    avgScore,
    avgHours,
    avgSleepTime: last7[last7.length - 1]?.sleepTime || "--:--",
    avgWakeTime: last7[last7.length - 1]?.wakeTime || "--:--",
    consistency,
    totalSp,
    bestDay: dayNames[new Date(bestNight.date).getDay()],
    worstDay: dayNames[new Date(worstNight.date).getDay()],
  };
}

export function generateInsights(history: SleepNight[]): SleepInsight[] {
  if (history.length === 0) return [];

  const last7 = history.slice(-7);
  const last14 = history.slice(-14);
  const insights: SleepInsight[] = [];

  // Phone impact
  const lowPhoneNights = last14.filter((n) => n.phoneUseBefore < 15);
  const highPhoneNights = last14.filter((n) => n.phoneUseBefore > 30);
  if (lowPhoneNights.length > 0 && highPhoneNights.length > 0) {
    const avgLow = lowPhoneNights.reduce((s, n) => s + n.score, 0) / lowPhoneNights.length;
    const avgHigh = highPhoneNights.reduce((s, n) => s + n.score, 0) / highPhoneNights.length;
    if (avgLow - avgHigh > 3) {
      insights.push({
        id: "phone-impact",
        type: "tip",
        iconName: "Smartphone",
        title: "Menos celular = melhor sono",
        description: `Nas noites sem celular, seu score foi ${Math.round(avgLow - avgHigh)} pontos maior.`,
      });
    }
  }

  // Consistency
  const avgConsistency = last7.reduce((s, n) => s + n.consistency, 0) / last7.length;
  if (avgConsistency > 85) {
    insights.push({
      id: "consistency-good",
      type: "positive",
      iconName: "Target",
      title: "Consistencia excelente",
      description: "Seus horarios de sono estao muito regulares.",
    });
  } else if (avgConsistency < 65) {
    insights.push({
      id: "consistency-low",
      type: "warning",
      iconName: "AlertTriangle",
      title: "Horarios irregulares",
      description: "Seus horarios de dormir variaram muito. Tente manter um padrao mais regular.",
    });
  }

  // Best sleep time
  const earlyNights = last14.filter((n) => {
    const h = parseInt(n.sleepTime.split(":")[0]);
    return h >= 22 && h <= 23;
  });
  if (earlyNights.length >= 3) {
    const avgEarly = earlyNights.reduce((s, n) => s + n.score, 0) / earlyNights.length;
    insights.push({
      id: "early-sleep",
      type: "positive",
      iconName: "Moon",
      title: "Melhor horario detectado",
      description: `Quando voce dorme entre 22h e 23h, seu score medio e ${Math.round(avgEarly)}.`,
    });
  }

  // Hours
  const avgHours = last7.reduce((s, n) => s + n.hoursSlept, 0) / last7.length;
  if (avgHours < 7) {
    insights.push({
      id: "low-hours",
      type: "warning",
      iconName: "Clock",
      title: "Poucas horas de sono",
      description: `Sua media esta semana foi ${avgHours.toFixed(1)}h. O ideal e entre 7-9 horas.`,
    });
  } else if (avgHours >= 7.5 && avgHours <= 8.5) {
    insights.push({
      id: "good-hours",
      type: "positive",
      iconName: "Sparkles",
      title: "Duracao ideal",
      description: `Media de ${avgHours.toFixed(1)}h por noite. Voce esta na faixa ideal!`,
    });
  }

  // Week trend
  if (last7.length >= 7 && last14.length >= 14) {
    const thisWeekAvg = last7.reduce((s, n) => s + n.score, 0) / 7;
    const lastWeekAvg = last14.slice(0, 7).reduce((s, n) => s + n.score, 0) / 7;
    const diff = thisWeekAvg - lastWeekAvg;
    if (Math.abs(diff) > 3) {
      insights.push({
        id: "week-trend",
        type: diff > 0 ? "positive" : "warning",
        iconName: diff > 0 ? "TrendingUp" : "TrendingDown",
        title: diff > 0 ? "Semana em alta" : "Semana em queda",
        description: `Seu score medio ${diff > 0 ? "subiu" : "caiu"} ${Math.abs(Math.round(diff))} pontos.`,
      });
    }
  }

  return insights.slice(0, 5);
}
