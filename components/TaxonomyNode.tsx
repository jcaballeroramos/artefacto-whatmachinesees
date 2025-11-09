import React, { useState } from 'react';

interface TaxonomyNodeProps {
  name: string;
  node: any;
  level: number;
  isLast: boolean;
}

const TaxonomyNode: React.FC<TaxonomyNodeProps> = ({ name, node, level, isLast }) => {
  const [isOpen, setIsOpen] = useState(level < 2); 

  const hasSubcategories = node.subcategories && Object.keys(node.subcategories).length > 0;
  const isExpandable = hasSubcategories || node.description || node.example;
  
  const isFrequentUse = name.toLowerCase().includes('frequent_uses');
  const isExampleItem = /^\d+$/.test(name);

  const toggleOpen = () => {
    if (isExpandable) {
      setIsOpen(!isOpen);
    }
  };

  const nodeName = name.replace(/_/g, ' ');

  if (isExampleItem) {
    return (
      <li className="relative pl-6">
        {/* Vertical connector line */}
        <div className={`absolute top-0 left-0 h-full w-0.5 bg-gray-300 ${isLast ? 'h-7' : ''}`}></div>
        {/* Horizontal connector line */}
        <div className="absolute top-7 left-0 h-0.5 w-6 bg-gray-300"></div>
        
        <div className="relative mt-4 ml-4 bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-lg transition-shadow group">
          <div className="flex items-center mb-2">
            <span className="flex-shrink-0 bg-gray-700 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
              {name}
            </span>
            <h5 className="ml-3 font-semibold text-gray-800">Example Case</h5>
          </div>
          <p className="text-sm text-gray-600 mb-3">{node.description}</p>
          {node.link && (
            <a 
              href={node.link} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 group-hover:underline"
            >
              View Source
              <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
            </a>
          )}
        </div>
      </li>
    );
  }

  return (
    <li className="relative">
      {/* Vertical connector line for children */}
      {hasSubcategories && !isLast && <div className="absolute top-14 left-0 h-[calc(100%-3.5rem)] w-0.5 bg-gray-300"></div>}
      
      {/* Node Card */}
      <div className={`flex items-start ${level > 0 ? 'pl-6' : ''}`}>
        {level > 0 && (
          <>
            <div className={`absolute top-0 left-0 h-full w-0.5 bg-gray-300 ${isLast ? 'h-7' : ''}`}></div>
            <div className="absolute top-7 left-0 h-0.5 w-6 bg-gray-300"></div>
          </>
        )}
        
        <div className="flex-grow mt-4 ml-4">
          <div 
            className={`shadow-sm rounded-lg border ${isFrequentUse ? 'bg-blue-50 border-blue-300' : 'bg-white border-gray-300'} ${isExpandable ? 'cursor-pointer' : ''}`}
            onClick={toggleOpen}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleOpen()}
            aria-expanded={isOpen}
          >
            {/* Header */}
            <div className="flex items-center p-3">
              {hasSubcategories && (
                <span className={`mr-2 text-gray-600 transition-transform transform ${isOpen ? 'rotate-90' : 'rotate-0'}`}>
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
                </span>
              )}
              <h4 className={`font-bold capitalize ${isFrequentUse ? 'text-blue-800' : 'text-gray-900'} ${level === 0 ? 'text-xl' : 'text-base'}`}>
                {nodeName}
              </h4>
            </div>

            {/* Expanded Content */}
            {isOpen && (node.description || node.example) && (
              <div className="px-4 pb-3 pt-1 border-t border-gray-200">
                {node.description && (
                  <p className="text-sm text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: node.description.replace(/\n/g, '<br />') }} />
                )}
                {node.example && (
                  <div className="mt-3 flex items-start bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md p-3">
                    <span className="text-lg mr-2">💡</span>
                    <div>
                        <strong className="font-semibold text-sm">Example</strong>
                        <p className="text-sm mt-1">{node.example}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Children nodes */}
      {isOpen && hasSubcategories && (
        <ul className={`relative ${level > 0 ? 'pl-6' : ''}`}>
          {Object.entries(node.subcategories).map(([subName, subNode], index, arr) => (
            <TaxonomyNode key={subName} name={subName} node={subNode} level={level + 1} isLast={index === arr.length - 1} />
          ))}
        </ul>
      )}
    </li>
  );
};

export default TaxonomyNode;