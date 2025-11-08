import React from 'react';

interface AnalysisDisplayProps {
  text: string | null;
}

// Basic markdown to HTML for better readability
const formatText = (text: string) => {
  if (!text) return '';
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
    .replace(/\n/g, '<br />'); // Newlines
};

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ text }) => {
  if (!text) return null;
  
  const formattedHtml = formatText(text);

  return (
    <div
      className="text-gray-700 whitespace-normal font-sans text-sm leading-relaxed"
      dangerouslySetInnerHTML={{ __html: formattedHtml }}
    />
  );
};

export default AnalysisDisplay;