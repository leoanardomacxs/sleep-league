import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";

const STORAGE_KEY = "dormio_sleep_detection";
const DISMISSED_KEY = "dormio_detection_dismissed";

const MIN_SLEEP_DURATION_MS = 4 * 60 * 60 * 1000;
const FALL_ASLEEP_OFFSET_MIN = 15;
const INACTIVITY_THRESHOLD_MS = 5 * 60 * 1000;

interface DetectionState {
  lastActiveAt: string | null;
  pageHiddenAt: string | null;
  lastInactiveAt: string | null;
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
  return { lastActiveAt: null, pageHiddenAt: null, lastInactiveAt: null };
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

function isInactive(lastActiveAt: string | null) {
  if (!lastActiveAt) return false;
  return Date.now() - new Date(lastActiveAt).getTime() > INACTIVITY_THRESHOLD_MS;
}

export function useSleepDetection() {
  const { user } = useAuth();
  const [estimate, setEstimate] = useState<SleepEstimate | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const activityTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  // 🔥 REGISTRA ATIVIDADE REAL
  const recordActivity = useCallback(() => {
    const now = new Date().toISOString();
    const state = loadState();

    state.lastActiveAt = now;
    state.lastInactiveAt = null; // reset

    saveState(state);
  }, []);

  // 🔥 DETECÇÃO PRINCIPAL
  const checkForSleepGap = useCallback(() => {
    if (!user) return;

    const state = loadState();

    // 🔥 prioridade: inatividade real antes de sair
    const baseTime = state.lastInactiveAt || state.pageHiddenAt;
    if (!baseTime) return;

    const now = new Date();
    const startTime = new Date(baseTime);
    const gapMs = now.getTime() - startTime.getTime();

    if (gapMs < MIN_SLEEP_DURATION_MS) return;

    const today = now.toISOString().split("T")[0];
    if (getDismissedDate() === today) return;

    const sleepStart = new Date(
      startTime.getTime() + FALL_ASLEEP_OFFSET_MIN * 60 * 1000
    );

    const sleepEnd = now;

    const durationMinutes = Math.round(
      (sleepEnd.getTime() - sleepStart.getTime()) / 60000
    );

    const hiddenHour = startTime.getHours();
    const wakeHour = now.getHours();
    const wasInactiveBefore = !!state.lastInactiveAt;

    let confidence: SleepEstimate["confidence"] = "low";

    if (
      wasInactiveBefore &&
      (hiddenHour >= 21 || hiddenHour <= 1) &&
      (wakeHour >= 5 && wakeHour <= 10)
    ) {
      confidence = "high";
    } else if (
      (hiddenHour >= 20 || hiddenHour <= 3) &&
      gapMs >= 5 * 60 * 60 * 1000
    ) {
      confidence = "medium";
    }

    // sanity check
    if (durationMinutes < 240 || durationMinutes > 840) {
      confidence = "low";
    }

    setEstimate({ sleepStart, sleepEnd, durationMinutes, confidence });
    setIsVisible(true);
  }, [user]);

  // 🔥 VISIBILITY CHANGE (SAIU / VOLTOU)
  useEffect(() => {
    const handleVisibility = () => {
      const state = loadState();
      const now = new Date().toISOString();

      if (document.hidden) {
        state.pageHiddenAt = now;

        // 🔥 só marca inatividade se já estava parado antes
        if (isInactive(state.lastActiveAt)) {
          state.lastInactiveAt = now;
        }

        saveState(state);
      } else {
        checkForSleepGap();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    checkForSleepGap();

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [checkForSleepGap]);

  // 🔥 TRACK ATIVIDADE
  useEffect(() => {
    const events = [
      "mousedown",
      "touchstart",
      "keydown",
      "scroll",
      "mousemove",
    ] as const;

    const handler = () => {
      if (activityTimeoutRef.current) {
        clearTimeout(activityTimeoutRef.current);
      }

      activityTimeoutRef.current = setTimeout(() => {
        recordActivity();
      }, 1000);
    };

    events.forEach((e) =>
      document.addEventListener(e, handler, { passive: true })
    );

    window.addEventListener("focus", recordActivity);

    recordActivity();

    return () => {
      events.forEach((e) => document.removeEventListener(e, handler));
      window.removeEventListener("focus", recordActivity);

      if (activityTimeoutRef.current) {
        clearTimeout(activityTimeoutRef.current);
      }
    };
  }, [recordActivity]);

  const dismiss = useCallback(() => {
    const today = new Date().toISOString().split("T")[0];
    setDismissedDate(today);
    setIsVisible(false);
    setEstimate(null);
  }, []);

  const confirm = useCallback(() => {
    dismiss();
  }, [dismiss]);

  return {
    estimate,
    isVisible,
    dismiss,
    confirm,
  };
}
