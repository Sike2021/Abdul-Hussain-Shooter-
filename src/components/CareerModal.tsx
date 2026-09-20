import React from 'react';
import { X, Trophy, Target, Swords, Award, Users, Crosshair } from 'lucide-react';
import { GENERATED_PLAYERS_POOL } from '../data/autoPlayers';

interface CareerModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  userFlag: string;
  highScore: number;
}

export const CareerModal: React.FC<CareerModalProps> = ({
  isOpen,
  onClose,
  userName,
  userFlag,
  highScore,
}) => {
  if (!isOpen) return null;

  const topPlayers = [...GENERATED_PLAYERS_POOL].sort((a, b) => b.elo - a.elo).slice(0, 10);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-[#10141a] border border-white/10 rounded-2xl p-5 shadow-2xl flex flex-col gap-4 text-white">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-wide uppercase">
                OPERATOR CAREER & RECORD
              </h3>
              <p className="text-xs text-[#8e9bb0]">
                Ranked Competitive Statistics • Season 04
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

        {/* Profile Stats Summary */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-[#181c22] border border-white/5 rounded-xl p-3 flex flex-col items-center text-center">
            <span className="text-[10px] font-mono text-[#8e9bb0] uppercase">Max Kills</span>
            <span className="text-xl font-black text-amber-400 mt-0.5">{highScore}</span>
            <span className="text-[9px] font-mono text-emerald-400">Personal Best</span>
          </div>
          <div className="bg-[#181c22] border border-white/5 rounded-xl p-3 flex flex-col items-center text-center">
            <span className="text-[10px] font-mono text-[#8e9bb0] uppercase">Win Rate</span>
            <span className="text-xl font-black text-cyan-400 mt-0.5">64.2%</span>
            <span className="text-[9px] font-mono text-[#8e9bb0]">2v2 CQB</span>
          </div>
          <div className="bg-[#181c22] border border-white/5 rounded-xl p-3 flex flex-col items-center text-center">
            <span className="text-[10px] font-mono text-[#8e9bb0] uppercase">Rank Tier</span>
            <span className="text-base font-black text-white mt-1">Diamond II</span>
            <span className="text-[9px] font-mono text-cyan-400">2,380 ELO</span>
          </div>
        </div>

        {/* Top 10 Operators Leaderboard */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-xs font-mono text-[#8e9bb0] px-1">
            <span>GLOBAL TOP 10 OPERATIVES</span>
            <span>RANK & ELO</span>
          </div>

          <div className="flex flex-col gap-1.5 max-h-52 overflow-y-auto pr-1">
            {/* Player rank position */}
            <div className="flex items-center justify-between p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30">
              <div className="flex items-center gap-2.5">
                <span className="w-6 font-mono text-xs font-bold text-cyan-400">#42</span>
                <span className="text-sm">{userFlag}</span>
                <span className="text-xs font-bold text-white">{userName} (You)</span>
              </div>
              <span className="font-mono text-xs font-bold text-cyan-400">2,380 ELO</span>
            </div>

            {topPlayers.map((p, idx) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-2 rounded-xl bg-white/[0.02] border border-white/5"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-6 font-mono text-xs font-bold ${
                      idx === 0
                        ? 'text-amber-400'
                        : idx === 1
                        ? 'text-zinc-300'
                        : idx === 2
                        ? 'text-amber-600'
                        : 'text-[#8e9bb0]'
                    }`}
                  >
                    #{idx + 1}
                  </span>
                  <span className="text-sm">{p.country}</span>
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold text-white">{p.name}</span>
                    <span className="text-[9px] font-mono text-[#8e9bb0]">{p.role}</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-mono text-xs font-bold text-white/90">{p.elo} ELO</span>
                  <span className="block text-[9px] font-mono text-emerald-400">{p.winRate}% W</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs uppercase tracking-wider transition-all"
        >
          BACK TO HUB
        </button>
      </div>
    </div>
  );
};
