import { getCurrentUser } from "../lib/auth";
import { getSubscription } from "../lib/firestore";

export type SubscriptionPlan = "free" | "consulting" | "premium";
export type SubscriptionStatus = "active" | "canceled" | "expired";

export interface Subscription {
  plan: SubscriptionPlan;
  status: SubscriptionStatus;
  currentPeriodEnd: Date | null;
}

export const hasConsultingAccess = async (): Promise<boolean> => {
  const user = getCurrentUser();
  if (!user) return false;

  try {
    const subscription = await getSubscription(user.uid);
    if (!subscription) return false;

    // Check if subscription is active and not expired
    if (subscription.status !== "active") return false;
    
    // Check if current period has ended
    if (subscription.currentPeriodEnd) {
      const periodEnd = subscription.currentPeriodEnd.toDate();
      if (periodEnd < new Date()) {
        return false;
      }
    }

    // Check if plan includes consulting
    return subscription.plan === "consulting" || subscription.plan === "premium";
  } catch (e) {
    console.error("Error checking subscription:", e);
    return false;
  }
};

export const getCurrentSubscription = async (): Promise<Subscription | null> => {
  const user = getCurrentUser();
  if (!user) return null;

  try {
    const subscription = await getSubscription(user.uid);
    if (!subscription) {
      return {
        plan: "free",
        status: "active",
        currentPeriodEnd: null
      };
    }

    return {
      plan: subscription.plan as SubscriptionPlan,
      status: subscription.status as SubscriptionStatus,
      currentPeriodEnd: subscription.currentPeriodEnd
        ? subscription.currentPeriodEnd.toDate()
        : null
    };
  } catch (e) {
    console.error("Error getting subscription:", e);
    return {
      plan: "free",
      status: "active",
      currentPeriodEnd: null
    };
  }
};
