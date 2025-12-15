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
              <span className="text-xl font-bold text-white drop-shadow-lg">OrgPhant</span>
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            <Link
              to="/features"
              className="text-white/90 hover:text-white font-medium transition-colors"
            >
              Features
            </Link>
            <Link
              to="/pricing"
              className="text-white/90 hover:text-white font-medium transition-colors"
            >
              Pricing
            </Link>
            {user ? (
              <>
                <Link
                  to="/app"
                  className="text-white/90 hover:text-white font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/settings"
                  className="text-white/90 hover:text-white font-medium transition-colors"
                >
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-white/90 hover:text-white font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white/90 hover:text-white font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-xl text-white font-semibold py-2 px-4 rounded-lg transition-colors border border-white/30"
                >
                  Sign Up
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
