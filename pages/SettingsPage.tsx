import React, { useState, useEffect } from "react";
import { useAuth } from "../components/Auth/AuthProvider";
import { logout } from "../lib/auth";
import { useNavigate } from "react-router-dom";
import {
  getCurrentUserProfile,
  updateCurrentUserProfile,
  getCurrentUserSettings,
  saveCurrentUserSettings
} from "../services/userService";
import { getCurrentSubscription } from "../services/subscriptionService";
import { UserProfile } from "../services/userService";

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        const [profileData, subscriptionData] = await Promise.all([
          getCurrentUserProfile(),
          getCurrentSubscription()
        ]);

        if (profileData) {
          setProfile(profileData);
          setDisplayName(profileData.displayName || "");
        }
        setSubscription(subscriptionData);
      } catch (e) {
        console.error("Error loading settings:", e);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user, navigate]);

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

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 mb-8">
          Settings
        </h1>

        {/* Profile Section */}
        <div className="glass-strong p-8 rounded-2xl mb-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Profile
          </h2>
          <form onSubmit={handleSaveProfile}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-800 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full glass px-4 py-3 rounded-lg text-slate-600 bg-white/20"
                />
                <p className="text-sm text-slate-600 mt-1">
                  Email address cannot be changed
                </p>
              </div>

              <div>
                <label htmlFor="displayName" className="block text-sm font-semibold text-slate-800 mb-2">
                  Name
                </label>
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full glass px-4 py-3 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Your Name"
                />
              </div>

              {message && (
                <div className={`px-4 py-3 rounded ${
                  message.includes("Error") 
                    ? "bg-red-100 text-red-700" 
                    : "bg-green-100 text-green-700"
                }`}>
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </form>
        </div>

        {/* Subscription Section */}
        <div className="glass-strong p-8 rounded-2xl mb-6">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Subscription
          </h2>
          {subscription ? (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-600 mb-1">Current Plan</p>
                <p className="text-xl font-bold text-slate-900 capitalize">
                  {subscription.plan === "free" ? "Free" : "Consulting"}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Status</p>
                <p className="text-lg font-semibold text-slate-900 capitalize">
                  {subscription.status === "active" ? "Active" : subscription.status}
                </p>
              </div>
              {subscription.currentPeriodEnd && (
                <div>
                  <p className="text-sm text-slate-600 mb-1">Expires on</p>
                  <p className="text-lg text-slate-900">
                    {new Date(subscription.currentPeriodEnd).toLocaleDateString("en-US")}
                  </p>
                </div>
              )}
              {subscription.plan === "free" && (
                <a
                  href="/pricing"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Upgrade Now
                </a>
              )}
            </div>
          ) : (
            <p className="text-slate-700">Loading subscription information...</p>
          )}
        </div>

        {/* Logout Section */}
        <div className="glass-strong p-8 rounded-2xl">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">
            Account
          </h2>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
