import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Volume2, Sliders, ShieldCheck, Crosshair, Map, Eye } from 'lucide-react';
import { GameSettings } from '../types';
import { soundEngine } from '../utils/audio';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  const handleVolumeChange = (vol: number) => {
    onUpdateSettings({ ...settings, sfxVolume: vol });
    soundEngine.setVolume(vol);
    soundEngine.playHit();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          id="settings-modal-backdrop"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 15 }}
            transition={{ duration: 0.2 }}
            id="settings-modal-card"
            className="w-full max-w-lg bg-zinc-950/95 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden text-zinc-100"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/80 bg-zinc-900/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base tracking-wide uppercase">Combat & HUD Settings</h3>
                  <p className="text-xs text-zinc-400">Controls, Audio & Tactical Telemetry</p>
                </div>
              </div>
              <button
                id="close-settings-modal-btn"
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5 max-h-[65vh] overflow-y-auto">
              {/* SFX Volume */}
              <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm font-semibold">Tactical Audio & SFX</span>
                  </div>
                  <span className="text-xs font-mono text-cyan-400">
                    {Math.round(settings.sfxVolume * 100)}%
                  </span>
                </div>
                <input
                  id="settings-sfx-slider"
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={settings.sfxVolume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              {/* Control Mode (Joystick vs D-Pad) */}
              <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Crosshair className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm font-semibold">Android Mobile Controls</span>
                  </div>
                  <span className="text-xs font-mono uppercase text-emerald-400 font-bold">
                    {settings.controlMode === 'dpad' ? 'Tactical D-Pad' : 'Virtual Joystick'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ ...settings, controlMode: 'joystick' })}
                    className={`py-2 px-3 rounded-lg text-xs font-bold uppercase transition-all ${
                      settings.controlMode === 'joystick'
                        ? 'bg-emerald-500 text-zinc-950 shadow-md'
                        : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                    }`}
                  >
                    🕹️ Virtual Joystick
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ ...settings, controlMode: 'dpad' })}
                    className={`py-2 px-3 rounded-lg text-xs font-bold uppercase transition-all ${
                      settings.controlMode === 'dpad'
                        ? 'bg-emerald-500 text-zinc-950 shadow-md'
                        : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                    }`}
                  >
                    🎮 Tactical D-Pad
                  </button>
                </div>
              </div>

              {/* Joystick Sensitivity */}
              <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm font-semibold">Movement Speed / Sensitivity</span>
                  </div>
                  <span className="text-xs font-mono text-cyan-400">
                    {settings.joystickSensitivity.toFixed(1)}x
                  </span>
                </div>
                <input
                  id="settings-joy-slider"
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={settings.joystickSensitivity}
                  onChange={(e) =>
                    onUpdateSettings({ ...settings, joystickSensitivity: parseFloat(e.target.value) })
                  }
                  className="w-full h-1.5 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
              </div>

              {/* Toggles */}
              <div className="space-y-2.5">
                <label className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800/80 cursor-pointer hover:bg-zinc-900/60 transition-colors">
                  <div className="flex items-center gap-3">
                    <Crosshair className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="text-sm font-medium block">Smart Auto-Aim Lock</span>
                      <span className="text-xs text-zinc-400">Automatically tracks nearest enemy when firing on mobile</span>
                    </div>
                  </div>
                  <input
                    id="settings-toggle-aim"
                    type="checkbox"
                    checked={settings.autoTarget}
                    onChange={(e) => onUpdateSettings({ ...settings, autoTarget: e.target.checked })}
                    className="w-4 h-4 rounded text-emerald-500 bg-zinc-800 border-zinc-700 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                </label>
                <label className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800/80 cursor-pointer hover:bg-zinc-900/60 transition-colors">
                  <div className="flex items-center gap-3">
                    <Eye className="w-4 h-4 text-cyan-400" />
                    <div>
                      <span className="text-sm font-medium block">Smart AI Target Laser</span>
                      <span className="text-xs text-zinc-400">Renders dashed cyan targeting line for teammate Yuki</span>
                    </div>
                  </div>
                  <input
                    id="settings-toggle-laser"
                    type="checkbox"
                    checked={settings.showAiLasers}
                    onChange={(e) => onUpdateSettings({ ...settings, showAiLasers: e.target.checked })}
                    className="w-4 h-4 rounded text-cyan-500 bg-zinc-800 border-zinc-700 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                </label>

                <label className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800/80 cursor-pointer hover:bg-zinc-900/60 transition-colors">
                  <div className="flex items-center gap-3">
                    <Map className="w-4 h-4 text-amber-400" />
                    <div>
                      <span className="text-sm font-medium block">High-Contrast Radar Minimap</span>
                      <span className="text-xs text-zinc-400">Highlights open/closed doors with vivid indicator lines</span>
                    </div>
                  </div>
                  <input
                    id="settings-toggle-minimap"
                    type="checkbox"
                    checked={settings.highContrastMinimap}
                    onChange={(e) =>
                      onUpdateSettings({ ...settings, highContrastMinimap: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-amber-500 bg-zinc-800 border-zinc-700 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                  />
                </label>

                <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-400 uppercase tracking-wide">
                        NO SELF-DAMAGE [ENFORCED]
                      </span>
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 rounded font-mono">
                        ACTIVE
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1">
                      Ahmed and teammate Yuki are strictly protected from player grenades and friendly explosive damage.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-zinc-800/80 bg-zinc-900/60 flex items-center justify-end">
              <button
                id="save-settings-btn"
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-lg shadow-emerald-500/20"
              >
                Save Settings
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
