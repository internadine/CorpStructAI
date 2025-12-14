import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  where,
  Timestamp,
  serverTimestamp
} from "firebase/firestore";
import { db } from "./firebase";
import { Project, StructureData } from "../types";

// User profile operations
export const createUserProfile = async (userId: string, email: string, displayName?: string) => {
  const userRef = doc(db, "users", userId);
  await setDoc(userRef, {
    email,
    displayName: displayName || email.split("@")[0],
    createdAt: serverTimestamp(),
    subscription: {
      plan: "free",
      status: "active",
      currentPeriodEnd: null
    }
  });
};

export const getUserProfile = async (userId: string) => {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  return userSnap.exists() ? userSnap.data() : null;
};

export const updateUserProfile = async (userId: string, data: Partial<{
  displayName: string;
  email: string;
}>) => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, data);
};

// Project operations
export const saveProject = async (userId: string, project: Project) => {
  const projectRef = doc(db, "users", userId, "projects", project.id);
  await setDoc(projectRef, {
    ...project,
    lastModified: Timestamp.now(),
    data: project.data
  });
};

export const getProject = async (userId: string, projectId: string): Promise<Project | null> => {
  const projectRef = doc(db, "users", userId, "projects", projectId);
  const projectSnap = await getDoc(projectRef);
  if (!projectSnap.exists()) return null;
  
  const data = projectSnap.data();
  return {
    id: projectSnap.id,
    name: data.name,
    lastModified: data.lastModified?.toMillis() || Date.now(),
    data: data.data as StructureData
  };
};

export const getUserProjects = async (userId: string): Promise<Project[]> => {
  const projectsRef = collection(db, "users", userId, "projects");
  const projectsSnap = await getDocs(projectsRef);
  
  return projectsSnap.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name,
      lastModified: data.lastModified?.toMillis() || Date.now(),
      data: data.data as StructureData
    };
  }).sort((a, b) => b.lastModified - a.lastModified);
};

export const deleteProject = async (userId: string, projectId: string) => {
  const projectRef = doc(db, "users", userId, "projects", projectId);
  await deleteDoc(projectRef);
};

// Settings operations
export const saveUserSettings = async (userId: string, settings: Record<string, any>) => {
  const settingsRef = doc(db, "users", userId, "settings", "main");
  await setDoc(settingsRef, {
    ...settings,
    updatedAt: serverTimestamp()
  }, { merge: true });
};

export const getUserSettings = async (userId: string) => {
  const settingsRef = doc(db, "users", userId, "settings", "main");
  const settingsSnap = await getDoc(settingsRef);
  return settingsSnap.exists() ? settingsSnap.data() : null;
};

// Subscription operations
export const updateSubscription = async (
  userId: string,
  subscription: {
    plan: "free" | "consulting" | "premium";
    status: "active" | "canceled" | "expired";
    currentPeriodEnd?: Date | null;
  }
) => {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    subscription: {
      ...subscription,
      currentPeriodEnd: subscription.currentPeriodEnd 
        ? Timestamp.fromDate(subscription.currentPeriodEnd)
        : null
    }
  });
};

export const getSubscription = async (userId: string) => {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  if (!userSnap.exists()) return null;
  
  const data = userSnap.data();
  return data.subscription || {
    plan: "free",
    status: "active",
    currentPeriodEnd: null
  };
};
