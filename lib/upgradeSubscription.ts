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
  if (!user) {
    throw new Error("User not found");
  }

  try {
    onLoading?.(true);

    const res = await securePost(
      "/duitku/create",
      "POST",
      {
        amount: 99000,
        product_name: "Subscription Premium",
        user_id: user.id,
        email: user.email,
        phone: user.phone,
        name: user.name,
      }
    );

    if (!res?.paymentUrl) {
      throw new Error("Payment URL not returned");
    }

    // 🔥 HARD redirect (payment gateway)
    window.location.href = res.paymentUrl;
  } finally {
    onLoading?.(false);
  }
}
