"use client";

import { BookOpen, Award, CheckCircle } from "lucide-react";

export default function Research() {
  const literature = [
    {
      platform: "iFAST",
      principle: "Single-cell impedance",
      sample: "Purified blood culture",
      measurement: "Microfluidic flow impedance",
      time: "2 - 3 hours",
      status: "ESTABLISHED"
    },
    {
      platform: "Bulk-EIS",
      principle: "Bulk suspension impedance",
      sample: "Bacterial suspension",
      measurement: "Dual electrode sweep",
      time: "4 - 6 hours",
      status: "LITERATURE-SUPPORTED"
    },
    {
      platform: "PHENORA V1",
      principle: "Bulk differential impedance + FPGA",
      sample: "Parallel suspension wells",
      measurement: "AD5933 DFT feature extraction",
      time: "< 5 hours",
      status: "PHENORA HYPOTHESIS"
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12">
          <span className="text-[10px] text-[#17B169] font-extrabold tracking-widest uppercase block">Scientific Basis</span>
          <h1 className="text-4xl font-extrabold text-slate-900 mt-2">Research Foundations</h1>
          <p className="text-slate-600 text-sm mt-2 max-w-2xl leading-relaxed">
            Explores the academic literature, published algorithms, and validation milestones backing PHENORA's design.
          </p>
        </div>

        {/* Foundations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
            <BookOpen className="h-6 w-6 text-[#17B169] mb-4" />
            <h3 className="text-slate-900 text-lg font-bold mb-2">Impedance AST Principles</h3>
            <p className="text-slate-600 text-xs leading-relaxed mb-4">
              Academic literature establishes that bacterial metabolism and cell division release ionic metabolites (such as lactic acid and bicarbonate) into the growth medium. This increases broth conductivity.
            </p>
            <p className="text-slate-600 text-xs leading-relaxed">
              When cells grow healthily (control well), conductance rises. If growth is inhibited by an antibiotic (susceptible well), conductance remains stationary.
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
            <Award className="h-6 w-6 text-pink-500 mb-4" />
            <h3 className="text-slate-900 text-lg font-bold mb-2">Differential Rejection</h3>
            <p className="text-slate-600 text-xs leading-relaxed mb-4">
              Impedance sensors are highly sensitive to thermal noise (approx. 2% per °C drift). To isolate the biological signal from thermal perturbations, PHENORA adopts a dual-well differential configuration.
            </p>
            <p className="text-slate-600 text-xs leading-relaxed">
              Since temperature drift acts as a common-mode noise across both parallel wells, computing {"$\\Delta F(t) = F_{test}(t) - F_{control}(t)$"} effectively cancels out the temperature coefficient.
            </p>
          </div>
        </div>

        {/* Literature Matrix Table */}
        <section className="mb-12">
          <h2 className="text-xl font-bold text-slate-900 mb-6 uppercase tracking-wider">Literature Comparison Matrix</h2>
          
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-bold bg-slate-50">
                    <th className="p-4 uppercase tracking-wider">Platform</th>
                    <th className="p-4 uppercase tracking-wider">Detection Principle</th>
                    <th className="p-4 uppercase tracking-wider">Sample Prep</th>
                    <th className="p-4 uppercase tracking-wider">Measurement Type</th>
                    <th className="p-4 uppercase tracking-wider">Time-to-Result</th>
                    <th className="p-4 uppercase tracking-wider">Validation Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {literature.map((lit, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 text-slate-600">
                      <td className="p-4 text-slate-900 font-black">{lit.platform}</td>
                      <td className="p-4">{lit.principle}</td>
                      <td className="p-4">{lit.sample}</td>
                      <td className="p-4 font-mono text-[11px]">{lit.measurement}</td>
                      <td className="p-4 text-[#17B169]">{lit.time}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold tracking-wider uppercase ${
                          lit.status === "ESTABLISHED"
                            ? "bg-emerald-100 text-[#059669] border border-emerald-200"
                            : lit.status === "LITERATURE-SUPPORTED"
                            ? "bg-blue-100 text-blue-700 border border-blue-200"
                            : "bg-pink-100 text-pink-700 border border-pink-200"
                        }`}>
                          {lit.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Evidence Status Badges Explanation */}
        <section className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6 uppercase tracking-wider">Evidence Status Classifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-[#059669] mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-[10px] text-[#059669] font-bold uppercase tracking-wider block">ESTABLISHED</span>
                <p className="text-slate-600 text-xs mt-1">Validated by third-party peers with peer-reviewed human clinical trial publications.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider block">LITERATURE-SUPPORTED</span>
                <p className="text-slate-600 text-xs mt-1">Scientific consensus is backed by multiple academic research articles and lab validations.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle className="h-5 w-5 text-pink-600 mt-0.5 flex-shrink-0" />
              <div>
                <span className="text-[10px] text-pink-600 font-bold uppercase tracking-wider block">PHENORA HYPOTHESIS</span>
                <p className="text-slate-600 text-xs mt-1">Unique PHENORA architecture currently undergoing engineering calibration and verification.</p>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

