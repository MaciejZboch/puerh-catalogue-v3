import { useEffect, useState } from "react";
import { getCurrentUser, login, logout } from "../../lib/api";

export function useAuth() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // load user on mount
  useEffect(() => {
    getCurrentUser().then(setUser).finally(() => setLoading(false));
  }, []);

  async function handleLogin(username: string, password: string) {
    const data = await login(username, password);
    setUser(data.user);
  }

  async function handleLogout() {
    await logout();
    setUser(null);
  }

  return { user, loading, login: handleLogin, logout: handleLogout };
}
