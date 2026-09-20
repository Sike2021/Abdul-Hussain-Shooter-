import React from 'react';
import { TacticalAvatar } from '../data/avatars';

interface AvatarBadgeProps {
  avatar: TacticalAvatar;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBadge?: boolean;
  className?: string;
  isOnline?: boolean;
}

export const AvatarBadge: React.FC<AvatarBadgeProps> = ({
  avatar,
  size = 'md',
  showBadge = true,
  className = '',
  isOnline = true,
}) => {
  const sizeMap = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28',
  };

  const pxMap = {
    sm: 40,
    md: 56,
    lg: 80,
    xl: 112,
  };

  const dim = pxMap[size];

  return (
    <div className={`relative inline-block select-none ${className}`}>
      {/* Outer Glowing Border Ring */}
      <div
        className={`${sizeMap[size]} rounded-2xl overflow-hidden relative shadow-lg transition-transform`}
        style={{
          boxShadow: `0 0 16px ${avatar.accentColor}33`,
          border: `2px solid ${avatar.primaryColor}88`,
          background: 'linear-gradient(135deg, #18181b 0%, #09090b 100%)',
        }}
      >
        {/* Crisp 2D Tactical Vector Portrait */}
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full object-cover"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <radialGradient id={`glow-${avatar.id}`} cx="50%" cy="35%" r="60%">
              <stop offset="0%" stopColor={avatar.primaryColor} stopOpacity="0.3" />
              <stop offset="100%" stopColor="#09090b" stopOpacity="0" />
            </radialGradient>
            <linearGradient id={`visor-${avatar.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={avatar.visorGlow} />
              <stop offset="60%" stopColor={avatar.primaryColor} />
              <stop offset="100%" stopColor={avatar.accentColor} />
            </linearGradient>
            <linearGradient id={`armor-${avatar.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3f3f46" />
              <stop offset="100%" stopColor="#18181b" />
            </linearGradient>
          </defs>

          {/* Background Ambient Glow */}
          <rect width="100" height="100" fill={`url(#glow-${avatar.id})`} />
          <path d="M 0 0 L 100 100" stroke={avatar.primaryColor} strokeWidth="0.5" opacity="0.1" />
          <path d="M 100 0 L 0 100" stroke={avatar.primaryColor} strokeWidth="0.5" opacity="0.1" />

          {/* Neck / Tactical Collar */}
          <path d="M 40 70 L 60 70 L 65 95 L 35 95 Z" fill="#18181b" stroke="#27272a" strokeWidth="1.5" />

          {/* Torso Armor / Tactical Vest Plate */}
          <path
            d="M 22 90 L 35 72 L 65 72 L 78 90 L 82 100 L 18 100 Z"
            fill={`url(#armor-${avatar.id})`}
            stroke={avatar.accentColor}
            strokeWidth="1.5"
          />
          {/* Vest chest straps / molle webbing */}
          <line x1="32" y1="80" x2="68" y2="80" stroke="#52525b" strokeWidth="2" strokeDasharray="3 2" />
          <line x1="34" y1="88" x2="66" y2="88" stroke="#52525b" strokeWidth="2" strokeDasharray="3 2" />
          {/* Collar comms microphone */}
          <circle cx="34" cy="74" r="2.5" fill="#71717a" />
          <path d="M 34 74 Q 38 72 44 72" stroke="#71717a" strokeWidth="1" fill="none" />

          {/* Head & Balaclava Under-cowl */}
          <path
            d="M 32 40 C 32 25 68 25 68 40 C 68 58 64 68 50 68 C 36 68 32 58 32 40 Z"
            fill="#27272a"
          />

          {/* Distinct Headgear Variations */}
          {avatar.headgear === 'helmet' && (
            <g>
              {/* Tactical Kevlar Helmet */}
              <path
                d="M 27 38 C 27 18 73 18 73 38 C 73 42 70 45 68 46 L 32 46 C 30 45 27 42 27 38 Z"
                fill="#18181b"
                stroke={avatar.accentColor}
                strokeWidth="1.5"
              />
              {/* NVG Mount Plate */}
              <rect x="46" y="24" width="8" height="9" rx="1.5" fill="#3f3f46" stroke="#71717a" strokeWidth="0.8" />
              {/* Quad Panoramic Night Vision Lenses */}
              <circle cx="38" cy="38" r="4.5" fill={`url(#visor-${avatar.id})`} />
              <circle cx="46" cy="37" r="4" fill={`url(#visor-${avatar.id})`} />
              <circle cx="54" cy="37" r="4" fill={`url(#visor-${avatar.id})`} />
              <circle cx="62" cy="38" r="4.5" fill={`url(#visor-${avatar.id})`} />
              {/* Lens specular flare */}
              <circle cx="37" cy="36.5" r="1.5" fill="#ffffff" opacity="0.9" />
              <circle cx="45" cy="35.5" r="1.2" fill="#ffffff" opacity="0.9" />
              <circle cx="53" cy="35.5" r="1.2" fill="#ffffff" opacity="0.9" />
              <circle cx="61" cy="36.5" r="1.5" fill="#ffffff" opacity="0.9" />
              {/* Ear protection headset */}
              <rect x="25" y="38" width="5" height="12" rx="2" fill="#3f3f46" />
              <rect x="70" y="38" width="5" height="12" rx="2" fill="#3f3f46" />
            </g>
          )}

          {avatar.headgear === 'gasmask' && (
            <g>
              {/* Rubber Hood */}
              <path
                d="M 28 40 C 28 20 72 20 72 40 C 72 58 66 68 50 68 C 34 68 28 58 28 40 Z"
                fill="#18181b"
                stroke={avatar.accentColor}
                strokeWidth="1.5"
              />
              {/* Dual Round Cyber Eye Lenses */}
              <circle cx="40" cy="40" r="7" fill="#09090b" stroke={avatar.primaryColor} strokeWidth="1.5" />
              <circle cx="60" cy="40" r="7" fill="#09090b" stroke={avatar.primaryColor} strokeWidth="1.5" />
              <circle cx="40" cy="40" r="5" fill={`url(#visor-${avatar.id})`} opacity="0.85" />
              <circle cx="60" cy="40" r="5" fill={`url(#visor-${avatar.id})`} opacity="0.85" />
              <ellipse cx="38.5" cy="38.5" rx="2" ry="1" fill="#ffffff" opacity="0.8" />
              <ellipse cx="58.5" cy="38.5" rx="2" ry="1" fill="#ffffff" opacity="0.8" />
              {/* Center Respirator Filter Valve */}
              <circle cx="50" cy="56" r="8" fill="#27272a" stroke="#52525b" strokeWidth="1.5" />
              <circle cx="50" cy="56" r="5" fill="#18181b" />
              {/* Filter intake slits */}
              <line x1="47" y1="56" x2="53" y2="56" stroke={avatar.primaryColor} strokeWidth="1.5" />
              <line x1="50" y1="53" x2="50" y2="59" stroke={avatar.primaryColor} strokeWidth="1.5" />
            </g>
          )}

          {avatar.headgear === 'goggles' && (
            <g>
              {/* Tan SpecOps Helmet with Desert Cover */}
              <path
                d="M 28 36 C 28 18 72 18 72 36 C 72 41 68 44 65 45 L 35 45 C 32 44 28 41 28 36 Z"
                fill="#78350f"
                stroke={avatar.accentColor}
                strokeWidth="1.5"
              />
              {/* Wide Ballistic Goggles Frame */}
              <rect x="32" y="34" width="36" height="14" rx="4" fill="#18181b" stroke="#71717a" strokeWidth="1" />
              {/* Amber reflective lens */}
              <rect x="34" y="36" width="32" height="10" rx="2.5" fill={`url(#visor-${avatar.id})`} />
              <path d="M 37 38 L 47 43 L 42 45 Z" fill="#ffffff" opacity="0.4" />
              {/* Lower Shemagh Face Wrap */}
              <path
                d="M 35 52 L 65 52 L 61 68 C 55 70 45 70 39 68 Z"
                fill="#b45309"
                stroke="#78350f"
                strokeWidth="1"
              />
              <line x1="38" y1="58" x2="62" y2="58" stroke="#78350f" strokeWidth="1" strokeDasharray="2 2" />
            </g>
          )}

          {avatar.headgear === 'visor' && (
            <g>
              {/* SWAT Riot Helmet */}
              <path
                d="M 26 36 C 26 16 74 16 74 36 C 74 44 70 46 66 47 L 34 47 C 30 46 26 44 26 36 Z"
                fill="#0f172a"
                stroke="#334155"
                strokeWidth="1.5"
              />
              {/* Full Polycarbonate Face Shield */}
              <path
                d="M 31 38 L 69 38 L 66 60 C 60 64 40 64 34 60 Z"
                fill={`url(#visor-${avatar.id})`}
                opacity="0.75"
                stroke={avatar.primaryColor}
                strokeWidth="1.5"
              />
              {/* Curved Glare Reflection */}
              <path d="M 35 41 Q 50 43 65 41" stroke="#ffffff" strokeWidth="1.5" fill="none" opacity="0.7" />
              <path d="M 38 48 Q 50 50 62 48" stroke="#ffffff" strokeWidth="1" fill="none" opacity="0.4" />
            </g>
          )}

          {avatar.headgear === 'beret' && (
            <g>
              {/* Slanted Special Forces Beret */}
              <path
                d="M 26 34 C 26 20 50 18 76 24 C 80 34 68 40 50 40 L 30 38 Z"
                fill={avatar.primaryColor}
                stroke={avatar.accentColor}
                strokeWidth="1.5"
              />
              {/* Gold Officer Crest */}
              <polygon points="40,26 43,32 37,32" fill="#fbbf24" stroke="#d97706" strokeWidth="0.8" />
              {/* Veteran Eye patch / HUD sensor */}
              <circle cx="41" cy="44" r="5" fill="#18181b" stroke="#3f3f46" strokeWidth="1" />
              <line x1="36" y1="41" x2="46" y2="47" stroke="#18181b" strokeWidth="1.5" />
              {/* Right eye focused */}
              <circle cx="59" cy="44" r="3.5" fill="#f8fafc" />
              <circle cx="60" cy="44" r="2" fill={avatar.accentColor} />
              {/* Tactical Jaw Beard / Camo */}
              <path d="M 38 56 Q 50 65 62 56 Q 50 63 38 56" fill="#3f3f46" />
            </g>
          )}

          {avatar.headgear === 'hood' && (
            <g>
              {/* Tactical Hood Cowl */}
              <path
                d="M 25 45 C 25 18 75 18 75 45 C 75 60 70 70 50 70 C 30 70 25 60 25 45 Z"
                fill="#1e293b"
                stroke="#475569"
                strokeWidth="1.5"
              />
              {/* Shadowed Face Opening */}
              <ellipse cx="50" cy="45" rx="16" ry="17" fill="#09090b" />
              {/* Twin Cold Glowing Eyes */}
              <ellipse cx="43" cy="44" rx="4" ry="2.5" fill={avatar.primaryColor} />
              <ellipse cx="57" cy="44" rx="4" ry="2.5" fill={avatar.primaryColor} />
              <circle cx="43" cy="43.5" r="1.2" fill="#ffffff" />
              <circle cx="57" cy="43.5" r="1.2" fill="#ffffff" />
            </g>
          )}

          {avatar.headgear === 'heavy_visor' && (
            <g>
              {/* Titanium Juggernaut Helmet */}
              <rect x="26" y="24" width="48" height="42" rx="8" fill="#18181b" stroke="#52525b" strokeWidth="2" />
              {/* Dual Horizontal Blast Slits */}
              <rect x="34" y="38" width="32" height="4" rx="1.5" fill={`url(#visor-${avatar.id})`} />
              <rect x="34" y="46" width="32" height="4" rx="1.5" fill={`url(#visor-${avatar.id})`} />
              {/* Heavy reinforced bolts */}
              <circle cx="30" cy="28" r="1.5" fill="#a1a1aa" />
              <circle cx="70" cy="28" r="1.5" fill="#a1a1aa" />
              <circle cx="30" cy="62" r="1.5" fill="#a1a1aa" />
              <circle cx="70" cy="62" r="1.5" fill="#a1a1aa" />
            </g>
          )}

          {avatar.headgear === 'cap' && (
            <g>
              {/* Baseball Cap with Visor bill */}
              <path d="M 28 32 C 28 20 72 20 72 32 L 68 38 L 32 38 Z" fill="#365314" stroke="#4d7c0f" strokeWidth="1.5" />
              <path d="M 26 36 Q 50 32 74 36 L 78 39 Q 50 36 22 39 Z" fill="#1a2e05" />
              {/* Tactical sunglasses */}
              <polygon points="34,39 48,39 46,47 36,47" fill="#09090b" stroke={avatar.primaryColor} strokeWidth="1" />
              <polygon points="52,39 66,39 64,47 54,47" fill="#09090b" stroke={avatar.primaryColor} strokeWidth="1" />
              <circle cx="41" cy="43" r="1.5" fill={avatar.visorGlow} />
              <circle cx="59" cy="43" r="1.5" fill={avatar.visorGlow} />
            </g>
          )}
        </svg>

        {/* Tactical Scanlines overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[size:100%_4px] pointer-events-none opacity-40" />
      </div>

      {/* Online indicator ping */}
      {isOnline && (
        <span className="absolute bottom-0 right-0 flex h-3.5 w-3.5">
          <span
            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
            style={{ backgroundColor: avatar.primaryColor }}
          />
          <span
            className="relative inline-flex rounded-full h-3.5 w-3.5 border-2 border-zinc-950"
            style={{ backgroundColor: avatar.primaryColor }}
          />
        </span>
      )}

      {/* Rarity Star / Tier Indicator */}
      {showBadge && size !== 'sm' && (
        <div
          className="absolute -top-1.5 -left-1.5 px-1.5 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider shadow-md text-zinc-950 font-mono"
          style={{
            backgroundColor:
              avatar.rarity === 'Legendary'
                ? '#f59e0b'
                : avatar.rarity === 'Epic'
                ? '#c084fc'
                : avatar.rarity === 'Rare'
                ? '#38bdf8'
                : '#94a3b8',
          }}
        >
          {avatar.rarity === 'Legendary'
            ? '★ TOP'
            : avatar.rarity === 'Epic'
            ? 'EPIC'
            : avatar.rarity === 'Rare'
            ? 'RARE'
            : 'OPS'}
        </div>
      )}
    </div>
  );
};
