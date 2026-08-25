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
    { href: "/technology", label: "TECHNOLOGY" },
    { href: "/simulation", label: "SIMULATION LAB" },
    { href: "/research", label: "RESEARCH" },
    { href: "/platform", label: "PLATFORM" },
    { href: "/team", label: "TEAM" },
  ];

  return (
    <nav className="bg-[#0A192F] border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo / Brand */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center space-x-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-10 h-10">
                <g transform="translate(10, 25)">
                  <path d="M 0,25 C 10,5 20,45 30,25 C 40,5 50,45 60,25" fill="none" stroke="#17B169" stroke-width="6" stroke-linecap="round"/>
                  <rect x="68" y="10" width="10" height="30" rx="3" fill="#17B169" opacity="0.6"/>
                  <rect x="82" y="0" width="12" height="50" rx="3" fill="#17B169"/>
                </g>
              </svg>
              <div className="flex flex-col">
                <span className="text-white font-extrabold text-xl tracking-wider">PHENORA</span>
                <span className="text-[#17B169] text-[8px] font-semibold tracking-widest">ADAPTIVE IMPEDANCE</span>
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
                  className={`px-3 py-2 rounded-md text-xs font-semibold tracking-wider transition-colors duration-200 ${
                    isActive
                      ? "text-[#17B169] bg-[#17B169]/10"
                      : "text-gray-300 hover:text-[#17B169] hover:bg-gray-800/40"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/simulation"
              className="ml-4 px-4 py-2 border border-[#17B169] text-[#17B169] hover:bg-[#17B169] hover:text-[#0A192F] transition-all duration-200 rounded text-xs font-bold tracking-wider"
            >
              EXPLORE V1
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-[#0A192F]/95 backdrop-blur-md border-b border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-md text-sm font-semibold tracking-wider ${
                    isActive
                      ? "text-[#17B169] bg-[#17B169]/10"
                      : "text-gray-300 hover:text-[#17B169] hover:bg-gray-800"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/simulation"
              onClick={() => setIsOpen(false)}
              className="block w-full text-center mt-4 px-4 py-2 border border-[#17B169] text-[#17B169] hover:bg-[#17B169] hover:text-[#0A192F] transition-all duration-200 rounded text-xs font-bold tracking-wider"
            >
              EXPLORE V1
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

