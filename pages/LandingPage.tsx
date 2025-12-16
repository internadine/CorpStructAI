import React from "react";
import { Link } from "react-router-dom";

const LandingPage: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <img
            src="/orgphant-logo.png"
            alt="OrgPhant Logo"
            className="h-28 w-auto mx-auto mb-10 drop-shadow-lg"
          />
          <h1 className="text-5xl md:text-6xl font-bold text-slate-800 mb-6 leading-tight">
            Visualize Any<br />Organizational Structure
          </h1>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            From corporate holdings to team hierarchies — create beautiful, 
            interactive org charts with AI-powered insights.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/app"
              className="bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3.5 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl"
            >
              Start Free
            </Link>
            <Link
              to="/pricing"
              className="bg-white hover:bg-slate-50 text-slate-800 font-semibold py-3.5 px-8 rounded-xl transition-all border border-slate-200 shadow-sm"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Use Cases Carousel */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold text-center text-slate-700 mb-10">
            Built for Every Organization Type
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl text-center shadow-sm border border-slate-100">
              <div className="w-10 h-10 mx-auto mb-3 text-slate-600">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <span className="text-sm text-slate-700 font-medium">Corporate Holdings</span>
            </div>
            <div className="bg-white p-5 rounded-xl text-center shadow-sm border border-slate-100">
              <div className="w-10 h-10 mx-auto mb-3 text-slate-600">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <span className="text-sm text-slate-700 font-medium">Team Structures</span>
            </div>
            <div className="bg-white p-5 rounded-xl text-center shadow-sm border border-slate-100">
              <div className="w-10 h-10 mx-auto mb-3 text-slate-600">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
              </div>
              <span className="text-sm text-slate-700 font-medium">Project Organizations</span>
            </div>
            <div className="bg-white p-5 rounded-xl text-center shadow-sm border border-slate-100">
              <div className="w-10 h-10 mx-auto mb-3 text-slate-600">
                <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <span className="text-sm text-slate-700 font-medium">Family Offices</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-slate-800 mb-14">
            Everything You Need
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">
                Drag & Drop Builder
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Intuitive visual editor for any hierarchy. Add entities, 
                define relationships, and customize the look instantly.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">
                Multiple Project Types
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Corporate structures, team org charts, project hierarchies, 
                or custom setups — one tool for all.
              </p>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-3">
                Export & Share
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Export as PDF for presentations or JSON for integration. 
                Share with stakeholders effortlessly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Features Section */}
      <section className="py-24 px-4 bg-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            AI-Powered Insights
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto leading-relaxed">
            Premium subscribers get access to intelligent analysis — 
            tax optimization ideas, legal considerations, and strategic business advice.
          </p>
          <Link
            to="/features"
            className="inline-flex items-center text-white hover:text-slate-200 font-semibold text-lg transition-colors"
          >
            View All Features
            <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-xl mx-auto">
          <div className="bg-white p-10 rounded-3xl text-center shadow-sm border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">
              Ready to Get Organized?
            </h2>
            <p className="text-slate-600 mb-8">
              Create your first structure for free — no credit card required.
            </p>
            <Link
              to="/app"
              className="inline-block bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3.5 px-10 rounded-xl transition-all shadow-lg"
            >
              Start Free Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
