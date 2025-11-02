
import React from 'react';
import { MagicWandIcon } from './Icons';

export const Header: React.FC = () => {
  return (
    <header className="text-center">
      <div className="inline-flex items-center justify-center gap-3">
        <MagicWandIcon className="w-10 h-10 text-cyan-400" />
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-500">
          AI Prompt Perfector
        </h1>
      </div>
      <p className="mt-4 text-lg text-slate-400 max-w-2xl mx-auto">
        Transform your simple ideas into powerful, detailed prompts that get the results you want from any AI.
      </p>
    </header>
  );
};
