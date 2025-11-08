import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-3xl font-bold text-center text-gray-900 tracking-tight">
          ARTEFACTO - What does a machine see?
        </h1>
      </div>
    </header>
  );
};

export default Header;