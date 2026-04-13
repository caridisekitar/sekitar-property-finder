import { useEffect, useState } from "react";
import { secureGet } from "@/lib/secureGet";

type PendingPayment = {
  order_id: number;
  amount: number;
  product_name: string;
  locations: string[];
  created_at: string;
};

type Subscription = {
  plan: "BASIC" | "PREMIUM" | "PREMIUM_PLUS";
  ends_at: string;
  is_active: number;
  locations: string[];          // slugs e.g. ["jogja"]
  pending_payment: PendingPayment | null;
};

type User = {
  id: number;
  name: string;
  email: string;
};

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem("token")
  );

  const [user, setUser] = useState<User | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔁 Sync token changes
  useEffect(() => {
    const onStorage = () => {
      setToken(localStorage.getItem("token"));
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (!token) {
      setUser(null);
      setSubscription(null);
      setLoading(false);
      return;
    }

    const loadMe = async () => {
      try {
        const res = await secureGet("/auth/me");

        setUser(res.data.user);
        setSubscription(res.data.subscription);
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
