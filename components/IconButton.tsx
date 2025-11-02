
import React from 'react';

interface IconButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

export const IconButton: React.FC<IconButtonProps> = ({ onClick, children }) => {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center px-3 py-1.5 border border-slate-600 text-sm font-medium rounded-md text-slate-300 bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-cyan-500 transition-colors"
    >
      {children}
    </button>
  );
};
