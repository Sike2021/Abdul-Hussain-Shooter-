import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  RotateCcw,
  ArrowLeft,
  Volume2,
  VolumeX,
  ShieldCheck,
  Zap,
  Target,
  Trophy,
  Flame,
  Radio,
} from 'lucide-react';
import {
  MAP_WIDTH,
  MAP_HEIGHT,
  INITIAL_WALLS,
  INITIAL_DOORS,
  INITIAL_OBJECTS,
  INITIAL_PICKUPS,
  ROOM_ZONES,
} from '../data/gameData';
import {
  Player,
  Wall,
  Door,
  HideObject,
  Bullet,
  Bomb,
  Explosion,
  Particle,
  KillFeedItem,
  GameSettings,
  OperatorSkin,
  PickupItem,
  Decal,
  GameMode,
  WeaponType,
  WEAPON_DEFS,
  LootItem,
  Creature,
} from '../types';
import {
  OPEN_WORLD_WIDTH,
  OPEN_WORLD_HEIGHT,
  generateOpenWorldWalls,
  generateOpenWorldObjects,
  generateOpenWorldLoot,
  generateOpenWorldCreatures,
  generateOpenWorldPlayers,
  OPEN_WORLD_ZONES,
} from '../data/openWorldData';
import { soundEngine } from '../utils/audio';
import { AutoPlayer } from '../data/autoPlayers';
import { TacticalAvatar, TACTICAL_AVATARS, getAvatarForPlayer } from '../data/avatars';
import {
  drawReal2DObject,
  drawReal2DPlayer,
  drawReal2DPickup,
  drawDecals,
  drawRoomFloors,
  drawOpenWorldTerrain,
  drawLootItem,
  drawCreature,
} from './renderReal2D';

interface InGameCombatHUDProps {
  onBackToLobby: () => void;
  settings: GameSettings;
  onUpdateSettings?: (settings: GameSettings) => void;
  currentAvatar?: TacticalAvatar;
  operatorSkin: OperatorSkin;
  onRecordKills: (kills: number) => void;
  userName?: string;
  userFlag?: string;
  teammate?: AutoPlayer;
  enemyA?: AutoPlayer;
  enemyB?: AutoPlayer;
  gameMode?: GameMode;
  onChangeGameMode?: (mode: GameMode) => void;
}

export const InGameCombatHUD: React.FC<InGameCombatHUDProps> = ({
  onBackToLobby,
  settings,
  onUpdateSettings,
  currentAvatar = TACTICAL_AVATARS[0],
  operatorSkin,
  onRecordKills,
  userName = 'Ahmed',
  userFlag = '🇵🇰',
  teammate,
  enemyA,
  enemyB,
  gameMode = 'open_world',
  onChangeGameMode,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const minimapRef = useRef<HTMLCanvasElement | null>(null);

  // Match State
  const [matchTime, setMatchTime] = useState(180); // 3 minutes
  const [teamKills, setTeamKills] = useState({ A: 0, B: 0 });
  const [isMatchOver, setIsMatchOver] = useState(false);
  const [killFeed, setKillFeed] = useState<KillFeedItem[]>([]);
  const [ammo, setAmmo] = useState(30);
  const [isReloading, setIsReloading] = useState(false);
  const [isNearDoor, setIsNearDoor] = useState(false);
  const [nearestDoorDist, setNearestDoorDist] = useState<number | null>(null);
  const [bombCooldownPercent, setBombCooldownPercent] = useState(0);
  const [jumpCooldownPercent, setJumpCooldownPercent] = useState(0);
  const [audioMuted, setAudioMuted] = useState(settings.sfxVolume <= 0);

  // Active Control Mode (Joystick vs D-Pad)
  const [controlMode, setControlMode] = useState<'joystick' | 'dpad'>(
    settings.controlMode || 'joystick'
  );

  const isWorld = gameMode === 'open_world';

  // Active Guns & Limited Bombs State
  const [activeWeapon, setActiveWeapon] = useState<WeaponType>(isWorld ? 'SMG' : 'AR');
  const [secondaryWeapon, setSecondaryWeapon] = useState<WeaponType | undefined>(isWorld ? 'AR' : 'SHOTGUN');
  const [activeSlot, setActiveSlot] = useState<1 | 2>(1);
  const [bombCount, setBombCount] = useState<number>(isWorld ? 3 : 2);
  const [armor, setArmor] = useState<number>(50);
  const [nearbyLoot, setNearbyLoot] = useState<LootItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [aliveCount, setAliveCount] = useState<number>(isWorld ? 30 : 4);
  const [mutantCount, setMutantCount] = useState<number>(isWorld ? 18 : 0);

  // Joystick & D-Pad refs
  const joystickContainerRef = useRef<HTMLDivElement | null>(null);
  const stickRef = useRef<HTMLDivElement | null>(null);
  const joystickActiveRef = useRef(false);
  const joystickStartRef = useRef({ x: 0, y: 0 });
  const moveVectorRef = useRef({ x: 0, y: 0 });
  const dpadStateRef = useRef<{ up: boolean; down: boolean; left: boolean; right: boolean }>({
    up: false,
    down: false,
    left: false,
    right: false,
  });
  const [dpadActive, setDpadActive] = useState<{ up: boolean; down: boolean; left: boolean; right: boolean }>({
    up: false,
    down: false,
    left: false,
    right: false,
  });

  const fireIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Game Engine Entities stored in refs for 60fps loop
  const playersRef = useRef<Player[]>(
    isWorld
      ? generateOpenWorldPlayers(userName, userFlag, operatorSkin.color, currentAvatar.id)
      : [
          {
            id: 'player-you',
            x: 140,
            y: 150,
            team: 'A',
            name: userName || 'Ahmed',
            flag: userFlag || '🇵🇰',
            hp: 100,
            maxHp: 100,
            angle: 0,
            isYou: true,
            color: operatorSkin.color,
            kills: 0,
            deaths: 0,
            jumping: false,
            jumpH: 0,
            jumpProg: 0,
            target: null,
            stuck: 0,
            ammo: 30,
            maxAmmo: 30,
            reloading: false,
            reloadProgress: 0,
            role: 'CQB Lead (You)',
            ping: 18,
            level: 42,
            weapon: 'AR',
            secondaryWeapon: 'SHOTGUN',
            bombs: 2,
            armor: 50,
            maxArmor: 100,
            isFriend: true,
          },
          {
            id: 'teammate-abdul',
            x: 190,
            y: 150,
            team: 'A',
            name: teammate?.name || 'Abdul Hussain (Squad Alpha)',
            flag: teammate?.flag || '🇵🇰',
            hp: 100,
            maxHp: 100,
            angle: 0,
            isYou: false,
            color: '#00e5ff',
            kills: 0,
            deaths: 0,
            jumping: false,
            jumpH: 0,
            jumpProg: 0,
            target: null,
            stuck: 0,
            ammo: 30,
            maxAmmo: 30,
            reloading: false,
            reloadProgress: 0,
            role: teammate?.role || 'Smart AI Breacher',
            ping: teammate?.ping || 22,
            level: teammate?.level || 45,
            weapon: 'SMG',
            bombs: 1,
            armor: 30,
            maxArmor: 100,
            isFriend: true,
          },
          {
            id: 'enemy-a',
            x: 680,
            y: 480,
            team: 'B',
            name: enemyA?.name || 'Abdul Hussain (Red Hostile 1)',
            flag: enemyA?.flag || '🇧🇷',
            hp: 100,
            maxHp: 100,
            angle: 0,
            isYou: false,
            color: '#ef4444',
            kills: 0,
            deaths: 0,
            jumping: false,
            jumpH: 0,
            jumpProg: 0,
            target: null,
            stuck: 0,
            ammo: 30,
            maxAmmo: 30,
            reloading: false,
            reloadProgress: 0,
            role: enemyA?.role || 'Assault Scout',
            ping: enemyA?.ping || 31,
            level: enemyA?.level || 38,
            weapon: 'AR',
            bombs: 1,
            armor: 30,
            maxArmor: 100,
            isFriend: false,
          },
          {
            id: 'enemy-b',
            x: 720,
            y: 480,
            team: 'B',
            name: enemyB?.name || 'Abdul Hussain (Red Hostile 2)',
            flag: enemyB?.flag || '🇷🇺',
            hp: 100,
            maxHp: 100,
            angle: 0,
            isYou: false,
            color: '#ef4444',
            kills: 0,
            deaths: 0,
            jumping: false,
            jumpH: 0,
            jumpProg: 0,
            target: null,
            stuck: 0,
            ammo: 30,
            maxAmmo: 30,
            reloading: false,
            reloadProgress: 0,
            role: enemyB?.role || 'Heavy Breacher',
            ping: enemyB?.ping || 28,
            level: enemyB?.level || 44,
            weapon: 'SHOTGUN',
            bombs: 1,
            armor: 30,
            maxArmor: 100,
            isFriend: false,
          },
        ]
  );

  const wallsRef = useRef<Wall[]>(isWorld ? generateOpenWorldWalls() : JSON.parse(JSON.stringify(INITIAL_WALLS)));
  const doorsRef = useRef<Door[]>(isWorld ? [] : JSON.parse(JSON.stringify(INITIAL_DOORS)));
  const objectsRef = useRef<HideObject[]>(isWorld ? generateOpenWorldObjects() : JSON.parse(JSON.stringify(INITIAL_OBJECTS)));
  const pickupsRef = useRef<PickupItem[]>(isWorld ? [] : JSON.parse(JSON.stringify(INITIAL_PICKUPS)));
  const lootRef = useRef<LootItem[]>(isWorld ? generateOpenWorldLoot() : []);
  const creaturesRef = useRef<Creature[]>(isWorld ? generateOpenWorldCreatures() : []);
  const decalsRef = useRef<Decal[]>([]);
  const bulletsRef = useRef<Bullet[]>([]);
  const bombsRef = useRef<Bomb[]>([]);
  const explosionsRef = useRef<Explosion[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const cameraRef = useRef({ x: 0, y: 0 });
  const keyboardKeysRef = useRef<{ [key: string]: boolean }>({});

  const fireCooldownRef = useRef(0);
  const bombCooldownRef = useRef(0);
  const jumpCooldownRef = useRef(0);
  const matchTimeRef = useRef(180);
  const teamKillsRef = useRef({ A: 0, B: 0 });
  const texturesRef = useRef<{ [key: string]: CanvasPattern | null }>({});
  const frameCountRef = useRef(0);

  // Trigger tactile haptic feedback
  const triggerHaptic = useCallback(() => {
    if (settings.hapticFeedback && typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(15);
    }
  }, [settings.hapticFeedback]);

  // Texture generator for canvas floors & walls
  useEffect(() => {
    const makePattern = (type: string): CanvasPattern | null => {
      const c = document.createElement('canvas');
      c.width = 64;
      c.height = 64;
      const ctx = c.getContext('2d');
      if (!ctx) return null;

      if (type === 'tile') {
        ctx.fillStyle = '#1e222d';
        ctx.fillRect(0, 0, 64, 64);
        ctx.strokeStyle = '#2b3242';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(0, 0, 32, 32);
        ctx.strokeRect(32, 0, 32, 32);
        ctx.strokeRect(0, 32, 32, 32);
        ctx.strokeRect(32, 32, 32, 32);
      } else if (type === 'carpet') {
        ctx.fillStyle = '#161922';
        ctx.fillRect(0, 0, 64, 64);
        ctx.fillStyle = '#222838';
        for (let i = 0; i < 64; i += 8) {
          ctx.fillRect(i, 0, 4, 64);
        }
      } else if (type === 'wood') {
        ctx.fillStyle = '#5c3820';
        ctx.fillRect(0, 0, 64, 64);
        ctx.strokeStyle = '#432612';
        ctx.lineWidth = 2;
        for (let i = 0; i < 64; i += 12) {
          ctx.beginPath();
          ctx.moveTo(0, i);
          ctx.lineTo(64, i);
          ctx.stroke();
        }
      } else if (type === 'wall') {
        ctx.fillStyle = '#27272a';
        ctx.fillRect(0, 0, 64, 64);
        ctx.fillStyle = '#3f3f46';
        ctx.fillRect(0, 0, 64, 3);
      } else if (type === 'metal') {
        ctx.fillStyle = '#334155';
        ctx.fillRect(0, 0, 64, 64);
        ctx.strokeStyle = '#475569';
        ctx.strokeRect(2, 2, 60, 60);
      } else if (type === 'sofa') {
        ctx.fillStyle = '#1e3a5f';
        ctx.fillRect(0, 0, 64, 64);
        ctx.strokeStyle = '#2563eb';
        ctx.strokeRect(4, 4, 56, 56);
      } else if (type === 'bed') {
        ctx.fillStyle = '#312e81';
        ctx.fillRect(0, 0, 64, 64);
        ctx.fillStyle = '#e0e7ff';
        ctx.fillRect(8, 10, 48, 20);
      }

      const mainCtx = canvasRef.current?.getContext('2d');
      return mainCtx ? mainCtx.createPattern(c, 'repeat') : null;
    };

    texturesRef.current = {
      tile: makePattern('tile'),
      carpet: makePattern('carpet'),
      wood: makePattern('wood'),
      wall: makePattern('wall'),
      metal: makePattern('metal'),
      sofa: makePattern('sofa'),
      bed: makePattern('bed'),
    };
  }, []);

  // Collision detection with forgiving 9px clearance
  const isPositionBlocked = (
    x: number,
    y: number,
    jumping: boolean,
    ignoreDoors: boolean = false
  ): boolean => {
    // Walls
    for (const w of wallsRef.current) {
      if (x > w.x - 9 && x < w.x + w.w + 9 && y > w.y - 9 && y < w.y + w.h + 9) {
        return true;
      }
    }

    // Doors (if closed, blocks unless ignoreDoors is true)
    if (!ignoreDoors) {
      for (const d of doorsRef.current) {
        if (!d.open && x > d.x - 9 && x < d.x + d.w + 9 && y > d.y - 9 && y < d.y + d.h + 9) {
          return true;
        }
      }
    }

    // Obstacles
    for (const o of objectsRef.current) {
      if (!o.block) continue;
      // If jumping AND object is vaultable (sofa, bed, table, desk), player passes over!
      if (jumping && o.jumpOver) continue;
      if (x > o.x - 9 && x < o.x + o.w + 9 && y > o.y - 9 && y < o.y + o.h + 9) {
        return true;
      }
    }

    return false;
  };

  // Perform Jump Action (Vault)
  const handleJump = useCallback(() => {
    const you = playersRef.current[0];
    if (you.jumping || jumpCooldownRef.current > 0) return;
    you.jumping = true;
    you.jumpProg = 0;
    jumpCooldownRef.current = 40; // ~0.66s cooldown
    soundEngine.playJump();
    triggerHaptic();

    // Spawn dust particles
    for (let i = 0; i < 4; i++) {
      particlesRef.current.push({
        id: Math.random(),
        x: you.x + (Math.random() - 0.5) * 16,
        y: you.y + (Math.random() - 0.5) * 16,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        life: 15,
        maxLife: 15,
        color: '#94a3b8',
        size: 2,
      });
    }
  }, [triggerHaptic]);

  // Perform Fire Action with different gun types (Shotgun, Sniper, AR, SMG, LMG)
  const handleFire = useCallback(() => {
    const you = playersRef.current[0];
    if (you.hp <= 0 || isMatchOver) return;

    if (you.ammo <= 0) {
      // Auto reload
      if (!you.reloading) {
        you.reloading = true;
        setIsReloading(true);
        soundEngine.playEmptyClick();
        setTimeout(() => {
          const def = WEAPON_DEFS[activeWeapon || 'SMG'];
          you.maxAmmo = def.magSize;
          you.ammo = def.magSize;
          you.reloading = false;
          setIsReloading(false);
          setAmmo(you.ammo);
        }, 1200);
      }
      return;
    }

    if (fireCooldownRef.current > 0 || you.reloading) return;

    const currentWep = activeWeapon || 'SMG';
    const def = WEAPON_DEFS[currentWep];

    if (currentWep === 'SHOTGUN') {
      // 5 spread pellets
      for (let i = 0; i < 5; i++) {
        const spread = (Math.random() - 0.5) * 0.28;
        bulletsRef.current.push({
          id: Math.random(),
          x: you.x + Math.cos(you.angle) * 18,
          y: you.y + Math.sin(you.angle) * 18,
          angle: you.angle + spread,
          team: you.team,
          owner: you,
          life: 36,
          maxLife: 36,
          damage: 18,
        });
      }
      fireCooldownRef.current = 24;
      soundEngine.playShotgun();
    } else if (currentWep === 'SNIPER') {
      // 1 high-velocity bullet
      bulletsRef.current.push({
        id: Math.random(),
        x: you.x + Math.cos(you.angle) * 22,
        y: you.y + Math.sin(you.angle) * 22,
        angle: you.angle + (Math.random() - 0.5) * 0.02,
        team: you.team,
        owner: you,
        life: 80,
        maxLife: 80,
        damage: 92,
      });
      fireCooldownRef.current = 38;
      soundEngine.playSniper();
    } else {
      // AR / SMG / LMG
      bulletsRef.current.push({
        id: Math.random(),
        x: you.x + Math.cos(you.angle) * 18,
        y: you.y + Math.sin(you.angle) * 18,
        angle: you.angle + (Math.random() - 0.5) * (currentWep === 'LMG' ? 0.12 : 0.06),
        team: you.team,
        owner: you,
        life: 65,
        maxLife: 65,
        damage: currentWep === 'AR' ? 28 : currentWep === 'LMG' ? 24 : 18,
      });
      fireCooldownRef.current = currentWep === 'SMG' ? 5 : currentWep === 'LMG' ? 6 : 8;
      soundEngine.playShoot();
    }

    you.ammo--;
    you.firingTimer = 4;
    setAmmo(you.ammo);
    triggerHaptic();

    // Expended brass casing decal on floor
    decalsRef.current.push({
      id: Math.random(),
      x: you.x - Math.cos(you.angle) * 8 + (Math.random() - 0.5) * 4,
      y: you.y - Math.sin(you.angle) * 8 + (Math.random() - 0.5) * 4,
      type: 'CASING',
      angle: you.angle + Math.PI / 2 + (Math.random() - 0.5) * 0.4,
      size: currentWep === 'SNIPER' ? 4.5 : 3,
      alpha: 0.85,
    });
    if (decalsRef.current.length > 50) decalsRef.current.shift();

    // Muzzle flash particle
    particlesRef.current.push({
      id: Math.random(),
      x: you.x + Math.cos(you.angle) * 20,
      y: you.y + Math.sin(you.angle) * 20,
      vx: Math.cos(you.angle) * 3,
      vy: Math.sin(you.angle) * 3,
      life: 6,
      maxLife: 6,
      color: '#fef08a',
      size: currentWep === 'SHOTGUN' ? 6 : 4,
    });
  }, [isMatchOver, activeWeapon, triggerHaptic]);

  // Drop Bomb (Frag Grenade) - Limited count & NO SELF-DAMAGE
  const handleBomb = useCallback(() => {
    const you = playersRef.current[0];
    if (you.hp <= 0 || bombCooldownRef.current > 0 || isMatchOver) return;

    if ((you.bombs || 0) <= 0) {
      soundEngine.playEmptyClick();
      setToastMessage('OUT OF BOMBS! LOOT A BOMB CRATE 📦');
      setTimeout(() => setToastMessage(null), 2500);
      return;
    }

    you.bombs = (you.bombs || 0) - 1;
    setBombCount(you.bombs);

    bombsRef.current.push({
      id: Math.random(),
      x: you.x + Math.cos(you.angle) * 45,
      y: you.y + Math.sin(you.angle) * 45,
      timer: 90, // ~1.5s fuse
      maxTimer: 90,
      owner: you,
    });

    bombCooldownRef.current = 150; // 2.5s cooldown
    soundEngine.playBombTick();
    triggerHaptic();
  }, [isMatchOver, triggerHaptic]);

  // Weapon Slot Switching ([1], [2], or [Q])
  const handleSwitchWeapon = useCallback((slot: 1 | 2) => {
    const you = playersRef.current[0];
    setActiveSlot(slot);
    if (slot === 1) {
      if (activeWeapon !== you.weapon) {
        const prev = activeWeapon;
        setActiveWeapon(you.weapon || 'SMG');
        setSecondaryWeapon(prev);
        const def = WEAPON_DEFS[you.weapon || 'SMG'];
        you.maxAmmo = def.magSize;
        you.ammo = Math.min(you.ammo, def.magSize);
        setAmmo(you.ammo);
        soundEngine.playPickup(false);
      }
    } else if (slot === 2 && secondaryWeapon) {
      const prev = activeWeapon;
      setActiveWeapon(secondaryWeapon);
      setSecondaryWeapon(prev);
      you.weapon = secondaryWeapon;
      you.secondaryWeapon = prev;
      const def = WEAPON_DEFS[secondaryWeapon];
      you.maxAmmo = def.magSize;
      you.ammo = Math.min(you.ammo, def.magSize);
      setAmmo(you.ammo);
      soundEngine.playPickup(false);
    }
  }, [activeWeapon, secondaryWeapon]);

  const handleSwapWeapon = useCallback(() => {
    if (!secondaryWeapon) return;
    setActiveSlot((prevSlot) => (prevSlot === 1 ? 2 : 1));
    const prev = activeWeapon;
    setActiveWeapon(secondaryWeapon);
    setSecondaryWeapon(prev);
    const you = playersRef.current[0];
    you.weapon = secondaryWeapon;
    you.secondaryWeapon = prev;
    const def = WEAPON_DEFS[secondaryWeapon];
    you.maxAmmo = def.magSize;
    you.ammo = Math.min(you.ammo, def.magSize);
    setAmmo(you.ammo);
    soundEngine.playPickup(false);
  }, [activeWeapon, secondaryWeapon]);

  // Loot Pickup Action ([F] or Tap HUD prompt)
  const handlePickupLoot = useCallback((item: LootItem) => {
    const you = playersRef.current[0];
    if (item.weaponType) {
      const oldWeapon = activeWeapon;
      setActiveWeapon(item.weaponType);
      you.weapon = item.weaponType;
      if (!secondaryWeapon) {
        setSecondaryWeapon(oldWeapon);
        you.secondaryWeapon = oldWeapon;
      }
      const def = WEAPON_DEFS[item.weaponType];
      you.maxAmmo = def.magSize;
      you.ammo = def.magSize;
      setAmmo(def.magSize);
      item.respawnTimer = 600;
      soundEngine.playPickup(false);
      triggerHaptic();
      setToastMessage(`EQUIPPED ${item.name} (${def.caliber})`);
      setTimeout(() => setToastMessage(null), 2500);
    } else if (item.type === 'BOMB') {
      setBombCount((c) => Math.min(6, c + 2));
      item.respawnTimer = 600;
      soundEngine.playPickup(false);
      triggerHaptic();
      setToastMessage('COLLECTED +2 FRAG BOMBS');
      setTimeout(() => setToastMessage(null), 2500);
    } else if (item.type === 'ARMOR') {
      setArmor((a) => Math.min(100, a + 40));
      item.respawnTimer = 600;
      soundEngine.playPickup(true);
      triggerHaptic();
      setToastMessage('EQUIPPED +40 BODY ARMOR');
      setTimeout(() => setToastMessage(null), 2500);
    } else if (item.type === 'MEDKIT') {
      you.hp = Math.min(you.maxHp, you.hp + 50);
      item.respawnTimer = 600;
      soundEngine.playPickup(true);
      triggerHaptic();
      setToastMessage('HEALED +50 HP');
      setTimeout(() => setToastMessage(null), 2500);
    } else if (item.type === 'AMMO') {
      you.ammo = you.maxAmmo;
      setAmmo(you.maxAmmo);
      item.respawnTimer = 600;
      soundEngine.playPickup(false);
      triggerHaptic();
      setToastMessage('FULL AMMO RESTOCK');
      setTimeout(() => setToastMessage(null), 2500);
    }
  }, [activeWeapon, secondaryWeapon, triggerHaptic]);

  // Contextual Door Breach / Open Action
  const handleToggleDoor = useCallback(() => {
    const you = playersRef.current[0];
    let nearest: Door | null = null;
    let minDist = 70;

    doorsRef.current.forEach((d) => {
      const dist = Math.hypot(you.x - (d.x + d.w / 2), you.y - (d.y + d.h / 2));
      if (dist < minDist) {
        minDist = dist;
        nearest = d;
      }
    });

    if (nearest) {
      const door = nearest as Door;
      door.open = !door.open;
      soundEngine.playDoor(door.open);
      triggerHaptic();

      // Spawn breach wood splinter particles
      for (let i = 0; i < 8; i++) {
        particlesRef.current.push({
          id: Math.random(),
          x: door.x + door.w / 2,
          y: door.y + door.h / 2,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
          life: 20,
          maxLife: 20,
          color: '#d97706',
          size: 2.5,
        });
      }
    }
  }, [triggerHaptic]);

  // Respawn dead player in open area
  const respawnPlayer = (p: Player) => {
    p.hp = p.maxHp;
    p.jumping = false;
    p.jumpH = 0;
    p.ammo = p.maxAmmo;
    if (isWorld) {
      // Spawn within island bounds
      p.x = 400 + Math.random() * (OPEN_WORLD_WIDTH - 800);
      p.y = 400 + Math.random() * (OPEN_WORLD_HEIGHT - 800);
    } else {
      if (p.team === 'A') {
        p.x = 140 + Math.random() * 40;
        p.y = 140 + Math.random() * 40;
      } else {
        p.x = 680 + Math.random() * 40;
        p.y = 480 + Math.random() * 40;
      }
    }
  };

  // Record a kill in the feed & score with auto-fade to prevent screen fill
  const registerKill = (killer: Player, victim: Player, weapon: string) => {
    killer.kills++;
    victim.deaths++;
    teamKillsRef.current[killer.team]++;
    setTeamKills({ ...teamKillsRef.current });

    if (killer.isYou) {
      soundEngine.playKill();
      onRecordKills(killer.kills);
    }

    const newFeed: KillFeedItem = {
      id: Math.random().toString(),
      killerName: killer.name,
      killerTeam: killer.team,
      victimName: victim.name,
      victimTeam: victim.team,
      weapon,
      timestamp: Date.now(),
    };

    // Keep to max 2 items so it NEVER fills the screen!
    setKillFeed((prev) => [newFeed, ...prev.slice(0, 1)]);
    setTimeout(() => {
      setKillFeed((prev) => prev.filter((k) => k.id !== newFeed.id));
    }, 3200);

    setTimeout(() => {
      if (!isMatchOver) {
        respawnPlayer(victim);
      }
    }, 3000);
  };

  // Keyboard controls listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keyboardKeysRef.current[e.key.toLowerCase()] = true;
      if (e.key === ' ' || e.code === 'Space') {
        handleFire();
      }
      if (e.key.toLowerCase() === 'j') {
        handleJump();
      }
      if (e.key.toLowerCase() === 'b') {
        handleBomb();
      }
      if (e.key === '1') {
        handleSwitchWeapon(1);
      }
      if (e.key === '2') {
        handleSwitchWeapon(2);
      }
      if (e.key.toLowerCase() === 'q') {
        handleSwapWeapon();
      }
      if (e.key.toLowerCase() === 'f') {
        if (nearbyLoot) {
          handlePickupLoot(nearbyLoot);
        } else {
          handleToggleDoor();
        }
      }
      if (e.key.toLowerCase() === 'e') {
        handleToggleDoor();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keyboardKeysRef.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleFire, handleJump, handleBomb, handleToggleDoor, handleSwitchWeapon, handleSwapWeapon, handlePickupLoot, nearbyLoot]);

  // Main 60fps Game Loop
  useEffect(() => {
    let animId: number;
    let lastTick = performance.now();

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const mini = minimapRef.current;
    const mctx = mini?.getContext('2d');

    // Resize canvas to full window
    const resize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };
    resize();
    window.addEventListener('resize', resize);

    const gameLoop = (now: number) => {
      const dt = (now - lastTick) / 1000;
      lastTick = now;

      // 1. Timer update
      if (!isMatchOver) {
        matchTimeRef.current -= 1 / 60;
        if (matchTimeRef.current <= 0) {
          matchTimeRef.current = 0;
          setIsMatchOver(true);
          soundEngine.playVictory();
        }
        setMatchTime(Math.max(0, Math.floor(matchTimeRef.current)));

        // Urgent beep at <=30s once per second
        if (matchTimeRef.current <= 30 && Math.floor(matchTimeRef.current * 60) % 60 === 0) {
          soundEngine.playCountdownTick(true);
        }
      }

      // Update cooldowns UI
      if (bombCooldownRef.current > 0) {
        bombCooldownRef.current--;
        setBombCooldownPercent(bombCooldownRef.current / 150);
      } else {
        setBombCooldownPercent(0);
      }

      if (jumpCooldownRef.current > 0) {
        jumpCooldownRef.current--;
        setJumpCooldownPercent(jumpCooldownRef.current / 40);
      } else {
        setJumpCooldownPercent(0);
      }

      if (fireCooldownRef.current > 0) {
        fireCooldownRef.current--;
      }

      // 2. You (Ahmed) movement
      const you = playersRef.current[0];
      if (you.hp > 0 && !isMatchOver) {
        let mx = moveVectorRef.current.x * settings.joystickSensitivity;
        let my = moveVectorRef.current.y * settings.joystickSensitivity;

        // Keyboard fallback
        const k = keyboardKeysRef.current;
        if (k['w'] || k['arrowup']) my = -1;
        if (k['s'] || k['arrowdown']) my = 1;
        if (k['a'] || k['arrowleft']) mx = -1;
        if (k['d'] || k['arrowright']) mx = 1;

        if (mx !== 0 || my !== 0) {
          const mag = Math.hypot(mx, my);
          const normX = mx / (mag || 1);
          const normY = my / (mag || 1);
          const speed = 3.4;

          const nextX = you.x + normX * speed;
          const nextY = you.y + normY * speed;

          if (!isPositionBlocked(nextX, you.y, you.jumping)) {
            you.x = nextX;
            you.walkProg = (you.walkProg || 0) + 0.25;
          }
          if (!isPositionBlocked(you.x, nextY, you.jumping)) {
            you.y = nextY;
            you.walkProg = (you.walkProg || 0) + 0.25;
          }

          you.angle = Math.atan2(normY, normX);
        }

        you.firingTimer = Math.max(0, (you.firingTimer || 0) - 1);

        // Smart Auto-Aim Logic (Tracks nearest enemy on Android/touch)
        if (settings.autoTarget || settings.aimAssist) {
          let closestEnemy: Player | null = null;
          let closestDist = 550; // max engagement distance
          for (let i = 1; i < playersRef.current.length; i++) {
            const enemy = playersRef.current[i];
            if (enemy.team !== you.team && enemy.hp > 0) {
              const d = Math.hypot(enemy.x - you.x, enemy.y - you.y);
              if (d < closestDist) {
                closestDist = d;
                closestEnemy = enemy;
              }
            }
          }
          if (closestEnemy) {
            you.target = closestEnemy;
            you.angle = Math.atan2(closestEnemy.y - you.y, closestEnemy.x - you.x);
          } else {
            you.target = null;
          }
        }
      }

      // Jump progression animation for all jumping players
      playersRef.current.forEach((p) => {
        if (p.jumping) {
          p.jumpProg += 0.08;
          p.jumpH = Math.sin(p.jumpProg * Math.PI) * 28;
          if (p.jumpProg >= 1) {
            p.jumping = false;
            p.jumpH = 0;
            p.jumpProg = 0;
          }
        }
      });

      // Contextual Door Proximity Check (<70px)
      let nearAnyDoor = false;
      let closestDoorDist = 999;
      doorsRef.current.forEach((d) => {
        const dist = Math.hypot(you.x - (d.x + d.w / 2), you.y - (d.y + d.h / 2));
        if (dist < 70) {
          nearAnyDoor = true;
          closestDoorDist = Math.min(closestDoorDist, dist);
        }
      });
      setIsNearDoor(nearAnyDoor);
      setNearestDoorDist(nearAnyDoor ? Math.round(closestDoorDist / 10) : null);

      // Open World Ground Loot Proximity Check (<55px)
      if (isWorld) {
        let nearestLootItem: LootItem | null = null;
        let minLootDist = 55;
        lootRef.current.forEach((item) => {
          if (item.respawnTimer > 0) return;
          const dist = Math.hypot(you.x - item.x, you.y - item.y);
          if (dist < minLootDist) {
            minLootDist = dist;
            nearestLootItem = item;
          }
        });
        setNearbyLoot(nearestLootItem);

        // Update Creatures (Mutant Stalkers and Beasts roaming Erangel island)
        creaturesRef.current.forEach((c) => {
          if (c.hp <= 0) return;
          c.animTick = (c.animTick || 0) + 1;

          // Find nearest living human target (Ahmed or AI bots)
          let nearestTarget: Player | null = null;
          let minTargetDist = 420;
          playersRef.current.forEach((pl) => {
            if (pl.hp <= 0) return;
            const dist = Math.hypot(pl.x - c.x, pl.y - c.y);
            if (dist < minTargetDist) {
              minTargetDist = dist;
              nearestTarget = pl;
            }
          });

          if (nearestTarget) {
            const tgt = nearestTarget as Player;
            const ang = Math.atan2(tgt.y - c.y, tgt.x - c.x);
            c.angle = ang;

            if (minTargetDist > 26) {
              c.x += Math.cos(ang) * c.speed;
              c.y += Math.sin(ang) * c.speed;
            } else {
              // Attack cooldown
              c.attackCooldown = (c.attackCooldown || 0) - 1;
              if (c.attackCooldown <= 0) {
                tgt.hp = Math.max(0, tgt.hp - c.damage);
                c.attackCooldown = 50;
                soundEngine.playHit();
                if (tgt.isYou) {
                  triggerHaptic();
                }
                if (tgt.hp <= 0) {
                  const newFeed: KillFeedItem = {
                    id: Math.random().toString(),
                    killerName: c.type === 'beast' ? 'MUTANT BEAST' : 'INFECTED STALKER',
                    killerTeam: 'B',
                    victimName: tgt.name,
                    victimTeam: tgt.team,
                    weapon: 'CLAWS',
                    timestamp: Date.now(),
                  };
                  setKillFeed((prev) => [newFeed, ...prev.slice(0, 1)]);
                  setTimeout(() => {
                    setKillFeed((prev) => prev.filter((k) => k.id !== newFeed.id));
                  }, 3200);
                  setTimeout(() => respawnPlayer(tgt), 3000);
                }
              }
            }
          }
        });
      } else {
        setNearbyLoot(null);
      }

      // 3. SMART AI (Yuki and Enemies Lucas & Dmitri)
      playersRef.current.forEach((p) => {
        if (p.isYou || p.hp <= 0 || isMatchOver) return;

        // Find nearest living enemy
        const enemyList = playersRef.current.filter((e) => e.team !== p.team && e.hp > 0);
        if (enemyList.length === 0) return;

        const enemy = enemyList.sort(
          (a, b) => Math.hypot(a.x - p.x, a.y - p.y) - Math.hypot(b.x - p.x, b.y - p.y)
        )[0];
        p.target = enemy;

        const dx = enemy.x - p.x;
        const dy = enemy.y - p.y;
        const dist = Math.hypot(dx, dy);
        p.angle = Math.atan2(dy, dx);

        // Check if path is blocked by closed door
        const stepX = p.x + Math.cos(p.angle) * 18;
        const stepY = p.y + Math.sin(p.angle) * 18;
        const blockedByDoor = isPositionBlocked(stepX, stepY, false, false);

        if (blockedByDoor) {
          // Find closest door to reach enemy
          let bestDoor: Door | null = null;
          let bestDoorDist = 9999;
          doorsRef.current.forEach((d) => {
            const distP = Math.hypot(p.x - (d.x + d.w / 2), p.y - (d.y + d.h / 2));
            const distE = Math.hypot(enemy.x - (d.x + d.w / 2), enemy.y - (d.y + d.h / 2));
            if (distP + distE < bestDoorDist) {
              bestDoorDist = distP + distE;
              bestDoor = d;
            }
          });

          if (bestDoor) {
            const bd = bestDoor as Door;
            const doorMidX = bd.x + bd.w / 2;
            const doorMidY = bd.y + bd.h / 2;
            const distToDoor = Math.hypot(p.x - doorMidX, p.y - doorMidY);

            // Open door if in proximity
            if (distToDoor < 52 && !bd.open) {
              bd.open = true;
              soundEngine.playDoor(true);
            }

            // Path towards the door
            const angToDoor = Math.atan2(doorMidY - p.y, doorMidX - p.x);
            const nx = p.x + Math.cos(angToDoor) * 1.5;
            const ny = p.y + Math.sin(angToDoor) * 1.5;
            if (!isPositionBlocked(nx, p.y, p.jumping)) p.x = nx;
            if (!isPositionBlocked(p.x, ny, p.jumping)) p.y = ny;
          }
        } else {
          // Direct hunting movement
          if (dist > 75) {
            const nx = p.x + Math.cos(p.angle) * 1.6;
            const ny = p.y + Math.sin(p.angle) * 1.6;
            let moved = false;
            if (!isPositionBlocked(nx, p.y, p.jumping)) {
              p.x = nx;
              moved = true;
            }
            if (!isPositionBlocked(p.x, ny, p.jumping)) {
              p.y = ny;
              moved = true;
            }
            if (moved) {
              p.walkProg = (p.walkProg || 0) + 0.18;
            }

            if (!moved) {
              p.stuck = (p.stuck || 0) + 1;
              if (p.stuck > 18 && Math.random() < 0.15) {
                // Tactical jump over low obstacles!
                p.jumping = true;
                p.jumpProg = 0;
                p.stuck = 0;
              }
            } else {
              p.stuck = 0;
            }
          }
        }

        p.firingTimer = Math.max(0, (p.firingTimer || 0) - 1);

        // Smart AI shooting
        if (dist < 280 && Math.random() < 0.04) {
          p.firingTimer = 4;
          bulletsRef.current.push({
            id: Math.random(),
            x: p.x + Math.cos(p.angle) * 16,
            y: p.y + Math.sin(p.angle) * 16,
            angle: p.angle + (Math.random() - 0.5) * 0.12,
            team: p.team,
            owner: p,
            life: 60,
            maxLife: 60,
          });
          soundEngine.playShoot();

          // Spent casing decal
          decalsRef.current.push({
            id: Math.random(),
            x: p.x - Math.cos(p.angle) * 6,
            y: p.y - Math.sin(p.angle) * 6,
            type: 'CASING',
            angle: p.angle + Math.PI / 2 + (Math.random() - 0.5) * 0.4,
            size: 3,
            alpha: 0.8,
          });
          if (decalsRef.current.length > 50) decalsRef.current.shift();
        }
      });

      // 4. Update Bullets
      for (let bi = bulletsRef.current.length - 1; bi >= 0; bi--) {
        const b = bulletsRef.current[bi];
        b.x += Math.cos(b.angle) * 9;
        b.y += Math.sin(b.angle) * 9;
        b.life--;

        // Collision with walls/closed doors
        if (isPositionBlocked(b.x, b.y, true, false)) {
          // Splinter effect
          particlesRef.current.push({
            id: Math.random(),
            x: b.x,
            y: b.y,
            vx: -Math.cos(b.angle) * 2,
            vy: -Math.sin(b.angle) * 2,
            life: 8,
            maxLife: 8,
            color: '#fbbf24',
            size: 2,
          });
          bulletsRef.current.splice(bi, 1);
          continue;
        }

        // Hit player
        let hit = false;
        for (const p of playersRef.current) {
          if (p.hp > 0 && b.team !== p.team && Math.hypot(p.x - b.x, p.y - b.y) < 16) {
            const dmg = p.jumping ? 14 : 26;
            p.hp = Math.max(0, p.hp - dmg);
            soundEngine.playHit();
            hit = true;

            // Blood floor decal
            decalsRef.current.push({
              id: Math.random(),
              x: p.x + (Math.random() - 0.5) * 8,
              y: p.y + (Math.random() - 0.5) * 8,
              type: 'BLOOD',
              angle: Math.random() * Math.PI * 2,
              size: 4 + Math.random() * 4,
              alpha: 0.75,
            });
            if (decalsRef.current.length > 50) decalsRef.current.shift();

            // Blood/impact sparks
            for (let i = 0; i < 5; i++) {
              particlesRef.current.push({
                id: Math.random(),
                x: p.x,
                y: p.y,
                vx: (Math.random() - 0.5) * 3,
                vy: (Math.random() - 0.5) * 3,
                life: 12,
                maxLife: 12,
                color: '#ef4444',
                size: 2.5,
              });
            }

            if (p.hp <= 0) {
              registerKill(b.owner, p, b.owner.weapon || 'AR');
            }
            break;
          }
        }

        // Hit creature (Open World)
        if (!hit && isWorld) {
          for (const c of creaturesRef.current) {
            if (c.hp > 0 && Math.hypot(c.x - b.x, c.y - b.y) < 20) {
              const dmg = b.damage || 28;
              c.hp = Math.max(0, c.hp - dmg);
              soundEngine.playHit();
              hit = true;

              for (let i = 0; i < 4; i++) {
                particlesRef.current.push({
                  id: Math.random(),
                  x: c.x,
                  y: c.y,
                  vx: (Math.random() - 0.5) * 3,
                  vy: (Math.random() - 0.5) * 3,
                  life: 12,
                  maxLife: 12,
                  color: '#ec4899',
                  size: 2.5,
                });
              }

              if (c.hp <= 0) {
                b.owner.kills++;
                teamKillsRef.current[b.owner.team]++;
                setTeamKills({ ...teamKillsRef.current });
                if (b.owner.isYou) {
                  soundEngine.playKill();
                  onRecordKills(b.owner.kills);
                }
                const newFeed: KillFeedItem = {
                  id: Math.random().toString(),
                  killerName: b.owner.name,
                  killerTeam: b.owner.team,
                  victimName: c.type === 'beast' ? 'MUTANT BEAST' : 'INFECTED STALKER',
                  victimTeam: 'B',
                  weapon: b.owner.weapon || 'GUN',
                  timestamp: Date.now(),
                };
                setKillFeed((prev) => [newFeed, ...prev.slice(0, 1)]);
                setTimeout(() => {
                  setKillFeed((prev) => prev.filter((k) => k.id !== newFeed.id));
                }, 3200);
              }
              break;
            }
          }
        }

        if (hit || b.life <= 0) {
          bulletsRef.current.splice(bi, 1);
        }
      }

      // 5. Update Bombs (NO SELF-DAMAGE GUARANTEED)
      for (let i = bombsRef.current.length - 1; i >= 0; i--) {
        const bomb = bombsRef.current[i];
        bomb.timer--;

        if (bomb.timer % 20 === 0) {
          soundEngine.playBombTick();
        }

        if (bomb.timer <= 0) {
          // Detonate
          soundEngine.playExplosion();
          explosionsRef.current.push({
            id: Math.random(),
            x: bomb.x,
            y: bomb.y,
            radius: 5,
            maxRadius: 100,
            life: 25,
            maxLife: 25,
          });

          // Damage check with strict NO SELF-DAMAGE / FRIENDLY FIRE SAFEGUARD
          playersRef.current.forEach((p) => {
            // SAFEGUARD: bombs NEVER damage own team!
            if (p.team === bomb.owner.team) return;

            const dist = Math.hypot(p.x - bomb.x, p.y - bomb.y);
            if (dist < 100 && p.hp > 0) {
              const dmg = Math.round((1 - dist / 100) * 85);
              p.hp = Math.max(0, p.hp - dmg);
              if (p.hp <= 0) {
                registerKill(bomb.owner, p, 'FRAG');
              }
            }
          });

          // Damage creatures (Open World)
          if (isWorld) {
            creaturesRef.current.forEach((c) => {
              if (c.hp <= 0) return;
              const dist = Math.hypot(c.x - bomb.x, c.y - bomb.y);
              if (dist < 110) {
                const dmg = Math.round((1 - dist / 110) * 110);
                c.hp = Math.max(0, c.hp - dmg);
                if (c.hp <= 0) {
                  bomb.owner.kills++;
                  teamKillsRef.current[bomb.owner.team]++;
                  setTeamKills({ ...teamKillsRef.current });
                  if (bomb.owner.isYou) {
                    soundEngine.playKill();
                    onRecordKills(bomb.owner.kills);
                  }
                  const newFeed: KillFeedItem = {
                    id: Math.random().toString(),
                    killerName: bomb.owner.name,
                    killerTeam: bomb.owner.team,
                    victimName: c.type === 'beast' ? 'MUTANT BEAST' : 'INFECTED STALKER',
                    victimTeam: 'B',
                    weapon: 'FRAG',
                    timestamp: Date.now(),
                  };
                  setKillFeed((prev) => [newFeed, ...prev.slice(0, 1)]);
                  setTimeout(() => {
                    setKillFeed((prev) => prev.filter((k) => k.id !== newFeed.id));
                  }, 3200);
                }
              }
            });
          }

          // Explosive shrapnel particles
          for (let p = 0; p < 18; p++) {
            const ang = (Math.PI * 2 * p) / 18;
            particlesRef.current.push({
              id: Math.random(),
              x: bomb.x,
              y: bomb.y,
              vx: Math.cos(ang) * (3 + Math.random() * 3),
              vy: Math.sin(ang) * (3 + Math.random() * 3),
              life: 20,
              maxLife: 20,
              color: Math.random() > 0.5 ? '#f97316' : '#ef4444',
              size: 3.5,
            });
          }

          bombsRef.current.splice(i, 1);
        }
      }

      // 6. Update Explosions & Particles
      for (let i = explosionsRef.current.length - 1; i >= 0; i--) {
        const exp = explosionsRef.current[i];
        exp.life--;
        exp.radius += (exp.maxRadius - exp.radius) * 0.18;
        if (exp.life <= 0) explosionsRef.current.splice(i, 1);
      }

      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const pt = particlesRef.current[i];
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.life--;
        if (pt.life <= 0) particlesRef.current.splice(i, 1);
      }

      // Frame counter for animations (lighting, radar, idle bob)
      frameCountRef.current++;

      // 6.5. Update pickups collection and respawn
      pickupsRef.current.forEach((pk) => {
        if (pk.respawnTimer > 0) {
          pk.respawnTimer--;
          return;
        }

        for (const p of playersRef.current) {
          if (p.hp <= 0) continue;
          const dist = Math.hypot(p.x - pk.x, p.y - pk.y);
          if (dist < 26) {
            if (pk.type === 'MEDKIT') {
              if (p.hp < p.maxHp) {
                p.hp = Math.min(p.maxHp, p.hp + 35);
                pk.respawnTimer = 600; // 10s respawn
                if (p.isYou) {
                  soundEngine.playPickup(true);
                  triggerHaptic();
                  for (let i = 0; i < 8; i++) {
                    particlesRef.current.push({
                      id: Math.random(),
                      x: p.x,
                      y: p.y,
                      vx: (Math.random() - 0.5) * 2.5,
                      vy: -1.5 - Math.random() * 2,
                      life: 25,
                      maxLife: 25,
                      color: '#10b981',
                      size: 3,
                    });
                  }
                }
                break;
              }
            } else if (pk.type === 'AMMO') {
              if (p.ammo < p.maxAmmo) {
                p.ammo = p.maxAmmo;
                pk.respawnTimer = 600; // 10s respawn
                if (p.isYou) {
                  setAmmo(p.ammo);
                  soundEngine.playPickup(false);
                  triggerHaptic();
                  for (let i = 0; i < 8; i++) {
                    particlesRef.current.push({
                      id: Math.random(),
                      x: p.x,
                      y: p.y,
                      vx: (Math.random() - 0.5) * 2.5,
                      vy: -1.5 - Math.random() * 2,
                      life: 25,
                      maxLife: 25,
                      color: '#f59e0b',
                      size: 3,
                    });
                  }
                }
                break;
              }
            }
          }
        }
      });

      // 7. Smooth Camera centering on Ahmed (Player 0)
      const targetCamX = you.x - canvas.width / 2;
      const targetCamY = you.y - canvas.height / 2;
      cameraRef.current.x += (targetCamX - cameraRef.current.x) * 0.1;
      cameraRef.current.y += (targetCamY - cameraRef.current.y) * 0.1;

      // Clamp camera bounds to map (800x600 CQB or 3800x2800 20x Open World)
      const currentMapW = isWorld ? OPEN_WORLD_WIDTH : MAP_WIDTH;
      const currentMapH = isWorld ? OPEN_WORLD_HEIGHT : MAP_HEIGHT;
      cameraRef.current.x = Math.max(-40, Math.min(currentMapW - canvas.width + 40, cameraRef.current.x));
      cameraRef.current.y = Math.max(-40, Math.min(currentMapH - canvas.height + 40, cameraRef.current.y));

      // 8. RENDER CANVAS
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.translate(-cameraRef.current.x, -cameraRef.current.y);

      if (isWorld) {
        // Draw 3800x2800 Erangel Island terrain (Ocean water, sandy coastlines, grassy plains, roads, named zones)
        drawOpenWorldTerrain(ctx, OPEN_WORLD_WIDTH, OPEN_WORLD_HEIGHT, frameCountRef.current);
      } else {
        // Floor & 7 Safe-House Room Zones (Armory, Ops, Medbay, Server, Vault, Lounge, Yard)
        drawRoomFloors(ctx, texturesRef.current, MAP_WIDTH, MAP_HEIGHT);
      }

      // Floor Decals (Blood splatters & expended brass shell casings)
      drawDecals(ctx, decalsRef.current);

      // Walls
      wallsRef.current.forEach((w) => {
        if (texturesRef.current.wall) {
          ctx.fillStyle = texturesRef.current.wall;
        } else {
          ctx.fillStyle = '#3f3f46';
        }
        ctx.fillRect(w.x, w.y, w.w, w.h);
        ctx.strokeStyle = '#52525b';
        ctx.strokeRect(w.x, w.y, w.w, w.h);
      });

      // Doors (Closed = Red status line, Open = Green status line)
      doorsRef.current.forEach((d) => {
        if (d.open) {
          // Open door frame
          ctx.fillStyle = 'rgba(16, 185, 129, 0.12)';
          ctx.fillRect(d.x, d.y, d.w, d.h);
          ctx.fillStyle = '#10b981';
          ctx.fillRect(d.x, d.y, d.w > d.h ? d.w : 4, d.w > d.h ? 4 : d.h);
        } else {
          // Closed door
          if (texturesRef.current.wood) {
            ctx.fillStyle = texturesRef.current.wood;
          } else {
            ctx.fillStyle = '#78350f';
          }
          ctx.fillRect(d.x, d.y, d.w, d.h);
          ctx.strokeStyle = '#451a03';
          ctx.strokeRect(d.x, d.y, d.w, d.h);
          // Red indicator status line
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(d.x, d.y, d.w > d.h ? d.w : 4, d.w > d.h ? 4 : d.h);
        }
      });

      // Real 2D Top-Down Objects (Beds, Sofas, Desks, Counters, Fridges, Servers, Crates, Plants, Medbay Beds)
      objectsRef.current.forEach((o) => {
        drawReal2DObject(ctx, o, texturesRef.current, frameCountRef.current);
      });

      // Animated Tactical Pickups (Medkits + Ammo Caches)
      pickupsRef.current.forEach((pk) => {
        drawReal2DPickup(ctx, pk, frameCountRef.current);
      });

      // Open World Ground Loot Items (Guns, Ammo, Medkits, Armor, Bombs) & Roaming Mutant Creatures
      if (isWorld) {
        lootRef.current.forEach((item) => {
          drawLootItem(ctx, item, frameCountRef.current);
        });

        creaturesRef.current.forEach((creature) => {
          drawCreature(ctx, creature, frameCountRef.current);
        });
      }

      // SMART AI TARGETING LINE (Yuki hunting enemies)
      if (settings.showAiLasers) {
        playersRef.current.forEach((p) => {
          if (!p.isYou && p.hp > 0 && p.target && p.target.hp > 0) {
            ctx.save();
            ctx.strokeStyle = p.team === 'A' ? 'rgba(0, 229, 255, 0.65)' : 'rgba(239, 68, 68, 0.45)';
            ctx.lineWidth = 1.5;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p.target.x, p.target.y);
            ctx.stroke();
            ctx.restore();
          }
        });
      }

      // Explosions
      explosionsRef.current.forEach((exp) => {
        const alpha = exp.life / exp.maxLife;
        const grad = ctx.createRadialGradient(exp.x, exp.y, 0, exp.x, exp.y, exp.radius);
        grad.addColorStop(0, `rgba(255, 240, 100, ${alpha})`);
        grad.addColorStop(0.4, `rgba(255, 100, 0, ${alpha * 0.8})`);
        grad.addColorStop(1, `rgba(255, 0, 0, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(exp.x, exp.y, exp.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Bombs (Frag Grenades)
      bombsRef.current.forEach((b) => {
        ctx.save();
        ctx.fillStyle = b.timer < 25 ? '#ef4444' : '#f59e0b';
        ctx.beginPath();
        ctx.arc(b.x, b.y, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Pulsing blast indicator ring
        ctx.strokeStyle = `rgba(245, 158, 11, ${0.4 + 0.5 * Math.sin(b.timer * 0.3)})`;
        ctx.beginPath();
        ctx.arc(b.x, b.y, 25, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      });

      // Bullets (Tracers)
      bulletsRef.current.forEach((b) => {
        ctx.save();
        ctx.fillStyle = b.team === 'A' ? '#38bdf8' : '#f87171';
        ctx.beginPath();
        ctx.arc(b.x, b.y, 3, 0, Math.PI * 2);
        ctx.fill();
        // Tracer tail
        ctx.strokeStyle = b.team === 'A' ? 'rgba(56, 189, 248, 0.4)' : 'rgba(248, 113, 113, 0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(b.x, b.y);
        ctx.lineTo(b.x - Math.cos(b.angle) * 12, b.y - Math.sin(b.angle) * 12);
        ctx.stroke();
        ctx.restore();
      });

      // Particles
      particlesRef.current.forEach((pt) => {
        ctx.fillStyle = pt.color;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // Real 2D Top-Down Players with Stride, Vest, Tactical Visor, Weapon, & Muzzle Flash
      playersRef.current.forEach((p) => {
        const avatar: TacticalAvatar = p.isYou ? currentAvatar : getAvatarForPlayer(p);
        drawReal2DPlayer(
          ctx,
          p,
          p.isYou,
          operatorSkin.color,
          avatar,
          frameCountRef.current,
          settings.showAiLasers
        );
      });

      ctx.restore();

      // 9. DRAW PROPORTIONAL MINIMAP (110x82px)
      if (mctx && mini) {
        mctx.clearRect(0, 0, mini.width, mini.height);

        const mapW = isWorld ? OPEN_WORLD_WIDTH : MAP_WIDTH;
        const mapH = isWorld ? OPEN_WORLD_HEIGHT : MAP_HEIGHT;
        const sx = mini.width / mapW;
        const sy = mini.height / mapH;

        if (isWorld) {
          // Ocean water background
          mctx.fillStyle = '#0f2942';
          mctx.fillRect(0, 0, mini.width, mini.height);

          // Island landmass
          mctx.fillStyle = '#163829';
          mctx.fillRect(200 * sx, 200 * sy, (OPEN_WORLD_WIDTH - 400) * sx, (OPEN_WORLD_HEIGHT - 400) * sy);

          // Key strategic named zones
          OPEN_WORLD_ZONES.forEach((z) => {
            mctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
            mctx.fillRect(z.x * sx, z.y * sy, z.w * sx, z.h * sy);
          });

          // Creatures on Minimap (Pink dots)
          creaturesRef.current.forEach((c) => {
            if (c.hp <= 0) return;
            mctx.fillStyle = '#ec4899';
            mctx.beginPath();
            mctx.arc(c.x * sx, c.y * sy, 2, 0, Math.PI * 2);
            mctx.fill();
          });
        } else {
          mctx.fillStyle = settings.highContrastMinimap ? '#09090b' : '#18181b';
          mctx.fillRect(0, 0, mini.width, mini.height);

          // Walls
          mctx.fillStyle = '#52525b';
          wallsRef.current.forEach((w) => {
            mctx.fillRect(w.x * sx, w.y * sy, Math.max(2, w.w * sx), Math.max(2, w.h * sy));
          });

          // Doors (Green line = open, Red line = closed)
          doorsRef.current.forEach((d) => {
            mctx.fillStyle = d.open ? '#22c55e' : '#ef4444';
            mctx.fillRect(d.x * sx, d.y * sy, Math.max(3, d.w * sx), Math.max(3, d.h * sy));
          });

          // Pickups on Minimap (Green dot = Medkit, Amber dot = Ammo Cache)
          pickupsRef.current.forEach((pk) => {
            if (pk.respawnTimer > 0) return;
            mctx.fillStyle = pk.type === 'MEDKIT' ? '#10b981' : '#f59e0b';
            mctx.beginPath();
            mctx.arc(pk.x * sx, pk.y * sy, 2.5, 0, Math.PI * 2);
            mctx.fill();
          });
        }

        // Players on Minimap:
        // White square = you, Blue/Green dot = teammate/friend, Red dot = enemy
        playersRef.current.forEach((p) => {
          if (p.hp <= 0) return;
          const px = p.x * sx;
          const py = p.y * sy;

          if (p.isYou) {
            // White square = You
            mctx.fillStyle = '#ffffff';
            mctx.fillRect(px - 3, py - 3, 6, 6);
            mctx.strokeStyle = '#00e5ff';
            mctx.lineWidth = 1.5;
            mctx.strokeRect(px - 4, py - 4, 8, 8);
            // FOV direction tick
            mctx.strokeStyle = '#ffffff';
            mctx.beginPath();
            mctx.moveTo(px, py);
            mctx.lineTo(px + Math.cos(p.angle) * 7, py + Math.sin(p.angle) * 7);
            mctx.stroke();
          } else if (p.isFriend || p.team === 'A') {
            // Teammate or friend squad
            mctx.fillStyle = '#00e5ff';
            mctx.beginPath();
            mctx.arc(px, py, 2.5, 0, Math.PI * 2);
            mctx.fill();
          } else {
            // Enemy
            mctx.fillStyle = '#ef4444';
            mctx.beginPath();
            mctx.arc(px, py, 2.5, 0, Math.PI * 2);
            mctx.fill();
          }
        });
      }

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, [isMatchOver, settings, operatorSkin, onRecordKills]);

  // Virtual Analog Joystick Touch / Pointer handlers with center-relative tracking
  const handleJoystickStart = (clientX: number, clientY: number) => {
    joystickActiveRef.current = true;
    if (joystickContainerRef.current) {
      const rect = joystickContainerRef.current.getBoundingClientRect();
      joystickStartRef.current = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    } else {
      joystickStartRef.current = { x: clientX, y: clientY };
    }
    handleJoystickMove(clientX, clientY);
  };

  const handleJoystickMove = (clientX: number, clientY: number) => {
    if (!joystickActiveRef.current) return;
    const dx = clientX - joystickStartRef.current.x;
    const dy = clientY - joystickStartRef.current.y;
    const maxRadius = 38;
    const dist = Math.min(maxRadius, Math.hypot(dx, dy));
    const ang = Math.atan2(dy, dx);

    if (stickRef.current) {
      const offsetX = Math.cos(ang) * dist;
      const offsetY = Math.sin(ang) * dist;
      stickRef.current.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    }

    const normX = (Math.cos(ang) * dist) / maxRadius;
    const normY = (Math.sin(ang) * dist) / maxRadius;
    moveVectorRef.current = { x: normX, y: normY };

    // Point player towards movement direction if not locked on enemy
    if (dist > 5 && (!settings.autoTarget || !playersRef.current[0].target)) {
      playersRef.current[0].angle = ang;
    }
  };

  const handleJoystickEnd = () => {
    joystickActiveRef.current = false;
    moveVectorRef.current = { x: 0, y: 0 };
    if (stickRef.current) {
      stickRef.current.style.transform = 'translate(0px, 0px)';
    }
  };

  // Tactical D-Pad Touch/Button Handlers (Android Friendly)
  const handleDpadPress = (direction: 'up' | 'down' | 'left' | 'right', pressed: boolean) => {
    dpadStateRef.current[direction] = pressed;
    setDpadActive((prev) => ({ ...prev, [direction]: pressed }));
    if (pressed) {
      triggerHaptic();
    }

    let dx = 0;
    let dy = 0;
    if (dpadStateRef.current.up) dy -= 1;
    if (dpadStateRef.current.down) dy += 1;
    if (dpadStateRef.current.left) dx -= 1;
    if (dpadStateRef.current.right) dx += 1;

    if (dx !== 0 || dy !== 0) {
      const mag = Math.hypot(dx, dy);
      moveVectorRef.current = { x: dx / mag, y: dy / mag };
      if (!settings.autoTarget || !playersRef.current[0].target) {
        playersRef.current[0].angle = Math.atan2(dy, dx);
      }
    } else {
      moveVectorRef.current = { x: 0, y: 0 };
    }
  };

  // Continuous Auto-Fire when FIRE button is held down (Android friendly)
  const startContinuousFire = () => {
    handleFire();
    if (!fireIntervalRef.current) {
      fireIntervalRef.current = setInterval(() => {
        handleFire();
      }, 130);
    }
  };

  const stopContinuousFire = () => {
    if (fireIntervalRef.current) {
      clearInterval(fireIntervalRef.current);
      fireIntervalRef.current = null;
    }
  };

  // Quick switch between Joystick & D-Pad in-game
  const toggleControlMode = (mode: 'joystick' | 'dpad') => {
    setControlMode(mode);
    moveVectorRef.current = { x: 0, y: 0 };
    if (onUpdateSettings) {
      onUpdateSettings({ ...settings, controlMode: mode });
    }
  };

  const toggleSound = () => {
    const next = !audioMuted;
    setAudioMuted(next);
    soundEngine.setVolume(next ? 0 : settings.sfxVolume || 0.7);
  };

  // Format timer MM:SS
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const isUrgentTimer = matchTime <= 30;

  return (
    <div className="relative w-full h-screen bg-zinc-950 select-none overflow-hidden touch-none font-sans text-white">
      {/* 2D Combat Canvas */}
      <canvas
        id="combat-canvas"
        ref={canvasRef}
        className="absolute inset-0 z-0 cursor-crosshair"
        onMouseMove={(e) => {
          const you = playersRef.current[0];
          const rect = canvasRef.current?.getBoundingClientRect();
          if (rect && you) {
            const worldMouseX = e.clientX - rect.left + cameraRef.current.x;
            const worldMouseY = e.clientY - rect.top + cameraRef.current.y;
            you.angle = Math.atan2(worldMouseY - you.y, worldMouseX - you.x);
          }
        }}
        onClick={handleFire}
      />

      {/* TOP COMBAT SCOREBAR */}
      <header
        id="combat-hud-top-bar"
        className="absolute top-2 left-2 right-2 sm:left-6 sm:right-6 z-20 flex items-center justify-between pointer-events-none"
      >
        {/* Team A (Alpha - Blue/Cyan) */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-cyan-500/40 backdrop-blur-md shadow-lg pointer-events-auto">
          <div className="flex -space-x-1.5">
            <span className="text-base" title={`${userName} (You)`}>{userFlag}</span>
            <span className="text-base" title={teammate?.name || 'Abdul Hussain (AI Teammate)'}>{teammate?.flag || '🇵🇰'}</span>
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-cyan-400">
              {isWorld ? 'Alpha Squad (2-Man)' : `Team Alpha • ${userName}`}
            </div>
            <div className="text-sm sm:text-base font-black text-cyan-300 font-mono leading-none">
              {teamKills.A} KILLS
            </div>
          </div>
        </div>

        {/* Center Countdown Timer (3:00) with Match Mode and Alive Counters */}
        <div className="flex flex-col items-center">
          <div
            id="match-countdown-timer"
            className={`px-4 py-1.5 rounded-2xl font-mono font-black text-sm sm:text-lg tracking-wider border shadow-xl flex items-center gap-2 backdrop-blur-md ${
              isUrgentTimer
                ? 'bg-red-600/90 border-red-400 text-white animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.7)]'
                : 'bg-zinc-900/85 border-zinc-700 text-zinc-100'
            }`}
          >
            <Flame className={`w-4 h-4 ${isUrgentTimer ? 'text-amber-300 animate-bounce' : 'text-cyan-400'}`} />
            <span>{formatTime(matchTime)}</span>
            {isWorld && (
              <span className="text-[9px] font-mono bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded border border-cyan-400/40">
                20X OPEN WORLD
              </span>
            )}
          </div>
          {/* Safeguard indicator badge & Title */}
          <div className="mt-1 flex items-center gap-2">
            <div className="flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 backdrop-blur-sm">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>NO SELF-DMG</span>
            </div>
            {settings.autoTarget && (
              <div className="flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 backdrop-blur-sm">
                <Target className="w-3 h-3 text-cyan-400" />
                <span>AUTO-AIM</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Header Widget: In Open World show Hostile Stats, in 2v2 show Team Omega */}
        {isWorld ? (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-amber-500/40 backdrop-blur-md shadow-lg pointer-events-auto">
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-amber-400">
                Survival Radar
              </div>
              <div className="text-xs sm:text-sm font-black text-amber-300 font-mono leading-none">
                {creaturesRef.current.filter((c) => c.hp > 0).length} MUTANTS • {playersRef.current.filter((p) => p.hp > 0).length}/30 ALIVE
              </div>
            </div>
            <span className="text-lg">🧟</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-red-500/40 backdrop-blur-md shadow-lg pointer-events-auto">
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-red-400">
                Team Omega • {enemyA?.name ? enemyA.name.slice(0, 16) : 'Abdul Hussain'}
              </div>
              <div className="text-sm sm:text-base font-black text-red-300 font-mono leading-none">
                {teamKills.B} KILLS
              </div>
            </div>
            <div className="flex -space-x-1.5">
              <span className="text-base" title={enemyA?.name || 'Abdul Hussain (Red A)'}>{enemyA?.flag || '🇧🇷'}</span>
              <span className="text-base" title={enemyB?.name || 'Abdul Hussain (Red B)'}>{enemyB?.flag || '🇷🇺'}</span>
            </div>
          </div>
        )}
      </header>

      {/* TOP-LEFT UTILITY & KILL FEED */}
      <div className="absolute top-16 left-3 sm:left-6 z-20 flex flex-col gap-2 pointer-events-none">
        {/* Navigation & Audio Buttons */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            id="hud-return-lobby-btn"
            onClick={onBackToLobby}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700 text-xs font-bold text-zinc-300 backdrop-blur-md transition-colors shadow-md"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Lobby</span>
          </button>
          <button
            id="hud-mute-btn"
            onClick={toggleSound}
            className="w-8 h-8 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 flex items-center justify-center backdrop-blur-md transition-colors shadow-md"
          >
            {audioMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
          </button>
        </div>

        {/* Live Kill Feed Notifications */}
        <div className="space-y-1.5 max-w-[240px]">
          <AnimatePresence>
            {killFeed.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="px-2.5 py-1 rounded-lg bg-black/75 border border-zinc-800/80 backdrop-blur-md text-[11px] font-mono flex items-center gap-1.5 shadow-md"
              >
                <span className={item.killerTeam === 'A' ? 'text-cyan-400 font-bold' : 'text-red-400 font-bold'}>
                  {item.killerName}
                </span>
                <span className="text-[10px] text-amber-400 font-extrabold px-1 rounded bg-zinc-800">
                  [{item.weapon}]
                </span>
                <span className={item.victimTeam === 'A' ? 'text-cyan-300' : 'text-red-300'}>
                  {item.victimName}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* TOP-RIGHT MINIMAP (110x82px with legend) */}
      <div
        id="hud-minimap-container"
        className="absolute top-16 right-3 sm:right-6 z-20 flex flex-col items-end pointer-events-auto"
      >
        <div className="relative p-1 rounded-xl bg-zinc-950/90 border-2 border-zinc-700/80 shadow-2xl backdrop-blur-md">
          {/* Exactly 110x82px canvas as specified */}
          <canvas
            id="minimap"
            ref={minimapRef}
            width={110}
            height={82}
            className="block rounded-lg"
          />
        </div>

        {/* Minimap legend card */}
        <div className="mt-1.5 px-2 py-1 rounded-lg bg-zinc-950/80 border border-zinc-800 text-[8px] font-mono text-zinc-300 flex flex-col gap-0.5 shadow-md">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 bg-white border border-cyan-400 inline-block" />
            <span>You (Ahmed)</span>
            <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block ml-1" />
            <span>Yuki</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 inline-block" />
            <span>Enemy</span>
            <span className="w-2.5 h-1 bg-green-500 inline-block ml-1" />
            <span>Door Open</span>
            <span className="w-2.5 h-1 bg-red-500 inline-block ml-1" />
            <span>Closed</span>
          </div>
        </div>
      </div>

      {/* CENTER-TOP CONTEXTUAL DOOR BUTTON (<70px from door) */}
      <AnimatePresence>
        {isNearDoor && (
          <div className="absolute top-24 left-1/2 -translate-x-1/2 z-30 pointer-events-auto">
            <motion.button
              id="hud-contextual-door-btn"
              initial={{ scale: 0.8, opacity: 0, y: -10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: -10 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleToggleDoor}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-zinc-950 font-black text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.5)] border border-emerald-300 cursor-pointer animate-pulse"
            >
              <span className="text-base">🚪</span>
              <span>OPEN DOOR {nearestDoorDist ? `(${nearestDoorDist}m)` : ''} [TAP BREACH]</span>
            </motion.button>
          </div>
        )}
      </AnimatePresence>

      {/* BOTTOM-LEFT MOVEMENT CONTROLS (Virtual Joystick OR D-Pad + Switcher) */}
      <div
        id="hud-joystick-area"
        className="absolute bottom-4 sm:bottom-6 left-3 sm:left-6 z-20 pointer-events-auto select-none flex flex-col items-start"
      >
        {/* Quick Mode Switcher */}
        <div className="flex items-center gap-1 mb-2 p-1 rounded-xl bg-zinc-950/85 border border-zinc-800/90 backdrop-blur-md shadow-lg">
          <button
            onClick={() => toggleControlMode('joystick')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all flex items-center gap-1 cursor-pointer ${
              controlMode === 'joystick'
                ? 'bg-cyan-500 text-zinc-950 shadow-md font-black'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>🕹️</span>
            <span>JOYSTICK</span>
          </button>
          <button
            onClick={() => toggleControlMode('dpad')}
            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all flex items-center gap-1 cursor-pointer ${
              controlMode === 'dpad'
                ? 'bg-cyan-500 text-zinc-950 shadow-md font-black'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <span>🎮</span>
            <span>D-PAD</span>
          </button>
        </div>

        {controlMode === 'joystick' ? (
          <div>
            <div
              id="joystick"
              ref={joystickContainerRef}
              style={{ touchAction: 'none' }}
              onPointerDown={(e) => {
                e.currentTarget.setPointerCapture(e.pointerId);
                handleJoystickStart(e.clientX, e.clientY);
              }}
              onPointerMove={(e) => handleJoystickMove(e.clientX, e.clientY)}
              onPointerUp={handleJoystickEnd}
              onPointerCancel={handleJoystickEnd}
              onTouchStart={(e) => {
                e.preventDefault();
                const t = e.touches[0];
                handleJoystickStart(t.clientX, t.clientY);
              }}
              onTouchMove={(e) => {
                e.preventDefault();
                const t = e.touches[0];
                handleJoystickMove(t.clientX, t.clientY);
              }}
              onTouchEnd={handleJoystickEnd}
              onTouchCancel={handleJoystickEnd}
              className="relative w-[96px] h-[96px] rounded-full bg-zinc-900/70 border-2 border-cyan-400/40 backdrop-blur-md shadow-2xl flex items-center justify-center cursor-pointer active:border-cyan-400"
            >
              {/* Subtle directional tick marks */}
              <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-2 h-1 bg-cyan-400/40 rounded-full" />
              <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-2 h-1 bg-cyan-400/40 rounded-full" />
              <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1 h-2 bg-cyan-400/40 rounded-full" />
              <div className="absolute right-1.5 top-1/2 -translate-y-1/2 w-1 h-2 bg-cyan-400/40 rounded-full" />

              {/* Center origin mark */}
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400/20" />

              {/* Draggable Stick */}
              <div
                id="stick"
                ref={stickRef}
                className="absolute w-[42px] h-[42px] rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 shadow-[0_0_15px_rgba(6,182,212,0.6)] pointer-events-none transition-transform duration-75 flex items-center justify-center border border-cyan-200"
              >
                <div className="w-3 h-3 rounded-full bg-white/90 shadow-inner" />
              </div>
            </div>
            <div className="text-[9px] text-zinc-400 font-mono text-center mt-1">DRAG // WASD</div>
          </div>
        ) : (
          /* Tactical 4-Way D-Pad */
          <div>
            <div
              id="dpad-container"
              style={{ touchAction: 'none' }}
              className="relative w-[116px] h-[116px] select-none"
            >
              {/* UP */}
              <button
                onPointerDown={() => handleDpadPress('up', true)}
                onPointerUp={() => handleDpadPress('up', false)}
                onPointerLeave={() => handleDpadPress('up', false)}
                onTouchStart={(e) => {
                  e.preventDefault();
                  handleDpadPress('up', true);
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  handleDpadPress('up', false);
                }}
                className={`absolute top-0 left-1/2 -translate-x-1/2 w-10 h-10 rounded-xl border flex items-center justify-center font-black text-sm shadow-md transition-all active:scale-95 cursor-pointer ${
                  dpadActive.up
                    ? 'bg-cyan-400 text-zinc-950 border-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.8)] scale-95'
                    : 'bg-zinc-900/90 text-cyan-400 border-zinc-700/80 hover:bg-zinc-800'
                }`}
              >
                ▲
              </button>
              {/* DOWN */}
              <button
                onPointerDown={() => handleDpadPress('down', true)}
                onPointerUp={() => handleDpadPress('down', false)}
                onPointerLeave={() => handleDpadPress('down', false)}
                onTouchStart={(e) => {
                  e.preventDefault();
                  handleDpadPress('down', true);
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  handleDpadPress('down', false);
                }}
                className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-10 rounded-xl border flex items-center justify-center font-black text-sm shadow-md transition-all active:scale-95 cursor-pointer ${
                  dpadActive.down
                    ? 'bg-cyan-400 text-zinc-950 border-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.8)] scale-95'
                    : 'bg-zinc-900/90 text-cyan-400 border-zinc-700/80 hover:bg-zinc-800'
                }`}
              >
                ▼
              </button>
              {/* LEFT */}
              <button
                onPointerDown={() => handleDpadPress('left', true)}
                onPointerUp={() => handleDpadPress('left', false)}
                onPointerLeave={() => handleDpadPress('left', false)}
                onTouchStart={(e) => {
                  e.preventDefault();
                  handleDpadPress('left', true);
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  handleDpadPress('left', false);
                }}
                className={`absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl border flex items-center justify-center font-black text-sm shadow-md transition-all active:scale-95 cursor-pointer ${
                  dpadActive.left
                    ? 'bg-cyan-400 text-zinc-950 border-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.8)] scale-95'
                    : 'bg-zinc-900/90 text-cyan-400 border-zinc-700/80 hover:bg-zinc-800'
                }`}
              >
                ◀
              </button>
              {/* RIGHT */}
              <button
                onPointerDown={() => handleDpadPress('right', true)}
                onPointerUp={() => handleDpadPress('right', false)}
                onPointerLeave={() => handleDpadPress('right', false)}
                onTouchStart={(e) => {
                  e.preventDefault();
                  handleDpadPress('right', true);
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  handleDpadPress('right', false);
                }}
                className={`absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl border flex items-center justify-center font-black text-sm shadow-md transition-all active:scale-95 cursor-pointer ${
                  dpadActive.right
                    ? 'bg-cyan-400 text-zinc-950 border-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.8)] scale-95'
                    : 'bg-zinc-900/90 text-cyan-400 border-zinc-700/80 hover:bg-zinc-800'
                }`}
              >
                ▶
              </button>
              {/* Center decorative hub */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-zinc-950/90 border border-zinc-700 flex items-center justify-center pointer-events-none">
                <div className="w-2 h-2 rounded-full bg-cyan-400/60" />
              </div>
            </div>
            <div className="text-[9px] text-zinc-400 font-mono text-center mt-1">TAP 4-WAY</div>
          </div>
        )}
      </div>

      {/* CONTEXTUAL GROUND LOOT PICKUP BUTTON (<55px from weapon / item) */}
      <AnimatePresence>
        {nearbyLoot && (
          <div className="absolute bottom-28 right-3 sm:right-6 z-30 pointer-events-auto">
            <motion.button
              id="hud-loot-pickup-btn"
              initial={{ scale: 0.85, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: 10 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handlePickupLoot(nearbyLoot)}
              className="px-4 py-2 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-black text-xs uppercase tracking-wider flex items-center gap-2.5 shadow-[0_0_25px_rgba(245,158,11,0.7)] border-2 border-amber-200 cursor-pointer animate-pulse"
            >
              <span className="text-base">🎁</span>
              <div className="text-left leading-tight">
                <div className="font-extrabold">TAKE {nearbyLoot.name} [F]</div>
                <div className="text-[9px] font-mono opacity-80">
                  {nearbyLoot.weaponType ? `EQUIP ${nearbyLoot.weaponType}` : nearbyLoot.type}
                </div>
              </div>
            </motion.button>
          </div>
        )}
      </AnimatePresence>

      {/* WEAPON SLOTS DOCK (Primary & Secondary Selector) */}
      <div className="absolute bottom-20 sm:bottom-24 right-3 sm:right-6 z-20 flex items-center gap-2 pointer-events-auto">
        {/* Slot 1 */}
        <button
          onClick={() => handleSwitchWeapon(1)}
          className={`px-3 py-1 rounded-xl border flex items-center gap-1.5 backdrop-blur-md shadow-lg transition-all cursor-pointer ${
            activeSlot === 1
              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.4)] font-bold'
              : 'bg-zinc-900/80 border-zinc-700 text-zinc-400 hover:text-white'
          }`}
        >
          <span className="font-mono text-[9px] font-black bg-zinc-800 px-1 rounded text-cyan-400">1</span>
          <div className="text-left leading-none">
            <div className="text-[10px] font-bold">{WEAPON_DEFS[activeWeapon]?.name || activeWeapon}</div>
            <div className="text-[8px] font-mono opacity-60">{WEAPON_DEFS[activeWeapon]?.caliber || '5.56mm'}</div>
          </div>
        </button>

        {/* Slot 2 */}
        <button
          onClick={() => handleSwitchWeapon(2)}
          className={`px-3 py-1 rounded-xl border flex items-center gap-1.5 backdrop-blur-md shadow-lg transition-all cursor-pointer ${
            activeSlot === 2
              ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.4)] font-bold'
              : 'bg-zinc-900/80 border-zinc-700 text-zinc-400 hover:text-white'
          }`}
        >
          <span className="font-mono text-[9px] font-black bg-zinc-800 px-1 rounded text-cyan-400">2</span>
          <div className="text-left leading-none">
            <div className="text-[10px] font-bold">{WEAPON_DEFS[secondaryWeapon || 'AR']?.name || 'Secondary'}</div>
            <div className="text-[8px] font-mono opacity-60">{WEAPON_DEFS[secondaryWeapon || 'AR']?.caliber || '9mm'}</div>
          </div>
        </button>

        {/* Quick Swap Q */}
        <button
          onClick={handleSwapWeapon}
          title="Swap Guns [Q]"
          className="w-7 h-7 rounded-lg bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 flex items-center justify-center font-mono font-bold text-xs shadow cursor-pointer active:scale-95"
        >
          Q
        </button>
      </div>

      {/* BOTTOM-RIGHT ACTION CLUSTER (Jump 🦘, Bomb 💣, Fire 🔥 with Continuous Auto-Fire) */}
      <div
        id="hud-controls-cluster"
        className="absolute bottom-4 sm:bottom-6 right-3 sm:right-6 z-20 flex items-end gap-3 pointer-events-auto select-none"
      >
        {/* Jump 🦘 (green gradient, 56px) */}
        <div className="flex flex-col items-center">
          <motion.button
            id="jump-btn"
            whileTap={{ scale: 0.9 }}
            onClick={handleJump}
            onTouchStart={(e) => {
              e.preventDefault();
              handleJump();
            }}
            disabled={jumpCooldownPercent > 0}
            className="relative w-[56px] h-[56px] rounded-full bg-gradient-to-br from-emerald-400 to-green-700 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-green-600/30 border border-green-300 active:brightness-125 cursor-pointer disabled:opacity-50 overflow-hidden"
          >
            <span>🦘</span>
            {/* Cooldown radial overlay */}
            {jumpCooldownPercent > 0 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-[10px] font-mono">
                ...
              </div>
            )}
          </motion.button>
          <span className="text-[9px] font-mono text-zinc-400 mt-1">VAULT [J]</span>
        </div>

        {/* Bomb 💣 (orange-yellow gradient, 56px with cooldown ring & Limited Count Badge) */}
        <div className="flex flex-col items-center">
          <motion.button
            id="bomb-btn"
            whileTap={{ scale: 0.9 }}
            onClick={handleBomb}
            onTouchStart={(e) => {
              e.preventDefault();
              handleBomb();
            }}
            disabled={bombCooldownPercent > 0 || bombCount <= 0}
            className="relative w-[56px] h-[56px] rounded-full bg-gradient-to-br from-amber-400 via-orange-500 to-red-600 text-white font-black text-2xl flex items-center justify-center shadow-lg shadow-amber-500/30 border border-amber-300 active:brightness-125 cursor-pointer disabled:opacity-50 overflow-hidden"
          >
            <span>💣</span>
            {/* Limited Bomb count pill */}
            <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600 text-white font-mono font-black text-[10px] flex items-center justify-center border border-white/60 shadow">
              {bombCount}
            </div>
            {/* Circular cooldown ring overlay */}
            {bombCooldownPercent > 0 && (
              <svg className="absolute inset-0 w-full h-full -rotate-90">
                <circle
                  cx="28"
                  cy="28"
                  r="25"
                  fill="rgba(0,0,0,0.6)"
                  stroke="#fbbf24"
                  strokeWidth="3"
                  strokeDasharray="157"
                  strokeDashoffset={157 * (1 - bombCooldownPercent)}
                />
              </svg>
            )}
          </motion.button>
          <span className="text-[9px] font-mono text-zinc-400 mt-1">FRAG [B] ({bombCount})</span>
        </div>

        {/* Fire 🔥 (red gradient, 62px with ammo count & Hold-to-Fire) */}
        <div className="flex flex-col items-center">
          <motion.button
            id="fire-btn"
            whileTap={{ scale: 0.92 }}
            onPointerDown={startContinuousFire}
            onPointerUp={stopContinuousFire}
            onPointerLeave={stopContinuousFire}
            onTouchStart={(e) => {
              e.preventDefault();
              startContinuousFire();
            }}
            onTouchEnd={stopContinuousFire}
            onTouchCancel={stopContinuousFire}
            className="relative w-[62px] h-[62px] rounded-full bg-gradient-to-br from-red-500 via-rose-600 to-red-800 text-white font-black text-3xl flex items-center justify-center shadow-xl shadow-red-600/50 border-2 border-red-300 active:brightness-125 cursor-pointer overflow-hidden select-none"
          >
            <span>🔥</span>
            {/* Ammo counter label */}
            <div className="absolute bottom-1 text-[8px] font-mono font-bold bg-black/85 px-1.5 rounded-full text-red-200 border border-red-500/30">
              {isReloading ? 'RELOAD' : `${ammo}/120`}
            </div>
          </motion.button>
          <span className="text-[9px] font-mono text-zinc-300 font-bold mt-1">HOLD FIRE</span>
        </div>
      </div>

      {/* GAME OVER / MATCH COMPLETE OVERLAY */}
      <AnimatePresence>
        {isMatchOver && (
          <div
            id="match-over-modal"
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-md bg-zinc-950 border border-zinc-800 rounded-3xl p-6 text-center shadow-2xl space-y-5"
            >
              {/* Winner Announcement */}
              <div className="flex justify-center">
                <div
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl ${
                    teamKills.A > teamKills.B
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40'
                      : teamKills.B > teamKills.A
                      ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  }`}
                >
                  <Trophy className="w-8 h-8" />
                </div>
              </div>

              <div>
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white">
                  {teamKills.A > teamKills.B
                    ? '🟦 TEAM ALPHA VICTORIOUS!'
                    : teamKills.B > teamKills.A
                    ? '🟥 TEAM OMEGA WINS!'
                    : '🤝 MATCH DRAW!'}
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  3-Minute Indoor Kill Race Concluded
                </p>
              </div>

              {/* Score Breakdown */}
              <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between font-mono text-base font-extrabold pb-2 border-b border-zinc-800">
                  <span className="text-cyan-400">Team Alpha: {teamKills.A}</span>
                  <span className="text-zinc-500">VS</span>
                  <span className="text-red-400">Team Omega: {teamKills.B}</span>
                </div>

                <div className="space-y-1.5 text-xs text-left">
                  {playersRef.current.map((p) => (
                    <div
                      key={p.name}
                      className="flex items-center justify-between px-2 py-1 rounded bg-zinc-950/50"
                    >
                      <span className="flex items-center gap-1.5 font-medium">
                        <span>{p.flag}</span>
                        <span className={p.team === 'A' ? 'text-cyan-300' : 'text-red-300'}>
                          {p.name} {p.isYou ? '(You)' : ''}
                        </span>
                      </span>
                      <span className="font-mono font-bold text-zinc-200">
                        {p.kills} Kills / {p.deaths} Deaths
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  id="game-over-rematch-btn"
                  onClick={() => {
                    // Reset game state
                    matchTimeRef.current = 180;
                    teamKillsRef.current = { A: 0, B: 0 };
                    setTeamKills({ A: 0, B: 0 });
                    setMatchTime(180);
                    playersRef.current.forEach((p) => {
                      p.hp = p.maxHp;
                      p.kills = 0;
                      p.deaths = 0;
                    });
                    doorsRef.current = JSON.parse(JSON.stringify(INITIAL_DOORS));
                    setIsMatchOver(false);
                  }}
                  className="flex-1 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Play Again</span>
                </button>

                <button
                  id="game-over-lobby-btn"
                  onClick={onBackToLobby}
                  className="flex-1 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 border border-zinc-700 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Lobby</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
