import React, { useState } from 'react';
import { DepartmentRoom, RoomConfig } from './DepartmentRoom';

// The 8 departments of the think.live Agency
const DEPARTMENTS: RoomConfig[] = [
  {
    id: 'starter',
    code: 'C.1',
    name: 'Starter Lobby',
    colorVar: 'starter',
    description: 'Initial brainstorming desk. Proposes high-level architecture, outlines folder structures, lists user requirements, and suggests tech stacks.',
    floorColor: 'rgba(148, 163, 184, 0.15)'
  },
  {
    id: 'architect',
    code: 'C.2',
    name: 'Architect Studio',
    colorVar: 'architect',
    description: 'Detailed system modeling cabin. Refines data schemas, designs APIs, defines database models, and ensures modular decoupled configurations.',
    floorColor: 'rgba(59, 130, 246, 0.15)'
  },
  {
    id: 'task_distributor',
    code: 'C.3',
    name: 'Task Distributor',
    colorVar: 'task-distributor',
    description: 'Granular planning board. Takes the approved architecture and breaks it down into small, single-focus, actionable task backlogs.',
    floorColor: 'rgba(168, 85, 247, 0.15)'
  },
  {
    id: 'ui_designer',
    code: 'A.1',
    name: 'UI Designer Studio',
    colorVar: 'ui-designer',
    description: 'Creative design zone. Handles HTML mockups, container designs, color systems, glassmorphism templates, and styling specs.',
    floorColor: 'rgba(236, 72, 153, 0.15)'
  },
  {
    id: 'pr_safety',
    code: 'A.2',
    name: 'PR & Safety Cabin',
    colorVar: 'pr-safety',
    description: 'Content moderation and security desk. Audits visual specs, safety gates, and text copies for absolute clarity and system integrity.',
    floorColor: 'rgba(245, 158, 11, 0.15)'
  },
  {
    id: 'coder',
    code: 'B.1',
    name: 'Coder Workspace',
    colorVar: 'coder',
    description: 'Development department. Writes core logic, connects databases, builds API endpoints, integrates libraries, and fixes bugs.',
    floorColor: 'rgba(16, 185, 129, 0.15)'
  },
  {
    id: 'auditor',
    code: 'D',
    name: 'Auditor Bench',
    colorVar: 'auditor',
    description: 'Inspection and verification board. Verifies features against task requirements, generates tests, drafts release logs, and compiles commit summaries.',
    floorColor: 'rgba(239, 68, 68, 0.15)'
  },
  {
    id: 'git_guy',
    code: 'B.2',
    name: 'Git Guy Server',
    colorVar: 'git-guy',
    description: 'Deployment and distribution dock. Creates target git branches, manages solution commits, coordinates PR requests, and runs releases.',
    floorColor: 'rgba(6, 182, 212, 0.15)'
  }
];

export const OfficeMap: React.FC = () => {
  // Mock active state. Users can click rooms to simulate the agent moving!
  const [activeDept, setActiveDept] = useState<string>('starter');

  const selectedDept = DEPARTMENTS.find(d => d.id === activeDept) || DEPARTMENTS[0];
  const activeColorHSL = `var(--color-${selectedDept.colorVar})`;

  return (
    <div className="flex flex-col xl:flex-row gap-6 w-full h-[calc(100vh-140px)] select-none">
      {/* 1. Left Side: The Office Grid Plan */}
      <div className="flex-[3] flex flex-col justify-between h-full bg-[#0a0f1d] border border-gray-800 rounded-2xl p-5 relative overflow-hidden">
        {/* Ambient layout guide lines */}
        <div className="absolute top-0 bottom-0 left-1/4 w-[1px] bg-blue-500/5 pointer-events-none" />
        <div className="absolute top-0 bottom-0 left-2/4 w-[1px] bg-blue-500/5 pointer-events-none" />
        <div className="absolute top-0 bottom-0 left-3/4 w-[1px] bg-blue-500/5 pointer-events-none" />
        <div className="absolute left-0 right-0 top-1/2 h-[1px] bg-blue-500/5 pointer-events-none" />

        {/* Inner Building Map Grid */}
        <div className="grid grid-cols-4 grid-rows-2 gap-5 w-full h-full min-h-[400px]">
          {DEPARTMENTS.map(dept => (
            <DepartmentRoom
              key={dept.id}
              config={dept}
              isActive={dept.id === activeDept}
              onClick={() => setActiveDept(dept.id)}
            />
          ))}
        </div>

        {/* Interactive simulation helper info */}
        <div className="flex justify-between items-center text-[11px] text-gray-500 mt-4 border-t border-gray-900 pt-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            <span>Interactive Blueprint Map View (Click rooms to simulate transitions)</span>
          </div>
          <span>Floor Plan Scale: 1:24</span>
        </div>
      </div>

      {/* 2. Right Side: Command Panel Details */}
      <div className="flex-1 min-w-[320px] flex flex-col justify-between h-full glass-panel p-5 border-gray-800/80">
        
        {/* Department Info Header */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div>
              <span 
                className="text-xs font-bold uppercase tracking-wider transition-all duration-300"
                style={{ color: `hsla(${activeColorHSL}, 1)` }}
              >
                Department Details
              </span>
              <h2 className="text-2xl font-bold text-gray-100 tracking-tight mt-1">{selectedDept.name}</h2>
            </div>
            <div 
              className="text-xs px-2.5 py-1 rounded-md font-bold transition-all duration-300 border border-opacity-20"
              style={{ 
                backgroundColor: `hsla(${activeColorHSL}, 0.1)`, 
                color: `hsla(${activeColorHSL}, 1)`,
                borderColor: `hsla(${activeColorHSL}, 0.3)`
              }}
            >
              {selectedDept.code}
            </div>
          </div>

          <p className="text-sm text-gray-400 leading-relaxed min-h-[60px]">
            {selectedDept.description}
          </p>

          <div className="border-t border-gray-800/80 pt-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Operating Target</h3>
            <div className="flex items-center gap-3 bg-black/40 border border-gray-800/60 rounded-lg p-2.5">
              <div 
                className="w-8 h-8 rounded flex items-center justify-center font-bold text-sm"
                style={{ backgroundColor: `hsla(${activeColorHSL}, 0.08)`, color: `hsla(${activeColorHSL}, 0.95)` }}
              >
                📄
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-gray-500 uppercase tracking-wider">Instructions File</span>
                <code className="text-xs text-gray-300">.think-live/departments/...</code>
              </div>
            </div>
          </div>
        </div>

        {/* Live Terminal Log / Status console */}
        <div className="flex flex-col border-t border-gray-800/80 pt-4 mt-6">
          <div className="flex justify-between items-center mb-2.5">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Office Log</span>
            <span className="text-[10px] text-green-400 px-1.5 py-0.5 rounded bg-green-500/10 font-bold border border-green-500/20 animate-pulse">
              LIVE ONLINE
            </span>
          </div>
          
          <div className="bg-[#050811]/90 border border-gray-900 rounded-lg p-3 h-44 overflow-y-auto font-mono text-[11px] leading-relaxed text-gray-400 shadow-inner">
            <div className="text-blue-400/90">&gt; think.live Office Server online.</div>
            <div className="text-gray-500">2026-06-24T18:00:00Z - Initialization sequence started.</div>
            <div className="text-gray-500">2026-06-24T18:00:01Z - Loading floor layout configs...</div>
            <div className="text-emerald-500/90">&gt; Floor layout generated: 8 rooms fully configured.</div>
            <div className="text-gray-500 mt-2">2026-06-24T18:30:00Z - Simulated agent standing by.</div>
            <div className="text-purple-400 mt-1">🔄 [Transition] Adopting persona: {selectedDept.name} ({selectedDept.code})</div>
            <div className="text-gray-400/95 ml-2">Reading configuration instructions...</div>
            <div className="text-[#f59e0b] ml-2">Waiting for file state events...</div>
          </div>
        </div>

      </div>
    </div>
  );
};
