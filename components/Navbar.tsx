import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "./Auth/AuthProvider";
import { logout } from "../lib/auth";

const Navbar: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav className="glass-strong border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img
                src="/orgphant-logo.png"
                alt="OrgPhant Logo"
                className="h-9 w-auto mr-3"
              />
              <span className="text-xl font-bold text-white drop-shadow-lg">OrgPhant</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/features"
              className="text-white/80 hover:text-white text-sm font-medium transition-colors"
            >
              Features
            </Link>
            <Link
              to="/pricing"
              className="text-white/80 hover:text-white text-sm font-medium transition-colors"
            >
              Pricing
            </Link>
            {user ? (
              <>
                <Link
                  to="/app"
                  className="text-white/80 hover:text-white text-sm font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/settings"
                  className="text-white/80 hover:text-white text-sm font-medium transition-colors"
                >
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-white/80 hover:text-white text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white/80 hover:text-white text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-white/90 hover:bg-white text-slate-800 text-sm font-semibold py-2 px-5 rounded-lg transition-all shadow-sm"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/20">
            <div className="flex flex-col space-y-3">
              <Link
                to="/features"
                className="text-white/80 hover:text-white text-sm font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                to="/pricing"
                className="text-white/80 hover:text-white text-sm font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              {user ? (
                <>
                  <Link
                    to="/app"
                    className="text-white/80 hover:text-white text-sm font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/settings"
                    className="text-white/80 hover:text-white text-sm font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="text-white/80 hover:text-white text-sm font-medium py-2 text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-white/80 hover:text-white text-sm font-medium py-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-white/90 hover:bg-white text-slate-800 text-sm font-semibold py-2 px-5 rounded-lg transition-all text-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
