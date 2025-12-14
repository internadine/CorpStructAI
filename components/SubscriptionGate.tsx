import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { hasConsultingAccess } from "../services/subscriptionService";
import { useAuth } from "./Auth/AuthProvider";

interface SubscriptionGateProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const SubscriptionGate: React.FC<SubscriptionGateProps> = ({ 
  children, 
  fallback 
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [hasAccess, setHasAccess] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      if (!user) {
        setHasAccess(false);
        setChecking(false);
        return;
      }

      const access = await hasConsultingAccess();
      setHasAccess(access);
      setChecking(false);
    };

    checkAccess();
  }, [user]);

  if (checking) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!hasAccess) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="glass-strong p-8 rounded-2xl max-w-md mx-auto mt-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">
          Premium Feature
        </h2>
        <p className="text-slate-700 mb-6">
          Diese Funktion ist nur für Abonnenten verfügbar. Bitte upgraden Sie Ihren Plan, um auf die AI-Beratung zuzugreifen.
        </p>
        <button
          onClick={() => navigate("/pricing")}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Jetzt upgraden
        </button>
      </div>
    );
  }

  return <>{children}</>;
};
