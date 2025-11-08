import React from 'react';

const questions = [
  "What biases (cultural, social, historical) might be reflected in the AI's analysis?",
  "What important context or nuance did the machine fail to 'see'?",
  "How could the AI's labels (e.g., 'protest' vs. 'gathering') influence a viewer's interpretation of this media?",
  "If you were a documentary filmmaker, how would you use or challenge this machine-generated analysis?",
  "Whose perspective is centered in this analysis? Whose is missing?",
];

const CriticalReflection: React.FC = () => {
  return (
    <div className="mt-8 pt-6 border-t-2 border-dashed border-gray-300">
      <h4 className="text-lg font-bold text-gray-900 mb-4 tracking-tight">
        Critical Reflection Prompts
      </h4>
      <ul className="space-y-3 list-disc list-inside text-gray-700">
        {questions.map((q, index) => (
          <li key={index} className="pl-2">{q}</li>
        ))}
      </ul>
    </div>
  );
};

export default CriticalReflection;
