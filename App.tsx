import React, { useState, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { PreviewFrame } from './components/PreviewFrame';
import { SuccessOverlay } from './components/SuccessOverlay';
import { runArchitectAgent, runDeveloperAgentStream } from './services/geminiService';
import { deployToGithub } from './actions/deploy';
import { GenerationState } from './types';
import { 
  Sparkles, 
  Send, 
  Rocket, 
  Trash2,
  Cpu,
  History,
  Layout,
  MessageSquare,
  Activity,
  Zap,
  Loader2
} from 'lucide-react';

const INITIAL_CODE = {
  "/App.tsx": `import React from 'react';
import { Sparkles } from 'lucide-react';

export default function App() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50/50 p-6">
      <div className="max-w-md w-full bg-white p-12 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/50 text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="inline-flex p-4 bg-indigo-50 rounded-3xl">
          <Sparkles className="w-10 h-10 text-indigo-600 animate-pulse" />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">AYANA Studio</h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            Personal Software Factory <br/>
            <span className="text-indigo-600 font-bold uppercase tracking-widest text-[10px]">Ready for generation</span>
          </p>
        </div>
      </div>
    </div>
  );
}`,
};

const PERSONA_PRESETS = [
  { name: 'Jensen AI', prompt: 'Build an interactive chat app for a Jensen Huang AI persona. Include an NVIDIA stock ticker and leather-jacket themed UI.' },
  { name: 'Altman OS', prompt: 'Build a minimalist Sam Altman style productivity dashboard with focus timers and AI agent status.' },
  { name: 'Fintech X', prompt: 'Build a high-performance crypto dashboard with live charts, portfolio breakdowns, and glassmorphic UI.' },
];

const App: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isShipping, setIsShipping] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [state, setState] = useState<GenerationState>({
    status: 'idle',
    files: INITIAL_CODE,
    structure: [],
    currentTask: '',
  });

  const handleBuild = useCallback(async () => {
    if (!prompt.trim()) return;

    setShowSuccess(false);
    setState(prev => ({ 
      ...prev, 
      status: 'architecting', 
      currentTask: 'Constructing Blueprint...',
      structure: []
    }));

    try {
      const structure = await runArchitectAgent(prompt);
      setState(prev => ({ 
        ...prev, 
        structure, 
        status: 'developing',
        currentTask: `Forging ${structure.length} Modules...`
      }));

      let contextStr = "";
      for (const file of structure) {
        const sandpackPath = file.path.startsWith('/') ? file.path : `/${file.path}`;
        setState(prev => ({ ...prev, currentTask: `Engineering ${file.path}...` }));

        const finalCode = await runDeveloperAgentStream(
          prompt, 
          file, 
          contextStr,
          (currentStreamedCode) => {
            setState(prev => ({
              ...prev,
              files: { ...prev.files, [sandpackPath]: currentStreamedCode }
            }));
          }
        );
        
        contextStr += `\n--- MODULE: ${file.path} ---\n${finalCode.substring(0, 300)}`;
      }

      setState(prev => ({ 
        ...prev, 
        status: 'completed', 
        currentTask: 'Generation Complete' 
      }));
      setShowSuccess(true);
    } catch (err: any) {
      console.error(err);
      setState(prev => ({ 
        ...prev, 
        status: 'error', 
        error: err.message,
        currentTask: 'System Error' 
      }));
    }
  }, [prompt]);

  const handleShip = async () => {
    const codeToShip = state.files["/App.tsx"];
    if (!codeToShip) return;

    const appName = prompt.split(' ').slice(0, 3).join('-').replace(/[^a-zA-Z0-9-]/g, '') || "AYANA-App";
    setIsShipping(true);
    
    try {
      const result = await deployToGithub(appName, codeToShip);
      if (result.success) {
        alert(`🚀 Successfully shipped to GitHub!\nURL: ${result.url}`);
        window.open(result.url, '_blank');
      } else {
        alert(`❌ Deployment Failed: ${result.error}`);
      }
    } catch (err: any) {
      alert(`❌ Deployment Error: ${err.message}`);
    } finally {
      setIsShipping(false);
    }
  };

  return (
    <div className="h-screen w-full flex bg-white text-slate-900 font-sans overflow-hidden">
      {/* 1. NARROW SIDEBAR */}
      <Sidebar />

      {/* 2. CHAT / PROMPT PANEL */}
      <section className="w-[380px] border-r border-gray-200 flex flex-col bg-white shrink-0 z-30 shadow-[10px_0_30px_-15px_rgba(0,0,0,0.03)]">
        <header className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Ayana Studio</h2>
            {state.status !== 'idle' && (
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
                <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest">{state.status}</span>
              </div>
            )}
          </div>
          <p className="text-xl font-bold text-gray-900 tracking-tight">New Project</p>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
          <div className="bg-indigo-50/50 p-5 rounded-3xl text-[13px] text-indigo-900 leading-relaxed border border-indigo-100/30">
            Hello! I am <span className="font-bold">AYANA AI</span>. Describe the application you want to build, and I will handle the engineering.
          </div>

          <div className="space-y-3">
            <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 px-1">
              <Zap size={12} className="text-indigo-600" /> Presets
            </div>
            <div className="grid grid-cols-1 gap-2">
              {PERSONA_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => setPrompt(preset.prompt)}
                  className="w-full text-left px-4 py-3 bg-white border border-gray-100 rounded-xl text-xs font-semibold text-gray-600 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all shadow-sm"
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>

          {state.status !== 'idle' && (
            <div className="space-y-4 animate-in slide-in-from-top-2 duration-500">
               <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 px-1">
                  <Activity size={12} className="text-emerald-500" /> Factory Status
               </div>
               <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <p className="text-[10px] font-mono text-gray-500 leading-none mb-3 uppercase font-bold tracking-widest">{state.currentTask}</p>
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-600 transition-all duration-700 ease-out" 
                      style={{ width: state.status === 'completed' ? '100%' : state.status === 'developing' ? '70%' : '30%' }}
                    />
                  </div>
               </div>
            </div>
          )}

          {state.error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-[11px] text-red-600 font-medium animate-bounce">
              {state.error}
            </div>
          )}
        </div>

        {/* PROMPT INPUT */}
        <div className="p-6 border-t border-gray-100 bg-gray-50/30">
          <div className="relative group">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="How can AYANA help you today?"
              className="w-full bg-white border border-gray-200 rounded-2xl p-5 pr-14 text-sm focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all resize-none h-40 shadow-sm placeholder:text-gray-300 leading-relaxed font-medium"
            />
            <button
              onClick={handleBuild}
              disabled={state.status === 'architecting' || state.status === 'developing' || !prompt.trim()}
              className="absolute bottom-5 right-5 p-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-20 shadow-lg shadow-indigo-100 transition-all transform active:scale-95 z-20"
            >
              {state.status === 'developing' || state.status === 'architecting' ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Rocket size={18} className="fill-current" />
              )}
            </button>
            <button 
              onClick={() => { setPrompt(''); setState(p => ({...p, status: 'idle', currentTask: '', files: INITIAL_CODE})); }}
              className="absolute top-5 right-5 p-1.5 text-gray-300 hover:text-red-400 transition-colors"
              title="Reset Workspace"
            >
              <Trash2 size={14} />
            </button>
          </div>
          <p className="text-[9px] text-gray-400 mt-4 text-center uppercase tracking-[0.2em] font-black">
            Powered by AYANA AI Engine v2.4
          </p>
        </div>
      </section>

      {/* 3. MAIN WORKSPACE */}
      <section className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
        <PreviewFrame 
          files={state.files} 
          loading={state.status === 'architecting'} 
          onShip={handleShip}
          isShipping={isShipping}
        />
      </section>

      {/* Celebration Overlay */}
      {showSuccess && (
        <SuccessOverlay 
          onClose={() => setShowSuccess(false)}
          onShip={handleShip}
          moduleCount={state.structure.length}
          appName={prompt.split(' ').slice(0, 3).join(' ')}
        />
      )}
    </div>
  );
};

export default App;