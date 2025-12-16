import { Project, StructureData } from "../types";
import {
  saveProject,
  getProject,
  getUserProjects,
  deleteProject as deleteProjectFromFirestore
} from "../lib/firestore";
import { getCurrentUser } from "../lib/auth";

const STORAGE_KEY = "orgphantProjects";

// Load projects from localStorage
export const loadProjectsFromLocalStorage = (): Project[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Error loading projects from localStorage:", e);
  }
  return [];
};

// Save projects to localStorage
export const saveProjectsToLocalStorage = (projects: Project[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (e) {
    console.error("Error saving projects to localStorage:", e);
  }
};

// Get projects (Firestore if authenticated, localStorage otherwise)
export const getProjects = async (): Promise<Project[]> => {
  const user = getCurrentUser();
  if (user) {
    try {
      return await getUserProjects(user.uid);
    } catch (e) {
      console.error("Error loading projects from Firestore:", e);
      // Fallback to localStorage
      return loadProjectsFromLocalStorage();
    }
  }
  return loadProjectsFromLocalStorage();
};

// Save project (Firestore if authenticated, localStorage otherwise)
export const saveProjectToStorage = async (project: Project): Promise<void> => {
  const user = getCurrentUser();
  if (user) {
    try {
      await saveProject(user.uid, project);
    } catch (e) {
      console.error("Error saving project to Firestore:", e);
      // Fallback to localStorage
      const projects = loadProjectsFromLocalStorage();
      const index = projects.findIndex(p => p.id === project.id);
      if (index >= 0) {
        projects[index] = project;
      } else {
        projects.push(project);
      }
      saveProjectsToLocalStorage(projects);
    }
  } else {
    const projects = loadProjectsFromLocalStorage();
    const index = projects.findIndex(p => p.id === project.id);
    if (index >= 0) {
      projects[index] = project;
    } else {
      projects.push(project);
    }
    saveProjectsToLocalStorage(projects);
  }
};

// Delete project
export const deleteProject = async (projectId: string): Promise<void> => {
  const user = getCurrentUser();
  if (user) {
    try {
      await deleteProjectFromFirestore(user.uid, projectId);
    } catch (e) {
      console.error("Error deleting project from Firestore:", e);
      // Fallback to localStorage
      const projects = loadProjectsFromLocalStorage();
      const filtered = projects.filter(p => p.id !== projectId);
      saveProjectsToLocalStorage(filtered);
    }
  } else {
    const projects = loadProjectsFromLocalStorage();
    const filtered = projects.filter(p => p.id !== projectId);
    saveProjectsToLocalStorage(filtered);
  }
};

// Migrate localStorage projects to Firestore
export const migrateProjectsToFirestore = async (userId: string): Promise<void> => {
  const projects = loadProjectsFromLocalStorage();
  if (projects.length === 0) return;

  try {
    for (const project of projects) {
      await saveProject(userId, project);
    }
    // Clear localStorage after successful migration
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error("Error migrating projects to Firestore:", e);
    throw e;
  }
};

