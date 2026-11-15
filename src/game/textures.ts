import * as THREE from 'three';

export interface BiomePalette {
  skyColor: number;
  fogColor: number;
  groundTop: string;
  groundSide: string;
  groundAccent: string;
  pathColor: string;
  waterColor: number;
  foliagePrimary: number;
  foliageSecondary: number;
  cliffColor: number;
}

export const BIOME_PALETTES: Record<string, BiomePalette> = {
  earth_crust: {
    skyColor: 0x8ad4ff,
    fogColor: 0xaee3ff,
    groundTop: '#65a30d',
    groundSide: '#78350f',
    groundAccent: '#84cc16',
    pathColor: '#d6d3d1',
    waterColor: 0x0284c7,
    foliagePrimary: 0x22c55e,
    foliageSecondary: 0x16a34a,
    cliffColor: 0x78716c,
  },
  solar_orbit: {
    skyColor: 0x3b82f6,
    fogColor: 0x60a5fa,
    groundTop: '#4ade80',
    groundSide: '#854d0e',
    groundAccent: '#86efac',
    pathColor: '#fef08a',
    waterColor: 0x2563eb,
    foliagePrimary: 0x16a34a,
    foliageSecondary: 0xfacc15,
    cliffColor: 0x64748b,
  },
  climate_ice: {
    skyColor: 0xbde8ff,
    fogColor: 0xdaf2ff,
    groundTop: '#e0f2fe',
    groundSide: '#64748b',
    groundAccent: '#bae6fd',
    pathColor: '#7dd3fc',
    waterColor: 0x0ea5e9,
    foliagePrimary: 0x0284c7,
    foliageSecondary: 0xe0f2fe,
    cliffColor: 0x94a3b8,
  },
  biomes: {
    skyColor: 0x7dd3fc,
    fogColor: 0xbae6fd,
    groundTop: '#22c55e',
    groundSide: '#713f12',
    groundAccent: '#f59e0b',
    pathColor: '#fde68a',
    waterColor: 0x06b6d4,
    foliagePrimary: 0x15803d,
    foliageSecondary: 0x4ade80,
    cliffColor: 0xa16207,
  },
  food_chain: {
    skyColor: 0x86efac,
    fogColor: 0xbbf7d0,
    groundTop: '#4ade80',
    groundSide: '#5c3a21',
    groundAccent: '#16a34a',
    pathColor: '#fcd34d',
    waterColor: 0x0284c7,
    foliagePrimary: 0x16a34a,
    foliageSecondary: 0x84cc16,
    cliffColor: 0x57534e,
  },
  botanical: {
    skyColor: 0xa5f3fc,
    fogColor: 0xcffafe,
    groundTop: '#4ade80',
    groundSide: '#78350f',
    groundAccent: '#f472b6',
    pathColor: '#fed7aa',
    waterColor: 0x06b6d4,
    foliagePrimary: 0xec4899,
    foliageSecondary: 0x22c55e,
    cliffColor: 0x854d0e,
  },
  cellular_lab: {
    skyColor: 0x7c3aed,
    fogColor: 0x9f67ff,
    groundTop: '#2dd4bf',
    groundSide: '#0f766e',
    groundAccent: '#5eead4',
    pathColor: '#e0f2fe',
    waterColor: 0xec4899,
    foliagePrimary: 0x14b8a6,
    foliageSecondary: 0xf43f5e,
    cliffColor: 0x4c1d95,
  },
  inquiry_lab: {
    skyColor: 0x93c5fd,
    fogColor: 0xbfdbfe,
    groundTop: '#cbd5e1',
    groundSide: '#475569',
    groundAccent: '#e2e8f0',
    pathColor: '#7dd3fc',
    waterColor: 0x38bdf8,
    foliagePrimary: 0x0ea5e9,
    foliageSecondary: 0x22c55e,
    cliffColor: 0x64748b,
  },
  circuit_grid: {
    skyColor: 0x38bdf8,
    fogColor: 0x7dd3fc,
    groundTop: '#334155',
    groundSide: '#1e293b',
    groundAccent: '#facc15',
    pathColor: '#fbbf24',
    waterColor: 0x0ea5e9,
    foliagePrimary: 0xfacc15,
    foliageSecondary: 0xef4444,
    cliffColor: 0x475569,
  },
  forge_metals: {
    skyColor: 0xfdba74,
    fogColor: 0xfed7aa,
    groundTop: '#78716c',
    groundSide: '#44403c',
    groundAccent: '#a8a29e',
    pathColor: '#f97316',
    waterColor: 0xef4444,
    foliagePrimary: 0xea580c,
    foliageSecondary: 0xf59e0b,
    cliffColor: 0x57534e,
  },
  matter_camp: {
    skyColor: 0xfde68a,
    fogColor: 0xfef3c7,
    groundTop: '#84cc16',
    groundSide: '#78350f',
    groundAccent: '#a3e635',
    pathColor: '#fdba74',
    waterColor: 0x38bdf8,
    foliagePrimary: 0x16a34a,
    foliageSecondary: 0xf97316,
    cliffColor: 0x78716c,
  },
  light_prism: {
    skyColor: 0x6366f1,
    fogColor: 0x818cf8,
    groundTop: '#e0e7ff',
    groundSide: '#4338ca',
    groundAccent: '#c7d2fe',
    pathColor: '#fef08a',
    waterColor: 0xa855f7,
    foliagePrimary: 0xc084fc,
    foliageSecondary: 0x38bdf8,
    cliffColor: 0x3730a3,
  },
  friction_track: {
    skyColor: 0xbae6fd,
    fogColor: 0xe0f2fe,
    groundTop: '#99f6e4',
    groundSide: '#0f766e',
    groundAccent: '#ccfbf1',
    pathColor: '#fde047',
    waterColor: 0x0284c7,
    foliagePrimary: 0x14b8a6,
    foliageSecondary: 0xf59e0b,
    cliffColor: 0x64748b,
  },
  space_station: {
    skyColor: 0x1e1b4b,
    fogColor: 0x312e81,
    groundTop: '#cbd5e1',
    groundSide: '#334155',
    groundAccent: '#94a3b8',
    pathColor: '#818cf8',
    waterColor: 0x4f46e5,
    foliagePrimary: 0x818cf8,
    foliageSecondary: 0x38bdf8,
    cliffColor: 0x475569,
  },
};

function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createVoxelTileTexture(
  baseHex: string,
  accentHex: string,
  seed: number,
  maxAnisotropy: number,
  gridPattern = true,
): THREE.CanvasTexture {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const rand = mulberry32(seed);

  ctx.fillStyle = baseHex;
  ctx.fillRect(0, 0, size, size);

  const cell = 8;
  for (let y = 0; y < size; y += cell) {
    for (let x = 0; x < size; x += cell) {
      const n = rand();
      if (n > 0.72) {
        ctx.fillStyle = accentHex;
        ctx.globalAlpha = 0.28 + rand() * 0.25;
        ctx.fillRect(x, y, cell, cell);
      } else if (n < 0.22) {
        ctx.fillStyle = '#000000';
        ctx.globalAlpha = 0.08 + rand() * 0.08;
        ctx.fillRect(x, y, cell, cell);
      } else if (n > 0.45 && n < 0.56) {
        ctx.fillStyle = '#ffffff';
        ctx.globalAlpha = 0.08;
        ctx.fillRect(x, y, cell, cell);
      }
    }
  }

  if (gridPattern) {
    ctx.globalAlpha = 0.16;
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, size - 2, size - 2);
  }

  ctx.globalAlpha = 1;
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.magFilter = THREE.NearestFilter;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = maxAnisotropy;
  tex.needsUpdate = true;
  return tex;
}

export function createVoxelBumpTexture(
  seed: number,
  maxAnisotropy: number,
): THREE.CanvasTexture {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const rand = mulberry32(seed + 999);

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, size, size);

  const cell = 8;
  for (let y = 0; y < size; y += cell) {
    for (let x = 0; x < size; x += cell) {
      const shade = Math.floor(96 + rand() * 64);
      ctx.fillStyle = `rgb(${shade},${shade},${shade})`;
      ctx.fillRect(x, y, cell, cell);
    }
  }

  ctx.strokeStyle = '#505050';
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, size - 2, size - 2);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.NoColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = maxAnisotropy;
  tex.needsUpdate = true;
  return tex;
}

export function createContactShadowTexture(): THREE.CanvasTexture {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  const grad = ctx.createRadialGradient(
    size / 2,
    size / 2,
    4,
    size / 2,
    size / 2,
    size / 2,
  );
  grad.addColorStop(0, 'rgba(15, 23, 42, 0.55)');
  grad.addColorStop(0.55, 'rgba(15, 23, 42, 0.25)');
  grad.addColorStop(1, 'rgba(15, 23, 42, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}
