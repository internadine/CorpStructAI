import React from "react";

const ImprintPage: React.FC = () => {
  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="glass-strong p-8 rounded-2xl">
          <h1 className="text-4xl font-bold text-slate-900 mb-8">
            Impressum
          </h1>

          <div className="space-y-6 text-slate-800">
            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Angaben gemäß §5 TMG
              </h2>
              <p className="mb-2">
                <strong>OrgPhant</strong> ist eine Marke der:
              </p>
              <p className="mb-2">
                <strong>Quantophant GmbH</strong>
              </p>
              <p className="mb-2">
                Birkenweg 37<br />
                83209 Prien am Chiemsee
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Kontakt
              </h2>
              <p>
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
                Vertreten durch
              </h2>
              <p>
                Geschäftsführung: Nadine und Tobias Wischmeier
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Registereintrag
              </h2>
              <p className="mb-2">
                Eintragung im Handelsregister
              </p>
              <p className="mb-2">
                Registergericht: Amtsgericht Traunstein
              </p>
              <p>
                Registernummer: HRB 26475
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Umsatzsteuer-ID
              </h2>
              <p>
                Umsatzsteuer-Identifikationsnummer gemäß §27 a Umsatzsteuergesetz:
              </p>
              <p className="font-semibold">
                DE 31 57 49622
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
              </h2>
              <p>
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
