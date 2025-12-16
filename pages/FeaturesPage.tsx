import React from "react";
import { Link } from "react-router-dom";

const FeaturesPage: React.FC = () => {
  return (
    <div className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-center text-white mb-4 drop-shadow-lg">
          Features
        </h1>
        <p className="text-xl text-center text-white/90 mb-16">
          Everything you need to manage your company structure
        </p>

        {/* Free Features */}
        <section className="mb-20">
          <h2 className="text-2xl font-semibold text-white mb-8 uppercase tracking-wide">
            Free Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="glass-strong p-6 rounded-2xl hover:scale-[1.02] transition-transform">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Interactive Organizational Charts
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Create visual organizational charts with drag & drop. 
                Supports various company types (GmbH, UG, KG, AG, etc.).
              </p>
            </div>

            <div className="glass-strong p-6 rounded-2xl hover:scale-[1.02] transition-transform">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Customizable Display
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Customize colors, ownership percentages, and layouts. 
                Each company can be individually designed.
              </p>
            </div>

            <div className="glass-strong p-6 rounded-2xl hover:scale-[1.02] transition-transform">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Detailed Company Data
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Capture business purpose, financial resources, 
                real estate, and other assets.
              </p>
            </div>

            <div className="glass-strong p-6 rounded-2xl hover:scale-[1.02] transition-transform">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Key Personnel
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Manage managing directors, executives, and other 
                important people in your structure.
              </p>
            </div>

            <div className="glass-strong p-6 rounded-2xl hover:scale-[1.02] transition-transform">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Export Functions
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Export your structure as PDF or JSON. 
                Perfect for presentations and backup.
              </p>
            </div>

            <div className="glass-strong p-6 rounded-2xl hover:scale-[1.02] transition-transform">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Cloud Storage
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Store your projects securely in the cloud. 
                Access from anywhere, anytime.
              </p>
            </div>
          </div>
        </section>

        {/* Premium Features */}
        <section className="mb-20">
          <h2 className="text-2xl font-semibold text-white mb-8 uppercase tracking-wide">
            Premium Features
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="glass-strong p-6 rounded-2xl border border-white/40 hover:scale-[1.02] transition-transform">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-slate-600 bg-white/50 px-3 py-1 rounded-full">
                  Premium
                </span>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Tax & Legal Chat
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Get AI-powered advice on tax and legal questions about your company structure. 
                Analyze optimization potential.
              </p>
            </div>

            <div className="glass-strong p-6 rounded-2xl border border-white/40 hover:scale-[1.02] transition-transform">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-slate-600 bg-white/50 px-3 py-1 rounded-full">
                  Premium
                </span>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Business Consultant
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Analyze business opportunities, synergies, and 
                growth potential of your company structure.
              </p>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-white mb-8 uppercase tracking-wide">
            Use Cases
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="glass-strong p-6 rounded-2xl text-center">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Corporate Planning
              </h3>
              <p className="text-slate-600 text-sm">
                Plan new company structures and holding companies.
              </p>
            </div>
            <div className="glass-strong p-6 rounded-2xl text-center">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Tax Optimization
              </h3>
              <p className="text-slate-600 text-sm">
                Visualize structures for tax consulting.
              </p>
            </div>
            <div className="glass-strong p-6 rounded-2xl text-center">
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Presentations
              </h3>
              <p className="text-slate-600 text-sm">
                Create professional organizational charts for investors and partners.
              </p>
            </div>
          </div>
        </section>

        <div className="text-center">
          <Link
            to="/pricing"
            className="inline-block bg-white/90 hover:bg-white text-slate-800 font-semibold py-3 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl"
          >
            View Pricing
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;
