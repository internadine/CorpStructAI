import { getCurrentUser } from "../lib/auth";
import {
  createUserProfile,
  getUserProfile,
  updateUserProfile,
  saveUserSettings,
  getUserSettings
} from "../lib/firestore";

export interface UserProfile {
  email: string;
  displayName: string;
  createdAt: any;
  subscription: {
    plan: "free" | "consulting" | "premium";
    status: "active" | "canceled" | "expired";
    currentPeriodEnd: any;
  };
}

export const ensureUserProfile = async (userId: string, email: string, displayName?: string): Promise<void> => {
  const profile = await getUserProfile(userId);
  if (!profile) {
    await createUserProfile(userId, email, displayName);
  }
};

export const getCurrentUserProfile = async (): Promise<UserProfile | null> => {
  const user = getCurrentUser();
  if (!user) return null;

  const profile = await getUserProfile(user.uid);
  return profile as UserProfile | null;
};

export const updateCurrentUserProfile = async (data: Partial<{
  displayName: string;
  email: string;
}>) => {
  const user = getCurrentUser();
  if (!user) throw new Error("No user logged in");
  
  await updateUserProfile(user.uid, data);
};

export const saveCurrentUserSettings = async (settings: Record<string, any>) => {
  const user = getCurrentUser();
  if (!user) throw new Error("No user logged in");
  
  await saveUserSettings(user.uid, settings);
};

export const getCurrentUserSettings = async () => {
  const user = getCurrentUser();
  if (!user) return null;
  
  return await getUserSettings(user.uid);
};

