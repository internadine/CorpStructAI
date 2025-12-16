import React from "react";
import { Link } from "react-router-dom";

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <img
            src="/orgphant-logo.png"
            alt="OrgPhant Logo"
            className="h-32 w-auto mx-auto mb-8 drop-shadow-2xl"
          />
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
            Visualize Your Company Structure
          </h1>
          <p className="text-xl text-slate-700 mb-8 max-w-2xl mx-auto">
            Create interactive organizational charts of your company structure. 
            Professional, intuitive, and AI-powered.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              to="/app"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
            >
              Start Free
            </Link>
            <Link
              to="/pricing"
              className="glass-strong hover:bg-white/30 text-slate-900 font-semibold py-3 px-8 rounded-lg transition-colors border border-white/20"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-slate-900 mb-12">
            Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-strong p-6 rounded-2xl">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Interactive Visualization
              </h3>
              <p className="text-slate-700">
                Create organizational charts with drag & drop. Customize colors, 
                ownership percentages, and details.
              </p>
            </div>
            <div className="glass-strong p-6 rounded-2xl">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Detailed Information
              </h3>
              <p className="text-slate-700">
                Capture financial resources, business purpose, 
                real estate, and key personnel.
              </p>
            </div>
            <div className="glass-strong p-6 rounded-2xl">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">
                Export & Sharing
              </h3>
              <p className="text-slate-700">
                Export your structure as PDF or JSON. 
                Share it with your team.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">
            AI Consulting Available
          </h2>
          <p className="text-xl text-slate-700 mb-8 max-w-2xl mx-auto">
            With a Premium subscription, you get access to our 
            AI consulting features for tax, legal, and business strategy.
          </p>
          <Link
            to="/features"
            className="text-blue-600 hover:text-blue-700 font-semibold text-lg"
          >
            View All Features →
          </Link>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-slate-900 mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-slate-700 mb-8">
            Create your first company structure for free.
          </p>
          <Link
            to="/app"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-12 rounded-lg transition-colors text-lg inline-block"
          >
            Start Free Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;

