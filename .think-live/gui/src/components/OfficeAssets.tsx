import React from 'react';

interface AssetProps {
  className?: string;
  color?: string;
}

// 1. Cozy Ergonomic Office Chair (Top-Down)
export const OfficeChair: React.FC<AssetProps> = ({ className, color = 'rgba(255, 255, 255, 0.15)' }) => (
  <svg viewBox="0 0 40 40" className={`w-8 h-8 ${className || ''}`} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Five-star base legs */}
    <path d="M20 20 L20 6 M20 20 L33 13 M20 20 L28 32 M20 20 L12 32 M20 20 L7 13" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="2" strokeLinecap="round" />
    <circle cx="20" cy="6" r="2" fill="rgba(255, 255, 255, 0.5)" />
    <circle cx="33" cy="13" r="2" fill="rgba(255, 255, 255, 0.5)" />
    <circle cx="28" cy="32" r="2" fill="rgba(255, 255, 255, 0.5)" />
    <circle cx="12" cy="32" r="2" fill="rgba(255, 255, 255, 0.5)" />
    <circle cx="7" cy="13" r="2" fill="rgba(255, 255, 255, 0.5)" />
    
    {/* Seat Cushion */}
    <rect x="8" y="10" width="24" height="20" rx="6" fill={color} stroke="rgba(255, 255, 255, 0.25)" strokeWidth="1.5" />
    {/* Armrests */}
    <rect x="5" y="14" width="3" height="12" rx="1.5" fill="rgba(255, 255, 255, 0.2)" />
    <rect x="32" y="14" width="3" height="12" rx="1.5" fill="rgba(255, 255, 255, 0.2)" />
    {/* Backrest */}
    <path d="M11 31 C11 28, 29 28, 29 31" stroke="rgba(255, 255, 255, 0.35)" strokeWidth="3" strokeLinecap="round" />
    <rect x="12" y="30" width="16" height="3" rx="1.5" fill={color} />
  </svg>
);

// 2. Standard Developer Desk (Top-Down)
export const ComputerDesk: React.FC<AssetProps> = ({ className }) => (
  <svg viewBox="0 0 100 50" className={`w-20 h-10 ${className || ''}`} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Table surface */}
    <rect x="2" y="2" width="96" height="46" rx="4" fill="rgba(255, 255, 255, 0.03)" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1.5" />
    {/* Cable grommet hole */}
    <circle cx="85" cy="10" r="2.5" fill="rgba(0, 0, 0, 0.4)" stroke="rgba(255, 255, 255, 0.1)" />
    {/* Desk pad/mat */}
    <rect x="15" y="12" width="60" height="32" rx="2" fill="rgba(255, 255, 255, 0.05)" stroke="rgba(255, 255, 255, 0.05)" />
  </svg>
);

// 3. Ergonomic Keyboard and Mouse Combo
export const KeyboardMouse: React.FC<AssetProps> = ({ className }) => (
  <svg viewBox="0 0 40 15" className={`w-8 h-3 ${className || ''}`} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Keyboard */}
    <rect x="1" y="2" width="24" height="10" rx="1.5" fill="rgba(255, 255, 255, 0.08)" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" />
    {/* Spacebar outline */}
    <rect x="7" y="9" width="12" height="1.5" rx="0.5" fill="rgba(255, 255, 255, 0.3)" />
    {/* Mouse */}
    <rect x="30" y="3" width="5" height="8" rx="2" fill="rgba(255, 255, 255, 0.15)" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" />
    <line x1="32.5" y1="3" x2="32.5" y2="7" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="0.5" />
  </svg>
);

// 4. Glowing Computer Monitor
export const GlowMonitor: React.FC<AssetProps & { monitorColor?: string; screenType?: 'code' | 'chart' | 'wireframe' }> = ({ 
  className, 
  monitorColor = '#3b82f6', 
  screenType = 'code' 
}) => (
  <svg viewBox="0 0 60 16" className={`w-12 h-4 ${className || ''}`} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Monitor stand base */}
    <rect x="22" y="10" width="16" height="4" rx="1" fill="rgba(255, 255, 255, 0.1)" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="0.75" />
    {/* Screen frame (rotated/angled view representation) */}
    <rect x="2" y="1" width="56" height="6" rx="1.5" fill="rgba(0, 0, 0, 0.85)" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1.2" />
    {/* Glowing Screen display */}
    <rect x="3.5" y="2.2" width="53" height="3.6" rx="0.5" fill={`${monitorColor}1c`} className="animate-screen-glow" />
    
    {/* Screen contents */}
    {screenType === 'code' && (
      <>
        {/* Code lines */}
        <line x1="6" y1="3.2" x2="16" y2="3.2" stroke={monitorColor} strokeWidth="1.2" opacity="0.8" />
        <line x1="6" y1="4.8" x2="22" y2="4.8" stroke={monitorColor} strokeWidth="1.2" opacity="0.6" />
        <line x1="26" y1="4.8" x2="36" y2="4.8" stroke={monitorColor} strokeWidth="1.2" opacity="0.5" />
        <line x1="19" y1="3.2" x2="32" y2="3.2" stroke={monitorColor} strokeWidth="1.2" opacity="0.8" />
        <line x1="35" y1="3.2" x2="48" y2="3.2" stroke={monitorColor} strokeWidth="1.2" opacity="0.4" />
      </>
    )}
    {screenType === 'chart' && (
      <>
        {/* Visual Line Graph / Bars */}
        <path d="M6 5.2 L14 3.5 L22 4.5 L32 2.8 L42 4.2 L52 3" stroke={monitorColor} strokeWidth="1" strokeLinecap="round" opacity="0.9" />
        <circle cx="32" cy="2.8" r="0.8" fill={monitorColor} />
      </>
    )}
    {screenType === 'wireframe' && (
      <>
        {/* UI wireframe blocks */}
        <rect x="6" y="2.8" width="8" height="2.4" rx="0.5" stroke={monitorColor} strokeWidth="0.8" opacity="0.7" />
        <rect x="18" y="2.8" width="12" height="2.4" rx="0.5" stroke={monitorColor} strokeWidth="0.8" opacity="0.7" />
        <rect x="34" y="2.8" width="20" height="2.4" rx="0.5" fill={`${monitorColor}44`} stroke={monitorColor} strokeWidth="0.8" opacity="0.9" />
      </>
    )}
  </svg>
);

// 5. Potted Monstera Office Plant (Top-Down)
export const OfficePlant: React.FC<AssetProps> = ({ className }) => (
  <svg viewBox="0 0 35 35" className={`w-8 h-8 ${className || ''}`} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Terra cotta clay pot */}
    <circle cx="17.5" cy="17.5" r="7.5" fill="#c084fc" opacity="0.1" />
    <circle cx="17.5" cy="17.5" r="6" fill="#7c2d12" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" />
    <circle cx="17.5" cy="17.5" r="4.5" fill="#451a03" />

    {/* Green monstera leaf blades overlapping */}
    <path d="M17.5 17 L25 11 C28 9, 26 5, 21 8 L17.5 15" fill="#10b981" opacity="0.85" />
    <path d="M17 17.5 L11 25 C9 28, 5 26, 8 21 L15 17.5" fill="#047857" opacity="0.9" />
    <path d="M17.5 18 L26 23 C29 25, 28 29, 22 27 L17.5 19.5" fill="#059669" opacity="0.8" />
    <path d="M17 17 L9 11 C7 8, 11 5, 14 9 L17 15.5" fill="#34d399" opacity="0.85" />
    <path d="M16 17 L17.5 7 C18.5 4, 21.5 5, 20.5 9 L17 16" fill="#059669" opacity="0.9" />
  </svg>
);

// 6. Collaborative whiteboard (Drafting Board)
export const Whiteboard: React.FC<AssetProps & { drawingColor?: string }> = ({ className, drawingColor = '#818cf8' }) => (
  <svg viewBox="0 0 100 20" className={`w-20 h-4 ${className || ''}`} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Frame legs base */}
    <line x1="8" y1="10" x2="92" y2="10" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1.5" />
    <line x1="8" y1="3" x2="8" y2="17" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="2" strokeLinecap="round" />
    <line x1="92" y1="3" x2="92" y2="17" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="2" strokeLinecap="round" />
    
    {/* Whiteboard surface */}
    <rect x="12" y="4" width="76" height="7" rx="1.5" fill="rgba(255, 255, 255, 0.9)" stroke="rgba(0, 0, 0, 0.8)" strokeWidth="1" />
    
    {/* Scribbles / flowcharts */}
    <path d="M16 7.5 L20 6.5 L26 8 M32 6.5 L36 6.5 C39 6.5, 39 8.5, 42 8.5 M48 7 L54 7 M60 6.5 L64 8.5 L68 6.5 L72 8.5" stroke={drawingColor} strokeWidth="1" strokeLinecap="round" opacity="0.8" />
    <circle cx="28" cy="7.5" r="1" fill="#ef4444" />
    <circle cx="44" cy="7.5" r="1.2" fill="#10b981" />
  </svg>
);

// 7. Architect Blueprint Drafting Table
export const BlueprintTable: React.FC<AssetProps> = ({ className }) => (
  <svg viewBox="0 0 70 45" className={`w-14 h-9 ${className || ''}`} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Table frame */}
    <rect x="2" y="2" width="66" height="41" rx="2" fill="rgba(255, 255, 255, 0.03)" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1.5" />
    {/* Blue blueprint paper overlay (slanted) */}
    <rect x="10" y="6" width="48" height="30" transform="rotate(-3 34 21)" fill="rgba(59, 130, 246, 0.25)" stroke="rgba(59, 130, 246, 0.8)" strokeWidth="1" />
    {/* Blueprint drafting grids */}
    <line x1="16" y1="12" x2="52" y2="10" stroke="rgba(59, 130, 246, 0.4)" strokeWidth="0.75" />
    <line x1="14" y1="20" x2="54" y2="18" stroke="rgba(59, 130, 246, 0.4)" strokeWidth="0.75" />
    <line x1="18" y1="30" x2="48" y2="28" stroke="rgba(59, 130, 246, 0.4)" strokeWidth="0.75" />
    {/* Draft drawings (boxes, annotations) */}
    <rect x="22" y="14" width="12" height="12" fill="none" stroke="rgba(255, 255, 255, 0.6)" strokeWidth="1.2" />
    <circle cx="44" cy="22" r="6" stroke="rgba(255, 255, 255, 0.6)" strokeWidth="1" />
    {/* Ruler / T-Square overlay */}
    <line x1="8" y1="12" x2="58" y2="34" stroke="rgba(245, 158, 11, 0.8)" strokeWidth="2.5" />
  </svg>
);

// 8. Server Rack/Cabinet (Top-Down server bay)
export const ServerRack: React.FC<AssetProps & { isActive?: boolean }> = ({ className, isActive = true }) => (
  <svg viewBox="0 0 50 60" className={`w-12 h-14 ${className || ''}`} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Cabinet outline */}
    <rect x="2" y="2" width="46" height="56" rx="4" fill="rgba(15, 23, 42, 0.9)" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1.5" />
    {/* Heat ventilation mesh pattern */}
    <rect x="6" y="6" width="38" height="48" rx="2" fill="rgba(255, 255, 255, 0.02)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1" />
    
    {/* Internal Server Blades */}
    {Array.from({ length: 6 }).map((_, i) => (
      <g key={i} transform={`translate(8, ${9 + i * 8})`}>
        {/* Server tray slot */}
        <rect x="0" y="0" width="34" height="5" rx="1" fill="rgba(0, 0, 0, 0.7)" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="0.5" />
        {/* Tiny ventilation slits */}
        <line x1="3" y1="2.5" x2="16" y2="2.5" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" strokeDasharray="1.5 1" />
        {/* Blinking status LEDs */}
        <circle cx="22" cy="2.5" r="0.75" fill="#10b981" opacity={isActive ? 0.9 : 0.2} />
        <circle cx="26" cy="2.5" r="0.75" fill={isActive && i % 2 === 0 ? '#ef4444' : '#6b7280'} className={isActive && i % 2 === 0 ? "animate-blink" : ""} />
        <circle cx="30" cy="2.5" r="0.75" fill={isActive && i % 3 === 0 ? '#3b82f6' : '#6b7280'} className={isActive && i % 3 === 0 ? "animate-blink" : ""} />
      </g>
    ))}
  </svg>
);

// 9. Modern Lounge Sofa/Couch (Lobby / Starter)
export const LoungeSofa: React.FC<AssetProps> = ({ className, color = 'rgba(255, 255, 255, 0.08)' }) => (
  <svg viewBox="0 0 80 40" className={`w-16 h-8 ${className || ''}`} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Base frame */}
    <rect x="2" y="2" width="76" height="36" rx="4" fill={color} stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1.5" />
    
    {/* Seat cushions */}
    <rect x="8" y="10" width="20" height="24" rx="2" fill="rgba(255, 255, 255, 0.05)" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />
    <rect x="30" y="10" width="20" height="24" rx="2" fill="rgba(255, 255, 255, 0.05)" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />
    <rect x="52" y="10" width="20" height="24" rx="2" fill="rgba(255, 255, 255, 0.05)" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />
    
    {/* Left Armrest */}
    <rect x="2" y="6" width="6" height="32" rx="2" fill="rgba(255, 255, 255, 0.12)" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="0.5" />
    {/* Right Armrest */}
    <rect x="72" y="6" width="6" height="32" rx="2" fill="rgba(255, 255, 255, 0.12)" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="0.5" />
    {/* Backrest cushion panel */}
    <rect x="8" y="2" width="64" height="6" rx="2" fill="rgba(255, 255, 255, 0.15)" />
  </svg>
);

// 10. Water Cooler & Coffee Station
export const CoffeeStation: React.FC<AssetProps> = ({ className }) => (
  <svg viewBox="0 0 45 45" className={`w-9 h-9 ${className || ''}`} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Cabinet counter */}
    <rect x="2" y="2" width="41" height="41" rx="3" fill="rgba(255, 255, 255, 0.03)" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1.5" />
    
    {/* Espresso Machine (Left side) */}
    <rect x="6" y="8" width="14" height="20" rx="2" fill="rgba(0, 0, 0, 0.6)" stroke="rgba(255, 255, 255, 0.2)" strokeWidth="1" />
    <circle cx="13" cy="18" r="3" fill="rgba(255, 255, 255, 0.1)" />
    {/* Glowing power dot */}
    <circle cx="10" cy="12" r="0.75" fill="#ef4444" />
    {/* Drip tray */}
    <rect x="8" y="24" width="10" height="2" rx="0.5" fill="rgba(255, 255, 255, 0.4)" />
    
    {/* Stack of cups (Middle/Right) */}
    <circle cx="30" cy="12" r="2.5" fill="#ec4899" opacity="0.8" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="0.75" />
    <circle cx="36" cy="16" r="2.5" fill="#3b82f6" opacity="0.8" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="0.75" />
    <circle cx="32" cy="22" r="2.5" fill="#f59e0b" opacity="0.8" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="0.75" />
  </svg>
);

// 11. Courier Cargo boxes / Git Shipping stack
export const DeliveryBoxes: React.FC<AssetProps> = ({ className }) => (
  <svg viewBox="0 0 60 50" className={`w-12 h-10 ${className || ''}`} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Large bottom crate */}
    <rect x="4" y="16" width="28" height="28" rx="2" fill="rgba(217, 119, 6, 0.15)" stroke="rgba(217, 119, 6, 0.7)" strokeWidth="1.2" />
    {/* Tape strip */}
    <rect x="4" y="28" width="28" height="4" fill="rgba(217, 119, 6, 0.4)" />
    
    {/* Medium stacked crate (rotated slightly) */}
    <rect x="26" y="8" width="24" height="24" transform="rotate(8 38 20)" fill="rgba(217, 119, 6, 0.12)" stroke="rgba(217, 119, 6, 0.6)" strokeWidth="1.2" />
    {/* Tape strip */}
    <rect x="36" y="8" width="4" height="24" transform="rotate(8 38 20)" fill="rgba(217, 119, 6, 0.3)" />

    {/* Small top crate */}
    <rect x="12" y="2" width="16" height="16" fill="rgba(217, 119, 6, 0.1)" stroke="rgba(217, 119, 6, 0.5)" strokeWidth="1" />
    <rect x="18" y="2" width="4" height="16" fill="rgba(217, 119, 6, 0.25)" />
  </svg>
);

// 12. Security Vault Cabinet (PR & Safety)
export const SecurityVault: React.FC<AssetProps> = ({ className }) => (
  <svg viewBox="0 0 45 45" className={`w-9 h-9 ${className || ''}`} fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Safe Body */}
    <rect x="4" y="4" width="37" height="37" rx="3" fill="rgba(15, 23, 42, 0.95)" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="2" />
    {/* Safe door panel */}
    <rect x="8" y="8" width="29" height="29" rx="1.5" fill="none" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1.5" />
    
    {/* Combination Lock Dial */}
    <circle cx="22.5" cy="22.5" r="7.5" fill="rgba(255, 255, 255, 0.05)" stroke="rgba(255, 255, 255, 0.35)" strokeWidth="1.5" />
    <circle cx="22.5" cy="22.5" r="3.5" fill="rgba(255, 255, 255, 0.2)" />
    {/* Indicator notch */}
    <line x1="22.5" y1="15" x2="22.5" y2="18" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" />
    
    {/* Steel handle pin bar */}
    <rect x="10" y="20.5" width="4" height="4" rx="0.5" fill="rgba(255, 255, 255, 0.4)" />
    <line x1="12" y1="20" x2="12" y2="25" stroke="rgba(255, 255, 255, 0.5)" strokeWidth="1" />
  </svg>
);
