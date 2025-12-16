import React from "react";
import { Link } from "react-router-dom";

const Footer: React.FC = () => {
  return (
    <footer className="glass-strong border-t border-white/20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4">OrgPhant</h3>
            <p className="text-slate-700 text-sm">
              Professional company structure visualization
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Product</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/features" className="text-slate-700 hover:text-slate-900">
                  Features
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-slate-700 hover:text-slate-900">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/legal/imprint" className="text-slate-700 hover:text-slate-900">
                  Imprint
                </Link>
              </li>
              <li>
                <Link to="/legal/privacy" className="text-slate-700 hover:text-slate-900">
                  Privacy
                </Link>
              </li>
              <li>
                <Link to="/legal/terms" className="text-slate-700 hover:text-slate-900">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-slate-900 mb-3">Contact</h4>
            <p className="text-slate-700 text-sm">
              <a
                href="mailto:nadine.wischmeier@quantophant.io"
                className="hover:text-slate-900"
              >
                nadine.wischmeier@quantophant.io
              </a>
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-white/20 text-center text-sm text-slate-700">
          <p>&copy; {new Date().getFullYear()} Quantophant GmbH. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

