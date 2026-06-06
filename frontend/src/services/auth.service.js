import { apiFetch } from './api-client.js';
import { clearAuthSession, saveAuthSession } from './auth-store.js';

export async function signUp(payload) {
  const session = await apiFetch('/auth/sign-up', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  saveAuthSession(session);
  return session;
}

export async function signIn(payload) {
  const session = await apiFetch('/auth/sign-in', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  saveAuthSession(session);
  return session;
}

export async function fetchCurrentSession() {
  return apiFetch('/auth/me');
}

export async function requestPasswordReset(payload) {
  return apiFetch('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function resetPassword(payload) {
  return apiFetch('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function signOut() {
  clearAuthSession();
}
