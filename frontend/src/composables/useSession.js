import { site } from '@/config';
// Stable per-browser session id (for visitor stats). Falls back gracefully.
export function getSessionId() {
  const KEY = `${site.site.slug}_session_id`;
  try {
    let id = localStorage.getItem(KEY);
    if (!id) {
      id = (crypto?.randomUUID?.() || `sess-${Date.now()}-${Math.random().toString(16).slice(2)}`);
      localStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    return `sess-${Date.now()}`;
  }
}
