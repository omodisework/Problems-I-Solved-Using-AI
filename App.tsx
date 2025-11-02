
import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { PromptInput } from './components/PromptInput';
import { IconButton } from './components/IconButton';
import { Loader } from './components/Loader';
import { generatePerfectPrompt, analyzePrompt } from './services/geminiService';
import { CopyIcon, SparklesIcon, BeakerIcon } from './components/Icons';

export default function App() {
  const [initialPrompt, setInitialPrompt] = useState<string>('');
  const [desiredOutcome, setDesiredOutcome] = useState<string>('');
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  const handleAnalyze = useCallback(async () => {
    if (!initialPrompt.trim()) {
      setError('Please enter a prompt to analyze.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysis('');
    setGeneratedPrompt(''); // Clear perfected prompt when re-analyzing

    try {
      const result = await analyzePrompt(initialPrompt, desiredOutcome);
      setAnalysis(result);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Failed to analyze prompt. ${errorMessage}`);
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  }, [initialPrompt, desiredOutcome]);


  const handleGenerate = useCallback(async () => {
    if (!initialPrompt.trim()) {
      setError('Please enter your initial prompt.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedPrompt('');
    setAnalysis(''); // Clear analysis when perfecting

    try {
      const result = await generatePerfectPrompt(initialPrompt, desiredOutcome);
      setGeneratedPrompt(result);
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setError(`Failed to generate prompt. ${errorMessage}`);
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [initialPrompt, desiredOutcome]);

  const handleCopy = useCallback(() => {
    if (!generatedPrompt) return;
    navigator.clipboard.writeText(generatedPrompt).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  }, [generatedPrompt]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 font-sans flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-3xl mx-auto">
        <Header />

        <main className="mt-8 space-y-8">
          <div className="bg-slate-800/50 rounded-xl p-6 shadow-lg border border-slate-700">
            <h2 className="text-xl font-semibold text-cyan-400 mb-4">1. Your Idea</h2>
            <div className="space-y-4">
              <PromptInput
                label="Your current prompt or idea"
                value={initialPrompt}
                onChange={(e) => setInitialPrompt(e.target.value)}
                placeholder="e.g., write a story about a cat"
                rows={4}
              />
              <PromptInput
                label="Desired outcome (optional)"
                value={desiredOutcome}
                onChange={(e) => setDesiredOutcome(e.target.value)}
                placeholder="e.g., a funny, short story for kids with a moral about sharing"
                rows={3}
              />
            </div>
            <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <button
                    onClick={handleAnalyze}
                    disabled={isLoading || isAnalyzing}
                    className="w-full flex items-center justify-center gap-2 bg-slate-600 hover:bg-slate-700 disabled:bg-slate-800 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-slate-500/50"
                >
                    {isAnalyzing ? (
                        <>
                            <Loader />
                            <span>Analyzing...</span>
                        </>
                    ) : (
                        <>
                            <BeakerIcon className="w-5 h-5" />
                            <span>Analyze Prompt</span>
                        </>
                    )}
                </button>
                <button
                    onClick={handleGenerate}
                    disabled={isLoading || isAnalyzing}
                    className="w-full flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-800 disabled:text-slate-400 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-cyan-300/50"
                >
                    {isLoading ? (
                        <>
                            <Loader />
                            <span>Perfecting...</span>
                        </>
                    ) : (
                        <>
                            <SparklesIcon className="w-5 h-5" />
                            <span>Perfect My Prompt</span>
                        </>
                    )}
                </button>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {(analysis || isAnalyzing) && (
            <div className="bg-slate-800/50 rounded-xl p-6 shadow-lg border border-slate-700">
                <h2 className="text-xl font-semibold text-amber-400 mb-4 flex items-center gap-2">
                    <BeakerIcon className="w-6 h-6" />
                    Prompt Analysis & Suggestions
                </h2>
                <div className="relative">
                    {isAnalyzing ? (
                        <div className="flex justify-center items-center h-32">
                            <Loader />
                        </div>
                    ) : (
                        <div className="text-slate-300 space-y-2 text-sm">
                            <ul className="list-disc pl-5 space-y-1">
                                {analysis.split('\n').filter(line => line.trim().startsWith('*') || line.trim().startsWith('-')).map((item, index) => (
                                    <li key={index}>{item.replace(/^\s*[-*]\s*/, '')}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
          )}

          {(generatedPrompt || isLoading) && (
            <div className="bg-slate-800/50 rounded-xl p-6 shadow-lg border border-slate-700">
              <h2 className="text-xl font-semibold text-green-400 mb-4">2. Perfected Prompt</h2>
              <div className="relative">
                {isLoading ? (
                  <div className="flex justify-center items-center h-48">
                     <Loader />
                  </div>
                ) : (
                  <>
                    <div className="absolute top-0 right-0">
                       <IconButton onClick={handleCopy}>
                          <CopyIcon className="w-5 h-5 mr-2" />
                          {isCopied ? 'Copied!' : 'Copy'}
                       </IconButton>
                    </div>
                    <pre className="whitespace-pre-wrap bg-slate-900/70 p-4 rounded-md font-mono text-slate-300 text-sm leading-relaxed overflow-x-auto">
                      <code>{generatedPrompt}</code>
                    </pre>
                  </>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
