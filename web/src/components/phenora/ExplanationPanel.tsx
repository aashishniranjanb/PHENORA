import React from 'react';

interface ExplanationPanelProps {
  explanations: string[];
}

export const ExplanationPanel: React.FC<ExplanationPanelProps> = ({ explanations }) => {
  return (
    <div className="flex flex-col font-mono text-xs">
      <div className="text-gray-400 mb-2 uppercase tracking-wide border-b border-gray-100 pb-1">
        Why this assessment?
      </div>
      <ul className="space-y-1">
        {explanations.map((exp, idx) => (
          <li 
            key={idx} 
            className={`${
              exp.startsWith('✓') ? 'text-green-700' : 
              exp.startsWith('△') ? 'text-yellow-700' : 
              exp.startsWith('❌') ? 'text-red-700' : 'text-gray-600'
            }`}
          >
            {exp}
          </li>
        ))}
      </ul>
    </div>
  );
};
