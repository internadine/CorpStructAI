import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../components/Auth/AuthProvider";

const PricingPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-center text-slate-900 mb-4">
          Preise
        </h1>
        <p className="text-xl text-center text-slate-700 mb-12">
          Wählen Sie den Plan, der zu Ihnen passt
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="glass-strong p-8 rounded-2xl">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Kostenlos
            </h2>
            <div className="text-4xl font-bold text-slate-900 mb-4">
              €0<span className="text-lg text-slate-600">/Monat</span>
            </div>
            <ul className="space-y-3 mb-8 text-slate-700">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Unbegrenzte Organigramme</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Drag & Drop Editor</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Detaillierte Unternehmensdaten</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>PDF & JSON Export</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Cloud-Speicherung</span>
              </li>
              <li className="flex items-start">
                <span className="text-slate-400 mr-2">✗</span>
                <span className="text-slate-500">KI-Beratung</span>
              </li>
            </ul>
            {user ? (
              <Link
                to="/app"
                className="block w-full text-center glass border border-white/20 hover:bg-white/30 text-slate-900 font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Zum Dashboard
              </Link>
            ) : (
              <Link
                to="/signup"
                className="block w-full text-center glass border border-white/20 hover:bg-white/30 text-slate-900 font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Kostenlos starten
              </Link>
            )}
          </div>

          {/* Consulting Plan */}
          <div className="glass-strong p-8 rounded-2xl border-2 border-blue-500 relative">
            <div className="absolute top-4 right-4 bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
              Empfohlen
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Consulting
            </h2>
            <div className="text-4xl font-bold text-slate-900 mb-4">
              €49<span className="text-lg text-slate-600">/Monat</span>
            </div>
            <ul className="space-y-3 mb-8 text-slate-700">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Alle kostenlosen Funktionen</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Steuer- & Rechts-Chat</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Business-Berater Chat</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>KI-gestützte Strukturanalyse</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Strategische Empfehlungen</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <span>Prioritärer Support</span>
              </li>
            </ul>
            {user ? (
              <Link
                to="/app"
                className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Jetzt upgraden
              </Link>
            ) : (
              <Link
                to="/signup"
                className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Jetzt starten
              </Link>
            )}
          </div>
        </div>

        <div className="text-center mt-12 text-slate-700">
          <p className="mb-4">
            Alle Pläne können jederzeit gekündigt werden.
          </p>
          <p className="text-sm">
            Fragen? Kontaktieren Sie uns unter{" "}
            <a href="mailto:nadine.wischmeier@quantophant.io" className="text-blue-600 hover:underline">
              nadine.wischmeier@quantophant.io
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
