export type VoxelParticleKind = 'spark' | 'confetti';

export const CONFETTI_PALETTE: readonly number[] = [
  0xfacc15, // Gold
  0x10b981, // Emerald
  0x38bdf8, // Sky Cyan
  0xf43f5e, // Coral Red
  0xf97316, // Ember Orange
  0xa855f7, // Violet
  0xec4899, // Pink
  0x84cc16, // Lime
];

export interface VoxelParticleSlot {
  active: boolean;
  needsSync: boolean;
  dirtyColor: boolean;
  kind: VoxelParticleKind;
  life: number;
  maxLife: number;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  rx: number;
  ry: number;
  rz: number;
  vrx: number;
  vry: number;
  vrz: number;
  sx: number;
  sy: number;
  sz: number;
  gravity: number;
  drag: number;
  flutterFreq: number;
  flutterAmp: number;
  flutterPhase: number;
  floorY: number;
  bounce: number;
  colorHex: number;
}

export interface VoxelParticlePool {
  capacity: number;
  cursor: number;
  activeCount: number;
  slots: VoxelParticleSlot[];
}

export function createVoxelParticlePool(capacity = 260): VoxelParticlePool {
  const slots: VoxelParticleSlot[] = [];
  for (let i = 0; i < capacity; i++) {
    slots.push({
      active: false,
      needsSync: true,
      dirtyColor: true,
      kind: 'spark',
      life: 0,
      maxLife: 0.6,
      x: 0,
      y: -50,
      z: 0,
      vx: 0,
      vy: 0,
      vz: 0,
      rx: 0,
      ry: 0,
      rz: 0,
      vrx: 0,
      vry: 0,
      vrz: 0,
      sx: 0.18,
      sy: 0.18,
      sz: 0.18,
      gravity: 9.8,
      drag: 0,
      flutterFreq: 0,
      flutterAmp: 0,
      flutterPhase: 0,
      floorY: 0.06,
      bounce: 0,
      colorHex: 0xfacc15,
    });
  }
  return {
    capacity,
    cursor: 0,
    activeCount: 0,
    slots,
  };
}

export function parseHexColor(color: string | number): number {
  if (typeof color === 'number' && Number.isFinite(color)) {
    return color & 0xffffff;
  }
  if (typeof color === 'string') {
    const clean = color.trim().replace(/^#/, '');
    const parsed = Number.parseInt(clean, 16);
    if (Number.isFinite(parsed)) {
      return parsed & 0xffffff;
    }
  }
  return 0x10b981;
}

export function resetVoxelParticlePool(pool: VoxelParticlePool): void {
  for (let i = 0; i < pool.capacity; i++) {
    const slot = pool.slots[i];
    if (slot.active) {
      slot.active = false;
      slot.needsSync = true;
      slot.y = -50;
    }
  }
  pool.activeCount = 0;
}

function allocSlot(pool: VoxelParticlePool): VoxelParticleSlot {
  const slot = pool.slots[pool.cursor];
  pool.cursor = (pool.cursor + 1) % pool.capacity;
  return slot;
}

export function emitVoxelBurst(
  pool: VoxelParticlePool,
  opts: {
    x: number;
    y: number;
    z: number;
    colorHex: number;
    count: number;
    rng?: () => number;
  },
): void {
  const rand = opts.rng ?? Math.random;
  for (let i = 0; i < opts.count; i++) {
    const slot = allocSlot(pool);
    const angle = rand() * Math.PI * 2;
    const speed = 1.6 + rand() * 3.4;
    const cubeSize = 0.12 + rand() * 0.12;

    slot.active = true;
    slot.needsSync = true;
    slot.dirtyColor = true;
    slot.kind = 'spark';
    slot.life = 0;
    slot.maxLife = 0.45 + rand() * 0.35;
    slot.x = opts.x;
    slot.y = opts.y;
    slot.z = opts.z;
    slot.vx = Math.cos(angle) * speed;
    slot.vy = 2.2 + rand() * 3.8;
    slot.vz = Math.sin(angle) * speed;
    slot.rx = rand() * Math.PI;
    slot.ry = rand() * Math.PI;
    slot.rz = rand() * Math.PI;
    slot.vrx = (rand() - 0.5) * 8;
    slot.vry = (rand() - 0.5) * 8;
    slot.vrz = (rand() - 0.5) * 8;
    slot.sx = cubeSize;
    slot.sy = cubeSize;
    slot.sz = cubeSize;
    slot.gravity = 11.5;
    slot.drag = 0.8;
    slot.flutterFreq = 0;
    slot.flutterAmp = 0;
    slot.flutterPhase = 0;
    slot.floorY = 0.08;
    slot.bounce = 0.15;
    slot.colorHex = opts.colorHex;
  }
}

export function emitConfettiExplosion(
  pool: VoxelParticlePool,
  opts: {
    x: number;
    y: number;
    z: number;
    accentColor?: string | number;
    confettiCount?: number;
    sparkCount?: number;
    rng?: () => number;
  },
): void {
  const rand = opts.rng ?? Math.random;
  const confettiCount = opts.confettiCount ?? 76;
  const sparkCount = opts.sparkCount ?? 26;
  const accentHex =
    opts.accentColor !== undefined ? parseHexColor(opts.accentColor) : 0x10b981;

  // 1. Crown confetti dome around the beacon crystal
  for (let i = 0; i < confettiCount; i++) {
    const slot = allocSlot(pool);
    const angle = (i / confettiCount) * Math.PI * 2 + (rand() - 0.5) * 0.45;
    const spawnRadius = 0.25 + rand() * 0.7;
    const radialSpeed = 2.6 + rand() * 5.0;
    const upSpeed = 5.4 + rand() * 5.2;

    const isFlatStrip = rand() > 0.28;
    const w = isFlatStrip ? 0.18 + rand() * 0.14 : 0.14 + rand() * 0.08;
    const h = isFlatStrip ? 0.045 + rand() * 0.025 : w;
    const d = isFlatStrip ? 0.12 + rand() * 0.1 : w;

    const useAccent = i % 7 === 0;
    const paletteColor =
      CONFETTI_PALETTE[(i + Math.floor(rand() * 3)) % CONFETTI_PALETTE.length];

    slot.active = true;
    slot.needsSync = true;
    slot.dirtyColor = true;
    slot.kind = 'confetti';
    slot.life = 0;
    slot.maxLife = 1.65 + rand() * 0.85;
    slot.x = opts.x + Math.cos(angle) * spawnRadius;
    slot.y = opts.y + (rand() - 0.35) * 0.55;
    slot.z = opts.z + Math.sin(angle) * spawnRadius;
    slot.vx = Math.cos(angle) * radialSpeed;
    slot.vy = upSpeed;
    slot.vz = Math.sin(angle) * radialSpeed;
    slot.rx = rand() * Math.PI * 2;
    slot.ry = rand() * Math.PI * 2;
    slot.rz = rand() * Math.PI * 2;
    slot.vrx = (rand() - 0.5) * 16;
    slot.vry = (rand() - 0.5) * 14;
    slot.vrz = (rand() - 0.5) * 16;
    slot.sx = w;
    slot.sy = h;
    slot.sz = d;
    slot.gravity = 8.4;
    slot.drag = 1.65;
    slot.flutterFreq = 5.5 + rand() * 4.5;
    slot.flutterAmp = 1.4 + rand() * 1.6;
    slot.flutterPhase = rand() * Math.PI * 2;
    slot.floorY = 0.06;
    slot.bounce = 0.28;
    slot.colorHex = useAccent ? accentHex : paletteColor;
  }

  // 2. Pedestal ring voxel spark burst around the beacon base
  for (let i = 0; i < sparkCount; i++) {
    const slot = allocSlot(pool);
    const angle = (i / sparkCount) * Math.PI * 2 + (rand() - 0.5) * 0.25;
    const speed = 3.2 + rand() * 3.4;
    const cubeSize = 0.14 + rand() * 0.1;

    slot.active = true;
    slot.needsSync = true;
    slot.dirtyColor = true;
    slot.kind = 'spark';
    slot.life = 0;
    slot.maxLife = 0.9 + rand() * 0.55;
    slot.x = opts.x + Math.cos(angle) * 0.85;
    slot.y = Math.max(0.45, opts.y - 0.85);
    slot.z = opts.z + Math.sin(angle) * 0.85;
    slot.vx = Math.cos(angle) * speed;
    slot.vy = 3.6 + rand() * 3.6;
    slot.vz = Math.sin(angle) * speed;
    slot.rx = rand() * Math.PI;
    slot.ry = rand() * Math.PI;
    slot.rz = rand() * Math.PI;
    slot.vrx = (rand() - 0.5) * 12;
    slot.vry = (rand() - 0.5) * 12;
    slot.vrz = (rand() - 0.5) * 12;
    slot.sx = cubeSize;
    slot.sy = cubeSize;
    slot.sz = cubeSize;
    slot.gravity = 10.5;
    slot.drag = 1.05;
    slot.flutterFreq = 0;
    slot.flutterAmp = 0;
    slot.flutterPhase = 0;
    slot.floorY = 0.08;
    slot.bounce = 0.32;
    slot.colorHex = i % 3 === 0 ? accentHex : i % 2 === 0 ? 0xfacc15 : 0x10b981;
  }
}

export function stepVoxelParticles(
  pool: VoxelParticlePool,
  dt: number,
  elapsed: number,
): boolean {
  let anyChanged = false;
  let activeCount = 0;

  for (let i = 0; i < pool.capacity; i++) {
    const slot = pool.slots[i];
    if (!slot.active) {
      if (slot.needsSync || slot.dirtyColor) {
        anyChanged = true;
      }
      continue;
    }

    slot.life += dt;
    if (slot.life >= slot.maxLife) {
      slot.active = false;
      slot.needsSync = true;
      slot.y = -50;
      anyChanged = true;
      continue;
    }

    activeCount++;
    anyChanged = true;
    slot.needsSync = true;

    // Exponential air drag on horizontal velocity
    if (slot.drag > 0) {
      const damp = Math.exp(-slot.drag * dt);
      slot.vx *= damp;
      slot.vz *= damp;
    }

    // Gravity with confetti terminal fall speed cap
    slot.vy -= slot.gravity * dt;
    if (slot.kind === 'confetti' && slot.vy < -3.6) {
      slot.vy = -3.6;
    }

    // Sinusoidal flutter sway as confetti drifts
    let flutterX = 0;
    let flutterZ = 0;
    if (slot.flutterAmp > 0) {
      const wave = Math.sin(elapsed * slot.flutterFreq + slot.flutterPhase);
      flutterX = wave * slot.flutterAmp;
      flutterZ = Math.cos(elapsed * slot.flutterFreq * 0.85 + slot.flutterPhase) * slot.flutterAmp;
    }

    slot.x += (slot.vx + flutterX) * dt;
    slot.y += slot.vy * dt;
    slot.z += (slot.vz + flutterZ) * dt;

    // Ground contact bounce & spin damping
    if (slot.y <= slot.floorY) {
      slot.y = slot.floorY;
      if (slot.vy < -0.45 && slot.bounce > 0) {
        slot.vy = Math.abs(slot.vy) * slot.bounce;
        slot.vx *= 0.65;
        slot.vz *= 0.65;
        slot.vrx *= 0.55;
        slot.vry *= 0.55;
        slot.vrz *= 0.55;
      } else {
        slot.vy = 0;
        slot.vx *= 0.82;
        slot.vz *= 0.82;
        slot.vrx *= 0.75;
        slot.vry *= 0.75;
        slot.vrz *= 0.75;
      }
    }

    slot.rx += slot.vrx * dt;
    slot.ry += slot.vry * dt;
    slot.rz += slot.vrz * dt;
  }

  pool.activeCount = activeCount;
  return anyChanged;
}

export function computeParticleLifeScale(slot: VoxelParticleSlot): number {
  if (!slot.active) return 0;
  const remaining = Math.max(0, 1 - slot.life / slot.maxLife);
  // Hold full size for initial 60% of lifetime, then shrink smoothly to 0
  return Math.min(1, remaining * 2.5);
}
