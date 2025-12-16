import React from "react";

const PrivacyPage: React.FC = () => {
  return (
    <div className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-10 drop-shadow-lg">
          Datenschutzerklärung
        </h1>

        <div className="glass-strong p-8 rounded-2xl">
          <div className="space-y-8 text-slate-700">
            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">
                1. Datenschutz auf einen Blick
              </h2>
              <h3 className="text-base font-medium text-slate-800 mb-2">
                Allgemeine Hinweise
              </h3>
              <p className="leading-relaxed">
                Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren 
                personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene 
                Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">
                2. Verantwortliche Stelle
              </h2>
              <p className="mb-2">
                Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:
              </p>
              <p className="leading-relaxed">
                <strong className="text-slate-800">Quantophant GmbH</strong><br />
                Birkenweg 37<br />
                83209 Prien am Chiemsee
              </p>
              <p className="mt-2">
                E-Mail:{" "}
                <a
                  href="mailto:nadine.wischmeier@quantophant.io"
                  className="text-slate-800 hover:underline"
                >
                  nadine.wischmeier@quantophant.io
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">
                3. Datenerfassung auf dieser Website
              </h2>
              
              <h3 className="text-base font-medium text-slate-800 mb-2">
                Kontaktformular
              </h3>
              <p className="mb-4 leading-relaxed">
                Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus 
                dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks 
                Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert.
              </p>

              <h3 className="text-base font-medium text-slate-800 mb-2">
                Registrierung und Nutzerkonto
              </h3>
              <p className="mb-4 leading-relaxed">
                Wenn Sie sich auf unserer Website registrieren, erheben und speichern wir folgende 
                Daten: E-Mail-Adresse, Name (sofern angegeben) und Passwort (verschlüsselt). 
                Diese Daten werden zur Bereitstellung und Verwaltung Ihres Nutzerkontos verwendet.
              </p>

              <h3 className="text-base font-medium text-slate-800 mb-2">
                Abonnement und Zahlungsdaten
              </h3>
              <p className="mb-4 leading-relaxed">
                Bei der Anmeldung für ein kostenpflichtiges Abonnement erheben wir zusätzlich 
                Zahlungsinformationen. Diese werden über unseren Zahlungsdienstleister verarbeitet 
                und nicht direkt auf unseren Servern gespeichert.
              </p>

              <h3 className="text-base font-medium text-slate-800 mb-2">
                Nutzungsdaten
              </h3>
              <p className="mb-4 leading-relaxed">
                Wir erfassen automatisch Informationen über Ihre Nutzung der Plattform, einschließlich 
                Zugriffszeiten, genutzte Funktionen und erstellte Inhalte.
              </p>

              <h3 className="text-base font-medium text-slate-800 mb-2">
                Firebase Services
              </h3>
              <p className="mb-4 leading-relaxed">
                Wir nutzen Firebase (Google Cloud Platform) für die Authentifizierung und 
                Datenspeicherung. Weitere Informationen finden Sie in der{" "}
                <a
                  href="https://firebase.google.com/support/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-800 hover:underline"
                >
                  Firebase Datenschutzerklärung
                </a>.
              </p>

              <h3 className="text-base font-medium text-slate-800 mb-2">
                KI-Dienste (OpenRouter)
              </h3>
              <p className="leading-relaxed">
                Für KI-gestützte Funktionen nutzen wir OpenRouter. Bitte beachten Sie die{" "}
                <a
                  href="https://openrouter.ai/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-800 hover:underline"
                >
                  Datenschutzerklärung von OpenRouter
                </a>.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">
                4. Datenweitergabe
              </h2>
              <p className="mb-3 leading-relaxed">
                Ihre personenbezogenen Daten werden grundsätzlich nicht an Dritte weitergegeben. 
                Wir arbeiten mit folgenden Dienstleistern zusammen:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><strong className="text-slate-800">Google Cloud Platform (Firebase):</strong> Hosting und Datenspeicherung</li>
                <li><strong className="text-slate-800">OpenRouter:</strong> KI-Dienste</li>
                <li><strong className="text-slate-800">Zahlungsdienstleister:</strong> Abwicklung von Zahlungen</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">
                5. Datenspeicherung und -löschung
              </h2>
              <p className="leading-relaxed">
                Wir speichern Ihre personenbezogenen Daten nur so lange, wie dies für die 
                Erfüllung der Zwecke erforderlich ist. Abrechnungsdaten werden gemäß 
                steuerrechtlichen Vorgaben (in der Regel 10 Jahre) aufbewahrt.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">
                6. Ihre Rechte
              </h2>
              <p className="mb-2">Sie haben jederzeit das Recht:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Auskunft über Ihre gespeicherten Daten zu erhalten</li>
                <li>Berichtigung unrichtiger Daten zu verlangen</li>
                <li>Löschung Ihrer Daten zu verlangen</li>
                <li>Einschränkung der Datenverarbeitung zu verlangen</li>
                <li>Widerspruch gegen die Verarbeitung einzulegen</li>
                <li>Datenübertragbarkeit zu verlangen</li>
                <li>Beschwerde bei einer Aufsichtsbehörde einzulegen</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">
                7. Cookies und Tracking
              </h2>
              <p className="mb-3 leading-relaxed">
                Diese Website nutzt technisch notwendige Cookies für:
              </p>
              <ul className="list-disc list-inside space-y-1 text-sm mb-3">
                <li>Authentifizierung und Session-Verwaltung</li>
                <li>Speicherung Ihrer Cookie-Präferenzen</li>
                <li>Verbesserung der Funktionalität</li>
              </ul>
              <p className="text-sm leading-relaxed">
                Die Deaktivierung von Cookies kann die Funktionalität beeinträchtigen.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">
                8. Datensicherheit
              </h2>
              <p className="leading-relaxed">
                Wir setzen technische und organisatorische Maßnahmen ein, um Ihre Daten 
                vor Verlust, Manipulation oder unberechtigtem Zugriff zu schützen.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">
                9. Kontakt bei Datenschutzfragen
              </h2>
              <p className="leading-relaxed">
                <strong className="text-slate-800">Quantophant GmbH</strong><br />
                Birkenweg 37<br />
                83209 Prien am Chiemsee<br />
                E-Mail:{" "}
                <a
                  href="mailto:nadine.wischmeier@quantophant.io"
                  className="text-slate-800 hover:underline"
                >
                  nadine.wischmeier@quantophant.io
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">
                10. Änderungen dieser Datenschutzerklärung
              </h2>
              <p className="leading-relaxed">
                Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets den 
                aktuellen rechtlichen Anforderungen entspricht.
              </p>
            </section>

            <section className="pt-4 border-t border-white/30">
              <p className="text-xs text-slate-500">
                Stand: {new Date().toLocaleDateString("de-DE", { year: "numeric", month: "long", day: "numeric" })}
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
