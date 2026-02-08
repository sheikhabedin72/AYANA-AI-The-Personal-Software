
import React from 'react';
import { 
  SandpackProvider, 
  SandpackLayout, 
  SandpackPreview, 
  SandpackCodeEditor,
  SandpackFileExplorer
} from "@codesandbox/sandpack-react";
import { Maximize2, RefreshCw, Terminal, Play, Share2, Rocket } from 'lucide-react';

interface PreviewFrameProps {
  files: Record<string, string>;
  loading: boolean;
  onShip?: () => void;
  isShipping?: boolean;
}

export const PreviewFrame: React.FC<PreviewFrameProps> = ({ files, loading, onShip, isShipping }) => {
  return (
    <div className="h-full flex flex-col bg-white overflow-hidden relative">
      <header className="h-14 border-b border-gray-200 bg-white flex items-center justify-between px-6 shrink-0 z-40">
        <div className="flex gap-4 h-full">
          <button className="text-sm font-semibold border-b-2 border-indigo-600 px-2 py-1 h-full flex items-center gap-2 text-indigo-600">
            <Play size={14} /> Preview
          </button>
          <button className="text-sm font-medium text-gray-400 px-2 py-1 h-full flex items-center gap-2 hover:text-gray-900 transition-colors">
            <Terminal size={14} /> Console
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-[10px] font-bold text-gray-500 flex items-center gap-1.5 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-all uppercase tracking-wider">
            <Share2 size={12} /> Share
          </button>
          <button 
            onClick={onShip}
            disabled={isShipping}
            className="text-[10px] font-bold text-white bg-indigo-600 px-4 py-1.5 rounded-lg hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-100 disabled:opacity-50 uppercase tracking-wider flex items-center gap-2"
          >
            {isShipping ? <RefreshCw size={12} className="animate-spin" /> : <Rocket size={12} />}
            Deploy
          </button>
        </div>
      </header>

      <div className="flex-1 relative z-10">
        <SandpackProvider
          template="react-ts"
          theme="light"
          files={files}
          customSetup={{
            dependencies: {
              "lucide-react": "latest",
              "framer-motion": "latest",
              "clsx": "latest",
              "tailwind-merge": "latest"
            }
          }}
          options={{
            externalResources: ["https://cdn.tailwindcss.com"]
          }}
          className="h-full"
        >
          <SandpackLayout className="h-full border-none rounded-none">
            <SandpackFileExplorer className="h-full bg-gray-50/50 border-r border-gray-200" />
            <div className="flex-1 flex flex-col min-w-0">
               <SandpackPreview 
                showNavigator={false} 
                showOpenInCodeSandbox={false}
                className="h-[60%] border-b border-gray-200 bg-white"
              />
              <div className="flex-1 overflow-hidden">
                <SandpackCodeEditor 
                  showTabs 
                  showLineNumbers 
                  className="h-full"
                />
              </div>
            </div>
          </SandpackLayout>
        </SandpackProvider>

        {loading && (
          <div className="absolute inset-0 z-50 bg-white/60 backdrop-blur-[1px] pointer-events-none flex items-center justify-center">
            <div className="flex items-center gap-3 px-6 py-3 bg-white border border-indigo-100 rounded-2xl shadow-xl shadow-indigo-100/50 animate-in fade-in zoom-in-95 duration-300">
               <div className="w-4 h-4 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
               <span className="text-[11px] font-bold text-indigo-900 uppercase tracking-widest">AYANA Engineering in progress...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
