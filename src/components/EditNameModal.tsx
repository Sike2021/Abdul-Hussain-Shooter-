import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, UserCheck, Shield, Sparkles, Check } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface EditNameModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentName: string;
  currentFlag: string;
  onSaveName: (name: string, flag: string) => void;
}

const FLAGS = ['🇵🇰', '🇯🇵', '🇧🇷', '🇷🇺', '🇺🇸', '🇬🇧', '🇸🇦', '🇦🇪', '🇹🇷', '🇩🇪'];

export const EditNameModal: React.FC<EditNameModalProps> = ({
  isOpen,
  onClose,
  currentName,
  currentFlag,
  onSaveName,
}) => {
  const [name, setName] = useState(currentName);
  const [flag, setFlag] = useState(currentFlag);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim() || 'Abdul Hussain';
    onSaveName(trimmed, flag);
    soundEngine.playVictory();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          id="edit-name-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            id="edit-name-modal-card"
            className="w-full max-w-md bg-zinc-950/95 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden text-zinc-100"
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/80 bg-zinc-900/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                  <UserCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm tracking-wide uppercase">Operator Callsign</h3>
                  <p className="text-xs text-zinc-400">Personalize Your 2v2 Profile</p>
                </div>
              </div>
              <button
                id="close-name-modal-btn"
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              {/* Informational Callout */}
              <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs space-y-1">
                <span className="font-bold text-cyan-300">Name Designation:</span>
                <p className="text-zinc-400">
                  You can set your own callsign below. Non-user teammates and AI bots will be named <strong className="text-white">Abdul Hussain</strong>.
                </p>
              </div>

              {/* Name Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                  Your In-Game Callsign
                </label>
                <div className="flex items-center gap-2">
                  <span className="text-2xl p-2 rounded-xl bg-zinc-900 border border-zinc-800">
                    {flag}
                  </span>
                  <input
                    id="user-callsign-input"
                    type="text"
                    maxLength={16}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter callsign..."
                    className="flex-1 px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-700 text-white font-bold text-sm focus:outline-none focus:border-cyan-400"
                    autoFocus
                  />
                </div>
              </div>

              {/* Flag Picker */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300 uppercase tracking-wider">
                  Select Country Flag
                </label>
                <div className="flex flex-wrap gap-2">
                  {FLAGS.map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFlag(f)}
                      className={`text-xl p-2 rounded-xl border transition-all ${
                        flag === f
                          ? 'bg-cyan-500/20 border-cyan-400 scale-110 shadow-md shadow-cyan-500/20'
                          : 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 font-bold text-xs uppercase tracking-wider transition-colors border border-zinc-800"
                >
                  Cancel
                </button>
                <button
                  id="save-callsign-btn"
                  type="submit"
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-zinc-950 font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Profile</span>
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
