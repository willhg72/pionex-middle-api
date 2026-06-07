export function normalizePlanTier(planTier) {
  const value = String(planTier || 'free').trim().toLowerCase();
  if (value === 'pro' || value === 'premium') return value;
  return 'free';
}

export function getPlanRefreshPolicy(planTier, policyMap) {
  const tier = normalizePlanTier(planTier);
  return policyMap[tier] || policyMap.free;
}

export function getRefreshWindowState(history, policy, now = Date.now()) {
  const recent = (Array.isArray(history) ? history : []).filter(
    (timestamp) => Number.isFinite(timestamp) && (now - timestamp) < policy.windowMs,
  );
  const remaining = Math.max(0, policy.maxManual - recent.length);
  const retryAfterMs = remaining > 0 || recent.length === 0
    ? 0
    : Math.max(0, policy.windowMs - (now - recent[0]));

  return {
    history: recent,
    remaining,
    allowed: remaining > 0,
    retryAfterMs,
  };
}

export function consumeRefreshSlot(history, policy, now = Date.now()) {
  const state = getRefreshWindowState(history, policy, now);
  if (!state.allowed) return state;
  return {
    history: [...state.history, now],
    remaining: Math.max(0, state.remaining - 1),
    allowed: true,
    retryAfterMs: 0,
  };
}

export function formatRefreshWindow(windowMs) {
  const seconds = Math.max(1, Math.round(windowMs / 1000));
  return `${seconds}s`;
}
