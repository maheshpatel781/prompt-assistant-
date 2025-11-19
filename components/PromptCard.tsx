import React, { useState } from 'react';
import { Copy, Check, Sparkles, Bot, FileText, List, AlertCircle } from 'lucide-react';
import { GeneratedPromptPart } from '../types';

interface PromptCardProps {
  data: GeneratedPromptPart;
  analysis: string;
  isVague: boolean;
  questions: string[];
}

const PromptCard: React.FC<PromptCardProps> = ({ data, analysis, isVague, questions }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(data.full_text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full space-y-6 animate-fade-in">
      {/* Analysis Section */}
      <div className="glass-panel rounded-xl p-6 border-l-4 border-indigo-500">
        <div className="flex items-start gap-3">
            <Bot className="w-6 h-6 text-indigo-400 mt-1" />
            <div>
                <h3 className="text-lg font-semibold text-indigo-100 mb-2">Expert Analysis</h3>
                <p className="text-slate-300 leading-relaxed">{analysis}</p>
            </div>
        </div>
        
        {isVague && questions.length > 0 && (
            <div className="mt-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
                <div className="flex items-center gap-2 text-yellow-400 mb-2 font-medium">
                    <AlertCircle className="w-4 h-4" />
                    <span>To make this even better, consider:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-300 text-sm ml-1">
                    {questions.map((q, i) => (
                        <li key={i}>{q}</li>
                    ))}
                </ul>
            </div>
        )}
      </div>

      {/* The Generated Prompt */}
      <div className="glass-panel rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-white" />
            <h2 className="text-white font-bold tracking-wide">READY-TO-USE PROMPT</h2>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-md transition-all text-sm font-medium backdrop-blur-sm border border-white/20"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied!' : 'Copy Code'}
          </button>
        </div>

        <div className="p-6 space-y-6 bg-slate-900/50">
            {/* Structured Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                    <div className="flex items-center gap-2 text-purple-400 mb-2 font-mono text-xs uppercase tracking-wider">
                        <Bot className="w-4 h-4" /> Persona
                    </div>
                    <p className="text-slate-200 text-sm">{data.persona}</p>
                </div>
                 <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                    <div className="flex items-center gap-2 text-purple-400 mb-2 font-mono text-xs uppercase tracking-wider">
                        <List className="w-4 h-4" /> Format
                    </div>
                    <p className="text-slate-200 text-sm">{data.format}</p>
                </div>
            </div>

            <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                 <div className="flex items-center gap-2 text-purple-400 mb-2 font-mono text-xs uppercase tracking-wider">
                    <FileText className="w-4 h-4" /> Task & Constraints
                </div>
                <div className="text-slate-300 text-sm space-y-2">
                    <p><span className="text-slate-500 font-semibold">Task:</span> {data.task}</p>
                    <p><span className="text-slate-500 font-semibold">Constraints:</span> {data.constraints}</p>
                </div>
            </div>

          {/* Full Code Block */}
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg opacity-30 group-hover:opacity-50 transition duration-1000 blur"></div>
            <div className="relative bg-slate-950 rounded-lg p-4 font-mono text-sm text-slate-300 overflow-x-auto border border-slate-800">
              <pre className="whitespace-pre-wrap break-words">{data.full_text}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptCard;