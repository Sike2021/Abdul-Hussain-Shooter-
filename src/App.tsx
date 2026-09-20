/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TacticalLobby } from './components/TacticalLobby';
import { LiveMatchViewport } from './components/LiveMatchViewport';
import { InGameCombatHUD } from './components/InGameCombatHUD';
import { SkinsModal } from './components/SkinsModal';
import { SettingsModal } from './components/SettingsModal';
import { EditNameModal } from './components/EditNameModal';
import { GameSettings, OperatorSkin, GameMode } from './types';
import { OPERATOR_SKINS } from './data/gameData';
import { soundEngine } from './utils/audio';
import { safeStorage } from './utils/storage';
import { GENERATED_PLAYERS_POOL, AutoPlayer } from './data/autoPlayers';
import { TACTICAL_AVATARS, TacticalAvatar } from './data/avatars';
import { AvatarPickerModal } from './components/AvatarPickerModal';
import { ModeSelectModal } from './components/ModeSelectModal';

export default function App() {
  const [screen, setScreen] = useState<'lobby' | 'matchmaking' | 'combat'>('lobby');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSkinsOpen, setIsSkinsOpen] = useState(false);
  const [isEditNameOpen, setIsEditNameOpen] = useState(false);
  const [isAvatarPickerOpen, setIsAvatarPickerOpen] = useState(false);
  const [isModeSelectOpen, setIsModeSelectOpen] = useState(false);

  // Active Game Mode: Open World (Erangel Survival) vs 2v2 CQB Safehouse
  const [gameMode, setGameMode] = useState<GameMode>(() => {
    return (safeStorage.getItem('ahshooter_gamemode') as GameMode) || 'open_world';
  });

  const handleSelectGameMode = (mode: GameMode) => {
    setGameMode(mode);
    safeStorage.setItem('ahshooter_gamemode', mode);
  };

  // Active 2D Tactical Avatar
  const [currentAvatar, setCurrentAvatar] = useState<TacticalAvatar>(() => {
    const savedAvatarId = safeStorage.getItem('ahshooter_avatar');
    const found = TACTICAL_AVATARS.find((a) => a.id === savedAvatarId);
    return found || TACTICAL_AVATARS[0];
  });

  // Active 2v2 Operatives from 100+ Pool
  const [teammate, setTeammate] = useState<AutoPlayer>(() => GENERATED_PLAYERS_POOL[0]);
  const [enemyA, setEnemyA] = useState<AutoPlayer>(() => GENERATED_PLAYERS_POOL[1]);
  const [enemyB, setEnemyB] = useState<AutoPlayer>(() => GENERATED_PLAYERS_POOL[2]);

  // User Profile (Customizable Callsign & Flag)
  const [userName, setUserName] = useState<string>(() => {
    return safeStorage.getItem('ahshooter_username') || 'Ahmed';
  });
  const [userFlag, setUserFlag] = useState<string>(() => {
    return safeStorage.getItem('ahshooter_flag') || '🇵🇰';
  });

  // Settings with Mobile Android defaults
  const [settings, setSettings] = useState<GameSettings>(() => {
    const saved = safeStorage.getItem('ahshooter_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // fallback
      }
    }
    return {
      sfxVolume: 0.7,
      joystickSensitivity: 1.1,
      aimAssist: true,
      showAiLasers: true,
      highContrastMinimap: true,
      hapticFeedback: true,
      controlMode: 'joystick',
      autoTarget: true,
    };
  });

  // Skins
  const [currentSkin, setCurrentSkin] = useState<OperatorSkin>(() => {
    const savedSkinId = safeStorage.getItem('ahshooter_skin');
    const found = OPERATOR_SKINS.find((s) => s.id === savedSkinId);
    return found || OPERATOR_SKINS[0];
  });

  // High Score
  const [highScore, setHighScore] = useState<number>(() => {
    const saved = safeStorage.getItem('ahshooter_highscore');
    return saved ? parseInt(saved, 10) : 18;
  });

  // Keep soundEngine in sync with volume
  useEffect(() => {
    soundEngine.setVolume(settings.sfxVolume);
  }, [settings.sfxVolume]);

  const handleUpdateSettings = (newSettings: GameSettings) => {
    setSettings(newSettings);
    safeStorage.setItem('ahshooter_settings', JSON.stringify(newSettings));
  };

  const handleSelectSkin = (skin: OperatorSkin) => {
    setCurrentSkin(skin);
    safeStorage.setItem('ahshooter_skin', skin.id);
  };

  const handleSelectAvatar = (avatar: TacticalAvatar) => {
    setCurrentAvatar(avatar);
    safeStorage.setItem('ahshooter_avatar', avatar.id);
  };

  const handleSaveName = (name: string, flag: string) => {
    setUserName(name);
    setUserFlag(flag);
    safeStorage.setItem('ahshooter_username', name);
    safeStorage.setItem('ahshooter_flag', flag);
  };

  const handleRecordKills = (kills: number) => {
    if (kills > highScore) {
      setHighScore(kills);
      safeStorage.setItem('ahshooter_highscore', kills.toString());
    }
  };

  // Auto-Matchmaking: picks 3 distinct operatives from the 120 auto-generated players pool
  const handleAutoMatchmake = () => {
    const total = GENERATED_PLAYERS_POOL.length;
    const idxTeammate = Math.floor(Math.random() * total);
    let idxEnemyA = Math.floor(Math.random() * total);
    while (idxEnemyA === idxTeammate) {
      idxEnemyA = Math.floor(Math.random() * total);
    }
    let idxEnemyB = Math.floor(Math.random() * total);
    while (idxEnemyB === idxTeammate || idxEnemyB === idxEnemyA) {
      idxEnemyB = Math.floor(Math.random() * total);
    }

    setTeammate(GENERATED_PLAYERS_POOL[idxTeammate]);
    setEnemyA(GENERATED_PLAYERS_POOL[idxEnemyA]);
    setEnemyB(GENERATED_PLAYERS_POOL[idxEnemyB]);
  };

  return (
    <div className="w-full min-h-screen bg-[#0b0f17] text-[#f1f5f9] overflow-hidden select-none font-sans">
      {screen === 'lobby' ? (
        <TacticalLobby
          onStartGame={() => setScreen('matchmaking')}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenSkins={() => setIsSkinsOpen(true)}
          onOpenEditName={() => setIsEditNameOpen(true)}
          onOpenAvatarPicker={() => setIsAvatarPickerOpen(true)}
          currentAvatar={currentAvatar}
          currentSkin={currentSkin}
          highScore={highScore}
          userName={userName}
          userFlag={userFlag}
          controlMode={settings.controlMode}
          onToggleControlMode={(mode) =>
            handleUpdateSettings({ ...settings, controlMode: mode })
          }
          teammate={teammate}
          enemyA={enemyA}
          enemyB={enemyB}
          onSelectTeammate={(player) => setTeammate(player)}
          onSelectEnemyA={(player) => setEnemyA(player)}
          onSelectEnemyB={(player) => setEnemyB(player)}
          onAutoMatchmake={handleAutoMatchmake}
          gameMode={gameMode}
          onOpenModeSelect={() => setIsModeSelectOpen(true)}
        />
      ) : screen === 'matchmaking' ? (
        <LiveMatchViewport
          onBack={() => setScreen('lobby')}
          onStartInfiltration={() => setScreen('combat')}
          userName={userName}
          userFlag={userFlag}
          currentAvatar={currentAvatar}
          currentSkin={currentSkin}
          teammate={teammate}
          enemyA={enemyA}
          enemyB={enemyB}
          onOpenSkins={() => setIsSkinsOpen(true)}
        />
      ) : (
        <InGameCombatHUD
          onBackToLobby={() => setScreen('lobby')}
          settings={settings}
          onUpdateSettings={handleUpdateSettings}
          currentAvatar={currentAvatar}
          operatorSkin={currentSkin}
          onRecordKills={handleRecordKills}
          userName={userName}
          userFlag={userFlag}
          teammate={teammate}
          enemyA={enemyA}
          enemyB={enemyB}
          gameMode={gameMode}
          onChangeGameMode={handleSelectGameMode}
        />
      )}

      {/* Mode Select Modal (2v2 CQB vs 20x Open World Erangel) */}
      <ModeSelectModal
        isOpen={isModeSelectOpen}
        onClose={() => setIsModeSelectOpen(false)}
        selectedMode={gameMode}
        onSelectMode={handleSelectGameMode}
      />

      {/* Operator Callsign Name Editor Modal */}
      <EditNameModal
        isOpen={isEditNameOpen}
        onClose={() => setIsEditNameOpen(false)}
        currentName={userName}
        currentFlag={userFlag}
        onSaveName={handleSaveName}
      />

      {/* 2D Tactical Avatar Picker Modal */}
      <AvatarPickerModal
        isOpen={isAvatarPickerOpen}
        onClose={() => setIsAvatarPickerOpen(false)}
        selectedAvatarId={currentAvatar.id}
        onSelectAvatar={handleSelectAvatar}
      />

      {/* Operator Skins Customizer Modal */}
      <SkinsModal
        isOpen={isSkinsOpen}
        onClose={() => setIsSkinsOpen(false)}
        selectedSkinId={currentSkin.id}
        onSelectSkin={handleSelectSkin}
      />

      {/* Combat & HUD Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
      />
    </div>
  );
}
