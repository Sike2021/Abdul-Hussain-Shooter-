import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  BatteryCharging,
  User,
  CheckCircle2,
  Swords,
  Radar,
  Shield,
  Zap,
  Building2,
  Play,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { AutoPlayer } from '../data/autoPlayers';
import { TacticalAvatar } from '../data/avatars';
import { OperatorSkin } from '../types';
import { soundEngine } from '../utils/audio';

interface LiveMatchViewportProps {
  onBack: () => void;
  onStartInfiltration: () => void;
  userName: string;
  userFlag: string;
  currentAvatar: TacticalAvatar;
  currentSkin: OperatorSkin;
  teammate: AutoPlayer;
  enemyA: AutoPlayer;
  enemyB: AutoPlayer;
  onOpenSkins?: () => void;
}

export const LiveMatchViewport: React.FC<LiveMatchViewportProps> = ({
  onBack,
  onStartInfiltration,
  userName,
  userFlag,
  currentAvatar,
  currentSkin,
  teammate,
  enemyA,
  enemyB,
  onOpenSkins,
}) => {
  const [seconds, setSeconds] = useState(7);
  const [isDeploying, setIsDeploying] = useState(false);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);

  // Automatic countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsDeploying(true);
          soundEngine.playBombTick();
          // Auto launch after 1.5s once countdown completes
          setTimeout(() => {
            onStartInfiltration();
          }, 1500);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onStartInfiltration]);

  const handleLaunch = () => {
    setIsDeploying(true);
    soundEngine.playBombTick();
    setTimeout(() => {
      onStartInfiltration();
    }, 400);
  };

  const toggleMic = () => {
    setIsMicOn((prev) => !prev);
    soundEngine.playBombTick();
  };

  const toggleAudio = () => {
    setIsAudioOn((prev) => {
      const next = !prev;
      soundEngine.setVolume(next ? 0.7 : 0);
      return next;
    });
  };

  // Safehouse images
  const blueprintImg =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDCXZV_58hOxICk-_yTNwyLiNY7hchDKg_k2522g3d_sw058dGmnZeJd1ZfySIbnnm-dzXb5G-wA-oqaO-D3td-85h4nlMaTSrgVRlokJ4IvbUoZcEkdtRGPpzunfqUWdhHflKjOAsDR8ODTl6M37MCsCpubFWWcoDsYwremlOKOsWB0ZBFy8zZTX-nDKlAJFv7kKs2sQqfpMB6qTJAHatLjfaHWEsChATmomXLVPtq03_tNIKLvrOYLA';

  const defaultAlliesPortraits = {
    you:
      currentAvatar.imageUrl ||
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAt4xEmfM7g_IGC9tGzJe8reUhMzePEz64_InxHWwewj3rMqarIIoKLOjxXuxqixVH6HnYU9VKMz2pp-OguvsUNXJUL1t5D2Sr7_n_irENdyEZ9HJJWLWYrPZ8dI0eJvDo7DRNgShk1L-f7eMbXRtUz0IlUGypcmXnh4KraoTbziuQCk1Fvi0Y_Ooh7Dz0iV78LXrhsdDg7qhk26xCDV_zE06pbdfRSroUmZF7Y4OMfUkEQi6uDVfSw7w',
    teammate:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC0syJZ0sCIMuvmptHPjUOOH3gm_SdNl7f3pZ-FtdJC3kH62_6q3LV3Tb5C7QYlVySjNlCIS8GsEhXUqoYIi8i7btUUpuf7k6G_9ALl5zEjt57JNvbZzfy1U8a0lYt77WQRWUzwR0PdPyasnrqbKKSMy6xFZU8MtiFX31uC0bCG81VTbM4UHpkguHehzLsLIHEGjKiWA0V9Z_tu17StaHxGLuAPdUa9-s-C_4b83HstRgXpalGzt1st9A',
  };

  const defaultOmegaPortraits = {
    enemyA:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDnC4pbGXUOZq0bLOGRbnPP2j9j7ZX361fnTEwxEMjKF51GMwIMGmw5ElqjEXE7x9mz3MHvV_NVzqLsrBJXotP0NgtMvGuiCGJApdjm6FN2vPJHjSc2Wfdxs_3n3lZK3lTHoLIpEd_OuKoPJizfaU2QiA4UQJXhFgdFoQS3cBVxFq9xHuzZoabl_ISGzF25BySqq_xcGmy-LEKEbF_W64GwianmRErL4YuTILVCNqDIMcaIDUv9Ax5nGg',
    enemyB:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAVqyj4-BanTdJq39CSKM65gSRTxa4M-3iXfV_7fMhkJyWP4zsO7y8hycY5uDti4Kbs5s3c_gepYJoBcFXCp3r37AX40lnq7GuXlr5hqVBwZGJRkpmgdeYbq-Qatwjsg2ict-EJ5iacceWAe9xfqyYveXlMO6M0_AdMZGOKb9FkXNyUWUDSp0xa_67ZkaviTHSmaeMW3BQwn4RkLCDKLqvluf8TN-m0HEHJv1aNPro88aRQ6Fnim1iM6A',
  };

  return (
    <div className="relative w-full min-h-screen bg-[#10141a] text-[#dfe2eb] flex flex-col font-sans select-none overflow-x-hidden">
      {/* Tactical HUD Corner Brackets */}
      <div className="pointer-events-none fixed inset-0 z-40 bg-[radial-gradient(ellipse_at_center,transparent_60%,rgba(10,14,20,0.85)_100%)]">
        <div className="absolute top-2 left-2 w-4 h-4 border-l-2 border-t-2 border-[#00daf3]/40" />
        <div className="absolute top-2 right-2 w-4 h-4 border-r-2 border-t-2 border-[#00daf3]/40" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-l-2 border-b-2 border-[#00daf3]/40" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-r-2 border-b-2 border-[#00daf3]/40" />
      </div>

      {/* TOP HEADER */}
      <header className="fixed top-0 w-full z-50 pt-safe bg-[#0a0e14]/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.5)] border-b border-white/5">
        <div className="h-14 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={onBack}
              className="w-10 h-10 flex items-center justify-center text-[#bac9cc] hover:text-[#c3f5ff] transition-colors rounded-lg hover:bg-white/5 active:scale-95"
              aria-label="Back to Lobby"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5 font-mono text-[9px] text-[#00daf3]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff] animate-pulse" />
                <span>SEC-SYS // 192.168.0.1</span>
              </div>
              <h1 className="font-bold text-sm tracking-wider uppercase text-[#dfe2eb]">
                Live Match Viewport
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1 font-mono text-[11px] text-[#bac9cc] bg-[#1c2026]/70 px-2 py-1 rounded border border-white/5">
              <BatteryCharging className="w-3.5 h-3.5 text-[#00e5ff]" />
              <span>98%</span>
            </div>
            <div className="w-8 h-8 rounded-full bg-[#c3f5ff] text-[#00363d] flex items-center justify-center font-bold text-xs shadow-md">
              <User className="w-4 h-4" />
            </div>
          </div>
        </div>
      </header>

      {/* MAIN VIEWPORT CONTENT */}
      <main className="flex-1 flex flex-col relative w-full pt-16 pb-8 px-4 max-w-lg mx-auto">
        <div className="flex flex-col gap-4">
          {/* SECTION TITLE & COUNTDOWN */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex flex-col">
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#00e5ff] font-bold">
                Competitive
              </span>
              <h2 className="text-xl font-extrabold tracking-tight text-white">
                Safehouse CQB
              </h2>
              <span className="text-xs text-[#bac9cc]">
                Ranked 2v2 • Best of 7 Rounds
              </span>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#262a31] border border-white/5 shadow-sm">
              <span
                className={`w-2 h-2 rounded-full ${
                  isDeploying ? 'bg-[#00e5ff] animate-ping' : 'bg-[#e2044d] animate-pulse'
                }`}
              />
              <span
                className={`font-mono text-xs font-bold uppercase tracking-wider ${
                  isDeploying ? 'text-[#00daf3]' : 'text-[#ffb2b9]'
                }`}
              >
                {isDeploying ? 'DEPLOYING...' : `STARTS IN 0:0${seconds}`}
              </span>
            </div>
          </div>

          {/* 2V2 MATCHUP SECTION */}
          <div className="flex flex-col gap-3">
            {/* ALLIES // ALPHA */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-3 rounded-full bg-[#e2044d]" />
                  <span className="font-mono text-xs uppercase tracking-wider text-[#ffb2b9] font-bold">
                    Allies // Alpha
                  </span>
                </div>
                <span className="font-mono text-[10px] text-[#ffb2b9]/80 font-medium">
                  Win Chance 52%
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {/* YOU (Ahmed) */}
                <div className="bg-[#181c22] border border-white/5 rounded-xl p-2.5 flex flex-col gap-2 shadow-lg relative overflow-hidden">
                  <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-[#e2044d]/10 rounded-full blur-xl pointer-events-none" />
                  <div className="flex items-center justify-between">
                    <div className="relative w-11 h-11 rounded-lg bg-[#31353c] overflow-hidden border border-white/10">
                      <img
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        alt={userName}
                        src={defaultAlliesPortraits.you}
                      />
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#e2044d] rounded-tl-sm" />
                    </div>
                    <div className="flex items-center gap-1 bg-[#1c2026] px-2 py-0.5 rounded-full border border-white/5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#e2044d]" />
                      <span className="font-mono text-[9px] text-[#ffb2b9] font-bold tracking-wider">
                        READY
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-xs truncate text-white">{userName}</span>
                      <span className="text-xs">{userFlag}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="font-mono text-[10px] text-[#00daf3] font-bold">LVL 42</span>
                      <span className="text-[#bac9cc] text-[10px]">•</span>
                      <span className="font-mono text-[10px] text-[#e2044d] font-semibold">
                        Diamond II
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px] text-[#bac9cc]">
                    <div className="flex items-center gap-1">
                      <Swords className="w-3 h-3 text-[#ffb2b9]" />
                      <span>Breacher</span>
                    </div>
                    <span className="font-mono text-[9px]">18ms</span>
                  </div>
                </div>

                {/* TEAMMATE (Yuki) */}
                <div className="bg-[#181c22] border border-white/5 rounded-xl p-2.5 flex flex-col gap-2 shadow-lg relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="relative w-11 h-11 rounded-lg bg-[#31353c] overflow-hidden border border-white/10">
                      <img
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        alt={teammate.name}
                        src={defaultAlliesPortraits.teammate}
                      />
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#e2044d] rounded-tl-sm" />
                    </div>
                    <div className="flex items-center gap-1 bg-[#1c2026] px-2 py-0.5 rounded-full border border-white/5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#e2044d]" />
                      <span className="font-mono text-[9px] text-[#ffb2b9] font-bold tracking-wider">
                        READY
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-xs truncate text-white">{teammate.name}</span>
                      <span className="text-xs">{teammate.country}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="font-mono text-[10px] text-[#00daf3] font-bold">BOT 50</span>
                      <span className="text-[#bac9cc] text-[10px]">•</span>
                      <span className="font-mono text-[10px] text-[#bac9cc]">Partner AI</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px] text-[#bac9cc]">
                    <div className="flex items-center gap-1">
                      <Radar className="w-3 h-3 text-[#00daf3]" />
                      <span>Recon</span>
                    </div>
                    <span className="font-mono text-[9px]">0ms</span>
                  </div>
                </div>
              </div>
            </div>

            {/* VS DIVIDER */}
            <div className="relative flex items-center justify-center py-0.5">
              <div className="absolute inset-x-0 h-px bg-[#31353c]" />
              <div className="relative bg-[#262a31] border border-white/10 px-3 py-0.5 rounded-full shadow-md flex items-center gap-1">
                <span className="font-mono text-xs text-[#00e5ff] font-black tracking-widest">
                  VS
                </span>
              </div>
            </div>

            {/* OPPONENTS // OMEGA */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-3 rounded-full bg-[#ffc681]" />
                  <span className="font-mono text-xs uppercase tracking-wider text-[#ffe9d3] font-bold">
                    Opponents // Omega
                  </span>
                </div>
                <span className="font-mono text-[10px] text-[#ffe9d3]/80 font-medium">
                  Rating 2,410
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {/* ENEMY A (Lucas) */}
                <div className="bg-[#181c22] border border-white/5 rounded-xl p-2.5 flex flex-col gap-2 shadow-lg relative overflow-hidden">
                  <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-[#ffc681]/10 rounded-full blur-xl pointer-events-none" />
                  <div className="flex items-center justify-between">
                    <div className="relative w-11 h-11 rounded-lg bg-[#31353c] overflow-hidden border border-white/10">
                      <img
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        alt={enemyA.name}
                        src={defaultOmegaPortraits.enemyA}
                      />
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#ffc681] rounded-tl-sm" />
                    </div>
                    <div className="flex items-center gap-1 bg-[#1c2026] px-2 py-0.5 rounded-full border border-white/5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#ffc681]" />
                      <span className="font-mono text-[9px] text-[#ffe9d3] font-bold tracking-wider">
                        READY
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-xs truncate text-white">{enemyA.name}</span>
                      <span className="text-xs">{enemyA.country}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="font-mono text-[10px] text-[#00daf3] font-bold">LVL 45</span>
                      <span className="text-[#bac9cc] text-[10px]">•</span>
                      <span className="font-mono text-[10px] text-[#ffc681] font-semibold">
                        Master I
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px] text-[#bac9cc]">
                    <div className="flex items-center gap-1">
                      <Shield className="w-3 h-3 text-[#ffc681]" />
                      <span>Defender</span>
                    </div>
                    <span className="font-mono text-[9px]">32ms</span>
                  </div>
                </div>

                {/* ENEMY B (Dmitri) */}
                <div className="bg-[#181c22] border border-white/5 rounded-xl p-2.5 flex flex-col gap-2 shadow-lg relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="relative w-11 h-11 rounded-lg bg-[#31353c] overflow-hidden border border-white/10">
                      <img
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        alt={enemyB.name}
                        src={defaultOmegaPortraits.enemyB}
                      />
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#ffc681] rounded-tl-sm" />
                    </div>
                    <div className="flex items-center gap-1 bg-[#1c2026] px-2 py-0.5 rounded-full border border-white/5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#ffc681]" />
                      <span className="font-mono text-[9px] text-[#ffe9d3] font-bold tracking-wider">
                        READY
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-xs truncate text-white">{enemyB.name}</span>
                      <span className="text-xs">{enemyB.country}</span>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="font-mono text-[10px] text-[#00daf3] font-bold">LVL 39</span>
                      <span className="text-[#bac9cc] text-[10px]">•</span>
                      <span className="font-mono text-[10px] text-[#ffc681] font-semibold">
                        Diamond III
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-white/5 text-[10px] text-[#bac9cc]">
                    <div className="flex items-center gap-1">
                      <Zap className="w-3 h-3 text-[#ffc681]" />
                      <span>Assault</span>
                    </div>
                    <span className="font-mono text-[9px]">41ms</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SAFEHOUSE INTERIOR MAP CARD */}
          <div className="bg-[#181c22] border border-white/5 rounded-xl p-3 shadow-md flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#00e5ff]" />
                <span className="font-bold text-xs text-white">Safehouse Interior</span>
              </div>
              <span className="font-mono text-[10px] text-[#bac9cc] font-semibold">
                SECTOR C-04
              </span>
            </div>

            <div className="relative w-full h-24 rounded-lg overflow-hidden bg-[#0a0e14] border border-white/5">
              <img
                className="w-full h-full object-cover opacity-80"
                referrerPolicy="no-referrer"
                alt="Safehouse Blueprint"
                src={blueprintImg}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0e14] via-transparent to-transparent" />
              <div className="absolute bottom-2 left-2 flex items-center gap-1 px-2 py-0.5 rounded bg-[#0a0e14]/80 backdrop-blur-md border border-white/10">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00e5ff]" />
                <span className="font-mono text-[10px] text-white">Ground Level & Mezzanine</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-0.5 text-[10px]">
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded bg-[#1c2026] text-[#ffb2b9] font-mono font-medium">
                  3 Breach Points
                </span>
                <span className="px-2 py-0.5 rounded bg-[#1c2026] text-[#bac9cc] font-mono font-medium">
                  3-Min Match
                </span>
              </div>
              <span className="font-mono text-[10px] text-[#849396]">No Friendly Fire</span>
            </div>
          </div>

          {/* ACTIVE LOADOUT TILE */}
          <div className="flex items-center justify-between bg-[#181c22] border border-white/5 p-2 rounded-xl shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-[#1c2026] flex items-center justify-center text-[#00e5ff] border border-white/5">
                <Shield className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-[9px] text-[#bac9cc] uppercase tracking-wider font-semibold">
                  ACTIVE LOADOUT
                </span>
                <span className="font-bold text-xs text-white">
                  {currentSkin.name} • SIG MPX 9mm
                </span>
              </div>
            </div>
            {onOpenSkins && (
              <button
                onClick={onOpenSkins}
                className="px-3 py-1 rounded-lg bg-[#262a31] hover:bg-[#353940] text-white font-mono text-[10px] font-bold transition-all active:scale-95 border border-white/10"
              >
                CHANGE
              </button>
            )}
          </div>

          {/* BOTTOM CONTROLS & START BUTTON */}
          <div className="flex items-center gap-2 pt-1">
            <div className="flex items-center gap-1 bg-[#181c22] border border-white/5 p-1 rounded-xl">
              <button
                onClick={toggleMic}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all active:scale-95 ${
                  isMicOn
                    ? 'bg-[#262a31] text-white'
                    : 'bg-[#93000a]/40 text-[#ffb4ab] border border-[#ffb4ab]/30'
                }`}
                title={isMicOn ? 'Mute Mic' : 'Unmute Mic'}
              >
                {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </button>
              <button
                onClick={toggleAudio}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all active:scale-95 ${
                  isAudioOn
                    ? 'bg-[#262a31] text-white'
                    : 'bg-[#93000a]/40 text-[#ffb4ab] border border-[#ffb4ab]/30'
                }`}
                title={isAudioOn ? 'Mute Audio' : 'Unmute Audio'}
              >
                {isAudioOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>
            </div>

            <button
              onClick={handleLaunch}
              disabled={isDeploying}
              className={`flex-1 h-12 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 cursor-pointer ${
                isDeploying
                  ? 'bg-[#e2044d] text-white animate-pulse'
                  : 'bg-[#00e5ff] hover:bg-[#9cf0ff] text-[#00363d] shadow-[0_0_20px_rgba(0,229,255,0.4)]'
              }`}
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{isDeploying ? 'CONNECTING TO SERVER...' : 'START INFILTRATION'}</span>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
