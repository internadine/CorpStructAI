import React from "react";

const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="glass-strong p-8 rounded-2xl">
          <h1 className="text-4xl font-bold text-slate-900 mb-8">
            Datenschutzerklärung
          </h1>

          <div className="space-y-6 text-slate-800">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                1. Datenschutz auf einen Blick
              </h2>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Allgemeine Hinweise
              </h3>
              <p className="mb-4">
                Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren 
                personenbezogenen Daten passiert, wenn Sie diese Website besuchen. Personenbezogene 
                Daten sind alle Daten, mit denen Sie persönlich identifiziert werden können.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                2. Verantwortliche Stelle
              </h2>
              <p className="mb-2">
                Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:
              </p>
              <p className="mb-2">
                <strong>Quantophant GmbH</strong><br />
                Birkenweg 37<br />
                83209 Prien am Chiemsee
              </p>
              <p className="mb-2">
                E-Mail:{" "}
                <a
                  href="mailto:nadine.wischmeier@quantophant.io"
                  className="text-blue-600 hover:underline"
                >
                  nadine.wischmeier@quantophant.io
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                3. Datenerfassung auf dieser Website
              </h2>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Kontaktformular
              </h3>
              <p className="mb-4">
                Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus 
                dem Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks 
                Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Registrierung und Nutzerkonto
              </h3>
              <p className="mb-4">
                Wenn Sie sich auf unserer Website registrieren, erheben und speichern wir folgende 
                Daten: E-Mail-Adresse, Name (sofern angegeben) und Passwort (verschlüsselt). 
                Diese Daten werden zur Bereitstellung und Verwaltung Ihres Nutzerkontos verwendet.
              </p>

              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Firebase Services
              </h3>
              <p className="mb-4">
                Wir nutzen Firebase (Google Cloud Platform) für die Authentifizierung und 
                Datenspeicherung. Ihre Daten werden auf Servern von Google Cloud Platform gespeichert. 
                Weitere Informationen finden Sie in der{" "}
                <a
                  href="https://firebase.google.com/support/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Firebase Datenschutzerklärung
                </a>.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                4. Ihre Rechte
              </h2>
              <p className="mb-2">
                Sie haben jederzeit das Recht:
              </p>
              <ul className="list-disc list-inside space-y-2 mb-4">
                <li>Auskunft über Ihre bei uns gespeicherten personenbezogenen Daten zu erhalten</li>
                <li>Berichtigung unrichtiger Daten zu verlangen</li>
                <li>Löschung Ihrer bei uns gespeicherten Daten zu verlangen</li>
                <li>Einschränkung der Datenverarbeitung zu verlangen</li>
                <li>Widerspruch gegen die Verarbeitung Ihrer Daten einzulegen</li>
                <li>Datenübertragbarkeit zu verlangen</li>
                <li>Beschwerde bei einer Aufsichtsbehörde einzulegen</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                5. Cookies
              </h2>
              <p className="mb-4">
                Diese Website nutzt technisch notwendige Cookies, die für den Betrieb der Website 
                erforderlich sind. Diese Cookies werden automatisch gesetzt, wenn Sie die Website 
                besuchen. Sie können Ihre Browser-Einstellungen so anpassen, dass Sie über das 
                Setzen von Cookies informiert werden und Cookies nur im Einzelfall erlauben.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                6. Änderungen dieser Datenschutzerklärung
              </h2>
              <p>
                Wir behalten uns vor, diese Datenschutzerklärung anzupassen, damit sie stets den 
                aktuellen rechtlichen Anforderungen entspricht oder um Änderungen unserer Leistungen 
                in der Datenschutzerklärung umzusetzen. Für Ihren erneuten Besuch gilt dann die neue 
                Datenschutzerklärung.
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

export default PrivacyPage;
