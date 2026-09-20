export interface TacticalAvatar {
  id: string;
  name: string;
  callsign: string;
  role: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  headgear: 'helmet' | 'goggles' | 'gasmask' | 'beret' | 'hood' | 'visor' | 'cap' | 'heavy_visor';
  primaryColor: string;
  accentColor: string;
  visorGlow: string;
  camo: 'urban' | 'desert' | 'arctic' | 'blackout' | 'cyber' | 'specops';
  description: string;
  imageUrl?: string;
}

export const TACTICAL_AVATARS: TacticalAvatar[] = [
  {
    id: 'ahs-vanguard',
    name: 'Abdul Hussain Vanguard',
    callsign: 'Apex Lead',
    role: 'CQB Pointman',
    rarity: 'Legendary',
    headgear: 'helmet',
    primaryColor: '#00e5ff',
    accentColor: '#0891b2',
    visorGlow: '#22d3ee',
    camo: 'specops',
    description: 'Lead operator equipped with quad panoramic night-vision goggles and cyber tactical HUD.',
  },
  {
    id: 'cyber-spectre',
    name: 'Ghost Spectre',
    callsign: 'Spectre',
    role: 'Cyber Infiltrator',
    rarity: 'Epic',
    headgear: 'gasmask',
    primaryColor: '#c084fc',
    accentColor: '#9333ea',
    visorGlow: '#e879f9',
    camo: 'cyber',
    description: 'Synthetic filtration respirator with tactical digital eye overlays for hazard combat.',
  },
  {
    id: 'desert-commando',
    name: 'Sandstorm Marauder',
    callsign: 'Dune 01',
    role: 'Desert Assault',
    rarity: 'Epic',
    headgear: 'goggles',
    primaryColor: '#f59e0b',
    accentColor: '#d97706',
    visorGlow: '#fbbf24',
    camo: 'desert',
    description: 'Arid climate tactical shemagh and dual dust-proof ballistic lenses.',
  },
  {
    id: 'urban-swat',
    name: 'Metro SWAT Enforcer',
    callsign: 'Shield 9',
    role: 'Tactical Breacher',
    rarity: 'Rare',
    headgear: 'visor',
    primaryColor: '#38bdf8',
    accentColor: '#0284c7',
    visorGlow: '#7dd3fc',
    camo: 'urban',
    description: 'Heavy riot ballistic polycarbonate face shield with direct team communications.',
  },
  {
    id: 'beret-veteran',
    name: 'Commander Hussain',
    callsign: 'Overlord',
    role: 'Squad Strategist',
    rarity: 'Legendary',
    headgear: 'beret',
    primaryColor: '#ef4444',
    accentColor: '#b91c1c',
    visorGlow: '#fca5a5',
    camo: 'specops',
    description: 'Veteran red beret with gold insignias, tactical earpiece, and tactical eyepatch HUD.',
  },
  {
    id: 'arctic-phantom',
    name: 'Frostbite Scout',
    callsign: 'Zero Kelvin',
    role: 'Sub-Zero Sniper',
    rarity: 'Rare',
    headgear: 'hood',
    primaryColor: '#e0f2fe',
    accentColor: '#7dd3fc',
    visorGlow: '#38bdf8',
    camo: 'arctic',
    description: 'Insulated balaclava and thermal anti-glare goggles for frigid safe-house operations.',
  },
  {
    id: 'heavy-juggernaut',
    name: 'Iron Wall Abdul',
    callsign: 'Titan',
    role: 'Heavy Suppressor',
    rarity: 'Epic',
    headgear: 'heavy_visor',
    primaryColor: '#10b981',
    accentColor: '#059669',
    visorGlow: '#34d399',
    camo: 'blackout',
    description: 'Reinforced titanium jawplate and dual ballistic blast slit visors.',
  },
  {
    id: 'ghillie-recon',
    name: 'Shadow Viper',
    callsign: 'Cobra',
    role: 'Stealth Recon',
    rarity: 'Common',
    headgear: 'cap',
    primaryColor: '#84cc16',
    accentColor: '#65a30d',
    visorGlow: '#a3e635',
    camo: 'specops',
    description: 'Low-profile tactical baseball cap with polarized eyewear and noise-canceling comms.',
  },
];

export const getAvatarForPlayer = (player: { id: string; role?: string }): TacticalAvatar => {
  let hash = 0;
  for (let i = 0; i < player.id.length; i++) {
    hash = (hash * 31 + player.id.charCodeAt(i)) % TACTICAL_AVATARS.length;
  }
  return TACTICAL_AVATARS[hash];
};
