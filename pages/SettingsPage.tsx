import React, { useState, useEffect } from "react";
import { useAuth } from "../components/Auth/AuthProvider";
import { logout } from "../lib/auth";
import { useNavigate, Link } from "react-router-dom";
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
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/50 border-t-white"></div>
      </div>
    );
  }

  return (
    <div className="py-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back to Dashboard */}
        <Link
          to="/app"
          className="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Dashboard
        </Link>

        <h1 className="text-4xl font-bold text-white mb-10 drop-shadow-lg">
          Settings
        </h1>

        {/* Profile Section */}
        <div className="glass-strong p-8 rounded-2xl mb-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-6">
            Profile
          </h2>
          <form onSubmit={handleSaveProfile}>
            <div className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={user?.email || ""}
                  disabled
                  className="w-full bg-white/30 px-4 py-3 rounded-xl text-slate-600 border border-white/20"
                />
                <p className="text-xs text-slate-500 mt-1.5">
                  Email address cannot be changed
                </p>
              </div>

              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-slate-700 mb-2">
                  Name
                </label>
                <input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-white/50 px-4 py-3 rounded-xl text-slate-800 placeholder-slate-400 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                  placeholder="Your Name"
                />
              </div>

              {message && (
                <div className={`px-4 py-3 rounded-xl text-sm ${
                  message.includes("Error") 
                    ? "bg-red-100/80 text-red-700" 
                    : "bg-green-100/80 text-green-700"
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

        {/* Subscription Section */}
        <div className="glass-strong p-8 rounded-2xl mb-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-6">
            Subscription
          </h2>
          {subscription ? (
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-white/20">
                <span className="text-sm text-slate-600">Current Plan</span>
                <span className="font-semibold text-slate-800 capitalize">
                  {subscription.plan === "free"
                    ? "Free"
                    : subscription.plan === "premium"
                      ? "Premium"
                      : "Consulting"}
                </span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-white/20">
                <span className="text-sm text-slate-600">Status</span>
                <span className="font-semibold text-slate-800 capitalize">
                  {subscription.status === "active" ? "Active" : subscription.status}
                </span>
              </div>
              {subscription.currentPeriodEnd && (
                <div className="flex justify-between items-center py-3 border-b border-white/20">
                  <span className="text-sm text-slate-600">Expires on</span>
                  <span className="text-slate-800">
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
            <p className="text-slate-600">Loading subscription information...</p>
          )}
        </div>

        {/* Logout Section */}
        <div className="glass-strong p-8 rounded-2xl">
          <h2 className="text-xl font-semibold text-slate-800 mb-6">
            Account
          </h2>
          <button
            onClick={handleLogout}
            className="bg-red-500/80 hover:bg-red-600 text-white font-medium py-3 px-6 rounded-xl transition-all"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
