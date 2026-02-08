
import React from 'react';
import { Sparkles, History, Code2, Settings, HelpCircle, Layers } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const items = [
    { icon: History, label: 'History' },
    { icon: Layers, label: 'Projects' },
    { icon: Code2, label: 'Snippets', active: true },
    { icon: Settings, label: 'Settings' },
  ];

  return (
    <aside className="w-16 border-r border-gray-200 flex flex-col items-center py-6 gap-8 bg-gray-50/50 shrink-0 z-50">
      <div className="p-2.5 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-100 transform transition-transform hover:scale-110 cursor-pointer">
        <Sparkles className="w-6 h-6 text-white" />
      </div>
      
      <div className="flex flex-col gap-6 flex-1">
        {items.map((item, idx) => (
          <div key={idx} className="group relative flex justify-center">
            <item.icon 
              className={`w-5 h-5 cursor-pointer transition-colors ${
                item.active ? 'text-indigo-600' : 'text-gray-400 hover:text-indigo-600'
              }`} 
            />
            <div className="absolute left-14 px-2 py-1 bg-gray-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
              {item.label}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-auto">
        <HelpCircle className="w-5 h-5 text-gray-400 hover:text-indigo-600 cursor-pointer transition-colors" />
      </div>
    </aside>
  );
};
