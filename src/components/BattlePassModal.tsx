import React from 'react';
import { X, Award, CheckCircle2, Lock, Sparkles, Diamond, Coins } from 'lucide-react';

interface BattlePassModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BattlePassModal: React.FC<BattlePassModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const currentLevel = 68;
  const maxLevel = 100;

  const tiers = [
    { level: 65, reward: 'Carbon Tactical Balaclava', type: 'COSMETIC', unlocked: true },
    { level: 66, reward: '1,500 Tactical Credits', type: 'CURRENCY', unlocked: true },
    { level: 67, reward: 'SIG MPX Cyan Glaze Skin', type: 'WEAPON', unlocked: true },
    { level: 68, reward: '50 Quantum Cores', type: 'CORES', unlocked: true },
    { level: 69, reward: 'Breacher Tactical Plate II', type: 'ARMOR', unlocked: false },
    { level: 70, reward: 'Yuki Spec-Ops Hologram Callout', type: 'EMOTE', unlocked: false },
    { level: 75, reward: 'Ghost Recon Midnight Outfit', type: 'LEGENDARY', unlocked: false },
    { level: 100, reward: 'Master Infiltrator Title & Banner', type: 'MYTHIC', unlocked: false },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-[#10141a] border border-white/10 rounded-2xl p-5 shadow-2xl flex flex-col gap-4 text-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base tracking-wide uppercase">
                  BATTLE PASS S04
                </h3>
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  PREMIUM
                </span>
              </div>
              <p className="text-xs text-[#8e9bb0]">
                Safehouse Infiltration Protocol • Season ends in 18 days
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

        {/* Level & Progress Bar */}
        <div className="bg-[#181c22] border border-white/5 rounded-xl p-3.5 flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#8e9bb0]">TIER PROGRESS</span>
            <span className="font-bold text-amber-400">
              LVL {currentLevel} / {maxLevel}
            </span>
          </div>
          <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full transition-all"
              style={{ width: `${(currentLevel / maxLevel) * 100}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#8e9bb0] pt-0.5">
            <span>Next Tier: 1,420 / 2,000 XP</span>
            <span className="text-amber-400 font-bold">+25% Battle XP Active</span>
          </div>
        </div>

        {/* Tiers List */}
        <div className="flex flex-col gap-2 max-h-64 overflow-y-auto pr-1">
          {tiers.map((t) => (
            <div
              key={t.level}
              className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                t.unlocked
                  ? 'bg-white/[0.03] border-white/10'
                  : 'bg-black/30 border-white/5 opacity-75'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs font-bold ${
                    t.unlocked
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                      : 'bg-white/5 text-[#8e9bb0]'
                  }`}
                >
                  {t.level}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-white">{t.reward}</span>
                  <span className="text-[10px] font-mono text-[#8e9bb0]">{t.type}</span>
                </div>
              </div>

              {t.unlocked ? (
                <div className="flex items-center gap-1 text-emerald-400 font-mono text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>CLAIMED</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-[#8e9bb0] font-mono text-xs">
                  <Lock className="w-3.5 h-3.5" />
                  <span>LOCKED</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-extrabold text-xs uppercase tracking-wider transition-all"
        >
          CONTINUE OPERATING
        </button>
      </div>
    </div>
  );
};
