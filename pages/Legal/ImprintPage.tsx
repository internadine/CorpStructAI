import React from "react";

const ImprintPage: React.FC = () => {
  return (
    <div className="py-16 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-10 drop-shadow-lg">
          Impressum
        </h1>

        <div className="glass-strong p-8 rounded-2xl">
          <div className="space-y-8 text-slate-700">
            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">
                Angaben gemäß §5 TMG
              </h2>
              <p className="mb-1">
                <strong className="text-slate-800">OrgPhant</strong> ist eine Marke der:
              </p>
              <p className="mb-1 font-medium text-slate-800">
                Quantophant GmbH
              </p>
              <p className="leading-relaxed">
                Birkenweg 37<br />
                83209 Prien am Chiemsee
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">
                Kontakt
              </h2>
              <p className="mb-2">
                E-Mail:{" "}
                <a
                  href="mailto:nadine.wischmeier@quantophant.io"
                  className="text-slate-800 hover:underline"
                >
                  nadine.wischmeier@quantophant.io
                </a>
              </p>
              <p>
                Termin vereinbaren:{" "}
                <a
                  href="https://calendly.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-800 hover:underline"
                >
                  Generate Appointment in Calendly
                </a>
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">
                Vertreten durch
              </h2>
              <p>
                Geschäftsführung: Nadine und Tobias Wischmeier
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">
                Registereintrag
              </h2>
              <p className="mb-1">
                Eintragung im Handelsregister
              </p>
              <p className="mb-1">
                Registergericht: Amtsgericht Traunstein
              </p>
              <p>
                Registernummer: HRB 26475
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">
                Umsatzsteuer-ID
              </h2>
              <p className="mb-1">
                Umsatzsteuer-Identifikationsnummer gemäß §27 a Umsatzsteuergesetz:
              </p>
              <p className="font-medium text-slate-800">
                DE 31 57 49622
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-slate-800 mb-3">
                Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
              </h2>
              <p className="leading-relaxed">
                Nadine Wischmeier<br />
                Birkenweg 37<br />
                83209 Prien am Chiemsee
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImprintPage;
