import React from 'react';
import { CheckCircle2, Rocket, Layout, Sparkles, Zap, Award, ShieldCheck, X } from 'lucide-react';

interface SuccessOverlayProps {
  onClose: () => void;
  onShip: () => void;
  moduleCount: number;
  appName: string;
}

export const SuccessOverlay: React.FC<SuccessOverlayProps> = ({ onClose, onShip, moduleCount, appName }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in duration-500">
      <div className="absolute inset-0 bg-white/80 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative w-full max-w-xl bg-white border border-gray-200 rounded-[2rem] shadow-[0_20px_70px_-10px_rgba(0,0,0,0.1)] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 transition-colors z-20"
        >
          <X size={20} />
        </button>

        <div className="p-10 flex flex-col items-center text-center space-y-6 relative z-10">
          <div className="relative">
            <div className="w-20 h-20 bg-indigo-50 rounded-3xl flex items-center justify-center shadow-sm">
              <ShieldCheck size={40} className="text-indigo-600" />
            </div>
            <Sparkles className="absolute -top-2 -right-2 text-indigo-400 animate-pulse" size={20} />
          </div>

          <div className="space-y-2">
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-black tracking-[0.3em] text-indigo-600 uppercase mb-1">Production Verified</span>
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                Software Forge Complete
              </h2>
            </div>
            <p className="text-gray-500 text-sm max-w-xs mx-auto leading-relaxed">
              AYANA AI has successfully engineered <span className="font-semibold text-gray-900">"{appName || 'Your Project'}"</span>.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
            <div className="p-3 bg-gray-50 rounded-xl flex flex-col items-center border border-gray-100">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Modules</span>
              <span className="text-lg font-bold text-gray-900">{moduleCount}</span>
            </div>
            <div className="p-3 bg-gray-50 rounded-xl flex flex-col items-center border border-gray-100">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Quality</span>
              <span className="text-lg font-bold text-indigo-600">A+</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full pt-2">
            <button
              onClick={() => {
                onClose();
                onShip();
              }}
              className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-indigo-100 transition-all transform active:scale-95 flex items-center justify-center gap-2"
            >
              <Rocket size={16} />
              Deploy to Production
            </button>
            <button
              onClick={onClose}
              className="w-full px-6 py-4 bg-white border border-gray-200 rounded-xl text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-gray-900 hover:border-gray-300 transition-all"
            >
              Back to Studio
            </button>
          </div>

          <div className="pt-2">
             <span className="text-[9px] font-medium text-gray-300 uppercase tracking-widest">Build ID: AY-{(new Date().getTime().toString().slice(-6))}</span>
          </div>
        </div>
      </div>
    </div>
  );
};