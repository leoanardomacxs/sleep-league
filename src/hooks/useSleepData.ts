import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface SleepSession {
  id: string;
  user_id: string;
  sleep_start: string;
  sleep_end: string | null;
  score: number | null;
  duration_minutes: number | null;
  deep_sleep_minutes: number | null;
  rem_sleep_minutes: number | null;
  light_sleep_minutes: number | null;
  awake_minutes: number | null;
  sp_earned: number | null;
  phone_before_bed: boolean | null;
  notes: string | null;
  created_at: string;
}

function calculateSleepScore(durationMin: number, phoneBefore: boolean): number {
  let score = 0;
  // Duration score (0-40): optimal 420-540 min (7-9h)
  if (durationMin >= 420 && durationMin <= 540) score += 40;
  else if (durationMin >= 360) score += 30;
  else if (durationMin >= 300) score += 20;
  else score += Math.max(5, Math.floor(durationMin / 30));

  // Cycles score (0-30): each 90min cycle
  const cycles = Math.floor(durationMin / 90);
  score += Math.min(30, cycles * 6);

  // No phone bonus (0-20)
  score += phoneBefore ? 0 : 20;

  // Base consistency bonus (10)
  score += 10;

  return Math.min(100, Math.max(0, score));
}

function calculateSP(score: number): number {
  return Math.floor(score * 1.2 + (score > 80 ? 15 : 0));
}

export function useSleepSessions(days: number = 90) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["sleep_sessions", user?.id, days],
    queryFn: async () => {
      if (!user) return [];
      const since = new Date();
      since.setDate(since.getDate() - days);

      const { data, error } = await supabase
        .from("sleep_sessions")
        .select("*")
        .eq("user_id", user.id)
        .gte("sleep_start", since.toISOString())
        .order("sleep_start", { ascending: true });

      if (error) throw error;
      return (data || []) as SleepSession[];
    },
    enabled: !!user,
  });
}

export function useLastNight() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["last_night", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(18, 0, 0, 0);

      const { data, error } = await supabase
        .from("sleep_sessions")
        .select("*")
        .eq("user_id", user.id)
        .gte("sleep_start", yesterday.toISOString())
        .order("sleep_start", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;
      return data as SleepSession | null;
    },
    enabled: !!user,
  });
}

export function useTotalSP() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["total_sp", user?.id],
    queryFn: async () => {
      if (!user) return 0;
      const { data, error } = await supabase
        .from("sleep_sessions")
        .select("sp_earned")
        .eq("user_id", user.id);

      if (error) throw error;
      return (data || []).reduce((sum, s) => sum + (s.sp_earned || 0), 0);
    },
    enabled: !!user,
  });
}

export function useLogSleep() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      sleepStart,
      sleepEnd,
      phoneBefore,
      notes,
    }: {
      sleepStart: Date;
      sleepEnd: Date;
      phoneBefore: boolean;
      notes?: string;
    }) => {
      if (!user) throw new Error("Not authenticated");

      const durationMin = Math.round((sleepEnd.getTime() - sleepStart.getTime()) / 60000);
      const score = calculateSleepScore(durationMin, phoneBefore);
      const spEarned = calculateSP(score);
      const cycles = Math.floor(durationMin / 90);

      const { data, error } = await supabase.from("sleep_sessions").insert({
        user_id: user.id,
        sleep_start: sleepStart.toISOString(),
        sleep_end: sleepEnd.toISOString(),
        duration_minutes: durationMin,
        score,
        sp_earned: spEarned,
        phone_before_bed: phoneBefore,
        notes: notes || null,
        deep_sleep_minutes: Math.floor(durationMin * 0.2),
        rem_sleep_minutes: Math.floor(durationMin * 0.25),
        light_sleep_minutes: Math.floor(durationMin * 0.45),
        awake_minutes: Math.floor(durationMin * 0.1),
      }).select().single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sleep_sessions"] });
      queryClient.invalidateQueries({ queryKey: ["last_night"] });
      queryClient.invalidateQueries({ queryKey: ["total_sp"] });
      queryClient.invalidateQueries({ queryKey: ["streak"] });
    },
  });
}

export function useStreak() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["streak", user?.id],
    queryFn: async () => {
      if (!user) return { current: 0, longest: 0 };
      const { data, error } = await supabase
        .from("streaks")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return {
        current: data?.current_streak || 0,
        longest: data?.longest_streak || 0,
      };
    },
    enabled: !!user,
  });
}
