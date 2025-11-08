import React from 'react';

interface TabButtonProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ label, isActive, onClick }) => {
  const baseClasses = "pb-3 text-base font-medium focus:outline-none transition-colors duration-300";
  const activeClasses = "text-black border-b-2 border-black";
  const inactiveClasses = "text-gray-500 hover:text-black";

  return (
    <button onClick={onClick} className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}>
      {label}
    </button>
  );
};

export default TabButton;