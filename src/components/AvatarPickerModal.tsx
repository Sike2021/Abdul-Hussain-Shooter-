import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Shield, Zap, Sparkles, Crosshair } from 'lucide-react';
import { TACTICAL_AVATARS, TacticalAvatar } from '../data/avatars';
import { AvatarBadge } from './AvatarBadge';
import { soundEngine } from '../utils/audio';

interface AvatarPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAvatarId: string;
  onSelectAvatar: (avatar: TacticalAvatar) => void;
}

export const AvatarPickerModal: React.FC<AvatarPickerModalProps> = ({
  isOpen,
  onClose,
  selectedAvatarId,
  onSelectAvatar,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-2xl rounded-2xl bg-zinc-900/95 border border-cyan-500/40 p-4 sm:p-6 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Crosshair className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-black uppercase text-white tracking-wider flex items-center gap-2">
                  <span>Tactical 2D Operator Avatars</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {TACTICAL_AVATARS.length} UNITS
                  </span>
                </h2>
                <p className="text-xs text-zinc-400">
                  Select your in-game 2D top-down operative portrait and helmet rig
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                soundEngine.playBombTick();
                onClose();
              }}
              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Grid of 2D Tactical Avatars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-4 overflow-y-auto pr-1">
            {TACTICAL_AVATARS.map((avatar) => {
              const isSelected = avatar.id === selectedAvatarId;

              return (
                <div
                  key={avatar.id}
                  onClick={() => {
                    soundEngine.playBombTick();
                    onSelectAvatar(avatar);
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 relative ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-400 shadow-[0_0_18px_rgba(6,182,212,0.25)]'
                      : 'bg-zinc-950/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800/40'
                  }`}
                >
                  <AvatarBadge avatar={avatar} size="lg" isOnline={isSelected} />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <div className="text-xs font-black text-white truncate">{avatar.name}</div>
                      <span
                        className="text-[9px] font-black px-1.5 py-0.5 rounded uppercase font-mono"
                        style={{
                          backgroundColor: `${avatar.primaryColor}25`,
                          color: avatar.primaryColor,
                          border: `1px solid ${avatar.primaryColor}40`,
                        }}
                      >
                        {avatar.rarity}
                      </span>
                    </div>

                    <div className="text-[11px] font-bold text-cyan-400 flex items-center gap-1 mb-1">
                      <span>{avatar.callsign}</span>
                      <span className="text-zinc-600">•</span>
                      <span className="text-zinc-400 font-normal">{avatar.role}</span>
                    </div>

                    <p className="text-[10px] text-zinc-400 leading-tight line-clamp-2">
                      {avatar.description}
                    </p>
                  </div>

                  {/* Active selection tick */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-cyan-400 text-zinc-950 flex items-center justify-center shadow-md">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer Action */}
          <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
            <span className="text-xs text-zinc-500 font-mono">
              Avatars automatically synchronize with your top-down 2D in-game character model
            </span>
            <button
              onClick={() => {
                soundEngine.playBombTick();
                onClose();
              }}
              className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer shadow-lg shadow-cyan-500/20"
            >
              Confirm Avatar
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
