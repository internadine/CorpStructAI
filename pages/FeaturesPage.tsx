import React from "react";
import { Link } from "react-router-dom";

const FeaturesPage: React.FC = () => {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-center text-slate-900 mb-4">
          Funktionen
        </h1>
        <p className="text-xl text-center text-slate-700 mb-12">
          Alles, was Sie brauchen, um Ihre Firmenstruktur zu verwalten
        </p>

        {/* Free Features */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">
            Kostenlose Funktionen
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-strong p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                📊 Interaktive Organigramme
              </h3>
              <p className="text-slate-700">
                Erstellen Sie visuelle Organigramme mit Drag & Drop. 
                Unterstützt verschiedene Unternehmensformen (GmbH, UG, KG, AG, etc.).
              </p>
            </div>
            <div className="glass-strong p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                🎨 Anpassbare Darstellung
              </h3>
              <p className="text-slate-700">
                Passen Sie Farben, Beteiligungsverhältnisse und Layouts an. 
                Jedes Unternehmen kann individuell gestaltet werden.
              </p>
            </div>
            <div className="glass-strong p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                📝 Detaillierte Unternehmensdaten
              </h3>
              <p className="text-slate-700">
                Erfassen Sie Unternehmensgegenstand, Finanzressourcen, 
                Immobilien und andere Assets.
              </p>
            </div>
            <div className="glass-strong p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                👥 Schlüsselpersonen
              </h3>
              <p className="text-slate-700">
                Verwalten Sie Geschäftsführer, Vorstände und andere 
                wichtige Personen in Ihrer Struktur.
              </p>
            </div>
            <div className="glass-strong p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                📄 Export-Funktionen
              </h3>
              <p className="text-slate-700">
                Exportieren Sie Ihre Struktur als PDF oder JSON. 
                Perfekt für Präsentationen und Backup.
              </p>
            </div>
            <div className="glass-strong p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                💾 Cloud-Speicherung
              </h3>
              <p className="text-slate-700">
                Speichern Sie Ihre Projekte sicher in der Cloud. 
                Zugriff von überall, jederzeit.
              </p>
            </div>
          </div>
        </section>

        {/* Premium Features */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-8">
            Premium-Funktionen (mit Abonnement)
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-strong p-6 rounded-2xl border-2 border-blue-500">
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                🤖 Steuer- & Rechts-Chat
              </h3>
              <p className="text-slate-700 mb-4">
                Erhalten Sie KI-gestützte Beratung zu steuerlichen und rechtlichen 
                Fragen Ihrer Firmenstruktur. Analysieren Sie Optimierungspotenziale.
              </p>
              <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded">
                Premium
              </span>
            </div>
            <div className="glass-strong p-6 rounded-2xl border-2 border-blue-500">
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                💼 Business-Berater
              </h3>
              <p className="text-slate-700 mb-4">
                Analysieren Sie Geschäftsmöglichkeiten, Synergien und 
                Wachstumspotenziale Ihrer Unternehmensstruktur.
              </p>
              <span className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-1 rounded">
                Premium
              </span>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section>
          <h2 className="text-3xl font-bold text-slate-900 mb-8">
            Anwendungsfälle
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="glass-strong p-6 rounded-2xl">
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Unternehmensplanung
              </h3>
              <p className="text-slate-700 text-sm">
                Planen Sie neue Unternehmensstrukturen und Holding-Gesellschaften.
              </p>
            </div>
            <div className="glass-strong p-6 rounded-2xl">
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Steueroptimierung
              </h3>
              <p className="text-slate-700 text-sm">
                Visualisieren Sie Strukturen für steuerliche Beratung.
              </p>
            </div>
            <div className="glass-strong p-6 rounded-2xl">
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Präsentationen
              </h3>
              <p className="text-slate-700 text-sm">
                Erstellen Sie professionelle Organigramme für Investoren und Partner.
              </p>
            </div>
          </div>
        </section>

        <div className="text-center mt-12">
          <Link
            to="/pricing"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors inline-block"
          >
            Preise ansehen
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;
