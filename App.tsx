import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Send, 
  History, 
  Wand2, 
  Trash2, 
  ChevronRight, 
  Cpu, 
  Zap, 
  MessageSquare
} from 'lucide-react';
import { generateExpertPrompt } from './services/geminiService';
import { PromptAnalysisResponse, LoadingState, HistoryItem } from './types';
import PromptCard from './components/PromptCard';

const App: React.FC = () => {
  const [input, setInput] = useState('');
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [currentResult, setCurrentResult] = useState<PromptAnalysisResponse | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const endOfListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem('promptAssistantHistory');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  const saveHistory = (newItem: HistoryItem) => {
    const updatedHistory = [newItem, ...history].slice(0, 20); // Keep last 20
    setHistory(updatedHistory);
    localStorage.setItem('promptAssistantHistory', JSON.stringify(updatedHistory));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('promptAssistantHistory');
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loadingState !== LoadingState.IDLE) return;

    setLoadingState(LoadingState.ANALYZING);
    setCurrentResult(null);

    try {
      // Simulate a slight "Analysis" phase for UX
      setTimeout(async () => {
        setLoadingState(LoadingState.GENERATING);
        try {
            const result = await generateExpertPrompt(input);
            setCurrentResult(result);
            setLoadingState(LoadingState.COMPLETE);
            
            saveHistory({
                id: crypto.randomUUID(),
                originalInput: input,
                result: result,
                timestamp: Date.now()
            });
        } catch (err) {
            console.error(err);
            setLoadingState(LoadingState.ERROR);
        }
      }, 800);
    } catch (error) {
      console.error(error);
      setLoadingState(LoadingState.ERROR);
    }
  };

  const loadHistoryItem = (item: HistoryItem) => {
    setInput(item.originalInput);
    setCurrentResult(item.result);
    setLoadingState(LoadingState.COMPLETE);
    setShowHistory(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const examples = [
    "I need an email to my boss asking for a raise.",
    "Write a blog post about sustainable gardening.",
    "Generate a python script to scrape a website.",
    "Create a catchy slogan for a coffee shop."
  ];

  return (
    <div className="min-h-screen bg-darker text-slate-200 relative overflow-x-hidden selection:bg-indigo-500/30">
      {/* Background Gradients */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-indigo-900/20 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[60%] bg-purple-900/10 rounded-full blur-[100px]"></div>
      </div>

      {/* Navigation Bar */}
      <nav className="glass-panel sticky top-0 z-50 border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Wand2 className="w-5 h-5 text-white" />
            </div>
            <h1 className="font-bold text-xl tracking-tight text-white">Prompt <span className="text-indigo-400">Assistant</span></h1>
          </div>
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className={`p-2 rounded-lg transition-colors ${showHistory ? 'bg-indigo-500/20 text-indigo-300' : 'hover:bg-white/5 text-slate-400'}`}
          >
            <History className="w-5 h-5" />
          </button>
        </div>
      </nav>

      <div className="relative max-w-5xl mx-auto flex">
        
        {/* Main Content */}
        <main className={`flex-1 px-4 py-8 transition-all duration-300 ${showHistory ? 'lg:mr-80' : ''}`}>
          
          {/* Hero Section (Visible when no result) */}
          {!currentResult && loadingState === LoadingState.IDLE && (
            <div className="text-center mt-10 mb-12 space-y-4 animate-fade-in">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/50 border border-indigo-500/20 text-indigo-300 text-xs font-medium mb-4">
                    <Sparkles className="w-3 h-3" /> Powered by Gemini 2.5 Flash
                </div>
              <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-indigo-400 pb-2">
                Master the Art of Prompting
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto text-lg">
                Transform vague ideas into world-class, highly optimized prompts for ChatGPT, Claude, and Gemini.
              </p>
            </div>
          )}

          {/* Input Section */}
          <div className={`w-full max-w-3xl mx-auto transition-all duration-500 ${currentResult ? 'mb-8' : 'mb-20'}`}>
            <form onSubmit={handleSubmit} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl opacity-30 group-hover:opacity-70 transition duration-500 blur"></div>
                <div className="relative flex items-start gap-2 bg-slate-900 rounded-2xl p-2 border border-white/10 shadow-2xl">
                    <div className="flex-1">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSubmit();
                                }
                            }}
                            placeholder="Describe your task... (e.g. 'Write a polite email declining a wedding invitation')"
                            className="w-full bg-transparent text-white placeholder-slate-500 p-3 focus:outline-none resize-none min-h-[80px] max-h-[200px]"
                            rows={3}
                        />
                         {/* Quick Example Chips */}
                        {!currentResult && input.length === 0 && (
                            <div className="hidden md:flex flex-wrap gap-2 p-2 mt-2">
                                {examples.map((ex, i) => (
                                    <button 
                                        key={i}
                                        type="button"
                                        onClick={() => setInput(ex)}
                                        className="text-xs px-3 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-indigo-300 border border-slate-700 transition-colors"
                                    >
                                        {ex}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <button 
                        type="submit" 
                        disabled={!input.trim() || loadingState !== LoadingState.IDLE}
                        className="p-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-xl transition-all self-end mb-1 mr-1 shadow-lg shadow-indigo-900/20"
                    >
                        {loadingState !== LoadingState.IDLE ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <Send className="w-5 h-5" />
                        )}
                    </button>
                </div>
            </form>
          </div>

          {/* Loading State Visuals */}
          {loadingState !== LoadingState.IDLE && loadingState !== LoadingState.COMPLETE && loadingState !== LoadingState.ERROR && (
             <div className="max-w-3xl mx-auto py-10">
                 <div className="flex flex-col items-center justify-center gap-6">
                    <div className="relative w-20 h-20">
                         <div className="absolute inset-0 border-4 border-indigo-500/20 rounded-full"></div>
                         <div className="absolute inset-0 border-4 border-t-indigo-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                         <div className="absolute inset-0 flex items-center justify-center">
                             <Cpu className="w-8 h-8 text-indigo-400 animate-pulse" />
                         </div>
                    </div>
                    <div className="space-y-2 text-center">
                        <h3 className="text-xl font-semibold text-white">
                            {loadingState === LoadingState.ANALYZING ? 'Analyzing Request...' : 'Optimizing Prompt...'}
                        </h3>
                        <p className="text-slate-400 text-sm">
                            {loadingState === LoadingState.ANALYZING 
                                ? "Identifying persona, constraints, and missing context." 
                                : "Structuring output for maximum LLM performance."}
                        </p>
                    </div>
                 </div>
             </div>
          )}
          
          {/* Error State */}
          {loadingState === LoadingState.ERROR && (
              <div className="max-w-3xl mx-auto p-6 glass-panel border-red-500/30 rounded-xl text-center">
                  <div className="text-red-400 font-semibold mb-2">Something went wrong.</div>
                  <p className="text-slate-400 text-sm mb-4">Please check your API key or try again.</p>
                  <button onClick={() => setLoadingState(LoadingState.IDLE)} className="text-indigo-400 hover:underline text-sm">Try Again</button>
              </div>
          )}

          {/* Result Display */}
          {currentResult && loadingState === LoadingState.COMPLETE && (
            <div className="max-w-3xl mx-auto pb-20">
                <PromptCard 
                    data={currentResult.generated_prompt} 
                    analysis={currentResult.analysis}
                    isVague={currentResult.is_vague}
                    questions={currentResult.clarification_questions}
                />
                
                <div className="mt-8 flex justify-center">
                    <button 
                        onClick={() => {
                            setCurrentResult(null);
                            setInput('');
                            setLoadingState(LoadingState.IDLE);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors"
                    >
                        <MessageSquare className="w-4 h-4" /> Create Another Prompt
                    </button>
                </div>
            </div>
          )}
          
          <div ref={endOfListRef} />
        </main>

        {/* History Sidebar (Desktop Slide-over / Mobile Modal style) */}
        <aside className={`
            fixed lg:absolute inset-y-0 right-0 w-80 bg-slate-900/95 backdrop-blur-xl border-l border-white/5 transform transition-transform duration-300 z-40
            ${showHistory ? 'translate-x-0' : 'translate-x-full'}
        `}>
            <div className="h-full flex flex-col">
                <div className="p-4 border-b border-white/5 flex items-center justify-between">
                    <h3 className="font-semibold text-white flex items-center gap-2">
                        <History className="w-4 h-4 text-indigo-400" /> History
                    </h3>
                    {history.length > 0 && (
                        <button onClick={clearHistory} className="p-1 text-slate-500 hover:text-red-400 transition-colors" title="Clear History">
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {history.length === 0 ? (
                        <div className="text-center text-slate-600 py-10 text-sm">
                            No generated prompts yet.
                        </div>
                    ) : (
                        history.map((item) => (
                            <button 
                                key={item.id}
                                onClick={() => loadHistoryItem(item)}
                                className="w-full text-left p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 transition-all group"
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-xs text-indigo-400 font-mono">
                                        {new Date(item.timestamp).toLocaleDateString()}
                                    </span>
                                    <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-white transition-colors" />
                                </div>
                                <p className="text-sm text-slate-300 line-clamp-2 font-medium">
                                    {item.originalInput}
                                </p>
                                <div className="mt-2 flex items-center gap-2">
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-500 uppercase tracking-wider">
                                        {item.result.generated_prompt.persona.split(' ').slice(0, 2).join(' ')}
                                    </span>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </div>
        </aside>
        
        {/* Overlay for mobile history */}
        {showHistory && (
            <div 
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
                onClick={() => setShowHistory(false)}
            />
        )}

      </div>
    </div>
  );
};

export default App;