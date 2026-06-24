import React from 'react';
import * as Assets from './OfficeAssets';

export interface RoomConfig {
  id: string;
  name: string;
  code: string;
  colorVar: string;
  description: string;
  floorColor: string;
}

interface DepartmentRoomProps {
  config: RoomConfig;
  isActive: boolean;
  onClick?: () => void;
}

export const DepartmentRoom: React.FC<DepartmentRoomProps> = ({ config, isActive, onClick }) => {
  // Render specific layout of furniture/objects for each department room
  const renderRoomFurniture = () => {
    const colorHex = `var(--color-${config.colorVar})`;

    switch (config.id) {
      case 'starter': // Lobby / Reception
        return (
          <div className="absolute inset-0 flex flex-col justify-between items-center p-3 mt-5">
            {/* Reception Lounge Area */}
            <div className="flex w-full justify-around items-center">
              <Assets.LoungeSofa color="rgba(100, 116, 139, 0.15)" />
            </div>
            {/* Coffee corner & reception plant */}
            <div className="flex justify-between items-end w-full px-2">
              <Assets.CoffeeStation />
              <Assets.OfficePlant />
            </div>
          </div>
        );

      case 'architect': // Architectural Drawing Room
        return (
          <div className="absolute inset-0 flex flex-col justify-around items-center p-3 mt-5">
            {/* Whiteboard with system drawings */}
            <Assets.Whiteboard drawingColor="#3b82f6" />
            {/* Drafting blueprint desk */}
            <div className="flex gap-2 items-center">
              <Assets.BlueprintTable />
              <Assets.OfficeChair color="rgba(59, 130, 246, 0.2)" />
            </div>
          </div>
        );

      case 'task_distributor': // Operations / Sorting Office
        return (
          <div className="absolute inset-0 flex flex-col justify-between items-center p-3 mt-5">
            {/* Whiteboard */}
            <Assets.Whiteboard drawingColor="#a855f7" />
            
            <div className="flex w-full justify-around items-center">
              {/* Operations Desk */}
              <div className="relative">
                <Assets.ComputerDesk />
                <Assets.GlowMonitor className="absolute top-1 left-4" monitorColor="rgba(168, 85, 247, 1)" screenType="chart" />
                <Assets.KeyboardMouse className="absolute bottom-2 left-6" />
              </div>
              <Assets.OfficeChair color="rgba(168, 85, 247, 0.2)" className="rotate-180" />
            </div>
          </div>
        );

      case 'ui_designer': // Creative Studio
        return (
          <div className="absolute inset-0 flex flex-col justify-between items-center p-3 mt-5">
            {/* Plant in corner */}
            <div className="absolute top-6 right-2">
              <Assets.OfficePlant />
            </div>
            {/* Creative design desk */}
            <div className="flex flex-col items-center gap-1 mt-2">
              <div className="relative">
                <Assets.ComputerDesk />
                <Assets.GlowMonitor className="absolute top-1 left-4" monitorColor="rgba(236, 72, 153, 1)" screenType="wireframe" />
                <Assets.KeyboardMouse className="absolute bottom-2 left-6" />
              </div>
              <Assets.OfficeChair color="rgba(236, 72, 153, 0.2)" />
            </div>
          </div>
        );

      case 'pr_safety': // Private Glass Cabin
        return (
          <div className="absolute inset-0 flex flex-col justify-around items-center p-3 mt-5">
            {/* Vault lockbox */}
            <Assets.SecurityVault />
            {/* Standard verification desk */}
            <div className="flex gap-2 items-center">
              <Assets.OfficeChair color="rgba(245, 158, 11, 0.2)" className="rotate-90" />
              <div className="relative">
                <Assets.ComputerDesk className="w-16" />
                <Assets.GlowMonitor className="absolute top-1 left-2 w-10" monitorColor="rgba(245, 158, 11, 1)" screenType="chart" />
              </div>
            </div>
          </div>
        );

      case 'coder': // Developer Bay
        return (
          <div className="absolute inset-0 flex flex-col justify-between items-center p-2 mt-5">
            {/* Shared coding whiteboard */}
            <Assets.Whiteboard drawingColor="#10b981" />
            
            {/* Dual workstation setups */}
            <div className="flex w-full justify-around gap-1 mb-1">
              <div className="flex flex-col items-center">
                <div className="relative">
                  <Assets.ComputerDesk className="w-16 h-8" />
                  <Assets.GlowMonitor className="absolute top-1 left-2 w-10" monitorColor="rgba(16, 185, 129, 1)" screenType="code" />
                </div>
                <Assets.OfficeChair color="rgba(16, 185, 129, 0.15)" className="w-6 h-6" />
              </div>
              <div className="flex flex-col items-center">
                <div className="relative">
                  <Assets.ComputerDesk className="w-16 h-8" />
                  <Assets.GlowMonitor className="absolute top-1 left-2 w-10" monitorColor="rgba(16, 185, 129, 1)" screenType="code" />
                </div>
                <Assets.OfficeChair color="rgba(16, 185, 129, 0.15)" className="w-6 h-6" />
              </div>
            </div>
          </div>
        );

      case 'auditor': // Inspection Lab
        return (
          <div className="absolute inset-0 flex flex-col justify-between items-center p-3 mt-5">
            <Assets.Whiteboard drawingColor="#ef4444" />
            <div className="flex w-full justify-around items-center">
              <Assets.OfficeChair color="rgba(239, 68, 68, 0.2)" />
              <div className="relative">
                <Assets.ComputerDesk />
                <Assets.GlowMonitor className="absolute top-1 left-4" monitorColor="rgba(239, 68, 68, 1)" screenType="chart" />
                <Assets.KeyboardMouse className="absolute bottom-2 left-6" />
              </div>
            </div>
          </div>
        );

      case 'git_guy': // Shipping & Hosting server room
        return (
          <div className="absolute inset-0 flex justify-between items-center p-3 mt-5">
            {/* Heavy-duty server racks */}
            <Assets.ServerRack isActive={isActive} />
            {/* Delivery/Git commit crates */}
            <Assets.DeliveryBoxes />
          </div>
        );

      default:
        return null;
    }
  };

  const glowHSL = `var(--color-${config.colorVar})`;

  return (
    <div
      onClick={onClick}
      className={`relative glass-panel overflow-hidden transition-all duration-500 cursor-pointer select-none group
        ${isActive 
          ? 'scale-[1.01] border-opacity-90 shadow-lg' 
          : 'border-opacity-30 hover:border-opacity-50 hover:bg-[rgba(255,255,255,0.01)]'
        }
      `}
      style={{
        borderColor: isActive ? `hsla(${glowHSL}, 0.8)` : 'rgba(255, 255, 255, 0.08)',
        boxShadow: isActive ? `0 0 25px -5px hsla(${glowHSL}, 0.25), inset 0 0 15px -3px hsla(${glowHSL}, 0.12)` : 'none',
      }}
    >
      {/* Dynamic floor pattern grid overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.04] transition-all duration-300"
        style={{
          backgroundColor: config.floorColor,
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)',
          backgroundSize: '12px 12px',
        }}
      />
      
      {/* Active Room Glow Underlay */}
      {isActive && (
        <div 
          className="absolute -inset-10 opacity-30 blur-2xl transition-all duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(circle, hsla(${glowHSL}, 0.2) 0%, transparent 70%)`
          }}
        />
      )}

      {/* Header bar containing label & code ID */}
      <div 
        className="absolute top-0 inset-x-0 h-7 flex justify-between items-center px-3 border-b border-opacity-5 transition-all duration-300"
        style={{
          borderBottomColor: isActive ? `hsla(${glowHSL}, 0.3)` : 'rgba(255, 255, 255, 0.05)',
          background: isActive ? `linear-gradient(90deg, hsla(${glowHSL}, 0.06) 0%, transparent 100%)` : 'rgba(0, 0, 0, 0.2)'
        }}
      >
        <span 
          className="text-[10px] font-bold tracking-widest uppercase transition-all duration-300"
          style={{ color: isActive ? `hsla(${glowHSL}, 0.95)` : 'var(--text-secondary)' }}
        >
          {config.code}
        </span>
        <span className="text-[11px] font-semibold text-gray-300 group-hover:text-white transition-all duration-300">
          {config.name}
        </span>
        <div 
          className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${isActive ? 'animate-pulse' : 'opacity-40'}`}
          style={{ backgroundColor: `hsla(${glowHSL}, 1)` }}
        />
      </div>

      {/* Desk furnishings */}
      {renderRoomFurniture()}
    </div>
  );
};
