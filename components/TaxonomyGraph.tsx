import React from 'react';
import { TAXONOMY } from '../services/taxonomy';
import TaxonomyNode from './TaxonomyNode';

const TaxonomyGraph: React.FC = () => {
  const taxonomyEntries = Object.entries(TAXONOMY);
  return (
    <div className="bg-gray-50/80 border border-gray-200 p-4 sm:p-6 rounded-lg">
      <h3 className="text-2xl font-bold text-gray-800 mb-4 border-b border-gray-200 pb-3">Milliere Media Taxonomy Explorer</h3>
      <ul className="space-y-0">
        {taxonomyEntries.map(([name, node], index) => (
          <TaxonomyNode 
            key={name} 
            name={name} 
            node={node as object} 
            level={0} 
            isLast={index === taxonomyEntries.length - 1}
          />
        ))}
      </ul>
    </div>
  );
};

export default TaxonomyGraph;