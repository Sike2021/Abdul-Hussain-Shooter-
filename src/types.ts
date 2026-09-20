export type GameMode = '2v2_cqb' | 'open_world';

export type WeaponType = 'SMG' | 'AR' | 'SHOTGUN' | 'SNIPER' | 'LMG';

export interface WeaponDef {
  type: WeaponType;
  name: string;
  caliber: string;
  damage: number;
  fireRateMs: number;
  magSize: number;
  reloadTimeMs: number;
  bulletSpeed: number;
  spread: number;
  range: number;
  pellets?: number;
  color: string;
  bulletColor: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  description: string;
}

export const WEAPON_DEFS: Record<WeaponType, WeaponDef> = {
  SMG: {
    type: 'SMG',
    name: 'SIG MPX 9mm',
    caliber: '9x19mm NATO',
    damage: 18,
    fireRateMs: 95,
    magSize: 32,
    reloadTimeMs: 1200,
    bulletSpeed: 15,
    spread: 0.08,
    range: 380,
    color: '#00e5ff',
    bulletColor: '#38bdf8',
    rarity: 'Common',
    description: 'Ultra high-RPM submachine gun, superb for close quarters and swift breaching.',
  },
  AR: {
    type: 'AR',
    name: 'M416 Tactical',
    caliber: '5.56x45mm NATO',
    damage: 32,
    fireRateMs: 135,
    magSize: 30,
    reloadTimeMs: 1600,
    bulletSpeed: 18,
    spread: 0.04,
    range: 520,
    color: '#10b981',
    bulletColor: '#34d399',
    rarity: 'Rare',
    description: 'Versatile military assault rifle with high precision and formidable stopping power.',
  },
  SHOTGUN: {
    type: 'SHOTGUN',
    name: 'SPAS-12 Breacher',
    caliber: '12-Gauge Magnum',
    damage: 16, // per pellet x 6 = 96 max
    fireRateMs: 520,
    magSize: 8,
    reloadTimeMs: 2000,
    bulletSpeed: 13,
    spread: 0.22,
    range: 260,
    pellets: 6,
    color: '#f59e0b',
    bulletColor: '#fbbf24',
    rarity: 'Rare',
    description: 'Devastating close-range scatter blast. Eradicates foes and creatures instantly.',
  },
  SNIPER: {
    type: 'SNIPER',
    name: 'AWM Arctic Warfare',
    caliber: '.300 Winchester',
    damage: 98,
    fireRateMs: 1100,
    magSize: 5,
    reloadTimeMs: 2400,
    bulletSpeed: 28,
    spread: 0.01,
    range: 850,
    color: '#ec4899',
    bulletColor: '#f472b6',
    rarity: 'Legendary',
    description: 'Supreme bolt-action sniper rifle with lethal velocity and pinpoint distance penetration.',
  },
  LMG: {
    type: 'LMG',
    name: 'Negev Heavy Box',
    caliber: '7.62x51mm Belt',
    damage: 25,
    fireRateMs: 105,
    magSize: 75,
    reloadTimeMs: 3000,
    bulletSpeed: 16,
    spread: 0.11,
    range: 480,
    color: '#8b5cf6',
    bulletColor: '#a78bfa',
    rarity: 'Epic',
    description: 'Heavy sustained suppressing fire machine gun. Mows down swarms of infected and enemies.',
  },
};

export interface LootItem {
  id: string;
  x: number;
  y: number;
  type: 'GUN_SMG' | 'GUN_AR' | 'GUN_SHOTGUN' | 'GUN_SNIPER' | 'GUN_LMG' | 'MEDKIT' | 'AMMO' | 'ARMOR' | 'BOMB';
  name: string;
  color: string;
  weaponType?: WeaponType;
  respawnTimer: number; // 0 when ready
}

export interface Creature {
  id: string;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  speed: number;
  damage: number;
  target: Player | null;
  angle: number;
  attackCooldown: number;
  walkProg: number;
  animTick?: number;
  type: 'stalker' | 'beast';
  kills: number;
}

export interface Player {
  id: string;
  x: number;
  y: number;
  team: 'A' | 'B';
  name: string;
  flag: string;
  hp: number;
  maxHp: number;
  angle: number;
  isYou: boolean;
  color: string;
  kills: number;
  deaths: number;
  jumping: boolean;
  jumpH: number;
  jumpProg: number;
  target: Player | Creature | null;
  stuck: number;
  ammo: number;
  maxAmmo: number;
  reloading: boolean;
  reloadProgress: number;
  role: string;
  ping: number;
  level: number;
  skinColor?: string;
  walkProg?: number;
  firingTimer?: number;
  avatarId?: string;
  weapon: WeaponType;
  secondaryWeapon?: WeaponType;
  bombs: number;
  armor: number;
  maxArmor: number;
  isFriend?: boolean;
}

export interface Wall {
  x: number;
  y: number;
  w: number;
  h: number;
  tex: string;
  room?: string;
}

export interface Door {
  id: number;
  x: number;
  y: number;
  w: number;
  h: number;
  open: boolean;
  name: string;
}

export interface HideObject {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  tex: string;
  type:
    | 'SOFA'
    | 'BED'
    | 'TABLE'
    | 'DESK'
    | 'FRIDGE'
    | 'WARDROBE'
    | 'COUNTER'
    | 'SERVER'
    | 'CRATE'
    | 'PLANT'
    | 'BATHTUB'
    | 'MEDBAY_BED'
    | 'VEHICLE'
    | 'CONTAINER'
    | 'BARREL'
    | 'SANDBAG'
    | 'HAYBALE'
    | 'TREE'
    | 'ROCK'
    | 'FENCE';
  block: boolean;
  jumpOver: boolean;
  label?: string;
  color?: string;
  subType?: string;
}

export interface PickupItem {
  id: string;
  x: number;
  y: number;
  type: 'MEDKIT' | 'AMMO';
  respawnTimer: number; // 0 when ready, counts down from 600 frames (10s)
}

export interface Decal {
  id: number;
  x: number;
  y: number;
  type: 'BLOOD' | 'CASING';
  angle: number;
  size: number;
  alpha: number;
}

export interface Bullet {
  id: number;
  x: number;
  y: number;
  angle: number;
  team: 'A' | 'B';
  owner: Player;
  life: number;
  maxLife: number;
  damage?: number;
  weaponType?: WeaponType;
  color?: string;
}

export interface Bomb {
  id: number;
  x: number;
  y: number;
  timer: number;
  maxTimer: number;
  owner: Player;
}

export interface Explosion {
  id: number;
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  life: number;
  maxLife: number;
}

export interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export interface KillFeedItem {
  id: string;
  killerName: string;
  killerTeam: 'A' | 'B';
  victimName: string;
  victimTeam: 'A' | 'B';
  weapon: string;
  timestamp: number;
  isCreatureKill?: boolean;
}

export interface GameSettings {
  sfxVolume: number;
  joystickSensitivity: number;
  aimAssist: boolean;
  showAiLasers: boolean;
  highContrastMinimap: boolean;
  hapticFeedback: boolean;
  controlMode: 'joystick' | 'dpad';
  autoTarget: boolean;
}

export interface OperatorSkin {
  id: string;
  name: string;
  team: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  color: string;
  description: string;
  unlocked: boolean;
}
