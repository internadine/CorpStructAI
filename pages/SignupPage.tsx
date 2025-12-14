import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signupWithEmail, loginWithGoogle } from "../lib/auth";
import { useAuth } from "../components/Auth/AuthProvider";

const SignupPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      navigate("/app");
    }
  }, [user, navigate]);

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signupWithEmail(email, password, displayName || undefined);
      navigate("/app");
    } catch (err: any) {
      setError(err.message || "Registrierung fehlgeschlagen");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError("");
    setLoading(true);

    try {
      await loginWithGoogle();
      navigate("/app");
    } catch (err: any) {
      setError(err.message || "Google-Registrierung fehlgeschlagen");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="glass-strong p-8 rounded-2xl w-full max-w-md">
        <div className="text-center mb-8">
          <img
            src="/orgphant-logo.png"
            alt="OrgPhant Logo"
            className="h-20 w-auto mx-auto mb-4 drop-shadow-2xl"
          />
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Registrieren
          </h1>
          <p className="text-slate-700">
            Erstellen Sie ein kostenloses Konto
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleEmailSignup} className="space-y-4 mb-6">
          <div>
            <label htmlFor="displayName" className="block text-sm font-semibold text-slate-800 mb-2">
              Name (optional)
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full glass px-4 py-3 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ihr Name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-slate-800 mb-2">
              E-Mail
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full glass px-4 py-3 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ihre@email.de"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-slate-800 mb-2">
              Passwort
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full glass px-4 py-3 rounded-lg text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Mindestens 6 Zeichen"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            {loading ? "Registrierung..." : "Kostenlos registrieren"}
          </button>
        </form>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/30"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 glass text-slate-700">oder</span>
          </div>
        </div>

        <button
          onClick={handleGoogleSignup}
          disabled={loading}
          className="w-full glass hover:bg-white/30 border border-white/20 text-slate-900 font-semibold py-3 px-6 rounded-lg transition-colors mb-4"
        >
          Mit Google registrieren
        </button>

        <p className="text-center text-slate-700 text-sm mb-4">
          Mit der Registrierung akzeptieren Sie unsere{" "}
          <Link to="/legal/terms" className="text-blue-600 hover:underline">
            AGB
          </Link>{" "}
          und{" "}
          <Link to="/legal/privacy" className="text-blue-600 hover:underline">
            Datenschutzerklärung
          </Link>.
        </p>

        <p className="text-center text-slate-700">
          Bereits ein Konto?{" "}
          <Link to="/login" className="text-blue-600 hover:underline font-semibold">
            Jetzt anmelden
          </Link>
        </p>

        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-slate-600 hover:text-slate-800">
            ← Zurück zur Startseite
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
