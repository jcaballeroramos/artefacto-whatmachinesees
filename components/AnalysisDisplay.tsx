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
  
  const processLineContent = (content: string) => {
    // Process bolding and other inline formatting
    return content.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>');
  };

  lines.forEach(line => {
    const trimmedLine = line.trim();

    // Heuristic for main section headers based on prompts (e.g., **1. Title**)
    if (trimmedLine.startsWith('**') && trimmedLine.endsWith('**')) {
        closeList();
        const content = trimmedLine.substring(2, trimmedLine.length - 2);
        if (content.match(/^\d+\./)) {
             html += `<h3 class="text-lg font-bold text-gray-900 mt-8 mb-4 pb-2 border-b border-gray-200">${processLineContent(content)}</h3>`;
        } else {
             html += `<h4 class="text-md font-semibold text-gray-800 mt-6 mb-2">${processLineContent(content)}</h4>`;
        }
        return;
    }

    // Unordered list items
    if (trimmedLine.startsWith('* ')) {
      if (!inList || listType !== 'ul') {
        closeList();
        html += '<ul class="list-disc space-y-2 my-4 pl-6">';
        inList = true;
        listType = 'ul';
      }
      // Handle nested descriptions within a list item, like "* Title: description"
      const content = trimmedLine.substring(2);
      const parts = content.split(':');
      // A heuristic to bold the title part of a list item, e.g., "* Material signature: ..."
      if (parts.length > 1 && parts[0].length < 50) { // check length to avoid mis-formatting long sentences with colons
          html += `<li class="pl-1"><strong class="font-semibold text-gray-800">${processLineContent(parts[0])}:</strong> ${processLineContent(parts.slice(1).join(':'))}</li>`;
      } else {
          html += `<li class="pl-1">${processLineContent(content)}</li>`;
      }
      return;
    }
    
    // Ordered list items
    if (trimmedLine.match(/^\d+\.\s/)) {
        if (!inList || listType !== 'ol') {
            closeList();
            html += '<ol class="list-decimal space-y-2 my-4 pl-6">';
            inList = true;
            listType = 'ol';
        }
        html += `<li class="pl-1">${processLineContent(trimmedLine.replace(/^\d+\.\s/, ''))}</li>`;
        return;
    }

    // Current list is ending
    closeList();

    // Standard markdown headers
    if (trimmedLine.startsWith('### ')) {
      html += `<h4 class="text-md font-semibold mt-6 mb-2">${processLineContent(trimmedLine.substring(4))}</h4>`;
    } else if (trimmedLine.startsWith('## ')) {
      html += `<h3 class="text-lg font-semibold mt-8 mb-4">${processLineContent(trimmedLine.substring(3))}</h3>`;
    } else if (trimmedLine.startsWith('# ')) {
      html += `<h2 class="text-xl font-bold mt-10 mb-5">${processLineContent(trimmedLine.substring(2))}</h2>`;
    } else if (trimmedLine) { 
      // Regular paragraph
      html += `<p class="my-4 leading-relaxed">${processLineContent(trimmedLine)}</p>`;
    }
  });

  // Close any open list at the end
  closeList();
  
  return html;
};


const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ text }) => {
  if (!text) return null;
  
  const formattedHtml = formatText(text);

  return (
    <div
      className="text-gray-700 whitespace-normal font-sans text-sm"
      dangerouslySetInnerHTML={{ __html: formattedHtml }}
    />
  );
};

export default AnalysisDisplay;