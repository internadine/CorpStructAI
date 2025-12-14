import React from "react";
import { Link } from "react-router-dom";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <img
            src="/orgphant-logo.png"
            alt="OrgPhant Logo"
            className="h-32 w-auto mx-auto mb-8 drop-shadow-2xl"
          />
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            Visualisieren Sie Ihre Firmenstruktur
          </h1>
          <p className="text-xl text-slate-700 mb-8 max-w-2xl mx-auto">
            Erstellen Sie interaktive Organigramme Ihrer Unternehmensstruktur. 
            Professionell, intuitiv und mit KI-Unterstützung.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/app"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              Kostenlos starten
            </Link>
            <Link
              to="/pricing"
              className="glass-strong hover:bg-white/30 text-slate-900 font-semibold py-3 px-8 rounded-lg transition-colors border border-white/20"
            >
              Preise ansehen
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-slate-900 mb-12">
            Funktionen
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-strong p-6 rounded-2xl">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Interaktive Visualisierung
              </h3>
              <p className="text-slate-700">
                Erstellen Sie Organigramme mit Drag & Drop. Passen Sie Farben, 
                Beteiligungsverhältnisse und Details an.
              </p>
            </div>
            <div className="glass-strong p-6 rounded-2xl">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Detaillierte Informationen
              </h3>
              <p className="text-slate-700">
                Erfassen Sie Finanzressourcen, Unternehmensgegenstand, 
                Immobilien und Schlüsselpersonen.
              </p>
            </div>
            <div className="glass-strong p-6 rounded-2xl">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Export & Sharing
              </h3>
              <p className="text-slate-700">
                Exportieren Sie Ihre Struktur als PDF oder JSON. 
                Teilen Sie sie mit Ihrem Team.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">
            KI-Beratung verfügbar
          </h2>
          <p className="text-xl text-slate-700 mb-8 max-w-2xl mx-auto">
            Mit einem Premium-Abonnement erhalten Sie Zugang zu unseren 
            KI-Beratungsfunktionen für Steuer, Recht und Business-Strategie.
          </p>
          <Link
            to="/features"
            className="text-blue-600 hover:text-blue-700 font-semibold text-lg"
          >
            Alle Funktionen ansehen →
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">
            Bereit zum Start?
          </h2>
          <p className="text-xl text-slate-700 mb-8">
            Erstellen Sie Ihre erste Firmenstruktur kostenlos.
          </p>
          <Link
            to="/app"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-12 rounded-lg transition-colors text-lg inline-block"
          >
            Jetzt kostenlos starten
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
