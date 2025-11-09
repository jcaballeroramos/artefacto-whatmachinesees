import React from 'react';

interface AnalysisDisplayProps {
  text: string | null;
}

const formatText = (text: string): string => {
  if (!text) return '';

  const lines = text.split('\n');
  let html = '';
  let inList = false;
  let listType = '';

  const closeList = () => {
    if (inList) {
      html += listType === 'ul' ? '</ul>' : '</ol>';
      inList = false;
    }
  };

  lines.forEach(line => {
    // Trim the line to handle potential leading spaces
    const trimmedLine = line.trim();

    // Unordered list
    if (trimmedLine.startsWith('* ')) {
      if (!inList || listType !== 'ul') {
        closeList();
        html += '<ul class="list-disc list-inside space-y-1 my-2 pl-4">';
        inList = true;
        listType = 'ul';
      }
      html += `<li>${trimmedLine.substring(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>`;
      return;
    }
    
    // Ordered list
    if (trimmedLine.match(/^\d+\.\s/)) {
        if (!inList || listType !== 'ol') {
            closeList();
            html += '<ol class="list-decimal list-inside space-y-1 my-2 pl-4">';
            inList = true;
            listType = 'ol';
        }
        html += `<li>${trimmedLine.replace(/^\d+\.\s/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</li>`;
        return;
    }

    // If we encounter a non-list item, close the current list
    closeList();

    // Headers
    if (trimmedLine.startsWith('### ')) {
      html += `<h4 class="text-md font-semibold mt-2 mb-1">${trimmedLine.substring(4)}</h4>`;
    } else if (trimmedLine.startsWith('## ')) {
      html += `<h3 class="text-lg font-semibold mt-3 mb-1">${trimmedLine.substring(3)}</h3>`;
    } else if (trimmedLine.startsWith('# ')) {
      html += `<h2 class="text-xl font-semibold mt-4 mb-2">${trimmedLine.substring(2)}</h2>`;
    } else if (trimmedLine) { // Only add non-empty lines as paragraphs
      // Regular paragraph, handle bold
      html += `<p class="my-2">${trimmedLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>`;
    }
  });

  // Close any open list at the end of the text
  closeList();
  
  return html;
};


const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ text }) => {
  if (!text) return null;
  
  const formattedHtml = formatText(text);

  return (
    <div
      className="text-gray-700 whitespace-normal font-sans text-sm leading-relaxed prose prose-sm max-w-none"
      dangerouslySetInnerHTML={{ __html: formattedHtml }}
    />
  );
};

export default AnalysisDisplay;