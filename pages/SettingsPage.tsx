import React, { useState, useEffect } from "react";
import { useAuth } from "../components/Auth/AuthProvider";
import { logout } from "../lib/auth";
import { useNavigate, Link } from "react-router-dom";
import {
  getCurrentUserProfile,
  updateCurrentUserProfile,
} from "../services/userService";
import { getCurrentSubscription } from "../services/subscriptionService";
import { UserProfile } from "../services/userService";
import { getProjects } from "../services/projectService";
import { getMemories, deleteMemory } from "../services/memoryService";
import { Project, Memory } from "../types";
import Sidebar from "../components/Sidebar";
import { Company, Person } from "../types";

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [memoriesByProject, setMemoriesByProject] = useState<{ [projectId: string]: { project: Project; memories: Memory[] } }>({});
  const [loadingMemories, setLoadingMemories] = useState(false);
  const [deletingMemoryId, setDeletingMemoryId] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        const [profileData, subscriptionData, projectsData] = await Promise.all([
          getCurrentUserProfile(),
          getCurrentSubscription(),
          getProjects()
        ]);

        if (profileData) {
          setProfile(profileData);
          setDisplayName(profileData.displayName || "");
        }
        setSubscription(subscriptionData);
        setProjects(projectsData);
      } catch (e) {
        console.error("Error loading settings:", e);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, navigate]);

  useEffect(() => {
    const loadMemories = async () => {
      if (!user || projects.length === 0) return;

      setLoadingMemories(true);
      try {
        const memoriesMap: { [projectId: string]: { project: Project; memories: Memory[] } } = {};

        for (const project of projects) {
          try {
            const memories = await getMemories(user.uid, project.id);
            if (memories.length > 0) {
              memoriesMap[project.id] = { project, memories };
            }
          } catch (e) {
            console.error(`Error loading memories for project ${project.id}:`, e);
          }
        }

        setMemoriesByProject(memoriesMap);
      } catch (e) {
        console.error("Error loading memories:", e);
      } finally {
        setLoadingMemories(false);
      }
    };

    loadMemories();
  }, [user, projects]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      await updateCurrentUserProfile({ displayName });
      setMessage("Profile successfully updated");
      const updated = await getCurrentUserProfile();
      if (updated) setProfile(updated);
    } catch (e: any) {
      setMessage("Error saving: " + e.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMemory = async (projectId: string, memoryId: string) => {
    if (!user) return;

    if (!window.confirm("Are you sure you want to delete this memory? This action cannot be undone.")) {
      return;
    }

    setDeletingMemoryId(memoryId);
    try {
      await deleteMemory(user.uid, projectId, memoryId);
      
      // Update local state
      setMemoriesByProject(prev => {
        const updated = { ...prev };
        if (updated[projectId]) {
          updated[projectId] = {
            ...updated[projectId],
            memories: updated[projectId].memories.filter(m => m.id !== memoryId)
          };
          // Remove project entry if no memories left
          if (updated[projectId].memories.length === 0) {
            delete updated[projectId];
          }
        }
        return updated;
      });
    } catch (e: any) {
      console.error("Error deleting memory:", e);
      alert("Error deleting memory: " + e.message);
    } finally {
      setDeletingMemoryId(null);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // Get first project for sidebar (or create empty structure)
  const firstProject = projects[0];
  const emptyData = { companies: [] as Company[], people: [] as Person[] };

  if (loading) {
    return (
      <div className="flex h-screen w-full">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-slate-300 border-t-slate-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full font-sans">
      {/* Sidebar Panel */}
      <div className="flex flex-col glass-strong h-full relative z-20 w-96 shrink-0 shadow-2xl overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <Sidebar 
            currentProjectName={firstProject?.name || "Settings"}
            companies={firstProject?.data?.companies || emptyData.companies}
            people={firstProject?.data?.people || emptyData.people}
            projectType={firstProject?.projectType}
            onAddCompany={() => {}}
            onSelectCompany={() => {}}
            onClear={() => {}}
            onToggleChat={() => {}}
            onToggleBusinessChat={() => {}}
            onToggleArchitect={() => {}}
            onExportJSON={() => {}}
            onExportPDF={() => {}}
            onImportJSON={() => {}}
            onOpenProjectManager={() => navigate("/app")}
            onRenameProject={() => {}}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-hidden">
        <div className="h-full overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h1 className="text-4xl font-bold text-slate-800">
                Settings
              </h1>
              <Link
                to="/app"
                className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-xl transition-all shadow-sm hover:shadow-md"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Back to Canvas
              </Link>
            </div>

            {/* Profile Section */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 mb-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-6">
                Profile
              </h2>
              <form onSubmit={handleSaveProfile}>
                <div className="space-y-5">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-slate-600 mb-2">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={user?.email || ""}
                      disabled
                      className="w-full bg-slate-50 px-4 py-3 rounded-xl text-slate-500 border border-slate-200"
                    />
                    <p className="text-xs text-slate-400 mt-1.5">
                      Email address cannot be changed
                    </p>
                  </div>

                  <div>
                    <label htmlFor="displayName" className="block text-sm font-medium text-slate-600 mb-2">
                      Name
                    </label>
                    <input
                      id="displayName"
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full bg-white px-4 py-3 rounded-xl text-slate-800 placeholder-slate-400 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-300"
                      placeholder="Your Name"
                    />
                  </div>

                  {message && (
                    <div className={`px-4 py-3 rounded-xl text-sm ${
                      message.includes("Error") 
                        ? "bg-red-50 text-red-700 border border-red-200" 
                        : "bg-green-50 text-green-700 border border-green-200"
                    }`}>
                      {message}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-slate-800 hover:bg-slate-900 disabled:bg-slate-400 text-white font-medium py-3 px-6 rounded-xl transition-all"
                  >
                    {saving ? "Saving..." : "Save Profile"}
                  </button>
                </div>
              </form>
            </div>

            {/* Memory Management Section */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 mb-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-6">
                Context Memories
              </h2>
              <p className="text-sm text-slate-600 mb-6">
                Manage memories that are used as context for AI conversations. Delete memories you no longer want to be included.
              </p>

              {loadingMemories ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-slate-300 border-t-slate-600"></div>
                </div>
              ) : Object.keys(memoriesByProject).length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-slate-200 rounded-xl">
                  <p className="text-slate-500">No memories found across your projects.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {Object.values(memoriesByProject).map(({ project, memories }) => (
                    <div key={project.id} className="border border-slate-200 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-slate-800">
                          {project.name}
                        </h3>
                        <span className="text-sm text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                          {memories.length} {memories.length === 1 ? 'memory' : 'memories'}
                        </span>
                      </div>
                      <div className="space-y-3">
                        {memories.map((memory) => (
                          <div
                            key={memory.id}
                            className="flex items-start justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors"
                          >
                            <div className="flex-1 pr-4">
                              <p className="text-sm text-slate-800 mb-2">{memory.fact}</p>
                              <div className="flex items-center gap-3 text-xs text-slate-500">
                                <span className="capitalize">{memory.category.replace('_', ' ')}</span>
                                <span>•</span>
                                <span>Importance: {memory.importance}/5</span>
                                <span>•</span>
                                <span>{new Date(memory.createdAt).toLocaleDateString()}</span>
                                {memory.tags.length > 0 && (
                                  <>
                                    <span>•</span>
                                    <span className="flex gap-1">
                                      {memory.tags.map((tag, idx) => (
                                        <span key={idx} className="bg-slate-200 px-2 py-0.5 rounded">
                                          {tag}
                                        </span>
                                      ))}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => handleDeleteMemory(project.id, memory.id)}
                              disabled={deletingMemoryId === memory.id}
                              className="text-red-600 hover:text-red-700 disabled:text-red-400 disabled:cursor-not-allowed transition-colors p-2 hover:bg-red-50 rounded-lg"
                              title="Delete memory"
                            >
                              {deletingMemoryId === memory.id ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-red-600 border-t-transparent"></div>
                              ) : (
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              )}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Subscription Section */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 mb-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-6">
                Subscription
              </h2>
              {subscription ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-slate-100">
                    <span className="text-sm text-slate-500">Current Plan</span>
                    <span className="font-semibold text-slate-800 capitalize">
                      {subscription.plan === "free"
                        ? "Free"
                        : subscription.plan === "premium"
                          ? "Premium"
                          : "Consulting"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-slate-100">
                    <span className="text-sm text-slate-500">Status</span>
                    <span className="font-semibold text-slate-800 capitalize">
                      {subscription.status === "active" ? "Active" : subscription.status}
                    </span>
                  </div>
                  {subscription.currentPeriodEnd && (
                    <div className="flex justify-between items-center py-3 border-b border-slate-100">
                      <span className="text-sm text-slate-500">Expires on</span>
                      <span className="text-slate-700">
                        {new Date(subscription.currentPeriodEnd).toLocaleDateString("en-US")}
                      </span>
                    </div>
                  )}
                  {subscription.plan === "free" && (
                    <Link
                      to="/pricing"
                      className="inline-block bg-slate-800 hover:bg-slate-900 text-white font-medium py-3 px-6 rounded-xl transition-all mt-4"
                    >
                      Upgrade Now
                    </Link>
                  )}
                </div>
              ) : (
                <p className="text-slate-500">Loading subscription information...</p>
              )}
            </div>

            {/* Logout Section */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <h2 className="text-xl font-semibold text-slate-800 mb-6">
                Account
              </h2>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-6 rounded-xl transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettingsPage;
