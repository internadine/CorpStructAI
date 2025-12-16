import React from "react";
import { Link } from "react-router-dom";

const FeaturesPage: React.FC = () => {
  return (
    <div className="py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-center text-slate-800 mb-4">
          Features
        </h1>
        <p className="text-xl text-center text-slate-600 mb-16">
          One powerful tool for all your organizational structures
        </p>

        {/* Use Cases Section */}
        <section className="mb-20">
          <h2 className="text-2xl font-semibold text-slate-800 mb-8 uppercase tracking-wide">
            Use Cases
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Corporate Structures
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Visualize holding companies, subsidiaries, and ownership percentages. 
                Perfect for GmbH, UG, KG, AG, and international structures.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Team Hierarchies
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Map out your team structure, reporting lines, and responsibilities. 
                Great for onboarding and organizational clarity.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Project Organizations
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Define project structures with workstreams, leads, and dependencies. 
                Keep complex projects organized visually.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Family Offices
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Plan succession, visualize asset distribution, and manage 
                family business structures across generations.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Restructuring Plans
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Model before/after scenarios for mergers, acquisitions, or 
                internal reorganizations. Compare options visually.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Investment Portfolios
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Track investments, ownership stakes, and portfolio companies 
                in one clear visual overview.
              </p>
            </div>
          </div>
        </section>

        {/* Free Features */}
        <section className="mb-20">
          <h2 className="text-2xl font-semibold text-slate-800 mb-8 uppercase tracking-wide">
            Free Features
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Drag & Drop Editor
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Build structures visually with an intuitive drag & drop interface. 
                No learning curve required.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Customizable Design
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Customize colors, labels, and layouts. Match your 
                brand or preferences perfectly.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Rich Data Fields
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Add detailed information: financials, responsibilities, 
                assets, contacts, and custom fields.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                People Management
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Track key personnel, roles, and responsibilities 
                across your entire structure.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Export Options
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Export as PDF for presentations or JSON for 
                data integration and backups.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Cloud Storage
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                All projects stored securely in the cloud. 
                Access from any device, anytime.
              </p>
            </div>
          </div>
        </section>

        {/* Premium Features */}
        <section className="mb-20">
          <h2 className="text-2xl font-semibold text-slate-800 mb-8 uppercase tracking-wide">
            Premium Features
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                  Premium
                </span>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Tax & Legal AI Chat
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Get AI-powered insights on tax implications and legal considerations 
                for your corporate structures. Explore optimization opportunities.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border-2 border-slate-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="text-xs font-medium text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                  Premium
                </span>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                Business Strategy Consultant
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Analyze synergies, growth opportunities, and strategic options. 
                Get AI recommendations for your organizational setup.
              </p>
            </div>
          </div>
        </section>

        {/* Who It's For */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-slate-800 mb-8 uppercase tracking-wide">
            Who It's For
          </h2>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl text-center shadow-sm border border-slate-100">
              <h3 className="text-base font-semibold text-slate-800 mb-1">
                Entrepreneurs
              </h3>
              <p className="text-slate-500 text-xs">
                Plan and visualize your business empire
              </p>
            </div>
            <div className="bg-white p-5 rounded-2xl text-center shadow-sm border border-slate-100">
              <h3 className="text-base font-semibold text-slate-800 mb-1">
                Tax Advisors
              </h3>
              <p className="text-slate-500 text-xs">
                Create client structure documentation
              </p>
            </div>
            <div className="bg-white p-5 rounded-2xl text-center shadow-sm border border-slate-100">
              <h3 className="text-base font-semibold text-slate-800 mb-1">
                HR & Operations
              </h3>
              <p className="text-slate-500 text-xs">
                Map team hierarchies clearly
              </p>
            </div>
            <div className="bg-white p-5 rounded-2xl text-center shadow-sm border border-slate-100">
              <h3 className="text-base font-semibold text-slate-800 mb-1">
                Consultants
              </h3>
              <p className="text-slate-500 text-xs">
                Present restructuring proposals
              </p>
            </div>
          </div>
        </section>

        <div className="text-center">
          <Link
            to="/pricing"
            className="inline-block bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3 px-8 rounded-xl transition-all shadow-lg hover:shadow-xl"
          >
            View Pricing
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;
