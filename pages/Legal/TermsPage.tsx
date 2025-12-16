import React from "react";

const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="glass-strong p-8 rounded-2xl">
          <h1 className="text-4xl font-bold text-slate-900 mb-8">
            Allgemeine Geschäftsbedingungen (AGB)
          </h1>

          <div className="space-y-6 text-slate-800">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                1. Geltungsbereich
              </h2>
              <p className="mb-4">
                Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für die Nutzung der 
                Software-as-a-Service-Plattform "OrgPhant" der Quantophant GmbH. 
                Durch die Registrierung oder Nutzung der Plattform akzeptieren Sie diese AGB.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                2. Leistungsbeschreibung
              </h2>
              <p className="mb-4">
                OrgPhant ist eine Cloud-basierte Plattform zur Erstellung und Verwaltung von 
                Unternehmensstrukturen und Organigrammen. Die Plattform bietet:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>Erstellung und Bearbeitung von Organigrammen</li>
                <li>Speicherung von Projekten in der Cloud</li>
                <li>Export-Funktionen (PDF, JSON)</li>
                <li>Optional: KI-gestützte Beratungsfunktionen (kostenpflichtig)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                3. Registrierung und Nutzerkonto
              </h2>
              <p className="mb-4">
                Für die Nutzung der Plattform ist eine Registrierung erforderlich. Sie verpflichten 
                sich, wahrheitsgemäße Angaben zu machen und Ihre Zugangsdaten geheim zu halten. 
                Sie sind für alle Aktivitäten unter Ihrem Konto verantwortlich.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                4. Kostenlose und kostenpflichtige Funktionen
              </h2>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Kostenlose Funktionen
              </h3>
              <p className="mb-4">
                Die Grundfunktionen der Plattform (Erstellung von Organigrammen, Speicherung, 
                Export) sind kostenlos nutzbar.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Kostenpflichtige Funktionen
              </h3>
              <p className="mb-4">
                Erweiterte Funktionen wie KI-gestützte Beratung (Steuer- & Rechts-Chat, 
                Business-Berater) sind kostenpflichtig und erfordern ein Abonnement. 
                Die aktuellen Preise finden Sie auf der Preisseite.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                5. Abonnement und Zahlung
              </h2>
              <p className="mb-4">
                Abonnements werden monatlich abgerechnet und können jederzeit gekündigt werden. 
                Die Zahlung erfolgt im Voraus für den jeweiligen Abrechnungszeitraum. 
                Bei Zahlungsverzug behalten wir uns vor, den Zugang zu kostenpflichtigen 
                Funktionen zu sperren.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                6. Kündigung
              </h2>
              <p className="mb-4">
                Sie können Ihr Abonnement jederzeit kündigen. Die Kündigung wird zum Ende des 
                laufenden Abrechnungszeitraums wirksam. Wir behalten uns vor, Nutzerkonten bei 
                Verstößen gegen diese AGB zu sperren oder zu löschen.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                7. Datenschutz
              </h2>
              <p className="mb-4">
                Der Schutz Ihrer Daten ist uns wichtig. Details zur Datenverarbeitung finden Sie 
                in unserer{" "}
                <a
                  href="/legal/privacy"
                  className="text-blue-600 hover:underline"
                >
                  Datenschutzerklärung
                </a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                8. Verfügbarkeit und Haftung
              </h2>
              <p className="mb-4">
                Wir bemühen uns um eine hohe Verfügbarkeit der Plattform, können jedoch keine 
                Garantie für eine unterbrechungsfreie Nutzung geben. Für leichte Fahrlässigkeit 
                haften wir nur bei Verletzung wesentlicher Vertragspflichten. Die Haftung für 
                Schäden ist ausgeschlossen, soweit gesetzlich zulässig.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                9. Urheberrecht
              </h2>
              <p className="mb-4">
                Die auf der Plattform erstellten Inhalte bleiben Ihr geistiges Eigentum. 
                Sie gewähren uns das Recht, diese Daten zur Bereitstellung der Dienstleistung 
                zu speichern und zu verarbeiten.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                10. Änderungen der AGB
              </h2>
              <p className="mb-4">
                Wir behalten uns vor, diese AGB zu ändern. Über wesentliche Änderungen werden 
                Sie per E-Mail informiert. Bei Widerspruch können Sie Ihr Konto kündigen.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                11. Anwendbares Recht
              </h2>
              <p>
                Es gilt deutsches Recht unter Ausschluss des UN-Kaufrechts. Gerichtsstand ist, 
                soweit gesetzlich zulässig, der Sitz der Quantophant GmbH.
              </p>
            </section>

            <section className="pt-4">
              <p className="text-sm text-slate-600">
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

