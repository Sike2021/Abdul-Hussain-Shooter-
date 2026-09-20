import React, { useState } from 'react';
import {
  Play,
  Settings as SettingsIcon,
  Shield,
  Trophy,
  Swords,
  ChevronRight,
  User,
  Sliders,
  UserPlus,
  Coins,
  Diamond,
  Flame,
  Award,
  BarChart2,
  Gamepad2,
  Sparkles,
} from 'lucide-react';
import { OperatorSkin, GameMode } from '../types';
import { AutoPlayer } from '../data/autoPlayers';
import { TacticalAvatar, TACTICAL_AVATARS } from '../data/avatars';
import { soundEngine } from '../utils/audio';
import { BattlePassModal } from './BattlePassModal';
import { CareerModal } from './CareerModal';
import { PWAInstallButton } from './PWAInstallButton';

interface TacticalLobbyProps {
  onStartGame: () => void;
  onOpenSettings: () => void;
  onOpenSkins: () => void;
  onOpenEditName: () => void;
  onOpenAvatarPicker?: () => void;
  currentAvatar?: TacticalAvatar;
  currentSkin: OperatorSkin;
  highScore: number;
  userName: string;
  userFlag: string;
  controlMode: 'joystick' | 'dpad';
  onToggleControlMode: (mode: 'joystick' | 'dpad') => void;
  teammate: AutoPlayer;
  enemyA: AutoPlayer;
  enemyB: AutoPlayer;
  onSelectTeammate: (player: AutoPlayer) => void;
  onSelectEnemyA: (player: AutoPlayer) => void;
  onSelectEnemyB: (player: AutoPlayer) => void;
  onAutoMatchmake: () => void;
  gameMode: GameMode;
  onOpenModeSelect: () => void;
}

export const TacticalLobby: React.FC<TacticalLobbyProps> = ({
  onStartGame,
  onOpenSettings,
  onOpenSkins,
  onOpenEditName,
  onOpenAvatarPicker,
  currentAvatar = TACTICAL_AVATARS[0],
  currentSkin,
  highScore,
  userName,
  userFlag,
  controlMode,
  onToggleControlMode,
  teammate,
  enemyA,
  enemyB,
  onAutoMatchmake,
  gameMode,
  onOpenModeSelect,
}) => {
  const [activeNav, setActiveNav] = useState<'lobby' | 'agents' | 'armory' | 'pass' | 'career'>('lobby');
  const [isBattlePassOpen, setIsBattlePassOpen] = useState(false);
  const [isCareerOpen, setIsCareerOpen] = useState(false);

  // Cinematic Hero Backdrop Image
  const heroBackdropUrl =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuAw23se52wI7Jh7VZAlfdmRl1Gnq6iCkmzZl1iwumAYowDMYzeeSWBErcT_3UilZbeIEHgHlh2GDZROQR41-7HVNXXnIVfkqGx3VsUbI6TmGG3U1-N01Mmi3u1Zl3QAXnHjbAMvQAeJn1OSOTv9G4kWrVgv-ny8zcXsVE67lv96qmMxf1htVAadXaB94SfckdCxnGs5_uDsDhnZvhocr958DK1uuGN9EWYQrVffqVnRbzWQf2idlVMAXg';

  const defaultAvatarUrl =
    currentAvatar.imageUrl ||
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBH6FuNrkdELZKZuoOWqWHeWE__tnlpIyLl-3ANt-K5mPi7vmQX4A34FVHWXmt_38o_gt2eMcq-4VaaR7HvnKwCfmESaAGTZgudK4qmhXZJmObi8HQ3ecLgLGDWGl4GLc3ojgNxbzjJpHVN3WtTewOPLfl-J7r8pLgIM_JOeRcYz2wEgyPh_KtwF0C49EgmX8nNI3vdbD79xMjRIE8j_ZrkmmPBzCej-M8RqqrV5jUQptP_4puOTyK-jQ';

  const handleStartDeploy = () => {
    soundEngine.playBombTick();
    onStartGame();
  };

  const handleNavClick = (tab: 'lobby' | 'agents' | 'armory' | 'pass' | 'career') => {
    setActiveNav(tab);
    soundEngine.playBombTick();
    if (tab === 'agents' && onOpenAvatarPicker) {
      onOpenAvatarPicker();
    } else if (tab === 'armory') {
      onOpenSkins();
    } else if (tab === 'pass') {
      setIsBattlePassOpen(true);
    } else if (tab === 'career') {
      setIsCareerOpen(true);
    }
  };

  const handleInviteSwitch = () => {
    soundEngine.playBombTick();
    onAutoMatchmake();
  };

  return (
    <div className="relative w-full min-h-screen bg-[#0b0f17] text-[#f1f5f9] font-sans flex flex-col justify-between select-none overflow-x-hidden antialiased">
      {/* TOP STATUS & PROFILE BAR */}
      <header className="fixed top-0 w-full z-40 pt-safe bg-gradient-to-b from-[#0b0f17]/95 via-[#0b0f17]/85 to-transparent backdrop-blur-md border-b border-white/5">
        <div className="h-16 px-4 flex items-center justify-between max-w-5xl mx-auto w-full">
          {/* Player Profile Pill */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onOpenAvatarPicker}
              className="relative cursor-pointer group active:scale-95 transition-transform"
              title="Change Tactical Avatar"
            >
              <div className="w-10 h-10 rounded-full ring-2 ring-[#00f0ff]/50 p-0.5 overflow-hidden bg-[#131823] shadow-lg">
                <img
                  alt={userName}
                  className="w-full h-full object-cover rounded-full"
                  referrerPolicy="no-referrer"
                  src={defaultAvatarUrl}
                />
              </div>
              <span className="absolute -bottom-1 -right-1 bg-gradient-to-r from-[#00f0ff] to-blue-500 text-black font-mono text-[9px] font-black px-1.5 py-0.2 rounded-full ring-2 ring-[#0b0f17]">
                42
              </span>
            </button>

            <div className="flex flex-col">
              <button
                onClick={onOpenEditName}
                className="flex items-center gap-1.5 text-left group"
                title="Edit Callsign & Flag"
              >
                <span className="font-extrabold text-sm tracking-wide text-white group-hover:text-[#00f0ff] transition-colors uppercase">
                  {userName}
                </span>
                <span className="text-xs">{userFlag}</span>
              </button>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono font-medium text-[#00f0ff]">
                  <Diamond className="w-2.5 h-2.5" />
                  DIAMOND II
                </span>
              </div>
            </div>
          </div>

          {/* Currencies & Controls */}
          <div className="flex items-center gap-2">
            {/* Credits */}
            <div className="flex items-center gap-1.5 bg-white/[0.04] border border-white/10 px-2.5 py-1.5 rounded-full backdrop-blur-md">
              <Coins className="w-3.5 h-3.5 text-[#ff9900]" />
              <span className="font-mono text-xs font-semibold text-white/90">14.8K</span>
            </div>

            {/* Cores */}
            <div className="flex items-center gap-1.5 bg-white/[0.04] border border-white/10 px-2.5 py-1.5 rounded-full backdrop-blur-md">
              <Diamond className="w-3.5 h-3.5 text-[#00f0ff]" />
              <span className="font-mono text-xs font-semibold text-[#00f0ff]">420</span>
            </div>

            {/* Quick Settings */}
            <button
              onClick={onOpenSettings}
              aria-label="Settings"
              className="w-8 h-8 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center text-[#8e9bb0] hover:text-white transition-colors ml-0.5 active:scale-95"
            >
              <SettingsIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* MAIN VIEWPORT */}
      <main className="flex-1 relative w-full flex flex-col justify-between pt-16 pb-24 overflow-hidden min-h-[580px]">
        {/* HERO OPERATOR ART (Full Screen Backdrop with Cinematic Lighting) */}
        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full bg-cover bg-center"
            style={{ backgroundImage: `url('${heroBackdropUrl}')` }}
          />
          {/* Vignette and Modern Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f17] via-[#0b0f17]/35 to-[#0b0f17]/65" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#0b0f17_95%)] pointer-events-none" />
        </div>

        {/* UPPER HERO INFO: Minimal Equipment Badge & Battle Pass Widget */}
        <div className="relative z-10 px-4 pt-3 flex items-start justify-between max-w-lg mx-auto w-full">
          {/* Minimal Weapon Loadout Pill */}
          <button
            onClick={onOpenSkins}
            className="flex items-center gap-2 bg-black/50 backdrop-blur-xl border border-white/10 px-3 py-1.5 rounded-full text-xs hover:border-[#00f0ff]/40 transition-all cursor-pointer active:scale-95"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white/70 tracking-wide font-mono text-[11px]">LOADOUT</span>
            <span className="text-white font-semibold">{currentSkin.name}</span>
            <span className="text-white/40">•</span>
            <span className="text-[#00f0ff] text-[11px] font-mono">CQB SPEC</span>
          </button>

          {/* Compact Battle Pass Widget */}
          <button
            onClick={() => setIsBattlePassOpen(true)}
            className="bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl px-3 py-2 flex items-center gap-2.5 cursor-pointer hover:border-white/20 transition-all active:scale-95 text-left"
          >
            <div className="flex flex-col">
              <div className="flex items-center justify-between gap-3 text-[11px]">
                <span className="text-white/90 font-bold uppercase tracking-wider">Pass S04</span>
                <span className="text-[#ff9900] font-mono font-bold">LVL 68</span>
              </div>
              <div className="w-20 h-1.5 bg-white/10 rounded-full mt-1.5 overflow-hidden">
                <div className="h-full bg-[#ff9900] rounded-full" style={{ width: '68%' }} />
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-white/50" />
          </button>
        </div>

        {/* PWA INSTALL / FAST PLAY NOTICE */}
        <div className="relative z-10 px-4 flex justify-center max-w-lg mx-auto w-full my-auto">
          <PWAInstallButton compact />
        </div>

        {/* LOWER SECTION: SQUAD STATUS & PRIMARY ACTION DEPLOY */}
        <div className="relative z-10 px-4 mt-auto flex flex-col gap-3 max-w-lg mx-auto w-full">
          {/* Minimalist Squad Bar */}
          <div className="flex items-center justify-between bg-black/45 backdrop-blur-xl border border-white/10 p-2 rounded-2xl">
            <div className="flex items-center gap-2">
              {/* Slot 1: Self (Ready) */}
              <div className="flex items-center gap-2 bg-white/5 px-2.5 py-1.5 rounded-xl border border-white/5">
                <div className="relative w-7 h-7 rounded-full bg-[#131823] overflow-hidden">
                  <img
                    alt={userName}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    src={defaultAvatarUrl}
                  />
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 ring-1 ring-black" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-white leading-none">YOU</span>
                  <span className="text-[9px] font-mono text-emerald-400 tracking-wider">HOST</span>
                </div>
              </div>

              {/* Slot 2: Teammate (Yuki AI / Selected) */}
              <div className="flex items-center gap-2 bg-white/5 px-2.5 py-1.5 rounded-xl border border-white/5">
                <div className="relative w-7 h-7 rounded-full bg-[#00f0ff]/20 border border-[#00f0ff]/40 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-[#00f0ff]" />
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-400 ring-1 ring-black" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-white leading-none truncate max-w-[70px]">
                    {teammate.name}
                  </span>
                  <span className="text-[9px] font-mono text-emerald-400 tracking-wider">READY</span>
                </div>
              </div>
            </div>

            {/* Switch / Roster Roll Button */}
            <button
              onClick={handleInviteSwitch}
              className="flex items-center gap-1 text-xs text-[#8e9bb0] hover:text-white px-2.5 py-1.5 rounded-xl transition-colors active:scale-95 bg-white/5 border border-white/5 cursor-pointer"
              title="Reroll Teammate & Enemies"
            >
              <UserPlus className="w-3.5 h-3.5 text-[#00f0ff]" />
              <span className="font-semibold text-[11px]">REROLL</span>
            </button>
          </div>

          {/* MAIN PLAY CONTROLS: Mode Switcher + Dominant CTA */}
          <div className="grid grid-cols-12 gap-2.5 items-stretch">
            {/* Game Mode Selection Tile */}
            <button
              onClick={onOpenModeSelect}
              className={`col-span-5 backdrop-blur-xl border transition-all rounded-2xl p-3 flex flex-col justify-between text-left group cursor-pointer active:scale-95 ${
                gameMode === 'open_world'
                  ? 'bg-gradient-to-b from-emerald-950/40 to-black/60 border-emerald-500/40 hover:border-emerald-400'
                  : 'bg-black/50 hover:bg-black/70 border-white/10 hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className={`text-[10px] font-mono tracking-wider font-bold uppercase ${
                  gameMode === 'open_world' ? 'text-emerald-400' : 'text-[#00f0ff]'
                }`}>
                  {gameMode === 'open_world' ? '20x ERANGEL' : '2v2 CQB'}
                </span>
                <Sliders className="w-3.5 h-3.5 text-white/50 group-hover:text-white transition-colors" />
              </div>
              <div className="mt-2">
                <div className="text-sm font-extrabold text-white leading-tight">
                  {gameMode === 'open_world' ? 'OPEN WORLD' : 'SAFEHOUSE'}
                </div>
                <div className="text-[11px] text-[#8e9bb0] truncate mt-0.5">
                  {gameMode === 'open_world' ? '30 Players • Mutants' : 'Ranked • 2v2 Breachers'}
                </div>
              </div>
            </button>

            {/* Primary Deploy CTA (AAA Bold Glow Button) */}
            <button
              onClick={handleStartDeploy}
              id="quick-match-cta"
              className="col-span-7 relative group overflow-hidden bg-gradient-to-r from-[#00f0ff] via-[#00dbf5] to-[#00b4d8] hover:brightness-110 active:scale-[0.98] transition-all rounded-2xl p-3.5 shadow-[0_4px_24px_rgba(0,240,255,0.35)] flex items-center justify-between text-black cursor-pointer"
            >
              <div className="flex flex-col text-left z-10">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-black/80 animate-ping" />
                  <span className="font-black text-lg tracking-wider uppercase leading-none">
                    START MATCH
                  </span>
                </div>
                <span className="font-mono text-[10px] font-bold text-black/75 tracking-wider mt-1">
                  EST. WAIT ~ 0:07s
                </span>
              </div>
              <div className="w-10 h-10 rounded-xl bg-black/15 flex items-center justify-center z-10 group-hover:translate-x-0.5 transition-transform">
                <Play className="w-5 h-5 font-bold text-black fill-current" />
              </div>
            </button>
          </div>
        </div>
      </main>

      {/* MODERN MINIMALIST BOTTOM DOCKED NAVIGATION */}
      <nav className="fixed bottom-0 w-full z-40 pb-safe bg-[#0b0f17]/90 backdrop-blur-2xl border-t border-white/5">
        <div className="h-14 px-6 flex items-center justify-around max-w-lg mx-auto">
          {/* Home / Play (Active) */}
          <button
            onClick={() => handleNavClick('lobby')}
            className={`flex flex-col items-center gap-0.5 relative py-1 transition-colors cursor-pointer ${
              activeNav === 'lobby' ? 'text-[#00f0ff]' : 'text-[#8e9bb0] hover:text-white'
            }`}
          >
            <Gamepad2 className="w-5 h-5" />
            <span className="text-[10px] font-bold tracking-wider uppercase">LOBBY</span>
            {activeNav === 'lobby' && (
              <span className="w-4 h-0.5 bg-[#00f0ff] rounded-full shadow-[0_0_8px_#00f0ff]" />
            )}
          </button>

          {/* Operators / Agents */}
          <button
            onClick={() => handleNavClick('agents')}
            className={`flex flex-col items-center gap-0.5 py-1 transition-colors cursor-pointer ${
              activeNav === 'agents' ? 'text-[#00f0ff]' : 'text-[#8e9bb0] hover:text-white'
            }`}
          >
            <Shield className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-wider uppercase">AGENTS</span>
            {activeNav === 'agents' && (
              <span className="w-4 h-0.5 bg-[#00f0ff] rounded-full shadow-[0_0_8px_#00f0ff]" />
            )}
          </button>

          {/* Armory / Skins */}
          <button
            onClick={() => handleNavClick('armory')}
            className={`flex flex-col items-center gap-0.5 py-1 transition-colors cursor-pointer ${
              activeNav === 'armory' ? 'text-[#00f0ff]' : 'text-[#8e9bb0] hover:text-white'
            }`}
          >
            <Swords className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-wider uppercase">ARMORY</span>
            {activeNav === 'armory' && (
              <span className="w-4 h-0.5 bg-[#00f0ff] rounded-full shadow-[0_0_8px_#00f0ff]" />
            )}
          </button>

          {/* Battle Pass */}
          <button
            onClick={() => handleNavClick('pass')}
            className={`flex flex-col items-center gap-0.5 py-1 transition-colors cursor-pointer relative ${
              activeNav === 'pass' ? 'text-[#00f0ff]' : 'text-[#8e9bb0] hover:text-white'
            }`}
          >
            <Award className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-wider uppercase">PASS</span>
            <span className="absolute top-1 right-2 w-1.5 h-1.5 rounded-full bg-[#ff9900]" />
            {activeNav === 'pass' && (
              <span className="w-4 h-0.5 bg-[#00f0ff] rounded-full shadow-[0_0_8px_#00f0ff]" />
            )}
          </button>

          {/* Career / Stats */}
          <button
            onClick={() => handleNavClick('career')}
            className={`flex flex-col items-center gap-0.5 py-1 transition-colors cursor-pointer ${
              activeNav === 'career' ? 'text-[#00f0ff]' : 'text-[#8e9bb0] hover:text-white'
            }`}
          >
            <BarChart2 className="w-5 h-5" />
            <span className="text-[10px] font-medium tracking-wider uppercase">CAREER</span>
            {activeNav === 'career' && (
              <span className="w-4 h-0.5 bg-[#00f0ff] rounded-full shadow-[0_0_8px_#00f0ff]" />
            )}
          </button>
        </div>
      </nav>

      {/* Battle Pass Modal */}
      <BattlePassModal
        isOpen={isBattlePassOpen}
        onClose={() => {
          setIsBattlePassOpen(false);
          setActiveNav('lobby');
        }}
      />

      {/* Career & Stats Modal */}
      <CareerModal
        isOpen={isCareerOpen}
        onClose={() => {
          setIsCareerOpen(false);
          setActiveNav('lobby');
        }}
        userName={userName}
        userFlag={userFlag}
        highScore={highScore}
      />
    </div>
  );
};
