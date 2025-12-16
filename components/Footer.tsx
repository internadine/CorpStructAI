import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <h3 className="text-lg font-bold text-white mb-4">OrgPhant</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Professional organizational structure visualization for modern businesses.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">Product</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/features" className="text-slate-300 hover:text-white transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-slate-300 hover:text-white transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">Legal</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link to="/legal/imprint" className="text-slate-300 hover:text-white transition-colors">
                  Imprint
                </Link>
              </li>
              <li>
                <Link to="/legal/privacy" className="text-slate-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/legal/terms" className="text-slate-300 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">Contact</h4>
            <p className="text-slate-300 text-sm">
              <a
                href="mailto:nadine.wischmeier@quantophant.io"
                className="hover:text-white transition-colors"
              >
                nadine.wischmeier@quantophant.io
              </a>
            </p>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-slate-700 text-center text-sm text-slate-400">
          <p>&copy; {new Date().getFullYear()} Quantophant GmbH. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
