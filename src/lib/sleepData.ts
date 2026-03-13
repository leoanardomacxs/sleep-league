// Sleep history data model and mock data generator

export interface SleepNight {
  date: string; // YYYY-MM-DD
  score: number; // 0-100
  sleepTime: string; // HH:MM
  wakeTime: string; // HH:MM
  hoursSlept: number;
  cycles: number;
  phoneUseBefore: number; // minutes of phone use before bed
  interruptions: number;
  consistency: number; // 0-100
  spEarned: number;
}

export interface SleepInsight {
  id: string;
  type: "positive" | "warning" | "tip";
  icon: string;
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

// Generate realistic mock sleep data for the last N days
export function generateSleepHistory(days: number): SleepNight[] {
  const history: SleepNight[] = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    const dayOfWeek = date.getDay();

    // Weekend vs weekday patterns
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const baseScore = isWeekend ? 72 + Math.random() * 20 : 78 + Math.random() * 18;
    const baseSleepHour = isWeekend ? 23.5 + Math.random() * 1.5 : 22.5 + Math.random() * 1;
    const baseWakeHour = isWeekend ? 8 + Math.random() * 2 : 6.5 + Math.random() * 1;

    const sleepHour = Math.floor(baseSleepHour);
    const sleepMin = Math.floor((baseSleepHour % 1) * 60);
    const wakeHour = Math.floor(baseWakeHour);
    const wakeMin = Math.floor((baseWakeHour % 1) * 60);

    const hoursSlept = parseFloat((baseWakeHour + (baseSleepHour > 23 ? 24 - baseSleepHour : 0) + (baseSleepHour <= 23 ? 24 - baseSleepHour : 0) + baseWakeHour).toFixed(1));
    const actualHours = parseFloat((baseWakeHour - baseSleepHour + 24).toFixed(1)) % 24 || parseFloat(((isWeekend ? 8.5 : 7.5) + (Math.random() - 0.5)).toFixed(1));

    const cycles = Math.floor(actualHours / 1.5);
    const phoneUseBefore = Math.floor(Math.random() * 45);
    const interruptions = Math.floor(Math.random() * 3);
    const consistency = Math.floor(70 + Math.random() * 25);
    const score = Math.min(100, Math.max(30, Math.floor(baseScore + (phoneUseBefore < 15 ? 5 : -5) + (interruptions === 0 ? 3 : -3))));

    const spEarned = Math.floor(score * 1.2 + (consistency > 85 ? 20 : 0) + (cycles >= 5 ? 15 : 0));

    history.push({
      date: date.toISOString().split("T")[0],
      score,
      sleepTime: `${sleepHour.toString().padStart(2, "0")}:${sleepMin.toString().padStart(2, "0")}`,
      wakeTime: `${wakeHour.toString().padStart(2, "0")}:${wakeMin.toString().padStart(2, "0")}`,
      hoursSlept: actualHours,
      cycles,
      phoneUseBefore,
      interruptions,
      consistency,
      spEarned,
    });
  }

  return history;
}

export function getWeeklyStats(history: SleepNight[]): WeeklyStats {
  const last7 = history.slice(-7);
  const avgScore = Math.round(last7.reduce((s, n) => s + n.score, 0) / last7.length);
  const avgHours = parseFloat((last7.reduce((s, n) => s + n.hoursSlept, 0) / last7.length).toFixed(1));
  const totalSp = last7.reduce((s, n) => s + n.spEarned, 0);
  const consistency = Math.round(last7.reduce((s, n) => s + n.consistency, 0) / last7.length);

  const bestNight = last7.reduce((best, n) => (n.score > best.score ? n : best), last7[0]);
  const worstNight = last7.reduce((worst, n) => (n.score < worst.score ? n : worst), last7[0]);

  const dayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  return {
    avgScore,
    avgHours,
    avgSleepTime: last7[last7.length - 1]?.sleepTime || "23:00",
    avgWakeTime: last7[last7.length - 1]?.wakeTime || "07:00",
    consistency,
    totalSp,
    bestDay: dayNames[new Date(bestNight.date).getDay()],
    worstDay: dayNames[new Date(worstNight.date).getDay()],
  };
}

export function generateInsights(history: SleepNight[]): SleepInsight[] {
  const last7 = history.slice(-7);
  const last14 = history.slice(-14);
  const insights: SleepInsight[] = [];

  // Analyze phone usage impact
  const lowPhoneNights = last14.filter((n) => n.phoneUseBefore < 15);
  const highPhoneNights = last14.filter((n) => n.phoneUseBefore > 30);
  if (lowPhoneNights.length > 0 && highPhoneNights.length > 0) {
    const avgLow = lowPhoneNights.reduce((s, n) => s + n.score, 0) / lowPhoneNights.length;
    const avgHigh = highPhoneNights.reduce((s, n) => s + n.score, 0) / highPhoneNights.length;
    if (avgLow - avgHigh > 3) {
      insights.push({
        id: "phone-impact",
        type: "tip",
        icon: "📱",
        title: "Menos celular = melhor sono",
        description: `Nas noites sem celular antes de dormir, seu score foi ${Math.round(avgLow - avgHigh)} pontos maior em média.`,
      });
    }
  }

  // Consistency trend
  const avgConsistency = last7.reduce((s, n) => s + n.consistency, 0) / last7.length;
  if (avgConsistency > 85) {
    insights.push({
      id: "consistency-good",
      type: "positive",
      icon: "🎯",
      title: "Consistência excelente",
      description: "Seus horários de sono estão muito regulares. Isso melhora a qualidade do descanso.",
    });
  } else if (avgConsistency < 65) {
    insights.push({
      id: "consistency-low",
      type: "warning",
      icon: "⚠️",
      title: "Horários irregulares",
      description: "Seus horários de dormir variaram muito. Tente manter um padrão mais regular.",
    });
  }

  // Best sleep time pattern
  const earlyNights = last14.filter((n) => {
    const h = parseInt(n.sleepTime.split(":")[0]);
    return h >= 22 && h <= 23;
  });
  if (earlyNights.length >= 3) {
    const avgEarly = earlyNights.reduce((s, n) => s + n.score, 0) / earlyNights.length;
    insights.push({
      id: "early-sleep",
      type: "positive",
      icon: "🌙",
      title: "Melhor horário detectado",
      description: `Quando você dorme entre 22h e 23h, seu score médio é ${Math.round(avgEarly)}. Continue assim!`,
    });
  }

  // Hours slept
  const avgHours = last7.reduce((s, n) => s + n.hoursSlept, 0) / last7.length;
  if (avgHours < 7) {
    insights.push({
      id: "low-hours",
      type: "warning",
      icon: "⏰",
      title: "Poucas horas de sono",
      description: `Sua média esta semana foi ${avgHours.toFixed(1)}h. O ideal é entre 7-9 horas.`,
    });
  } else if (avgHours >= 7.5 && avgHours <= 8.5) {
    insights.push({
      id: "good-hours",
      type: "positive",
      icon: "✨",
      title: "Duração ideal",
      description: `Média de ${avgHours.toFixed(1)}h por noite. Você está na faixa ideal de sono!`,
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
        icon: diff > 0 ? "📈" : "📉",
        title: diff > 0 ? "Semana em alta" : "Semana em queda",
        description: `Seu score médio ${diff > 0 ? "subiu" : "caiu"} ${Math.abs(Math.round(diff))} pontos em relação à semana passada.`,
      });
    }
  }

  return insights.slice(0, 5);
}
