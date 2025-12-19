import { useEffect, useState } from "react";
import { secureGet } from "@/lib/secureGet";

type Subscription = {
  plan: "FREE" | "PREMIUM";
  ends_at: string;
  is_active: number;
};

type User = {
  id: number;
  name: string;
  email: string;
};

export const useAuth = () => {
  const token = localStorage.getItem("token");

  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const loadMe = async () => {
      try {
        const res = await secureGet("/auth/me");

        setUser(res.user);
        setSubscription(res.subscription);
      } catch {
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    loadMe();
  }, [token]);

  return {
    isAuthenticated: !!token,
    token,
    user,
    subscription,
    loading,
  };
};
