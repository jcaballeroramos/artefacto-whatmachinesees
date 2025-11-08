import React from 'react';

interface LoaderProps {
    message?: string;
}

const Loader: React.FC<LoaderProps> = ({ message = "Analyzing, please wait..." }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 h-full">
      <div className="w-12 h-12 border-4 border-gray-600 border-dashed rounded-full animate-spin"></div>
      <p className="text-lg text-gray-600">{message}</p>
    </div>
  );
};

export default Loader;