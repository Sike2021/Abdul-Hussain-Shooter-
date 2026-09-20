import { Wall, Door, HideObject, LootItem, Creature, Player, WEAPON_DEFS } from '../types';
import { GENERATED_PLAYERS_POOL } from './autoPlayers';

export const OPEN_WORLD_WIDTH = 3800;
export const OPEN_WORLD_HEIGHT = 2800;

export const WATER_BORDER_SIZE = 260; // Water surrounds the entire island

export interface OpenWorldZone {
  id: string;
  name: string;
  subtitle: string;
  code: string;
  x: number;
  y: number;
  w: number;
  h: number;
  accentColor: string;
  lootTier: 'High' | 'Very High' | 'Military' | 'Extreme';
}

export const OPEN_WORLD_ZONES: OpenWorldZone[] = [
  {
    id: 'pochinki',
    name: 'Pochinki Compounds',
    subtitle: 'Dense Urban CQB & Residential',
    code: 'POCH',
    x: 1550,
    y: 1350,
    w: 700,
    h: 550,
    accentColor: '#f59e0b',
    lootTier: 'High',
  },
  {
    id: 'military',
    name: 'Sosnovka Military Base',
    subtitle: 'Fortified Bunkers & Radar Dome',
    code: 'MILI',
    x: 1350,
    y: 2050,
    w: 950,
    h: 550,
    accentColor: '#ef4444',
    lootTier: 'Military',
  },
  {
    id: 'school',
    name: 'School & Hospital Complex',
    subtitle: 'Corridors, Courtyard & Medical Ward',
    code: 'SCHL',
    x: 1550,
    y: 650,
    w: 700,
    h: 550,
    accentColor: '#00e5ff',
    lootTier: 'High',
  },
  {
    id: 'docks',
    name: 'Georgopol Shipping Docks',
    subtitle: 'Cargo Containers, Piers & Cranes',
    code: 'DCKS',
    x: 400,
    y: 400,
    w: 850,
    h: 600,
    accentColor: '#3b82f6',
    lootTier: 'High',
  },
  {
    id: 'power',
    name: 'Mylta Power Substation',
    subtitle: 'High-Voltage Grid & Transformers',
    code: 'POWR',
    x: 2600,
    y: 1650,
    w: 800,
    h: 700,
    accentColor: '#8b5cf6',
    lootTier: 'Military',
  },
  {
    id: 'gatka',
    name: 'Gatka Farmlands & Depots',
    subtitle: 'Grain Silos, Warehouses & Open Fields',
    code: 'GTKA',
    x: 450,
    y: 1300,
    w: 750,
    h: 600,
    accentColor: '#10b981',
    lootTier: 'High',
  },
  {
    id: 'ruins',
    name: 'Ancient Ruins & Creature Lair',
    subtitle: 'Overgrown Stone Pillars & Mutant Nest',
    code: 'RUIN',
    x: 2550,
    y: 500,
    w: 850,
    h: 700,
    accentColor: '#ec4899',
    lootTier: 'Extreme',
  },
  {
    id: 'rozhok',
    name: 'Rozhok Hilltop Outpost',
    subtitle: 'Elevated Sniper Vantage & Watchtower',
    code: 'RZHK',
    x: 1100,
    y: 700,
    w: 380,
    h: 400,
    accentColor: '#06b6d4',
    lootTier: 'High',
  },
];

// Open world walls (buildings, fences, perimeter barriers)
export function generateOpenWorldWalls(): Wall[] {
  const walls: Wall[] = [];

  // Island coastline markers & breakwaters
  walls.push(
    // Dock Pier barrier
    { x: 380, y: 390, w: 20, h: 420, tex: 'metal' },
    { x: 380, y: 390, w: 500, h: 20, tex: 'metal' }
  );

  // Pochinki Buildings (4 residential blocks)
  const pochinkiHouses = [
    { x: 1620, y: 1420, w: 180, h: 140 },
    { x: 1860, y: 1420, w: 200, h: 140 },
    { x: 1620, y: 1640, w: 200, h: 160 },
    { x: 1900, y: 1640, w: 200, h: 160 },
  ];
  pochinkiHouses.forEach((h, idx) => {
    // 4 exterior walls with door openings
    walls.push(
      { x: h.x, y: h.y, w: h.w, h: 14, tex: 'wall' },
      { x: h.x, y: h.y + h.h - 14, w: h.w * 0.4, h: 14, tex: 'wall' },
      { x: h.x + h.w * 0.65, y: h.y + h.h - 14, w: h.w * 0.35, h: 14, tex: 'wall' },
      { x: h.x, y: h.y, w: 14, h: h.h, tex: 'wall' },
      { x: h.x + h.w - 14, y: h.y, w: 14, h: h.h, tex: 'wall' },
      // interior partition
      { x: h.x + h.w * 0.5, y: h.y + 14, w: 12, h: h.h * 0.55, tex: 'wall' }
    );
  });

  // Military Base Bunkers & Barracks
  const militaryBunkers = [
    { x: 1450, y: 2150, w: 240, h: 160 },
    { x: 1770, y: 2150, w: 240, h: 160 },
    { x: 1550, y: 2380, w: 320, h: 170 },
  ];
  militaryBunkers.forEach((b) => {
    walls.push(
      { x: b.x, y: b.y, w: b.w, h: 16, tex: 'metal' },
      { x: b.x, y: b.y + b.h - 16, w: b.w * 0.4, h: 16, tex: 'metal' },
      { x: b.x + b.w * 0.65, y: b.y + b.h - 16, w: b.w * 0.35, h: 16, tex: 'metal' },
      { x: b.x, y: b.y, w: 16, h: b.h, tex: 'metal' },
      { x: b.x + b.w - 16, y: b.y, w: 16, h: b.h, tex: 'metal' }
    );
  });

  // School & Hospital Complex
  walls.push(
    { x: 1620, y: 720, w: 420, h: 16, tex: 'wall' },
    { x: 1620, y: 1080, w: 420, h: 16, tex: 'wall' },
    { x: 1620, y: 720, w: 16, h: 376, tex: 'wall' },
    { x: 2024, y: 720, w: 16, h: 376, tex: 'wall' },
    // Central corridor & rooms
    { x: 1760, y: 736, w: 14, h: 180, tex: 'wall' },
    { x: 1880, y: 880, w: 14, h: 200, tex: 'wall' }
  );

  // Mylta Power Building
  walls.push(
    { x: 2750, y: 1780, w: 360, h: 18, tex: 'metal' },
    { x: 2750, y: 2080, w: 360, h: 18, tex: 'metal' },
    { x: 2750, y: 1780, w: 18, h: 318, tex: 'metal' },
    { x: 3092, y: 1780, w: 18, h: 318, tex: 'metal' }
  );

  // Gatka Warehouses
  walls.push(
    { x: 550, y: 1420, w: 260, h: 16, tex: 'wall' },
    { x: 550, y: 1620, w: 260, h: 16, tex: 'wall' },
    { x: 550, y: 1420, w: 16, h: 216, tex: 'wall' },
    { x: 794, y: 1420, w: 16, h: 216, tex: 'wall' }
  );

  // Ancient Ruins Columns (Ruined Stone Blocks)
  const columns = [
    { x: 2680, y: 640 }, { x: 2820, y: 640 }, { x: 2980, y: 640 }, { x: 3140, y: 640 },
    { x: 2680, y: 820 }, { x: 2820, y: 820 }, { x: 2980, y: 820 }, { x: 3140, y: 820 },
    { x: 2750, y: 1020 }, { x: 2920, y: 1020 }, { x: 3080, y: 1020 }
  ];
  columns.forEach((c) => {
    walls.push({ x: c.x, y: c.y, w: 38, h: 38, tex: 'wall' });
  });

  return walls;
}

// Shipping Containers in Georgopol Docks
export function generateOpenWorldObjects(): HideObject[] {
  const objs: HideObject[] = [];

  // Shipping containers in Docks
  const containerColors = ['#0284c7', '#dc2626', '#16a34a', '#eab308', '#475569'];
  const dockContainers = [
    { x: 480, y: 460, w: 110, h: 48 },
    { x: 620, y: 460, w: 110, h: 48 },
    { x: 760, y: 460, w: 110, h: 48 },
    { x: 520, y: 560, w: 110, h: 48 },
    { x: 670, y: 560, w: 110, h: 48 },
    { x: 820, y: 560, w: 110, h: 48 },
    { x: 480, y: 670, w: 110, h: 48 },
    { x: 630, y: 670, w: 110, h: 48 },
    { x: 780, y: 670, w: 110, h: 48 },
  ];
  dockContainers.forEach((dc, i) => {
    objs.push({
      id: `cont-${i}`,
      x: dc.x,
      y: dc.y,
      w: dc.w,
      h: dc.h,
      tex: 'metal',
      type: 'CRATE',
      block: true,
      jumpOver: false,
      label: `CONTAINER // ${i + 1}`,
    });
  });

  // Power Station Transformer Coils
  const transformers = [
    { x: 2800, y: 1850 },
    { x: 2950, y: 1850 },
    { x: 2800, y: 1980 },
    { x: 2950, y: 1980 },
  ];
  transformers.forEach((tr, i) => {
    objs.push({
      id: `trans-${i}`,
      x: tr.x,
      y: tr.y,
      w: 64,
      h: 56,
      tex: 'metal',
      type: 'SERVER',
      block: true,
      jumpOver: false,
      label: `TRANSFORMER-0${i + 1}`,
    });
  });

  // Military Supply Crates & Medbays
  objs.push(
    {
      id: 'mili-crate-1',
      x: 1520,
      y: 2200,
      w: 52,
      h: 40,
      tex: 'metal',
      type: 'CRATE',
      block: true,
      jumpOver: true,
      label: 'WEAPON CACHE',
    },
    {
      id: 'mili-crate-2',
      x: 1840,
      y: 2200,
      w: 52,
      h: 40,
      tex: 'metal',
      type: 'CRATE',
      block: true,
      jumpOver: true,
      label: 'AMMO BOX',
    },
    {
      id: 'school-med-1',
      x: 1790,
      y: 920,
      w: 64,
      h: 38,
      tex: 'med',
      type: 'MEDBAY_BED',
      block: true,
      jumpOver: true,
      label: 'TRAUMA BAY',
    }
  );

  return objs;
}

// Generate abundant loot pickups scattered across the island (Weapons, Medkits, Ammo, Armor, Bombs)
export function generateOpenWorldLoot(): LootItem[] {
  const loot: LootItem[] = [
    // POCHINKI
    { id: 'l-poch-1', x: 1660, y: 1470, type: 'GUN_AR', weaponType: 'AR', name: 'M416 Tactical', color: '#10b981', respawnTimer: 0 },
    { id: 'l-poch-2', x: 1720, y: 1480, type: 'AMMO', name: '5.56mm Ammo Box', color: '#34d399', respawnTimer: 0 },
    { id: 'l-poch-3', x: 1920, y: 1470, type: 'GUN_SMG', weaponType: 'SMG', name: 'SIG MPX 9mm', color: '#00e5ff', respawnTimer: 0 },
    { id: 'l-poch-4', x: 1980, y: 1500, type: 'BOMB', name: 'Frag Bombs x2', color: '#f97316', respawnTimer: 0 },
    { id: 'l-poch-5', x: 1680, y: 1700, type: 'MEDKIT', name: 'Trauma Medkit', color: '#10b981', respawnTimer: 0 },
    { id: 'l-poch-6', x: 1740, y: 1720, type: 'ARMOR', name: 'Tactical Vest Plate', color: '#60a5fa', respawnTimer: 0 },
    { id: 'l-poch-7', x: 1960, y: 1700, type: 'GUN_SHOTGUN', weaponType: 'SHOTGUN', name: 'SPAS-12 Breacher', color: '#f59e0b', respawnTimer: 0 },

    // MILITARY BASE (High tier loot: Snipers, Heavy Armor, LMG)
    { id: 'l-mili-1', x: 1480, y: 2190, type: 'GUN_SNIPER', weaponType: 'SNIPER', name: 'AWM Arctic Warfare', color: '#ec4899', respawnTimer: 0 },
    { id: 'l-mili-2', x: 1540, y: 2210, type: 'AMMO', name: '.300 Magnum Ammo', color: '#f472b6', respawnTimer: 0 },
    { id: 'l-mili-3', x: 1800, y: 2190, type: 'GUN_LMG', weaponType: 'LMG', name: 'Negev Heavy Box', color: '#8b5cf6', respawnTimer: 0 },
    { id: 'l-mili-4', x: 1860, y: 2210, type: 'AMMO', name: '7.62mm Belt Box', color: '#a78bfa', respawnTimer: 0 },
    { id: 'l-mili-5', x: 1620, y: 2440, type: 'ARMOR', name: 'Level III Armor Vest', color: '#38bdf8', respawnTimer: 0 },
    { id: 'l-mili-6', x: 1720, y: 2440, type: 'BOMB', name: 'High-Explosive Bombs x2', color: '#ef4444', respawnTimer: 0 },
    { id: 'l-mili-7', x: 1820, y: 2440, type: 'MEDKIT', name: 'Military Medkit', color: '#10b981', respawnTimer: 0 },

    // SCHOOL & HOSPITAL
    { id: 'l-schl-1', x: 1680, y: 780, type: 'GUN_AR', weaponType: 'AR', name: 'M416 Tactical', color: '#10b981', respawnTimer: 0 },
    { id: 'l-schl-2', x: 1740, y: 820, type: 'MEDKIT', name: 'First Aid Kit', color: '#10b981', respawnTimer: 0 },
    { id: 'l-schl-3', x: 1820, y: 950, type: 'MEDKIT', name: 'Hospital Serum', color: '#10b981', respawnTimer: 0 },
    { id: 'l-schl-4', x: 1940, y: 780, type: 'GUN_SMG', weaponType: 'SMG', name: 'SIG MPX 9mm', color: '#00e5ff', respawnTimer: 0 },
    { id: 'l-schl-5', x: 1940, y: 1020, type: 'BOMB', name: 'Frag Bombs x2', color: '#f97316', respawnTimer: 0 },

    // DOCKS (Shotguns, SMGs, Armor)
    { id: 'l-dcks-1', x: 560, y: 500, type: 'GUN_SHOTGUN', weaponType: 'SHOTGUN', name: 'SPAS-12 Breacher', color: '#f59e0b', respawnTimer: 0 },
    { id: 'l-dcks-2', x: 700, y: 500, type: 'AMMO', name: '12-Gauge Ammo', color: '#fbbf24', respawnTimer: 0 },
    { id: 'l-dcks-3', x: 600, y: 600, type: 'GUN_SMG', weaponType: 'SMG', name: 'SIG MPX 9mm', color: '#00e5ff', respawnTimer: 0 },
    { id: 'l-dcks-4', x: 740, y: 600, type: 'ARMOR', name: 'Tactical Armor', color: '#60a5fa', respawnTimer: 0 },
    { id: 'l-dcks-5', x: 880, y: 600, type: 'MEDKIT', name: 'Medkit', color: '#10b981', respawnTimer: 0 },

    // MYLTA POWER
    { id: 'l-powr-1', x: 2840, y: 1820, type: 'GUN_LMG', weaponType: 'LMG', name: 'Negev Heavy Box', color: '#8b5cf6', respawnTimer: 0 },
    { id: 'l-powr-2', x: 2900, y: 1820, type: 'AMMO', name: 'Heavy Ammo Drum', color: '#a78bfa', respawnTimer: 0 },
    { id: 'l-powr-3', x: 2880, y: 2020, type: 'ARMOR', name: 'Heavy Kevlar', color: '#38bdf8', respawnTimer: 0 },
    { id: 'l-powr-4', x: 2960, y: 2020, type: 'BOMB', name: 'Frag Bombs x2', color: '#f97316', respawnTimer: 0 },

    // GATKA FARMLANDS
    { id: 'l-gtka-1', x: 620, y: 1480, type: 'GUN_AR', weaponType: 'AR', name: 'M416 Assault', color: '#10b981', respawnTimer: 0 },
    { id: 'l-gtka-2', x: 710, y: 1480, type: 'AMMO', name: '5.56mm Ammo', color: '#34d399', respawnTimer: 0 },
    { id: 'l-gtka-3', x: 650, y: 1560, type: 'MEDKIT', name: 'Medkit', color: '#10b981', respawnTimer: 0 },
    { id: 'l-gtka-4', x: 720, y: 1560, type: 'BOMB', name: 'Frag Bombs x2', color: '#f97316', respawnTimer: 0 },

    // ROZHOK TOWER (Sniper vantage)
    { id: 'l-rzk-1', x: 1220, y: 820, type: 'GUN_SNIPER', weaponType: 'SNIPER', name: 'AWM Arctic Warfare', color: '#ec4899', respawnTimer: 0 },
    { id: 'l-rzk-2', x: 1280, y: 820, type: 'AMMO', name: '.300 Magnum Rounds', color: '#f472b6', respawnTimer: 0 },
    { id: 'l-rzk-3', x: 1250, y: 920, type: 'ARMOR', name: 'Sniper Cloak Armor', color: '#38bdf8', respawnTimer: 0 },

    // ANCIENT RUINS (Lethal creature zone with legendary loot)
    { id: 'l-ruin-1', x: 2750, y: 720, type: 'GUN_SNIPER', weaponType: 'SNIPER', name: 'AWM Sniper Rifle', color: '#ec4899', respawnTimer: 0 },
    { id: 'l-ruin-2', x: 2900, y: 720, type: 'GUN_AR', weaponType: 'AR', name: 'M416 Spec-Ops', color: '#10b981', respawnTimer: 0 },
    { id: 'l-ruin-3', x: 3050, y: 720, type: 'ARMOR', name: 'Mythic Tactical Plate', color: '#38bdf8', respawnTimer: 0 },
    { id: 'l-ruin-4', x: 2850, y: 900, type: 'BOMB', name: 'Cluster Frag Bombs x2', color: '#ef4444', respawnTimer: 0 },
    { id: 'l-ruin-5', x: 2980, y: 900, type: 'MEDKIT', name: 'Nano Trauma Medkit', color: '#10b981', respawnTimer: 0 },
  ];

  return loot;
}

// Generate mutant creatures roaming the island
export function generateOpenWorldCreatures(): Creature[] {
  const creatures: Creature[] = [];

  // 14 Stalkers (fast agile night hunters)
  const stalkerSpawns = [
    // Ruins nest
    { x: 2720, y: 680 },
    { x: 2880, y: 750 },
    { x: 3050, y: 680 },
    { x: 2780, y: 950 },
    { x: 2960, y: 980 },
    { x: 3120, y: 890 },
    // Wooded areas and outskirts
    { x: 1380, y: 1100 },
    { x: 2320, y: 1350 },
    { x: 950, y: 1150 },
    { x: 1150, y: 1650 },
    { x: 2380, y: 1950 },
    { x: 1250, y: 2200 },
    { x: 750, y: 850 },
    { x: 2450, y: 850 },
  ];

  stalkerSpawns.forEach((s, idx) => {
    creatures.push({
      id: `creature-stalker-${idx}`,
      x: s.x,
      y: s.y,
      hp: 75,
      maxHp: 75,
      speed: 2.2, // very fast
      target: null,
      angle: Math.random() * Math.PI * 2,
      attackCooldown: 0,
      walkProg: 0,
      damage: 18,
      type: 'stalker',
      kills: 0,
    });
  });

  // 4 Mutant Beasts (tanky boss creatures)
  const beastSpawns = [
    { x: 2900, y: 820 }, // Center of Ruins
    { x: 1720, y: 1120 }, // School courtyard
    { x: 2850, y: 1900 }, // Power station core
    { x: 1950, y: 2350 }, // Military testing yard
  ];

  beastSpawns.forEach((b, idx) => {
    creatures.push({
      id: `creature-beast-${idx}`,
      x: b.x,
      y: b.y,
      hp: 220,
      maxHp: 220,
      speed: 1.5,
      target: null,
      angle: Math.random() * Math.PI * 2,
      attackCooldown: 0,
      walkProg: 0,
      damage: 35,
      type: 'beast',
      kills: 0,
    });
  });

  return creatures;
}

// Generate around 30 active survival players (Player + 2 friends + 27 rival survivalists)
export function generateOpenWorldPlayers(
  userName: string,
  userFlag: string,
  userColor: string,
  userAvatarId?: string
): Player[] {
  const players: Player[] = [];

  // Slot 0: YOU (Abdul Hussain / Ahmed)
  players.push({
    id: 'player-you',
    x: 1600,
    y: 1480, // Spawns in Pochinki entrance
    team: 'A',
    name: userName || 'Ahmed',
    flag: userFlag || '🇵🇰',
    hp: 100,
    maxHp: 100,
    angle: 0,
    isYou: true,
    color: userColor,
    kills: 0,
    deaths: 0,
    jumping: false,
    jumpH: 0,
    jumpProg: 0,
    target: null,
    stuck: 0,
    ammo: 32,
    maxAmmo: 32,
    reloading: false,
    reloadProgress: 0,
    role: 'Apex Pointman',
    ping: 18,
    level: 42,
    avatarId: userAvatarId,
    weapon: 'SMG',
    secondaryWeapon: 'AR',
    bombs: 2, // Starts with limited 2 bombs!
    armor: 50,
    maxArmor: 100,
    isFriend: true,
  });

  // Slot 1 & 2: Friendly Squadmates (Yuki & Alex)
  const friendPool = GENERATED_PLAYERS_POOL.slice(0, 2);
  players.push(
    {
      id: 'friend-1',
      x: 1570,
      y: 1510,
      team: 'A',
      name: friendPool[0]?.name || 'Yuki-AI',
      flag: friendPool[0]?.country || '🇯🇵',
      hp: 100,
      maxHp: 100,
      angle: 0.2,
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
      role: 'Squad Sniper',
      ping: 12,
      level: 38,
      weapon: 'AR',
      bombs: 1,
      armor: 40,
      maxArmor: 100,
      isFriend: true,
    },
    {
      id: 'friend-2',
      x: 1630,
      y: 1510,
      team: 'A',
      name: friendPool[1]?.name || 'Ghost-Spec',
      flag: friendPool[1]?.country || '🇺🇸',
      hp: 100,
      maxHp: 100,
      angle: -0.2,
      isYou: false,
      color: '#10b981',
      kills: 0,
      deaths: 0,
      jumping: false,
      jumpH: 0,
      jumpProg: 0,
      target: null,
      stuck: 0,
      ammo: 32,
      maxAmmo: 32,
      reloading: false,
      reloadProgress: 0,
      role: 'Squad Support',
      ping: 24,
      level: 35,
      weapon: 'SMG',
      bombs: 1,
      armor: 40,
      maxArmor: 100,
      isFriend: true,
    }
  );

  // 27 Rival Survivalists placed around all the compounds and zones
  const rivalSpawnPoints = [
    // Military Base
    { x: 1500, y: 2180 }, { x: 1800, y: 2200 }, { x: 1650, y: 2400 }, { x: 1900, y: 2400 },
    // Pochinki
    { x: 1700, y: 1450 }, { x: 1950, y: 1450 }, { x: 1720, y: 1680 }, { x: 1980, y: 1680 },
    // School & Hospital
    { x: 1650, y: 800 }, { x: 1950, y: 800 }, { x: 1700, y: 1020 }, { x: 1980, y: 1020 },
    // Docks
    { x: 550, y: 520 }, { x: 750, y: 520 }, { x: 620, y: 650 }, { x: 820, y: 650 },
    // Mylta Power
    { x: 2780, y: 1800 }, { x: 2980, y: 1800 }, { x: 2850, y: 2000 },
    // Gatka
    { x: 600, y: 1450 }, { x: 750, y: 1550 }, { x: 680, y: 1680 },
    // Ruins
    { x: 2700, y: 700 }, { x: 3000, y: 700 }, { x: 2850, y: 920 },
    // Rozhok Outpost
    { x: 1200, y: 800 }, { x: 1300, y: 880 }
  ];

  const pool = GENERATED_PLAYERS_POOL.slice(2);
  rivalSpawnPoints.forEach((sp, i) => {
    const p = pool[i % pool.length];
    const weaponsList: Array<'SMG' | 'AR' | 'SHOTGUN' | 'SNIPER' | 'LMG'> = [
      'AR', 'SMG', 'SHOTGUN', 'AR', 'LMG', 'SNIPER', 'AR', 'SMG'
    ];
    const assignedWeapon = weaponsList[i % weaponsList.length];
    const weaponDef = WEAPON_DEFS[assignedWeapon];

    players.push({
      id: `rival-${i}`,
      x: sp.x + (Math.random() * 60 - 30),
      y: sp.y + (Math.random() * 60 - 30),
      team: 'B', // Rival
      name: p?.name || `Survivalist_${i + 1}`,
      flag: p?.country || '🌐',
      hp: 100,
      maxHp: 100,
      angle: Math.random() * Math.PI * 2,
      isYou: false,
      color: '#ef4444',
      kills: 0,
      deaths: 0,
      jumping: false,
      jumpH: 0,
      jumpProg: 0,
      target: null,
      stuck: 0,
      ammo: weaponDef.magSize,
      maxAmmo: weaponDef.magSize,
      reloading: false,
      reloadProgress: 0,
      role: p?.role || 'Infiltrator',
      ping: Math.floor(Math.random() * 35) + 15,
      level: Math.floor(Math.random() * 30) + 10,
      weapon: assignedWeapon,
      bombs: Math.random() > 0.6 ? 1 : 0,
      armor: Math.random() > 0.5 ? 40 : 20,
      maxArmor: 100,
      isFriend: false,
    });
  });

  return players;
}
