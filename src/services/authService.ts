export class AuthService {
  static async status(): Promise<boolean> {
    try {
      const res = await fetch('/api/auth/status', { credentials: 'include' });
      if (!res.ok) return false;
      const data = await res.json();
      return Boolean(data.authenticated);
    } catch {
      return false;
    }
  }

  static async login(password: string): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password }),
      });
      if (res.ok) return { success: true };
      const data = await res.json().catch(() => ({}));
      return { success: false, error: data.error || 'Não foi possível entrar.' };
    } catch {
      return { success: false, error: 'Erro de conexão com o servidor.' };
    }
  }

  static async logout(): Promise<void> {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    } catch {
      // no-op
    }
  }
}
