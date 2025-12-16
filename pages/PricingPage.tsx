import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../components/Auth/AuthProvider";

const PricingPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-center text-slate-900 mb-4">
          Pricing
        </h1>
        <p className="text-xl text-center text-slate-700 mb-12">
          Choose the plan that fits you
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="glass-strong p-8 rounded-2xl">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Free
            </h2>
            <div className="text-4xl font-bold text-slate-900 mb-4">
              €0<span className="text-lg text-slate-600">/month</span>
            </div>
            <ul className="space-y-3 mb-8 text-slate-700">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Unlimited organizational charts</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Drag & Drop Editor</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Detailed company data</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>PDF & JSON Export</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Cloud storage</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-slate-400 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="text-slate-500">AI consulting</span>
              </li>
            </ul>
            {user ? (
              <Link
                to="/app"
                className="block w-full text-center glass border border-white/20 hover:bg-white/30 text-slate-900 font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Go to Dashboard
              </Link>
            ) : (
              <Link
                to="/signup"
                className="block w-full text-center glass border border-white/20 hover:bg-white/30 text-slate-900 font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Start Free
              </Link>
            )}
          </div>

          {/* Consulting Plan */}
          <div className="glass-strong p-8 rounded-2xl border-2 border-blue-500 relative">
            <div className="absolute top-4 right-4 bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
              Recommended
            </div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Consulting
            </h2>
            <div className="text-4xl font-bold text-slate-900 mb-4">
              €49<span className="text-lg text-slate-600">/month</span>
            </div>
            <ul className="space-y-3 mb-8 text-slate-700">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>All free features</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Tax & Legal Chat</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Business Consultant Chat</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>AI-powered structure analysis</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Strategic recommendations</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Priority support</span>
              </li>
            </ul>
            {user ? (
              <Link
                to="/app"
                className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Upgrade Now
              </Link>
            ) : (
              <Link
                to="/signup"
                className="block w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>

        <div className="text-center mt-12 text-slate-700">
          <p className="mb-4">
            All plans can be cancelled at any time.
          </p>
          <p className="text-sm">
            Questions? Contact us at{" "}
            <a href="mailto:nadine.wischmeier@quantophant.io" className="text-blue-600 hover:underline">
              nadine.wischmeier@quantophant.io
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;

