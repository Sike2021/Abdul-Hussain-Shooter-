import React from 'react';
import { X, Shield, Globe, Users, Flame, Skull, Check, Play, Crosshair } from 'lucide-react';
import { GameMode } from '../types';

interface ModeSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
}

export const ModeSelectModal: React.FC<ModeSelectModalProps> = ({
  isOpen,
  onClose,
  selectedMode,
  onSelectMode,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-[#0e131b] border border-white/10 rounded-2xl p-5 shadow-2xl flex flex-col gap-4 text-white">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#00f0ff]/15 border border-[#00f0ff]/40 flex items-center justify-center text-[#00f0ff]">
              <Crosshair className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-wide uppercase">
                TACTICAL MISSION SELECTION
              </h3>
              <p className="text-xs text-[#8e9bb0]">
                Choose combat theater • 2v2 Safehouse vs 20x Open World Erangel
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-[#8e9bb0] hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Option 1: 2v2 CQB Safehouse */}
          <button
            onClick={() => {
              onSelectMode('2v2_cqb');
              onClose();
            }}
            className={`flex flex-col text-left p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
              selectedMode === '2v2_cqb'
                ? 'bg-gradient-to-b from-[#00f0ff]/15 to-transparent border-[#00f0ff] shadow-[0_0_20px_rgba(0,240,255,0.2)]'
                : 'bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.05]'
            }`}
          >
            <div className="flex items-center justify-between w-full mb-3">
              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40 uppercase tracking-wider">
                COMPETITIVE 2v2
              </span>
              {selectedMode === '2v2_cqb' && (
                <div className="w-6 h-6 rounded-full bg-[#00f0ff] text-black flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}
            </div>

            <div className="w-full h-24 rounded-xl mb-3 bg-[#131823] overflow-hidden border border-white/10 relative">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCQ1U77pA2_HZZd9gXnB7i-pC2G_k2Y96h2i4dF7Gq90_YIeP4zXh01W"
                alt="Safehouse CQB"
                className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e131b] via-transparent to-transparent" />
              <div className="absolute bottom-2 left-2 flex items-center gap-1.5 text-[10px] font-mono text-[#00f0ff]">
                <Shield className="w-3 h-3" />
                <span>INDOOR SAFEHOUSE • 800x600</span>
              </div>
            </div>

            <h4 className="font-black text-base text-white tracking-wide uppercase">
              2v2 CQB SAFEHOUSE
            </h4>
            <p className="text-xs text-[#8e9bb0] mt-1 line-clamp-2">
              Tactical close-quarters breacher combat. Best of 7 rounds with smart AI teammates, vaults, doors, and cover.
            </p>

            <div className="mt-4 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-[#8e9bb0]">
              <span>4 PLAYERS</span>
              <span className="text-[#00f0ff]">FAST MATCH</span>
            </div>
          </button>

          {/* Option 2: 20x Open World Island (Erangel Survival) */}
          <button
            onClick={() => {
              onSelectMode('open_world');
              onClose();
            }}
            className={`flex flex-col text-left p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
              selectedMode === 'open_world'
                ? 'bg-gradient-to-b from-[#10b981]/15 to-transparent border-[#10b981] shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                : 'bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.05]'
            }`}
          >
            <div className="flex items-center justify-between w-full mb-3">
              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40 uppercase tracking-wider">
                20x OPEN WORLD
              </span>
              {selectedMode === 'open_world' && (
                <div className="w-6 h-6 rounded-full bg-[#10b981] text-black flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}
            </div>

            <div className="w-full h-24 rounded-xl mb-3 bg-[#131823] overflow-hidden border border-white/10 relative">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAw23se52wI7Jh7VZAlfdmRl1Gnq6iCkmzZl1iwumAYowDMYzeeSWBErcT_3UilZbeIEHgHlh2GDZROQR41-7HVNXXnIVfkqGx3VsUbI6TmGG3U1-N01Mmi3u1Zl3QAXnHjbAMvQAeJn1OSOTv9G4kWrVgv-ny8zcXsVE67lv96qmMxf1htVAadXaB94SfckdCxnGs5_uDsDhnZvhocr958DK1uuGN9EWYQrVffqVnRbzWQf2idlVMAXg"
                alt="Open World Island"
                className="w-full h-full object-cover opacity-70 group-hover:scale-105 transition-transform"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0e131b] via-transparent to-transparent" />
              <div className="absolute bottom-2 left-2 flex items-center gap-1.5 text-[10px] font-mono text-[#10b981]">
                <Globe className="w-3 h-3" />
                <span>ERANGEL ISLAND • 3800x2800</span>
              </div>
            </div>

            <h4 className="font-black text-base text-white tracking-wide uppercase flex items-center gap-1.5">
              <span>ERANGEL SURVIVAL</span>
              <span className="text-xs px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-400 font-mono">NEW</span>
            </h4>
            <p className="text-xs text-[#8e9bb0] mt-1 line-clamp-2">
              Survive against mutant creatures & 30 rival players with your friends! Surrounded by ocean water with Pochinki, Military Base, and abundant weapon loot.
            </p>

            <div className="mt-4 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-[#8e9bb0]">
              <span className="text-emerald-400">30 PLAYERS + CREATURES</span>
              <span className="text-amber-400">ABUNDANT LOOT</span>
            </div>
          </button>
        </div>

        {/* Action Button */}
        <button
          onClick={onClose}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#00f0ff] to-[#00b4d8] text-black font-extrabold text-xs uppercase tracking-wider transition-all hover:brightness-110 active:scale-98"
        >
          CONFIRM MODE & DEPLOY
        </button>
      </div>
    </div>
  );
};
