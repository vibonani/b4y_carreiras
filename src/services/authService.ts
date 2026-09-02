const REQUEST_TIMEOUT_MS = 10000;

async function fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

export class AuthService {
  static async status(): Promise<boolean> {
    try {
      const res = await fetchWithTimeout('/api/auth/status', { credentials: 'include' });
      if (!res.ok) return false;
      const data = await res.json();
      return Boolean(data.authenticated);
    } catch {
      // Network failure or timeout — treat as "not authenticated" so the UI
      // can still show the login prompt instead of hanging indefinitely.
      return false;
    }
  }

  static async login(password: string): Promise<{ success: boolean; error?: string }> {
    // One silent retry on a network-level failure (not on a real 401/429 —
    // those are the server actually responding) before surfacing an error.
    // Covers a momentary blip — e.g. the dev server mid-restart, or a brief
    // network hiccup — that a second attempt a moment later usually clears.
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const res = await fetchWithTimeout('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ password }),
        });
        if (res.ok) return { success: true };
        const data = await res.json().catch(() => ({}));
        return { success: false, error: data.error || 'Não foi possível entrar.' };
      } catch {
        if (attempt === 0) {
          await new Promise((r) => setTimeout(r, 1000));
          continue;
        }
        return { success: false, error: 'Erro de conexão com o servidor. Tente novamente.' };
      }
    }
    // Unreachable — the loop above always returns.
    return { success: false, error: 'Erro de conexão com o servidor. Tente novamente.' };
  }

  static async logout(): Promise<void> {
    try {
      await fetchWithTimeout('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch {
      // no-op
    }
  }
}
