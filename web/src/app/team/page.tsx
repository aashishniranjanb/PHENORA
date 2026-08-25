"use client";

import { Mail, User, Globe } from "lucide-react";

export default function Team() {
  const members = [
    {
      name: "PHENORA R&D Group",
      role: "Hardware & Biological Systems Engineer",
      bio: "Focuses on analog front-ends, AD5933 integration, and micro-electrode biological calibration.",
    },
    {
      name: "PHENORA Computational Team",
      role: "Digital Design & Edge Intelligence",
      bio: "Focuses on Verilog FPGA digital filters, UART streaming, and adaptive decision state machines.",
    }
  ];

  return (
    <div className="bg-[#0A192F] min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12">
          <span className="text-[10px] text-[#17B169] font-extrabold tracking-widest uppercase block">Who We Are</span>
          <h1 className="text-4xl font-extrabold text-white mt-2">Team & Foundation</h1>
          <p className="text-gray-400 text-sm mt-2 max-w-2xl leading-relaxed">
            A collaborative engineering effort bridging analog circuits, biological suspensions, and hardware-level calculations.
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {members.map((member, idx) => (
            <div key={idx} className="bg-[#081324] border border-gray-800 p-8 rounded-xl shadow-xl">
              <h3 className="text-white text-xl font-bold mb-1">{member.name}</h3>
              <p className="text-[#17B169] text-xs font-mono mb-4">{member.role}</p>
              <p className="text-gray-400 text-xs leading-relaxed mb-6">
                {member.bio}
              </p>
              
              <div className="flex space-x-4 text-gray-500">
                <Mail className="h-4 w-4 hover:text-[#17B169] cursor-pointer" />
                <User className="h-4 w-4 hover:text-[#17B169] cursor-pointer" />
                <Globe className="h-4 w-4 hover:text-[#17B169] cursor-pointer" />
              </div>
            </div>
          ))}
        </div>

        {/* Contact details */}
        <section className="bg-[#081324] border border-gray-800 rounded-xl p-8 shadow-xl text-center max-w-2xl mx-auto">
          <h3 className="text-white text-lg font-bold mb-2">Inquiries & Collaboration</h3>
          <p className="text-gray-400 text-xs leading-relaxed mb-6">
            Interested in the PHENORA adaptive impedance research project? Reach out to collaborate on biosensor design, algorithmic testing, or investment opportunities.
          </p>
          <a
            href="mailto:contact@phenora-rd.org"
            className="inline-flex items-center justify-center px-6 py-2.5 bg-[#17B169] hover:bg-[#139457] text-[#0A192F] font-bold tracking-wider rounded text-xs transition-all duration-200"
          >
            CONTACT INITIATIVE
          </a>
        </section>

      </div>
    </div>
  );
}

