import { securePost } from "@/lib/securePost";
import type { User } from "@/types";

type UpgradeParams = {
  user: User;
  onLoading?: (v: boolean) => void;
};

export async function upgradeToPremium({
  user,
  onLoading,
}: UpgradeParams) {
  if (!user?.id) {
    throw new Error("User tidak valid");
  }

  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Session expired. Silakan login ulang.");
  }

  try {
    onLoading?.(true);

    const res = await securePost("/duitku/create", "POST", {
      amount: 99000,
      product_name: "Subscription Premium",
      user_id: user.id,
      email: user.email,
      phone: user.phone,
      name: user.name,
    });

    if (!res?.paymentUrl) {
      throw new Error("Payment URL tidak tersedia");
    }

    window.location.href = res.paymentUrl;
  } finally {
    onLoading?.(false);
  }
}
