export interface AutoPlayer {
  id: string;
  name: string;
  flag: string;
  role: string;
  tag: 'PRO' | 'CHAMPION' | 'VETERAN' | 'ELITE' | 'SCOUT' | 'BREACHER';
  rankTier: string;
  elo: number;
  level: number;
  kills: number;
  winRate: number; // percentage
  weapon: string;
  ping: number;
  status: 'In Lobby' | 'Searching' | 'In Match' | 'Ready';
  avatarColor: string;
  country: string;
}

const FLAGS = [
  { flag: '🇵🇰', country: 'Pakistan' },
  { flag: '🇹🇷', country: 'Turkey' },
  { flag: '🇸🇦', country: 'Saudi Arabia' },
  { flag: '🇦🇪', country: 'UAE' },
  { flag: '🇲🇾', country: 'Malaysia' },
  { flag: '🇮🇩', country: 'Indonesia' },
  { flag: '🇪🇬', country: 'Egypt' },
  { flag: '🇶🇦', country: 'Qatar' },
  { flag: '🇬🇧', country: 'United Kingdom' },
  { flag: '🇺🇸', country: 'United States' },
  { flag: '🇯🇵', country: 'Japan' },
  { flag: '🇩🇪', country: 'Germany' },
  { flag: '🇧🇷', country: 'Brazil' },
  { flag: '🇨🇦', country: 'Canada' },
  { flag: '🇦🇺', country: 'Australia' },
  { flag: '🇫🇷', country: 'France' },
  { flag: '🇰🇷', country: 'South Korea' },
];

const WEAPONS = [
  'M4A1 CQB Custom',
  'Vector .45 Tactical',
  'AK-12 Spec-Ops',
  'RPK Heavy Suppressor',
  'MP7 High-Velocity',
  'P90 Rush Stalker',
  'SCAR-H Breacher',
  'MK18 CQBR',
  'AS VAL Ghost',
  'HK416 A7 Elite',
];

const ROLES = [
  'Point Breacher',
  'CQB Assault Lead',
  'Infiltration Scout',
  'Heavy Suppressor',
  'Tactical Flanker',
  'Recon Strategist',
  'Precision Marksman',
  'Close Quarters Combatant',
  'Riot Shield Support',
  'Apex Rusher',
];

const RANKS = [
  'Grandmaster I',
  'Grandmaster II',
  'Master Tier',
  'Diamond I',
  'Diamond II',
  'Diamond III',
  'Platinum I',
  'Platinum II',
  'Gold I',
  'Elite Vanguard',
];

const AVATAR_COLORS = [
  '#06b6d4', // cyan
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ef4444', // red
  '#8b5cf6', // purple
  '#3b82f6', // blue
  '#ec4899', // pink
  '#14b8a6', // teal
];

const NAME_PREFIXES = [
  'Abdul Hussain',
  'AHS Abdul Hussain',
  'Major Abdul Hussain',
  'Captain Abdul Hussain',
  'Col. Abdul Hussain',
  'Sgt. Abdul Hussain',
  'Ghost Abdul Hussain',
  'Agent Abdul Hussain',
  'Commander Abdul Hussain',
  'Chief Abdul Hussain',
];

const CALLSIGNS = [
  'Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo', 'Foxtrot', 'Viper', 'Ghost',
  'Phantom', 'Spectre', 'Striker', 'Titan', 'Reaper', 'Shadow', 'Hawk', 'Falcon',
  'Apex', 'Havoc', 'Rogue', 'Onyx', 'Storm', 'Blitz', 'Ronin', 'Sabre',
  'Wolf', 'Cobra', 'Razor', 'Frost', 'Iron', 'Thunder', 'Knight', 'Nomad',
  'Zero', 'Nova', 'Pulse', 'Cyber', 'Neon', 'Vanguard', 'Sentinel', 'Predator',
  'Spartan', 'Bullet', 'Sniper', 'Tactician', 'Breach', 'Overlord', 'Crusher',
  'Enforcer', 'Wraith', 'Matrix', 'Vector', 'Hydra', 'Phoenix', 'Tempest',
];

// Generate 120 deterministic auto-generated players
export const GENERATED_PLAYERS_POOL: AutoPlayer[] = Array.from({ length: 120 }, (_, index) => {
  const i = index + 1;
  const flagObj = FLAGS[index % FLAGS.length];
  const weapon = WEAPONS[index % WEAPONS.length];
  const role = ROLES[index % ROLES.length];
  const avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length];
  const callsign = CALLSIGNS[index % CALLSIGNS.length];

  // Distinct naming format for all 120 Abdul Hussain players
  let name = '';
  if (i === 1) {
    name = 'Abdul Hussain (Squad Alpha)';
  } else if (i === 2) {
    name = 'Abdul Hussain (Red Hostile 1)';
  } else if (i === 3) {
    name = 'Abdul Hussain (Red Hostile 2)';
  } else if (i <= 30) {
    const prefix = NAME_PREFIXES[index % NAME_PREFIXES.length];
    name = `${prefix} [${callsign}]`;
  } else if (i <= 70) {
    name = `Abdul Hussain #${String(i).padStart(3, '0')} (${callsign})`;
  } else if (i <= 100) {
    name = `AHS • Abdul Hussain ${callsign}`;
  } else {
    name = `SpecOps Abdul Hussain ${i}`;
  }

  // Tags
  const tag: AutoPlayer['tag'] =
    i <= 10 ? 'CHAMPION' : i <= 35 ? 'ELITE' : i <= 65 ? 'PRO' : i <= 95 ? 'VETERAN' : 'BREACHER';

  // Rank and ELO
  const rankTier = RANKS[Math.floor((index / 120) * RANKS.length)];
  const elo = Math.max(1250, 3100 - i * 14 + (index % 7) * 8);
  const level = Math.max(15, 99 - Math.floor(i * 0.65));
  const kills = Math.max(120, 2900 - i * 22 + (index % 11) * 15);
  const winRate = Math.min(89, Math.max(51, 84 - Math.floor(i * 0.25) + (index % 5)));
  const ping = 12 + (index % 24);

  const statuses: AutoPlayer['status'][] = ['In Lobby', 'Searching', 'In Match', 'Ready'];
  const status = statuses[(index * 3) % statuses.length];

  return {
    id: `ahs-op-${i}`,
    name,
    flag: flagObj.flag,
    country: flagObj.country,
    role,
    tag,
    rankTier,
    elo,
    level,
    kills,
    winRate,
    weapon,
    ping,
    status,
    avatarColor,
  };
});
