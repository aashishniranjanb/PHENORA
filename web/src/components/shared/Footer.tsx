"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#040D1A] border-t border-gray-900 text-gray-400 py-12 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-8 h-8">
                <g transform="translate(10, 25)">
                  <path d="M 0,25 C 10,5 20,45 30,25 C 40,5 50,45 60,25" fill="none" stroke="#17B169" strokeWidth="6" strokeLinecap="round"/>
                  <rect x="68" y="10" width="10" height="30" rx="3" fill="#17B169" opacity="0.6"/>
                  <rect x="82" y="0" width="12" height="50" rx="3" fill="#17B169"/>
                </g>
              </svg>
              <span className="text-white font-extrabold text-lg tracking-wider">PHENORA</span>
            </div>
            <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
              Investigating adaptive impedance intelligence for rapid antimicrobial susceptibility testing.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4 text-xs tracking-widest uppercase">Quick Links</h3>
            <ul className="space-y-2 text-xs">
              <li><Link href="/technology" className="hover:text-[#17B169] transition-colors">Technology Details</Link></li>
              <li><Link href="/spectrae" className="hover:text-[#17B169] transition-colors">Simulation Lab</Link></li>
              <li><Link href="/research" className="hover:text-[#17B169] transition-colors">Research Matrix</Link></li>
              <li><Link href="/platform" className="hover:text-[#17B169] transition-colors">V1-V3 Roadmap</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4 text-xs tracking-widest uppercase">Disclaimer</h3>
            <p className="text-[11px] text-gray-600 leading-relaxed">
              PHENORA is an engineering research prototype. Computational models and simulations are for hypothesis testing and hardware calibration. Not validated for clinical use or diagnostic decision-making.
            </p>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-900 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-600">
          <p>© {new Date().getFullYear()} PHENORA R&D Initiative. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <span>Hackathon V1.0 Foundation</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

