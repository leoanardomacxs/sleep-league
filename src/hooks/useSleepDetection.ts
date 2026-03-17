import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";

const STORAGE_KEY = "dormio_sleep_detection";
const MIN_SLEEP_DURATION_MS = 4 * 60 * 60 * 1000; // 4 hours minimum to consider as sleep
const FALL_ASLEEP_OFFSET_MIN = 15; // assumed minutes to fall asleep
const DISMISSED_KEY = "dormio_detection_dismissed";

interface DetectionState {
  lastActiveAt: string | null;
  pageHiddenAt: string | null;
}

export interface SleepEstimate {
  sleepStart: Date;
  sleepEnd: Date;
  durationMinutes: number;
  confidence: "low" | "medium" | "high";
}

function loadState(): DetectionState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return { lastActiveAt: null, pageHiddenAt: null };
}

function saveState(state: DetectionState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getDismissedDate(): string | null {
  return localStorage.getItem(DISMISSED_KEY);
}

function setDismissedDate(date: string) {
  localStorage.setItem(DISMISSED_KEY, date);
}

export function useSleepDetection() {
  const { user } = useAuth();
  const [estimate, setEstimate] = useState<SleepEstimate | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const activityTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  // Record user activity
  const recordActivity = useCallback(() => {
    const now = new Date().toISOString();
    const state = loadState();
    state.lastActiveAt = now;
    saveState(state);
  }, []);

  // Check for sleep gap when page becomes visible
  const checkForSleepGap = useCallback(() => {
    if (!user) return;

    const state = loadState();
    const hiddenAt = state.pageHiddenAt;
    if (!hiddenAt) return;

    const now = new Date();
    const hiddenTime = new Date(hiddenAt);
    const gapMs = now.getTime() - hiddenTime.getTime();

    // Only consider gaps >= 4 hours as potential sleep
    if (gapMs < MIN_SLEEP_DURATION_MS) return;

    // Check if we already dismissed today
    const today = now.toISOString().split("T")[0];
    if (getDismissedDate() === today) return;

    // Estimate sleep start = hidden time + fall asleep offset
    const sleepStart = new Date(hiddenTime.getTime() + FALL_ASLEEP_OFFSET_MIN * 60 * 1000);
    const sleepEnd = now;
    const durationMinutes = Math.round((sleepEnd.getTime() - sleepStart.getTime()) / 60000);

    // Determine confidence based on gap duration and time of day
    const hiddenHour = hiddenTime.getHours();
    const wakeHour = now.getHours();
    let confidence: SleepEstimate["confidence"] = "low";

    // High confidence: hidden between 21-01, woke between 5-10
    if (hiddenHour >= 21 || hiddenHour <= 1) {
      if (wakeHour >= 5 && wakeHour <= 10) {
        confidence = "high";
      } else {
        confidence = "medium";
      }
    } else if (hiddenHour >= 22 || hiddenHour <= 3) {
      confidence = "medium";
    }

    // Duration sanity check (4-14 hours)
    if (durationMinutes < 240 || durationMinutes > 840) {
      confidence = "low";
    }

    setEstimate({ sleepStart, sleepEnd, durationMinutes, confidence });
    setIsVisible(true);
  }, [user]);

  // Visibility change handler
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        // Page going hidden — record this moment
        const state = loadState();
        state.pageHiddenAt = new Date().toISOString();
        state.lastActiveAt = new Date().toISOString();
        saveState(state);
      } else {
        // Page becoming visible — check for sleep gap
        checkForSleepGap();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    // Also check on mount (app was reopened)
    checkForSleepGap();

    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [checkForSleepGap]);

  // Track user activity via events
  useEffect(() => {
    const events = ["mousedown", "touchstart", "keydown", "scroll"] as const;

    const handler = () => {
      if (activityTimeoutRef.current) clearTimeout(activityTimeoutRef.current);
      activityTimeoutRef.current = setTimeout(recordActivity, 1000);
    };

    events.forEach((e) => document.addEventListener(e, handler, { passive: true }));
    
    // Record initial activity
    recordActivity();

    return () => {
      events.forEach((e) => document.removeEventListener(e, handler));
      if (activityTimeoutRef.current) clearTimeout(activityTimeoutRef.current);
    };
  }, [recordActivity]);

  const dismiss = useCallback(() => {
    const today = new Date().toISOString().split("T")[0];
    setDismissedDate(today);
    setIsVisible(false);
    setEstimate(null);
  }, []);

  const confirm = useCallback(() => {
    // After confirm, dismiss for today
    dismiss();
  }, [dismiss]);

  return {
    estimate,
    isVisible,
    dismiss,
    confirm,
  };
}
