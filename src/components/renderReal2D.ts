import { HideObject, Player, PickupItem, Decal, LootItem, Creature, WeaponType } from '../types';
import { TacticalAvatar } from '../data/avatars';
import { ROOM_ZONES } from '../data/gameData';
import { OPEN_WORLD_ZONES, WATER_BORDER_SIZE } from '../data/openWorldData';

/**
 * High-detail Real 2D Top-Down Objects Renderer
 * Inspired by classic 2D tactical CQB games (CS2D, Java ME tactical engines)
 */
export function drawReal2DObject(
  ctx: CanvasRenderingContext2D,
  obj: HideObject,
  textures: Record<string, CanvasPattern | null>,
  time: number
) {
  ctx.save();

  // Subtle floor drop shadow for physical 2D depth
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.fillRect(obj.x + 3, obj.y + 4, obj.w, obj.h);

  switch (obj.type) {
    case 'BED': {
      // Wood frame border
      ctx.fillStyle = '#451a03';
      ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
      ctx.strokeStyle = '#290e02';
      ctx.lineWidth = 2;
      ctx.strokeRect(obj.x, obj.y, obj.w, obj.h);

      // Wooden headboard (top 14px)
      ctx.fillStyle = '#78350f';
      ctx.fillRect(obj.x + 2, obj.y + 2, obj.w - 4, 12);
      ctx.fillStyle = '#92400e';
      ctx.fillRect(obj.x + 4, obj.y + 4, obj.w - 8, 3);

      // Mattress area (linen)
      const matX = obj.x + 4;
      const matY = obj.y + 14;
      const matW = obj.w - 8;
      const matH = obj.h - 18;

      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(matX, matY, matW, matH);

      // Two pillows at head
      const pilW = (matW - 6) / 2;
      const pilH = 14;
      // Pillow 1
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(matX + 2, matY + 3, pilW, pilH);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1;
      ctx.strokeRect(matX + 2, matY + 3, pilW, pilH);
      // Center pillow crease
      ctx.beginPath();
      ctx.moveTo(matX + 2 + pilW * 0.3, matY + 3 + pilH / 2);
      ctx.lineTo(matX + 2 + pilW * 0.7, matY + 3 + pilH / 2);
      ctx.stroke();

      // Pillow 2
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(matX + 4 + pilW, matY + 3, pilW, pilH);
      ctx.strokeRect(matX + 4 + pilW, matY + 3, pilW, pilH);
      ctx.beginPath();
      ctx.moveTo(matX + 4 + pilW + pilW * 0.3, matY + 3 + pilH / 2);
      ctx.lineTo(matX + 4 + pilW + pilW * 0.7, matY + 3 + pilH / 2);
      ctx.stroke();

      // Folded Duvet / Blanket covering lower 65% of bed
      const duvetY = matY + pilH + 6;
      const duvetH = matH - (pilH + 6);
      ctx.fillStyle = '#1e3a5f';
      ctx.fillRect(matX, duvetY, matW, duvetH);

      // Folded white trim at top of duvet
      ctx.fillStyle = '#f1f5f9';
      ctx.fillRect(matX, duvetY, matW, 5);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(matX, duvetY + 5, matW, 1);

      // Quilt stitching patterns
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 1;
      for (let y = duvetY + 12; y < matY + matH; y += 12) {
        ctx.beginPath();
        ctx.moveTo(matX + 2, y);
        ctx.lineTo(matX + matW - 2, y);
        ctx.stroke();
      }
      break;
    }

    case 'MEDBAY_BED': {
      // Chrome tubular medical gurney frame
      ctx.fillStyle = '#475569';
      ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(obj.x, obj.y, obj.w, obj.h);

      // 4 Caster wheels at corners
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(obj.x - 2, obj.y - 1, 4, 3);
      ctx.fillRect(obj.x + obj.w - 2, obj.y - 1, 4, 3);
      ctx.fillRect(obj.x - 2, obj.y + obj.h - 2, 4, 3);
      ctx.fillRect(obj.x + obj.w - 2, obj.y + obj.h - 2, 4, 3);

      // Sterile vinyl mattress
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(obj.x + 3, obj.y + 4, obj.w - 6, obj.h - 8);
      ctx.strokeStyle = '#cbd5e1';
      ctx.strokeRect(obj.x + 3, obj.y + 4, obj.w - 6, obj.h - 8);

      // Elevated head rest
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(obj.x + 5, obj.y + 6, obj.w - 10, 16);

      // Crisp Medical Red Cross on pillow
      const cx = obj.x + obj.w / 2;
      const cy = obj.y + 14;
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(cx - 6, cy - 2, 12, 4);
      ctx.fillRect(cx - 2, cy - 6, 4, 12);

      // IV Drip Pole base on side
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.arc(obj.x + 6, obj.y + obj.h - 8, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();
      break;
    }

    case 'SOFA': {
      // Rounded outer frame (Dark Navy / Charcoal)
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.roundRect(obj.x, obj.y, obj.w, obj.h, 6);
      ctx.fill();
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Backrest along top
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(obj.x + 6, obj.y + 2, obj.w - 12, 10);
      ctx.strokeStyle = '#475569';
      ctx.strokeRect(obj.x + 6, obj.y + 2, obj.w - 12, 10);

      // Left & Right Armrests
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(obj.x + 2, obj.y + 4, 8, obj.h - 8);
      ctx.fillRect(obj.x + obj.w - 10, obj.y + 4, 8, obj.h - 8);
      ctx.strokeStyle = '#475569';
      ctx.strokeRect(obj.x + 2, obj.y + 4, 8, obj.h - 8);
      ctx.strokeRect(obj.x + obj.w - 10, obj.y + 4, 8, obj.h - 8);

      // Plush seat cushions (2 or 3 split)
      const seatX = obj.x + 11;
      const seatY = obj.y + 13;
      const seatW = obj.w - 22;
      const seatH = obj.h - 16;
      const numCushions = obj.w > 65 ? 3 : 2;
      const cushionW = (seatW - (numCushions - 1) * 2) / numCushions;

      for (let c = 0; c < numCushions; c++) {
        const cx = seatX + c * (cushionW + 2);
        ctx.fillStyle = '#1d4ed8';
        ctx.fillRect(cx, seatY, cushionW, seatH);
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 1;
        ctx.strokeRect(cx, seatY, cushionW, seatH);

        // Center cushion highlight
        ctx.fillStyle = '#60a5fa';
        ctx.fillRect(cx + 3, seatY + 3, cushionW - 6, 2);
      }
      break;
    }

    case 'TABLE': {
      // Rich polished mahogany wood
      ctx.fillStyle = '#78350f';
      ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 2;
      ctx.strokeRect(obj.x, obj.y, obj.w, obj.h);

      // Wood grain border bevel
      ctx.fillStyle = '#92400e';
      ctx.fillRect(obj.x + 2, obj.y + 2, obj.w - 4, 2);
      ctx.fillRect(obj.x + 2, obj.y + 2, 2, obj.h - 4);

      // Laptop / Tactical Terminal on table
      const lapX = obj.x + 8;
      const lapY = obj.y + (obj.h - 18) / 2;
      // Laptop base
      ctx.fillStyle = '#18181b';
      ctx.fillRect(lapX, lapY + 8, 20, 10);
      // Glowing LCD screen
      ctx.fillStyle = '#06b6d4';
      ctx.fillRect(lapX + 2, lapY, 16, 7);
      ctx.strokeStyle = '#22d3ee';
      ctx.strokeRect(lapX + 2, lapY, 16, 7);

      // Tactical map grid on laptop screen
      ctx.strokeStyle = '#ecfeff';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(lapX + 2, lapY + 3.5);
      ctx.lineTo(lapX + 18, lapY + 3.5);
      ctx.moveTo(lapX + 10, lapY);
      ctx.lineTo(lapX + 10, lapY + 7);
      ctx.stroke();

      // Coffee mug with saucer
      const mugX = obj.x + obj.w - 14;
      const mugY = obj.y + obj.h / 2;
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.arc(mugX, mugY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.arc(mugX, mugY, 2.5, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'DESK': {
      // Workstation desk surface
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2;
      ctx.strokeRect(obj.x, obj.y, obj.w, obj.h);

      // Dual LCD Computer Monitors
      const monY = obj.y + 3;
      // Monitor 1
      ctx.fillStyle = '#09090b';
      ctx.fillRect(obj.x + 6, monY, 18, 5);
      ctx.fillStyle = '#10b981';
      ctx.fillRect(obj.x + 7, monY + 1, 16, 3);

      // Monitor 2
      ctx.fillStyle = '#09090b';
      ctx.fillRect(obj.x + 28, monY, 18, 5);
      ctx.fillStyle = '#00e5ff';
      ctx.fillRect(obj.x + 29, monY + 1, 16, 3);

      // Keyboard & mousepad
      ctx.fillStyle = '#334155';
      ctx.fillRect(obj.x + 12, obj.y + 12, 18, 7);
      ctx.fillStyle = '#64748b';
      for (let kx = obj.x + 13; kx < obj.x + 28; kx += 3) {
        ctx.fillRect(kx, obj.y + 13, 2, 5);
      }
      // Mousepad
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(obj.x + 33, obj.y + 12, 8, 7);
      break;
    }

    case 'COUNTER': {
      // Polished dark speckled granite countertop
      ctx.fillStyle = '#334155';
      ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(obj.x, obj.y, obj.w, obj.h);

      // Chrome beveled edge
      ctx.fillStyle = '#64748b';
      ctx.fillRect(obj.x + 1, obj.y + 1, obj.w - 2, 2);

      // Stainless Steel Kitchen Sink (Left side)
      const sinkX = obj.x + 6;
      const sinkY = obj.y + 4;
      const sinkW = 18;
      const sinkH = obj.h - 8;
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(sinkX, sinkY, sinkW, sinkH);
      ctx.fillStyle = '#64748b';
      ctx.fillRect(sinkX + 2, sinkY + 2, sinkW - 4, sinkH - 4);
      // Faucet
      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.arc(sinkX + sinkW / 2, sinkY + 3, 2, 0, Math.PI * 2);
      ctx.fill();

      // Induction Cooktop with 4 red coil burners (Right side if long enough)
      if (obj.w > 50) {
        const cookX = obj.x + obj.w - 28;
        const cookY = obj.y + 3;
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(cookX, cookY, 24, obj.h - 6);

        // 4 glowing burner coils
        const burnerCoords = [
          [cookX + 6, cookY + 5],
          [cookX + 18, cookY + 5],
          [cookX + 6, cookY + obj.h - 11],
          [cookX + 18, cookY + obj.h - 11],
        ];

        burnerCoords.forEach(([bx, by], i) => {
          ctx.strokeStyle = i === 1 ? '#ef4444' : '#f97316';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(bx, by, 3.5, 0, Math.PI * 2);
          ctx.stroke();
          if (i === 1) {
            ctx.fillStyle = 'rgba(239, 68, 68, 0.4)';
            ctx.fill();
          }
        });
      }
      break;
    }

    case 'FRIDGE': {
      // Brushed stainless steel metallic body
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(obj.x, obj.y, obj.w, obj.h);

      // Door split line (Top freezer vs lower fridge)
      const splitY = obj.y + obj.h * 0.4;
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(obj.x, splitY);
      ctx.lineTo(obj.x + obj.w, splitY);
      ctx.stroke();

      // Chrome vertical door handles on right edge
      ctx.fillStyle = '#475569';
      ctx.fillRect(obj.x + obj.w - 4, obj.y + 4, 2, splitY - obj.y - 8);
      ctx.fillRect(obj.x + obj.w - 4, splitY + 4, 2, obj.h - splitY - 8);

      // Digital LED temperature readout
      ctx.fillStyle = '#09090b';
      ctx.fillRect(obj.x + 4, obj.y + 6, 12, 6);
      ctx.fillStyle = '#00e5ff';
      ctx.font = 'bold 5px monospace';
      ctx.fillText('-18°', obj.x + 5, obj.y + 11);

      // Yellow sticky memo note on lower door
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(obj.x + 5, splitY + 8, 8, 8);
      ctx.strokeStyle = '#ca8a04';
      ctx.strokeRect(obj.x + 5, splitY + 8, 8, 8);
      break;
    }

    case 'SERVER': {
      // Matte black server chassis
      ctx.fillStyle = '#09090b';
      ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
      ctx.strokeStyle = '#27272a';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(obj.x, obj.y, obj.w, obj.h);

      // Rack trays & ventilation louvers
      const numTrays = Math.floor(obj.h / 10);
      for (let t = 0; t < numTrays; t++) {
        const ty = obj.y + 3 + t * 9;
        ctx.fillStyle = '#18181b';
        ctx.fillRect(obj.x + 3, ty, obj.w - 6, 7);
        ctx.strokeStyle = '#3f3f46';
        ctx.strokeRect(obj.x + 3, ty, obj.w - 6, 7);

        // Blinking LED status indicators
        const pulse = Math.sin(time * 0.08 + t * 1.5);
        // Green power LED
        ctx.fillStyle = '#10b981';
        ctx.fillRect(obj.x + 5, ty + 2.5, 2, 2);

        // Cyan network pulse LED
        ctx.fillStyle = pulse > 0 ? '#00e5ff' : '#0369a1';
        ctx.fillRect(obj.x + 9, ty + 2.5, 2, 2);

        // Amber drive activity LED
        const diskPulse = Math.cos(time * 0.12 + t * 2.2);
        ctx.fillStyle = diskPulse > 0.2 ? '#f59e0b' : '#78350f';
        ctx.fillRect(obj.x + 13, ty + 2.5, 2, 2);

        // Server handle
        ctx.fillStyle = '#71717a';
        ctx.fillRect(obj.x + obj.w - 7, ty + 2, 3, 3);
      }
      break;
    }

    case 'CRATE': {
      // Military olive-drab container
      ctx.fillStyle = '#3f4b3b';
      ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
      ctx.strokeStyle = '#222921';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(obj.x, obj.y, obj.w, obj.h);

      // Steel reinforced corner brackets
      ctx.fillStyle = '#18181b';
      const bSize = 6;
      ctx.fillRect(obj.x, obj.y, bSize, bSize);
      ctx.fillRect(obj.x + obj.w - bSize, obj.y, bSize, bSize);
      ctx.fillRect(obj.x, obj.y + obj.h - bSize, bSize, bSize);
      ctx.fillRect(obj.x + obj.w - bSize, obj.y + obj.h - bSize, bSize, bSize);

      // Rivet screws
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(obj.x + 2, obj.y + 2, 2, 2);
      ctx.fillRect(obj.x + obj.w - 4, obj.y + 2, 2, 2);
      ctx.fillRect(obj.x + 2, obj.y + obj.h - 4, 2, 2);
      ctx.fillRect(obj.x + obj.w - 4, obj.y + obj.h - 4, 2, 2);

      // Diagonal cross brace
      ctx.strokeStyle = '#2d372a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(obj.x + 4, obj.y + 4);
      ctx.lineTo(obj.x + obj.w - 4, obj.y + obj.h - 4);
      ctx.moveTo(obj.x + obj.w - 4, obj.y + 4);
      ctx.lineTo(obj.x + 4, obj.y + obj.h - 4);
      ctx.stroke();

      // Yellow military stencil markings
      ctx.fillStyle = 'rgba(250, 204, 21, 0.75)';
      ctx.font = 'bold 6px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('5.56 NATO', obj.x + obj.w / 2, obj.y + obj.h / 2 + 2);
      break;
    }

    case 'PLANT': {
      // Terracotta round pot
      const cx = obj.x + obj.w / 2;
      const cy = obj.y + obj.h / 2;
      const radius = Math.min(obj.w, obj.h) / 2 - 2;

      // Outer planter rim
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Dark potting soil
      ctx.fillStyle = '#292524';
      ctx.beginPath();
      ctx.arc(cx, cy, radius - 3, 0, Math.PI * 2);
      ctx.fill();

      // Layered organic fern fronds spreading outward
      const leaves = 8;
      for (let i = 0; i < leaves; i++) {
        const ang = (Math.PI * 2 * i) / leaves + Math.sin(time * 0.02 + i) * 0.05;
        const lx = cx + Math.cos(ang) * (radius + 4);
        const ly = cy + Math.sin(ang) * (radius + 4);

        ctx.fillStyle = i % 2 === 0 ? '#16a34a' : '#22c55e';
        ctx.beginPath();
        ctx.ellipse(
          cx + Math.cos(ang) * (radius * 0.6),
          cy + Math.sin(ang) * (radius * 0.6),
          radius * 0.7,
          4,
          ang,
          0,
          Math.PI * 2
        );
        ctx.fill();

        // Leaf spine
        ctx.strokeStyle = '#14532d';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(lx, ly);
        ctx.stroke();
      }
      break;
    }

    case 'BATHTUB': {
      // White porcelain rounded tub
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.roundRect(obj.x, obj.y, obj.w, obj.h, 8);
      ctx.fill();
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Water pool inside
      const basinX = obj.x + 4;
      const basinY = obj.y + 4;
      const basinW = obj.w - 8;
      const basinH = obj.h - 8;
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.roundRect(basinX, basinY, basinW, basinH, 6);
      ctx.fill();

      // Translucent reflective water surface
      ctx.fillStyle = 'rgba(224, 242, 254, 0.45)';
      ctx.fillRect(basinX, basinY, basinW, basinH);

      // Drain hole
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.arc(basinX + basinW - 6, basinY + basinH / 2, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Chrome faucet
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(obj.x + 2, basinY + basinH / 2 - 2, 4, 4);
      break;
    }

    case 'WARDROBE': {
      // Gun-metal locker cabinet
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2;
      ctx.strokeRect(obj.x, obj.y, obj.w, obj.h);

      // Dual locker doors
      const midX = obj.x + obj.w / 2;
      ctx.strokeStyle = '#334155';
      ctx.beginPath();
      ctx.moveTo(midX, obj.y);
      ctx.lineTo(midX, obj.y + obj.h);
      ctx.stroke();

      // Ventilation slots on both doors
      ctx.fillStyle = '#0f172a';
      for (let vy = obj.y + 6; vy < obj.y + 18; vy += 3) {
        ctx.fillRect(obj.x + 4, vy, obj.w / 2 - 8, 1.5);
        ctx.fillRect(midX + 4, vy, obj.w / 2 - 8, 1.5);
      }

      // Keypad lock / Handle
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(midX - 3, obj.y + obj.h / 2 - 2, 2, 4);
      ctx.fillRect(midX + 1, obj.y + obj.h / 2 - 2, 2, 4);
      break;
    }

    default: {
      ctx.fillStyle = obj.jumpOver ? '#1e293b' : '#334155';
      ctx.fillRect(obj.x, obj.y, obj.w, obj.h);
      ctx.strokeStyle = obj.jumpOver ? '#38bdf8' : '#64748b';
      ctx.strokeRect(obj.x, obj.y, obj.w, obj.h);
      break;
    }
  }

  // Vault / High cover badge callout
  ctx.fillStyle = obj.jumpOver ? 'rgba(56, 189, 248, 0.9)' : 'rgba(239, 68, 68, 0.9)';
  ctx.font = 'bold 8px monospace';
  ctx.fillText(
    `${obj.type} ${obj.jumpOver ? '[VAULT]' : '[HIGH]'}`,
    obj.x + 3,
    obj.y + 10
  );

  ctx.restore();
}

/**
 * High-detail Real 2D Top-Down Player Model Renderer
 * Renders tactical boots, armor vest, team armbands, arms holding weapon, helmet with goggles,
 * laser sights, and dynamic firing muzzle flashes!
 */
export function drawReal2DPlayer(
  ctx: CanvasRenderingContext2D,
  p: Player,
  isYou: boolean,
  operatorColor: string,
  avatar: TacticalAvatar,
  frameCount: number,
  showAiLasers: boolean
) {
  if (p.hp <= 0) return;

  ctx.save();

  // 1. Vault Jump Shadow (when jumping over sofa, bed, etc.)
  if (p.jumping) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.ellipse(p.x, p.y + 5, 14, 7, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // 2. Forward Tactical Laser Sight Beam
  if (showAiLasers || isYou) {
    ctx.save();
    const laserAng = p.angle;
    const laserLength = 160;
    const lx1 = p.x + Math.cos(laserAng) * 20;
    const ly1 = p.y - p.jumpH + Math.sin(laserAng) * 20;
    const lx2 = p.x + Math.cos(laserAng) * laserLength;
    const ly2 = p.y - p.jumpH + Math.sin(laserAng) * laserLength;

    const laserGrad = ctx.createLinearGradient(lx1, ly1, lx2, ly2);
    const laserCol = p.team === 'A' ? 'rgba(0, 229, 255,' : 'rgba(239, 68, 68,';
    laserGrad.addColorStop(0, `${laserCol} 0.5)`);
    laserGrad.addColorStop(0.7, `${laserCol} 0.2)`);
    laserGrad.addColorStop(1, `${laserCol} 0)`);

    ctx.strokeStyle = laserGrad;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(lx1, ly1);
    ctx.lineTo(lx2, ly2);
    ctx.stroke();

    // Subtle laser target dot at end
    ctx.fillStyle = p.team === 'A' ? 'rgba(0, 229, 255, 0.7)' : 'rgba(239, 68, 68, 0.7)';
    ctx.beginPath();
    ctx.arc(lx2, ly2, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  // 3. Translate & Rotate to Player Angle
  ctx.save();
  ctx.translate(p.x, p.y - p.jumpH);
  ctx.rotate(p.angle);

  // Dynamic Walk Stride (Alternating Tactical Boots)
  const walkProg = p.walkProg || 0;
  const leftStride = Math.sin(walkProg) * 4;
  const rightStride = -Math.sin(walkProg) * 4;

  // Left Boot (Top-down view)
  ctx.fillStyle = '#09090b';
  ctx.fillRect(-8 + leftStride, -10, 8, 4);
  ctx.strokeStyle = '#27272a';
  ctx.lineWidth = 1;
  ctx.strokeRect(-8 + leftStride, -10, 8, 4);

  // Right Boot
  ctx.fillStyle = '#09090b';
  ctx.fillRect(-8 + rightStride, 6, 8, 4);
  ctx.strokeRect(-8 + rightStride, 6, 8, 4);

  // 4. Tactical Torso & Plate Carrier Vest
  // Body Base / BDU Camo
  const baseColor = isYou ? operatorColor : p.color;
  ctx.fillStyle = '#1e293b';
  ctx.beginPath();
  ctx.roundRect(-10, -8, 20, 16, 4);
  ctx.fill();

  // Heavy Kevlar Plate Carrier Vest (Center)
  ctx.fillStyle = baseColor;
  ctx.beginPath();
  ctx.roundRect(-7, -6, 14, 12, 3);
  ctx.fill();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1;
  ctx.stroke();

  // MOLLE Mag Pouches on Vest
  ctx.fillStyle = '#09090b';
  ctx.fillRect(-2, -5, 4, 3);
  ctx.fillRect(-2, -1, 4, 3);
  ctx.fillRect(-2, 3, 4, 3);

  // Team Armband on shoulders (Left & Right)
  const armbandColor = p.team === 'A' ? '#00e5ff' : '#ef4444';
  ctx.fillStyle = armbandColor;
  ctx.fillRect(-4, -9, 6, 2.5);
  ctx.fillRect(-4, 6.5, 6, 2.5);

  // 5. Extended Arms & Gloved Hands Holding Rifle
  // Left Arm (forward grip)
  ctx.fillStyle = baseColor;
  ctx.fillRect(2, -9, 10, 4);
  // Left gloved hand
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(12, -7, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Right Arm (trigger grip)
  ctx.fillStyle = baseColor;
  ctx.fillRect(0, 5, 8, 4);
  // Right gloved hand
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(8, 7, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // 6. Detailed M4A1 CQB Assault Rifle
  // Rifle Receiver & Stock
  ctx.fillStyle = '#09090b';
  ctx.fillRect(4, -1, 14, 4);
  // Stock extension
  ctx.fillStyle = '#27272a';
  ctx.fillRect(0, -0.5, 4, 3);
  // Barrel & Flash Hider
  ctx.fillStyle = '#18181b';
  ctx.fillRect(18, -0.5, 9, 2.5);
  // Picatinny Top Rail & Holographic EOTech Sight
  ctx.fillStyle = '#0284c7';
  ctx.fillRect(10, -2.5, 5, 2);
  // Red reticle dot on sight
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(12, -2, 1.5, 1);

  // 7. Tactical Headgear & Helmet
  // Head contour
  ctx.fillStyle = '#09090b';
  ctx.beginPath();
  ctx.arc(-1, 0, 6.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#475569';
  ctx.stroke();

  // Operator Helmet / Cap / Goggles
  ctx.fillStyle = avatar.accentColor || '#38bdf8';
  ctx.beginPath();
  ctx.arc(-1, 0, 5.5, -Math.PI * 0.7, Math.PI * 0.7);
  ctx.fill();

  // Glowing Tactical Visor / NVG Goggles
  const visorGlow = avatar.visorGlow || '#00e5ff';
  ctx.fillStyle = visorGlow;
  ctx.fillRect(2, -3, 3, 6);
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 0.8;
  ctx.strokeRect(2, -3, 3, 6);

  // 8. Dynamic Starburst Muzzle Flash when firing!
  if (p.firingTimer && p.firingTimer > 0) {
    const flashX = 28;
    const flashY = 0.5;
    ctx.save();
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(flashX, flashY, 5, 0, Math.PI * 2);
    ctx.fill();

    // Starburst spikes
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.5;
    for (let s = 0; s < 5; s++) {
      const sa = (Math.PI * 2 * s) / 5;
      ctx.beginPath();
      ctx.moveTo(flashX, flashY);
      ctx.lineTo(flashX + Math.cos(sa) * 9, flashY + Math.sin(sa) * 9);
      ctx.stroke();
    }
    ctx.restore();
  }

  ctx.restore(); // Restore angle rotation

  // 9. Health Bar & Callsign Label above Player
  const barW = 38;
  const barH = 4;
  const barX = p.x - barW / 2;
  const barY = p.y - 23 - p.jumpH;

  // Health Bar Red Background
  ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
  ctx.fillRect(barX - 1, barY - 1, barW + 2, barH + 2);
  ctx.fillStyle = '#ef4444';
  ctx.fillRect(barX, barY, barW, barH);

  // Green Health Fill
  const hpPercent = Math.max(0, p.hp / p.maxHp);
  ctx.fillStyle = hpPercent > 0.35 ? '#10b981' : '#f59e0b';
  ctx.fillRect(barX, barY, barW * hpPercent, barH);
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
  ctx.lineWidth = 1;
  ctx.strokeRect(barX, barY, barW, barH);

  // Player Name & Flag
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 9px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(
    `${p.name} ${p.flag}${p.jumping ? ' 🦘' : ''}`,
    p.x,
    barY - 3
  );

  // Ammo / Reloading indicator if low
  if (p.reloading) {
    ctx.fillStyle = '#f59e0b';
    ctx.font = 'bold 8px monospace';
    ctx.fillText('RELOADING...', p.x, barY + barH + 9);
  }

  ctx.restore();
}

/**
 * Animated Real 2D Pickups (Medkit & Ammo)
 */
export function drawReal2DPickup(
  ctx: CanvasRenderingContext2D,
  pk: PickupItem,
  time: number
) {
  if (pk.respawnTimer > 0) return; // Currently collected

  ctx.save();
  const bob = Math.sin(time * 0.06 + pk.x) * 2;
  const py = pk.y + bob;

  if (pk.type === 'MEDKIT') {
    // Pulsing healing aura
    const auraAlpha = 0.3 + 0.2 * Math.sin(time * 0.08);
    ctx.fillStyle = `rgba(16, 185, 129, ${auraAlpha})`;
    ctx.beginPath();
    ctx.arc(pk.x, py, 14, 0, Math.PI * 2);
    ctx.fill();

    // White medical hardcase
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(pk.x - 9, py - 7, 18, 14);
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(pk.x - 9, py - 7, 18, 14);

    // Case handle
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(pk.x - 3, py - 9, 6, 2);

    // Red Cross emblem
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(pk.x - 5, py - 1.5, 10, 3);
    ctx.fillRect(pk.x - 1.5, py - 5, 3, 10);
  } else {
    // Ammo Cache
    const auraAlpha = 0.3 + 0.2 * Math.sin(time * 0.08);
    ctx.fillStyle = `rgba(245, 158, 11, ${auraAlpha})`;
    ctx.beginPath();
    ctx.arc(pk.x, py, 14, 0, Math.PI * 2);
    ctx.fill();

    // Military olive ammo tin
    ctx.fillStyle = '#3f4b3b';
    ctx.fillRect(pk.x - 8, py - 7, 16, 14);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(pk.x - 8, py - 7, 16, 14);

    // Golden 5.56 ammunition cartridges inside
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(pk.x - 4, py - 4, 2, 8);
    ctx.fillRect(pk.x - 1, py - 4, 2, 8);
    ctx.fillRect(pk.x + 2, py - 4, 2, 8);
  }

  ctx.restore();
}

/**
 * Floor Decals (Blood splatters & expended brass casings)
 */
export function drawDecals(ctx: CanvasRenderingContext2D, decals: Decal[]) {
  decals.forEach((d) => {
    ctx.save();
    ctx.globalAlpha = d.alpha;
    ctx.translate(d.x, d.y);
    ctx.rotate(d.angle);

    if (d.type === 'BLOOD') {
      ctx.fillStyle = '#991b1b';
      ctx.beginPath();
      ctx.ellipse(0, 0, d.size, d.size * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
      // Secondary blood droplet
      ctx.beginPath();
      ctx.arc(d.size * 0.8, d.size * 0.4, d.size * 0.3, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Brass bullet casing
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(-2, -1, 4, 2);
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 0.5;
      ctx.strokeRect(-2, -1, 4, 2);
    }

    ctx.restore();
  });
}

/**
 * Safe-House 7 Rooms Floor Patterns & Thematic Room Zones
 */
export function drawRoomFloors(
  ctx: CanvasRenderingContext2D,
  textures: Record<string, CanvasPattern | null>,
  width: number,
  height: number
) {
  // Base floor tile
  if (textures.tile) {
    ctx.fillStyle = textures.tile;
    ctx.fillRect(0, 0, width, height);
  } else {
    ctx.fillStyle = '#18181b';
    ctx.fillRect(0, 0, width, height);
  }

  // Draw 7 Distinct Thematic Room Zones
  ROOM_ZONES.forEach((zone) => {
    ctx.save();
    // Subtle zone floor wash
    ctx.fillStyle = zone.accentColor;
    ctx.globalAlpha = 0.05;
    ctx.fillRect(zone.x, zone.y, zone.w, zone.h);

    // Floor borders
    ctx.strokeStyle = zone.accentColor;
    ctx.globalAlpha = 0.15;
    ctx.lineWidth = 1;
    ctx.strokeRect(zone.x, zone.y, zone.w, zone.h);

    // Subtle tactical room callout on floor
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = zone.accentColor;
    ctx.font = 'bold 9px monospace';
    ctx.fillText(`${zone.code} // ${zone.name.toUpperCase()}`, zone.x + 8, zone.y + 16);
    ctx.restore();
  });

  // Carpets in Lounge & Quarters
  if (textures.carpet) {
    ctx.fillStyle = textures.carpet;
    ctx.fillRect(20, 20, 235, 255); // Room 1 Lounge carpet
    ctx.fillRect(525, 420, 255, 160); // Room 7 Armory work mat
  }

  // Tactical Floor Grid
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
  ctx.lineWidth = 1;
  for (let gx = 0; gx < width; gx += 40) {
    ctx.beginPath();
    ctx.moveTo(gx, 0);
    ctx.lineTo(gx, height);
    ctx.stroke();
  }
  for (let gy = 0; gy < height; gy += 40) {
    ctx.beginPath();
    ctx.moveTo(0, gy);
    ctx.lineTo(width, gy);
    ctx.stroke();
  }
}

/**
 * Open World Island (Erangel Style) 2D Terrain & Water Renderer
 * Features deep animated ocean perimeter, sand beaches, dirt roads, and zone footprints
 */
export function drawOpenWorldTerrain(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number
) {
  // 1. Deep Ocean Base (Water all around the island)
  ctx.fillStyle = '#082f49'; // deep ocean navy
  ctx.fillRect(0, 0, width, height);

  // Animated ocean water waves
  ctx.save();
  ctx.fillStyle = '#0284c7';
  ctx.globalAlpha = 0.25;
  const waveOffset = (time * 0.001) % (Math.PI * 2);
  for (let w = 0; w < width; w += 120) {
    for (let h = 0; h < height; h += 120) {
      const waveRadius = 14 + Math.sin(waveOffset + w * 0.01 + h * 0.01) * 6;
      ctx.beginPath();
      ctx.arc(w + 60, h + 60, waveRadius, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  ctx.restore();

  // 2. Island Coastline / Beach (Sand Buffer)
  const pad = WATER_BORDER_SIZE;
  const islandW = width - pad * 2;
  const islandH = height - pad * 2;

  // Sandy Shoreline
  ctx.save();
  ctx.fillStyle = '#d97706'; // wet beach sand
  ctx.fillRect(pad - 35, pad - 35, islandW + 70, islandH + 70);

  // Dry Beach Sand
  ctx.fillStyle = '#fde68a'; // golden beach sand
  ctx.fillRect(pad - 18, pad - 18, islandW + 36, islandH + 36);

  // 3. Island Mainland Grass / Terrain
  ctx.fillStyle = '#1c3829'; // dark tactical foliage/grass
  ctx.fillRect(pad, pad, islandW, islandH);

  // Secondary grass texture variation
  ctx.fillStyle = '#1e293b'; // rock/soil patch
  ctx.globalAlpha = 0.35;
  ctx.fillRect(pad + 100, pad + 100, islandW - 200, islandH - 200);
  ctx.restore();

  // 4. Main Asphalt / Dirt Roads connecting the zones
  ctx.save();
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 26;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // East-West Highway (Docks -> Pochinki -> Mylta)
  ctx.beginPath();
  ctx.moveTo(800, 700);
  ctx.lineTo(1600, 1500);
  ctx.lineTo(2700, 1800);
  ctx.stroke();

  // North-South Highway (School -> Pochinki -> Military)
  ctx.beginPath();
  ctx.moveTo(1900, 900);
  ctx.lineTo(1900, 1500);
  ctx.lineTo(1900, 2250);
  ctx.stroke();

  // Road center dashed line
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 2;
  ctx.setLineDash([12, 16]);
  ctx.beginPath();
  ctx.moveTo(800, 700);
  ctx.lineTo(1600, 1500);
  ctx.lineTo(2700, 1800);
  ctx.moveTo(1900, 900);
  ctx.lineTo(1900, 1500);
  ctx.lineTo(1900, 2250);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();

  // 5. Distinct Zone Footprints & Tactical Callouts
  OPEN_WORLD_ZONES.forEach((z) => {
    ctx.save();
    // Zone floor tint
    ctx.fillStyle = z.accentColor;
    ctx.globalAlpha = 0.06;
    ctx.fillRect(z.x, z.y, z.w, z.h);

    // Zone outer boundary border
    ctx.strokeStyle = z.accentColor;
    ctx.globalAlpha = 0.25;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(z.x, z.y, z.w, z.h);

    // High tech corner brackets
    const bLen = 22;
    ctx.globalAlpha = 0.6;
    ctx.lineWidth = 2.5;
    // Top-left
    ctx.beginPath();
    ctx.moveTo(z.x, z.y + bLen); ctx.lineTo(z.x, z.y); ctx.lineTo(z.x + bLen, z.y); ctx.stroke();
    // Top-right
    ctx.beginPath();
    ctx.moveTo(z.x + z.w - bLen, z.y); ctx.lineTo(z.x + z.w, z.y); ctx.lineTo(z.x + z.w, z.y + bLen); ctx.stroke();
    // Bottom-left
    ctx.beginPath();
    ctx.moveTo(z.x, z.y + z.h - bLen); ctx.lineTo(z.x, z.y + z.h); ctx.lineTo(z.x + bLen, z.y + z.h); ctx.stroke();
    // Bottom-right
    ctx.beginPath();
    ctx.moveTo(z.x + z.w - bLen, z.y + z.h); ctx.lineTo(z.x + z.w, z.y + z.h); ctx.lineTo(z.x + z.w, z.y + z.h - bLen); ctx.stroke();

    // Prominent Sector Name & Loot Tier Tag
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 13px "Space Grotesk", sans-serif';
    ctx.fillText(`${z.code} // ${z.name.toUpperCase()}`, z.x + 12, z.y + 24);

    ctx.font = 'bold 10px monospace';
    ctx.fillStyle = z.accentColor;
    ctx.fillText(`${z.subtitle} • LOOT: ${z.lootTier.toUpperCase()}`, z.x + 12, z.y + 40);

    ctx.restore();
  });
}

/**
 * 2D Glowing Ground Loot Item Renderer
 * Renders weapons, ammo, medkits, armor plates, and frag grenades with holographic glow
 */
export function drawLootItem(
  ctx: CanvasRenderingContext2D,
  loot: LootItem,
  time: number
) {
  if (loot.respawnTimer > 0) return;

  ctx.save();
  const bob = Math.sin(time * 0.005 + loot.x * 0.01) * 3;
  const lx = loot.x;
  const ly = loot.y + bob;

  // 1. Soft glowing beacon ring on ground
  const pulse = 0.5 + Math.sin(time * 0.008) * 0.3;
  ctx.fillStyle = loot.color;
  ctx.globalAlpha = 0.25 * pulse;
  ctx.beginPath();
  ctx.arc(loot.x, loot.y + 4, 18, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = loot.color;
  ctx.globalAlpha = 0.6 * pulse;
  ctx.lineWidth = 1.2;
  ctx.stroke();

  // 2. Loot Item Graphic
  ctx.globalAlpha = 1.0;
  if (loot.type.startsWith('GUN_')) {
    // 2D Tactical Weapon on ground
    ctx.save();
    ctx.translate(lx, ly);
    ctx.rotate(-Math.PI / 4);

    // Gun receiver
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-10, -3, 20, 6);
    // Barrel
    ctx.fillStyle = loot.color;
    ctx.fillRect(10, -2, 8, 4);
    // Stock
    ctx.fillStyle = '#334155';
    ctx.fillRect(-14, -2, 4, 4);

    ctx.restore();
  } else if (loot.type === 'MEDKIT') {
    // Medkit Crate with Cross
    ctx.fillStyle = '#064e3b';
    ctx.fillRect(lx - 9, ly - 7, 18, 14);
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(lx - 9, ly - 7, 18, 14);
    // White Cross
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(lx - 1.5, ly - 5, 3, 10);
    ctx.fillRect(lx - 5, ly - 1.5, 10, 3);
  } else if (loot.type === 'AMMO') {
    // Green ammo can
    ctx.fillStyle = '#14532d';
    ctx.fillRect(lx - 8, ly - 6, 16, 12);
    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 1;
    ctx.strokeRect(lx - 8, ly - 6, 16, 12);
    // Yellow brass bullet tips
    ctx.fillStyle = '#eab308';
    ctx.fillRect(lx - 5, ly - 4, 2, 4);
    ctx.fillRect(lx - 1, ly - 4, 2, 4);
    ctx.fillRect(lx + 3, ly - 4, 2, 4);
  } else if (loot.type === 'ARMOR') {
    // Blue Kevlar Armor Plate
    ctx.fillStyle = '#1e3a8a';
    ctx.beginPath();
    ctx.moveTo(lx, ly - 8);
    ctx.lineTo(lx + 8, ly - 4);
    ctx.lineTo(lx + 6, ly + 6);
    ctx.lineTo(lx, ly + 9);
    ctx.lineTo(lx - 6, ly + 6);
    ctx.lineTo(lx - 8, ly - 4);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#60a5fa';
    ctx.lineWidth = 1.2;
    ctx.stroke();
  } else if (loot.type === 'BOMB') {
    // Frag Grenade with pin
    ctx.fillStyle = '#7c2d12';
    ctx.beginPath();
    ctx.arc(lx, ly, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 1;
    ctx.stroke();
    // Spoon & safety ring
    ctx.fillStyle = '#9ca3af';
    ctx.fillRect(lx - 2, ly - 9, 4, 3);
  }

  // 3. Compact Floating Name Tag
  ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
  ctx.strokeStyle = loot.color;
  ctx.lineWidth = 0.8;
  const labelText = loot.name;
  ctx.font = 'bold 8px monospace';
  const textW = ctx.measureText(labelText).width;
  ctx.fillRect(lx - textW / 2 - 3, ly - 18, textW + 6, 11);
  ctx.strokeRect(lx - textW / 2 - 3, ly - 18, textW + 6, 11);

  ctx.fillStyle = loot.color;
  ctx.fillText(labelText, lx - textW / 2, ly - 9);

  ctx.restore();
}

/**
 * 2D Mutant Creature (Stalker & Beast) Renderer
 * Renders arachnid limbs, shadowy chitin body, eerie glowing red eyes, and health bar
 */
export function drawCreature(
  ctx: CanvasRenderingContext2D,
  creature: Creature,
  time: number
) {
  if (creature.hp <= 0) return;

  ctx.save();
  ctx.translate(creature.x, creature.y);
  ctx.rotate(creature.angle);

  const isBeast = creature.type === 'beast';
  const radius = isBeast ? 16 : 10;
  const limbCycle = Math.sin(creature.walkProg || 0);

  // 1. Shadow Drop
  ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
  ctx.beginPath();
  ctx.ellipse(0, 4, radius + 4, radius * 0.7, 0, 0, Math.PI * 2);
  ctx.fill();

  // 2. Mutant Claw Limbs (4 sharp jointed legs)
  ctx.strokeStyle = isBeast ? '#7f1d1d' : '#450a0a';
  ctx.lineWidth = isBeast ? 3 : 2;
  ctx.lineCap = 'round';

  const legAngles = [-0.8, -0.3, 0.3, 0.8];
  legAngles.forEach((a, i) => {
    const legSwing = (i % 2 === 0 ? limbCycle : -limbCycle) * 0.3;
    const jointX = Math.cos(a + legSwing) * (radius + 6);
    const jointY = Math.sin(a + legSwing) * (radius + 6);
    const tipX = Math.cos(a + legSwing * 1.5) * (radius + 14);
    const tipY = Math.sin(a + legSwing * 1.5) * (radius + 14);

    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(jointX, jointY);
    ctx.lineTo(tipX, tipY);
    ctx.stroke();
  });

  // 3. Central Chitinous Torso
  ctx.fillStyle = isBeast ? '#450a0a' : '#18181b';
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = isBeast ? '#dc2626' : '#991b1b';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Spines / Carapace Ridges
  ctx.fillStyle = '#dc2626';
  ctx.beginPath();
  ctx.moveTo(-radius * 0.5, -radius * 0.4);
  ctx.lineTo(-radius * 0.8, 0);
  ctx.lineTo(-radius * 0.5, radius * 0.4);
  ctx.closePath();
  ctx.fill();

  // 4. Glowing Red Mutant Eyes
  ctx.fillStyle = '#ef4444';
  ctx.shadowColor = '#ef4444';
  ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.arc(radius * 0.5, -3, isBeast ? 2.5 : 1.8, 0, Math.PI * 2);
  ctx.arc(radius * 0.5, 3, isBeast ? 2.5 : 1.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.restore();

  // 5. Creature Health Bar (Screen Space above creature)
  ctx.save();
  const barW = isBeast ? 36 : 24;
  const barH = 3.5;
  const bx = creature.x - barW / 2;
  const by = creature.y - radius - 10;

  ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
  ctx.fillRect(bx - 1, by - 1, barW + 2, barH + 2);

  const hpRatio = Math.max(0, creature.hp / creature.maxHp);
  ctx.fillStyle = isBeast ? '#ec4899' : '#ef4444';
  ctx.fillRect(bx, by, barW * hpRatio, barH);
  ctx.restore();
}
