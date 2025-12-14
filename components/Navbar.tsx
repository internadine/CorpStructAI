import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./Auth/AuthProvider";
import { logout } from "../lib/auth";

const Navbar: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="glass-strong border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img
                src="/orgphant-logo.png"
                alt="OrgPhant Logo"
                className="h-10 w-auto mr-3"
              />
              <span className="text-xl font-bold text-slate-900">OrgPhant</span>
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            <Link
              to="/features"
              className="text-slate-800 hover:text-slate-900 font-medium"
            >
              Funktionen
            </Link>
            <Link
              to="/pricing"
              className="text-slate-800 hover:text-slate-900 font-medium"
            >
              Preise
            </Link>
            {user ? (
              <>
                <Link
                  to="/app"
                  className="text-slate-800 hover:text-slate-900 font-medium"
                >
                  Dashboard
                </Link>
                <Link
                  to="/settings"
                  className="text-slate-800 hover:text-slate-900 font-medium"
                >
                  Einstellungen
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-slate-800 hover:text-slate-900 font-medium"
                >
                  Abmelden
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-slate-800 hover:text-slate-900 font-medium"
                >
                  Anmelden
                </Link>
                <Link
                  to="/signup"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  Registrieren
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
