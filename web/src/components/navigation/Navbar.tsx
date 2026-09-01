"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { href: "/", label: "HOME" },
    { href: "/phenora-flash", label: "PHENORA FLASH" },
    { href: "/technology", label: "TECHNOLOGY" },
    { href: "/spectrae", label: "SIMULATION LAB" },
    { href: "/research", label: "RESEARCH" },
    { href: "/platform", label: "PLATFORM" },
    { href: "/team", label: "TEAM" },
  ];

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo / Brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-10 h-10">
                <g transform="translate(10, 25)">
                  <path d="M 0,25 C 10,5 20,45 30,25 C 40,5 50,45 60,25" fill="none" stroke="#059669" strokeWidth="6" strokeLinecap="round"/>
                  <rect x="68" y="10" width="10" height="30" rx="3" fill="#059669" opacity="0.6"/>
                  <rect x="82" y="0" width="12" height="50" rx="3" fill="#059669"/>
                </g>
              </svg>
              <div className="flex flex-col">
                <span className="text-slate-900 font-extrabold text-xl tracking-wider">PHENORA</span>
                <span className="text-[#059669] text-[8px] font-bold tracking-widest">ADAPTIVE IMPEDANCE</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-4">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-md text-xs font-bold tracking-wider transition-colors duration-200 ${
                    isActive
                      ? "text-[#059669] bg-emerald-50 border border-emerald-200"
                      : "text-slate-700 hover:text-[#059669] hover:bg-slate-100"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/spectrae"
              className="ml-4 px-4 py-2 bg-[#059669] text-white hover:bg-[#047857] transition-all duration-200 rounded text-xs font-bold tracking-wider shadow-sm"
            >
              EXPLORE V1
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-md text-sm font-bold tracking-wider ${
                    isActive
                      ? "text-[#059669] bg-emerald-50"
                      : "text-slate-700 hover:text-[#059669] hover:bg-slate-100"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/spectrae"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center mt-4 px-4 py-2 bg-[#059669] text-white hover:bg-[#047857] transition-all duration-200 rounded text-xs font-bold tracking-wider"
            >
              EXPLORE V1
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

