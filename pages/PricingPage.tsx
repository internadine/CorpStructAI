import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../components/Auth/AuthProvider";

const PricingPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-5xl font-bold text-center text-slate-800 mb-4">
          Pricing
        </h1>
        <p className="text-xl text-center text-slate-600 mb-16">
          Choose the plan that fits your needs
        </p>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {/* Free Plan */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Free
            </h2>
            <div className="mb-6">
              <span className="text-4xl font-bold text-slate-800">€0</span>
              <span className="text-slate-500 ml-1">/month</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-slate-600 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-slate-600">Unlimited organizational charts</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-slate-600 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-slate-600">Drag & Drop Editor</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-slate-600 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-slate-600">Detailed company data</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-slate-600 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-slate-600">PDF & JSON Export</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-slate-600 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-slate-600">Cloud storage</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-slate-300 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="text-slate-400">AI consulting</span>
              </li>
            </ul>
            {user ? (
              <Link
                to="/app"
                className="block w-full text-center bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-3 px-6 rounded-xl transition-all"
              >
                Go to Dashboard
              </Link>
            ) : (
              <Link
                to="/signup"
                className="block w-full text-center bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold py-3 px-6 rounded-xl transition-all"
              >
                Start Free
              </Link>
            )}
          </div>

          {/* Consulting Plan */}
          <div className="bg-white p-8 rounded-2xl shadow-md border-2 border-slate-800 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-slate-800 text-white text-xs font-semibold px-4 py-1.5 rounded-full">
                Recommended
              </span>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              Consulting
            </h2>
            <div className="mb-6">
              <span className="text-4xl font-bold text-slate-800">€49</span>
              <span className="text-slate-500 ml-1">/month</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start">
                <svg className="w-5 h-5 text-slate-600 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-slate-600">All free features</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-slate-600 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-slate-600">Tax & Legal Chat</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-slate-600 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-slate-600">Business Consultant Chat</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-slate-600 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-slate-600">AI-powered structure analysis</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-slate-600 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-slate-600">Strategic recommendations</span>
              </li>
              <li className="flex items-start">
                <svg className="w-5 h-5 text-slate-600 mr-3 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-slate-600">Priority support</span>
              </li>
            </ul>
            {user ? (
              <Link
                to="/app"
                className="block w-full text-center bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg"
              >
                Upgrade Now
              </Link>
            ) : (
              <Link
                to="/signup"
                className="block w-full text-center bg-slate-800 hover:bg-slate-900 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-lg"
              >
                Get Started
              </Link>
            )}
          </div>
        </div>

        <div className="text-center text-slate-500">
          <p className="mb-4">
            All plans can be cancelled at any time.
          </p>
          <p className="text-sm">
            Questions? Contact us at{" "}
            <a href="mailto:nadine.wischmeier@quantophant.io" className="text-slate-700 hover:underline">
              nadine.wischmeier@quantophant.io
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;
