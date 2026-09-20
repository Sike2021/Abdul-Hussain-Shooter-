import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Check, Shield, Sparkles, Award } from 'lucide-react';
import { OPERATOR_SKINS } from '../data/gameData';
import { OperatorSkin } from '../types';

interface SkinsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSkinId: string;
  onSelectSkin: (skin: OperatorSkin) => void;
}

export const SkinsModal: React.FC<SkinsModalProps> = ({
  isOpen,
  onClose,
  selectedSkinId,
  onSelectSkin,
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div
          id="skins-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            transition={{ duration: 0.2 }}
            id="skins-modal-card"
            className="w-full max-w-lg bg-zinc-950/95 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden text-zinc-100"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/80 bg-zinc-900/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base tracking-wide uppercase">Tactical Operator Skins</h3>
                  <p className="text-xs text-zinc-400">Customize Ahmed 🇵🇰 & CQB Tactical Rig</p>
                </div>
              </div>
              <button
                id="close-skins-modal-btn"
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content list */}
            <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
              {OPERATOR_SKINS.map((skin) => {
                const isSelected = selectedSkinId === skin.id;
                return (
                  <div
                    key={skin.id}
                    id={`skin-item-${skin.id}`}
                    onClick={() => onSelectSkin(skin)}
                    className={`relative flex items-center justify-between p-4 rounded-xl cursor-pointer border transition-all ${
                      isSelected
                        ? 'bg-cyan-950/30 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                        : 'bg-zinc-900/50 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Color Preview Swatch */}
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center shadow-inner relative border border-white/10"
                        style={{ backgroundColor: skin.color }}
                      >
                        <Shield className="w-6 h-6 text-zinc-950" />
                        <span className="absolute -bottom-1 -right-1 text-[9px] font-black px-1 rounded bg-black/80 text-zinc-200">
                          2v2
                        </span>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-zinc-100">{skin.name}</span>
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                              skin.rarity === 'Legendary'
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : skin.rarity === 'Epic'
                                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            }`}
                          >
                            {skin.rarity}
                          </span>
                        </div>
                        <p className="text-xs text-zinc-400 mt-0.5 line-clamp-1">{skin.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {isSelected ? (
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-400 bg-cyan-500/10 px-3 py-1.5 rounded-lg border border-cyan-500/30">
                          <Check className="w-3.5 h-3.5" />
                          <span>EQUIPPED</span>
                        </div>
                      ) : (
                        <button
                          id={`equip-skin-${skin.id}`}
                          className="text-xs font-semibold text-zinc-300 bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-lg transition-colors"
                        >
                          EQUIP
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-zinc-800/80 bg-zinc-900/60 flex items-center justify-between text-xs text-zinc-400">
              <div className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-cyan-400" />
                <span>All skins unlocked for tactical testing</span>
              </div>
              <button
                id="done-skins-modal-btn"
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-cyan-500/20"
              >
                Confirm Loadout
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
