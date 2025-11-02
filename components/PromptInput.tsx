
import React from 'react';

interface PromptInputProps {
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  rows?: number;
}

export const PromptInput: React.FC<PromptInputProps> = ({ label, value, onChange, placeholder, rows = 3 }) => {
  return (
    <div>
      <label htmlFor={label} className="block text-sm font-medium text-slate-300 mb-2">
        {label}
      </label>
      <textarea
        id={label}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className="w-full bg-slate-800 border border-slate-700 rounded-lg p-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition duration-200"
      />
    </div>
  );
};
