import React from "react";
import { Link } from "react-router-dom";

const TermsPage: React.FC = () => {
  return (
    <div className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-800 mb-10">
          Allgemeine Geschäftsbedingungen
        </h1>

        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <div className="space-y-8 text-slate-600">
            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">
                1. Geltungsbereich
              </h2>
              <p className="leading-relaxed">
                Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für die Nutzung der 
                Software-as-a-Service-Plattform "OrgPhant" der Quantophant GmbH. 
                Durch die Registrierung oder Nutzung der Plattform akzeptieren Sie diese AGB.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">
                2. Leistungsbeschreibung
              </h2>
              <p className="mb-3 leading-relaxed">
                OrgPhant ist eine Cloud-basierte Plattform zur Erstellung und Verwaltung von 
                Unternehmensstrukturen und Organigrammen. Die Plattform bietet:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Erstellung und Bearbeitung von Organigrammen</li>
                <li>Speicherung von Projekten in der Cloud</li>
                <li>Export-Funktionen (PDF, JSON)</li>
                <li>Optional: KI-gestützte Beratungsfunktionen (kostenpflichtig)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">
                3. Registrierung und Nutzerkonto
              </h2>
              <p className="leading-relaxed">
                Für die Nutzung der Plattform ist eine Registrierung erforderlich. Sie verpflichten 
                sich, wahrheitsgemäße Angaben zu machen und Ihre Zugangsdaten geheim zu halten. 
                Sie sind für alle Aktivitäten unter Ihrem Konto verantwortlich.
              </p>
            </section>

            <section className="bg-amber-50 -mx-8 px-8 py-6 border-y border-amber-200">
              <h2 className="text-lg font-semibold text-amber-900 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                4. Wichtiger Hinweis zu KI-Funktionen
              </h2>
              <p className="mb-3 leading-relaxed text-amber-900">
                <strong>Die KI-gestützten Beratungsfunktionen (Tax & Legal Chat, Business Consultant) 
                dienen ausschließlich zu Informationszwecken und ersetzen keine professionelle Beratung.</strong>
              </p>
              <ul className="list-disc list-inside space-y-2 text-sm text-amber-800 mb-4">
                <li>
                  <strong>Keine Rechts- oder Steuerberatung:</strong> Die von der KI generierten Antworten 
                  stellen keine rechtsverbindliche Beratung dar und ersetzen nicht die Konsultation eines 
                  qualifizierten Rechtsanwalts, Steuerberaters oder anderen Fachexperten.
                </li>
                <li>
                  <strong>Mögliche Fehler:</strong> KI-Systeme können fehlerhafte, unvollständige oder 
                  veraltete Informationen liefern ("Halluzinationen"). Die Richtigkeit der Antworten 
                  kann nicht garantiert werden.
                </li>
                <li>
                  <strong>Eigenverantwortung:</strong> Sie sind verpflichtet, alle von der KI erhaltenen 
                  Informationen vor der Umsetzung von einem qualifizierten Fachmann (Rechtsanwalt, 
                  Steuerberater, Wirtschaftsprüfer etc.) überprüfen zu lassen.
                </li>
                <li>
                  <strong>Haftungsausschluss:</strong> Für Schäden, die durch die Nutzung oder das 
                  Vertrauen auf KI-generierte Informationen entstehen, übernehmen wir keine Haftung, 
                  soweit gesetzlich zulässig.
                </li>
              </ul>
              <p className="text-sm text-amber-800 italic">
                Die Nutzung der KI-Funktionen erfolgt auf eigenes Risiko. Bei wichtigen rechtlichen, 
                steuerlichen oder geschäftlichen Entscheidungen konsultieren Sie bitte immer einen 
                entsprechenden Fachexperten.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">
                5. Kostenlose und kostenpflichtige Funktionen
              </h2>
              <h3 className="text-base font-medium text-slate-700 mb-2">
                Kostenlose Funktionen
              </h3>
              <p className="mb-4 leading-relaxed">
                Die Grundfunktionen der Plattform (Erstellung von Organigrammen, Speicherung, 
                Export) sind kostenlos nutzbar.
              </p>

              <h3 className="text-base font-medium text-slate-700 mb-2">
                Kostenpflichtige Funktionen
              </h3>
              <p className="leading-relaxed">
                Erweiterte Funktionen wie KI-gestützte Beratung sind kostenpflichtig und 
                erfordern ein Abonnement. Die aktuellen Preise finden Sie auf der Preisseite.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">
                6. Abonnement und Zahlung
              </h2>
              <p className="leading-relaxed">
                Abonnements werden monatlich abgerechnet und können jederzeit gekündigt werden. 
                Die Zahlung erfolgt im Voraus für den jeweiligen Abrechnungszeitraum. 
                Bei Zahlungsverzug behalten wir uns vor, den Zugang zu kostenpflichtigen 
                Funktionen zu sperren.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">
                7. Kündigung
              </h2>
              <p className="leading-relaxed">
                Sie können Ihr Abonnement jederzeit kündigen. Die Kündigung wird zum Ende des 
                laufenden Abrechnungszeitraums wirksam. Wir behalten uns vor, Nutzerkonten bei 
                Verstößen gegen diese AGB zu sperren oder zu löschen.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">
                8. Datenschutz
              </h2>
              <p className="leading-relaxed">
                Der Schutz Ihrer Daten ist uns wichtig. Details zur Datenverarbeitung finden Sie 
                in unserer{" "}
                <Link
                  to="/legal/privacy"
                  className="text-slate-800 hover:underline"
                >
                  Datenschutzerklärung
                </Link>.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">
                9. Verfügbarkeit und Haftung
              </h2>
              <p className="leading-relaxed">
                Wir bemühen uns um eine hohe Verfügbarkeit der Plattform, können jedoch keine 
                Garantie für eine unterbrechungsfreie Nutzung geben. Für leichte Fahrlässigkeit 
                haften wir nur bei Verletzung wesentlicher Vertragspflichten.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">
                10. Urheberrecht
              </h2>
              <p className="leading-relaxed">
                Die auf der Plattform erstellten Inhalte bleiben Ihr geistiges Eigentum. 
                Sie gewähren uns das Recht, diese Daten zur Bereitstellung der Dienstleistung 
                zu speichern und zu verarbeiten.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">
                11. Änderungen der AGB
              </h2>
              <p className="leading-relaxed">
                Wir behalten uns vor, diese AGB zu ändern. Über wesentliche Änderungen werden 
                Sie per E-Mail informiert. Bei Widerspruch können Sie Ihr Konto kündigen.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">
                12. Anwendbares Recht
              </h2>
              <p className="leading-relaxed">
                Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts. Gerichtsstand ist, 
                soweit gesetzlich zulässig, der Sitz der Quantophant GmbH.
              </p>
            </section>

            <section className="pt-4 border-t border-slate-200">
              <p className="text-xs text-slate-400">
                Stand: {new Date().toLocaleDateString("de-DE", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
