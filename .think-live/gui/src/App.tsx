import React from 'react';
import { OfficeMap } from './components/OfficeMap';

const App: React.FC = () => {
  return (
    <div className="flex flex-col w-screen h-screen px-6 py-4 overflow-hidden relative bg-[#060911]">
      {/* Decorative background ambient lighting bubbles */}
      <div className="absolute top-[-10%] left-[20%] w-[350px] h-[350px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[10%] w-[450px] h-[450px] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

      {/* 1. Header Navigation Bar */}
      <header className="flex justify-between items-center border-b border-gray-900/60 pb-3.5 mb-5 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600/90 to-purple-600/90 flex items-center justify-center font-bold text-white text-xl shadow-lg shadow-blue-500/10">
            🏢
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-100 tracking-tight">think.live</h1>
            <p className="text-[10px] text-gray-500 tracking-widest uppercase font-bold">Agentic Office Manager</p>
          </div>
        </div>

        {/* Dashboard Status Metadata */}
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest">Workspace Path</span>
            <span className="text-xs text-gray-400 font-mono mt-0.5">/home/shlok/Projects/think.live</span>
          </div>
          
          <div className="h-8 w-[1px] bg-gray-900/80 hidden sm:block" />
          
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-[#0e172a]/60 border border-gray-800/80">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs text-gray-300 font-semibold tracking-wide">Agency Operational</span>
          </div>
        </div>
      </header>

      {/* 2. Main Floor Plan Layout */}
      <main className="flex-1 relative z-10">
        <OfficeMap />
      </main>
    </div>
  );
};

export default App;
