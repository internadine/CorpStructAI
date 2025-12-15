import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile
} from "firebase/auth";
import { auth } from "./firebase";

export const loginWithEmail = async (email: string, password: string) => {
  return await signInWithEmailAndPassword(auth, email, password);
};

export const signupWithEmail = async (email: string, password: string, displayName?: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName && userCredential.user) {
    await updateProfile(userCredential.user, { displayName });
  }
  return userCredential;
};

export const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  return await signInWithPopup(auth, provider);
};

export const logout = async () => {
  return await signOut(auth);
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

const parseEnvCsv = (value: string | undefined): string[] => {
  if (!value) return [];
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
};

/**
 * Testing-only "admin" override to unlock premium features.
 *
 * Configure via:
 * - VITE_ADMIN_EMAILS="a@b.com,c@d.com"
 * - VITE_ADMIN_UIDS="uid1,uid2"
 */
export const isAdminUser = (user: User | null): boolean => {
  if (!user) return false;

  const adminEmails = parseEnvCsv(import.meta.env.VITE_ADMIN_EMAILS).map((e) =>
    e.toLowerCase()
  );
  const adminUids = parseEnvCsv(import.meta.env.VITE_ADMIN_UIDS);

  const email = (user.email || "").toLowerCase();
  if (email && adminEmails.includes(email)) return true;
  if (adminUids.includes(user.uid)) return true;

  return false;
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};
