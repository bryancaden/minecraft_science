import type { PlacedVoxelBlock, StudentProfile, TopicStage } from '../types/game';

export interface MyWorldBounds {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
  minY: number;
  maxY: number;
}

export const MY_WORLD_BOUNDS: MyWorldBounds = {
  minX: -8,
  maxX: 8,
  minZ: -8,
  maxZ: 8,
  minY: 0,
  maxY: 6,
};

export interface SolidBoxCollider {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  minZ: number;
  maxZ: number;
}

export interface TopicMyWorldDetails {
  terrainLabel: string;
  livingThingsLabel: string;
}

export const TOPIC_MYWORLD_DETAILS: Record<number, TopicMyWorldDetails> = {
  1: {
    terrainLabel: 'Volcanic Mountain with Lava',
    livingThingsLabel: 'Lava Crater & Stream, Granite Peak, Soil Ferns & Earthworm',
  },
  2: {
    terrainLabel: 'Sundial Sandstone Meadow',
    livingThingsLabel: 'Sunflowers & Spinning Tilted Earth',
  },
  3: {
    terrainLabel: 'Arctic Glacier Ice Shelf',
    livingThingsLabel: 'Waddling Penguin, Polar Bear Cub & Weather Gauge',
  },
  4: {
    terrainLabel: 'Wetland Lagoon & Desert Dune',
    livingThingsLabel: 'Hopping Wetland Frog, Desert Cactus & Reeds',
  },
  5: {
    terrainLabel: 'Forest Food-Chain Grove',
    livingThingsLabel: 'Woodland Rabbit, Red Fox, Butterfly & Oak',
  },
  6: {
    terrainLabel: 'Blooming Pollination Garden',
    livingThingsLabel: 'Buzzing Honeybees, Blossoms & Nesting Chick',
  },
  7: {
    terrainLabel: 'Microscopic Bio-Lab Dome',
    livingThingsLabel: 'Living Plant/Animal Cell, Immune Guard & Microbe',
  },
  8: {
    terrainLabel: 'Fair-Test Seedling Plot',
    livingThingsLabel: 'Growing Bean Sprouts, Soil Pots & Lab Bench',
  },
  9: {
    terrainLabel: 'Renewable Energy Hill',
    livingThingsLabel: 'Spinning Wind Turbine, Solar Panel & Lightbulb',
  },
  10: {
    terrainLabel: 'Conductive Forge Workshop',
    livingThingsLabel: 'Workshop Robot Buddy, Copper Coil & Anvil',
  },
  11: {
    terrainLabel: 'Matter Transformation Camp',
    livingThingsLabel: 'Crackling Campfire, Steam Kettle & Vapor',
  },
  12: {
    terrainLabel: 'Rainbow Prism Sanctuary',
    livingThingsLabel: 'Crystal Prism, Mirror Stand & Street Lamp',
  },
  13: {
    terrainLabel: 'Ice & Gravel Speed Track',
    livingThingsLabel: 'Racing Tortoise, Lab Cart & Speed Ramp',
  },
  14: {
    terrainLabel: 'Starlight Aerospace Launchpad',
    livingThingsLabel: 'Space Rocket, Orbiting Satellite & Mars Rover',
  },
};

export function getTopicMyWorldDetails(topicId: number): TopicMyWorldDetails {
  return (
    TOPIC_MYWORLD_DETAILS[topicId] ?? {
      terrainLabel: 'Science Biome Terrace',
      livingThingsLabel: 'Topic Specimens & Lab Props',
    }
  );
}

export interface TopicElementPlacement {
  stage: TopicStage;
  x: number;
  z: number;
  halfFootprint: number;
  height: number;
  terrainLabel: string;
  livingThingsLabel: string;
}

export interface MyWorldLayout {
  completedStages: TopicStage[];
  buildHalfExtent: number;
  gridSide: number;
  islandRadius: number;
  bounds: MyWorldBounds;
  topicElements: TopicElementPlacement[];
}

export const PLAYER_COLLISION_RADIUS = 0.34;
export const PLAYER_COLLISION_HEIGHT = 1.55;

export type BlockFinishStyle = 'emissive' | 'metallic' | 'matte';

const EMISSIVE_IDS = new Set([
  'sun_crystal',
  'ecosystem_emerald',
  'redstone_spark',
  'prism_quartz',
  'matter_cube',
]);

const METALLIC_IDS = new Set([
  'copper_ingot',
  'starlight_titanium',
  'immune_shield',
  'lab_quartz',
  'glacial_ice',
]);

export function getBlockFinishStyle(resourceId: string): BlockFinishStyle {
  if (EMISSIVE_IDS.has(resourceId)) return 'emissive';
  if (METALLIC_IDS.has(resourceId)) return 'metallic';
  return 'matte';
}

export function blockKey(x: number, y: number, z: number): string {
  return `${Math.round(x)},${Math.round(y)},${Math.round(z)}`;
}

export function getCompletedTopicIds(
  student: StudentProfile,
  stages: TopicStage[],
): number[] {
  const completedSet = new Set<number>();
  for (const stage of stages) {
    const progress = student.topicProgress[stage.id];
    if (progress?.completed || student.badges.includes(stage.badge.id)) {
      completedSet.add(stage.id);
    }
  }
  return stages.filter((s) => completedSet.has(s.id)).map((s) => s.id);
}

/**
 * Computes the dynamic My World island size & perimeter Topic Habitat zones.
 * Base plaza is 13x13 (half-extent 6); each completed topic stage expands
 * half-extent by +2 (+4 tiles width & depth, e.g. 13x13 -> 17x17 -> 21x21)
 * and unlocks a multi-level biome terrain terrace with living things & props.
 */
export function computeMyWorldLayout(
  completedTopicIds: number[],
  stages: TopicStage[],
): MyWorldLayout {
  const completedSet = new Set(completedTopicIds);
  const completedStages = stages.filter((s) => completedSet.has(s.id));
  const completedCount = completedStages.length;

  const buildHalfExtent = 6 + completedCount * 2;
  const gridSide = buildHalfExtent * 2 + 1;
  const islandRadius = buildHalfExtent + (completedCount > 0 ? 5 : 2);
  const maxY = 6 + Math.min(6, completedCount);

  const bounds: MyWorldBounds = {
    minX: -buildHalfExtent,
    maxX: buildHalfExtent,
    minZ: -buildHalfExtent,
    maxZ: buildHalfExtent,
    minY: 0,
    maxY,
  };

  // Pre-compute up to 14 balanced perimeter habitat coordinates (West, East, North flanks)
  const rimDist = buildHalfExtent + 2.8;
  const sideStep = Math.max(3.6, Math.min(5.2, (buildHalfExtent * 1.75) / 4));
  const slots: [number, number][] = [];

  for (let i = 0; i < 5; i++) {
    const zOffset = (i - 2) * sideStep;
    slots.push([-rimDist, zOffset]);
    slots.push([rimDist, zOffset]);
  }
  // North flank slots on left & right of central arch (which sits at x = 0, z = -(buildHalfExtent + 2.1))
  const northOffsets = [
    -Math.max(5.2, buildHalfExtent * 0.55),
    Math.max(5.2, buildHalfExtent * 0.55),
    -Math.max(8.8, buildHalfExtent * 0.88),
    Math.max(8.8, buildHalfExtent * 0.88),
  ];
  for (const nx of northOffsets) {
    slots.push([nx, -rimDist]);
  }

  const topicElements: TopicElementPlacement[] = completedStages.map((stage, idx) => {
    const [sx, sz] = slots[idx] ?? [-rimDist, -rimDist + idx * 3.0];
    const details = getTopicMyWorldDetails(stage.id);
    return {
      stage,
      x: sx,
      z: sz,
      halfFootprint: 1.9,
      height: stage.id === 1 ? 4.3 : 3.2,
      terrainLabel: details.terrainLabel,
      livingThingsLabel: details.livingThingsLabel,
    };
  });

  return {
    completedStages,
    buildHalfExtent,
    gridSide,
    islandRadius,
    bounds,
    topicElements,
  };
}

export const MAX_DIG_DEPTH = 2;

export function groundColKey(x: number, z: number): string {
  return `${Math.round(x)},${Math.round(z)}`;
}

export function getGroundTopY(
  x: number,
  z: number,
  dugDepths: Record<string, number> = {},
): number {
  const depth = dugDepths[groundColKey(x, z)] ?? 0;
  return -Math.max(0, Math.min(MAX_DIG_DEPTH, Math.floor(depth)));
}

export function isInsidePlazaXZ(
  x: number,
  z: number,
  bounds: MyWorldBounds = MY_WORLD_BOUNDS,
): boolean {
  const gx = Math.round(x);
  const gz = Math.round(z);
  return gx >= bounds.minX && gx <= bounds.maxX && gz >= bounds.minZ && gz <= bounds.maxZ;
}

export function isValidBlockCoord(
  x: number,
  y: number,
  z: number,
  bounds: MyWorldBounds = MY_WORLD_BOUNDS,
  dugDepths: Record<string, number> = {},
): boolean {
  if (!Number.isInteger(x) || !Number.isInteger(y) || !Number.isInteger(z)) {
    return false;
  }
  const minFloorY = getGroundTopY(x, z, dugDepths);
  return (
    x >= bounds.minX &&
    x <= bounds.maxX &&
    z >= bounds.minZ &&
    z <= bounds.maxZ &&
    y >= minFloorY &&
    y <= bounds.maxY
  );
}

export function doesBlockOverlapActor(
  bx: number,
  by: number,
  bz: number,
  actorX: number,
  actorY: number,
  actorZ: number,
  radius = PLAYER_COLLISION_RADIUS,
  height = PLAYER_COLLISION_HEIGHT,
): boolean {
  const overlapX = actorX + radius > bx - 0.5 && actorX - radius < bx + 0.5;
  const overlapZ = actorZ + radius > bz - 0.5 && actorZ - radius < bz + 0.5;
  const overlapY = actorY + height > by + 0.05 && actorY < by + 1 - 0.05;
  return overlapX && overlapZ && overlapY;
}

export function canPlaceVoxelBlock(
  blocks: PlacedVoxelBlock[],
  resources: Record<string, number>,
  resourceId: string,
  x: number,
  y: number,
  z: number,
  bounds: MyWorldBounds = MY_WORLD_BOUNDS,
  dugDepths: Record<string, number> = {},
): { ok: boolean; reason?: string } {
  const gx = Math.round(x);
  const gy = Math.round(y);
  const gz = Math.round(z);

  if (!isValidBlockCoord(gx, gy, gz, bounds, dugDepths)) {
    return {
      ok: false,
      reason: `Outside buildable plaza (${bounds.maxX * 2 + 1}×${bounds.maxZ * 2 + 1}, max height ${bounds.maxY + 1}).`,
    };
  }

  const stock = resources[resourceId] ?? 0;
  if (stock <= 0) {
    return {
      ok: false,
      reason: 'No blocks of this resource left. Complete more quests or dig blocks!',
    };
  }

  const key = blockKey(gx, gy, gz);
  const occupied = blocks.some((b) => blockKey(b.x, b.y, b.z) === key);
  if (occupied) {
    return { ok: false, reason: 'That grid space already has a block.' };
  }

  return { ok: true };
}

export function placeVoxelBlock(
  blocks: PlacedVoxelBlock[],
  resources: Record<string, number>,
  resourceId: string,
  x: number,
  y: number,
  z: number,
  bounds: MyWorldBounds = MY_WORLD_BOUNDS,
  dugDepths: Record<string, number> = {},
): {
  ok: boolean;
  blocks: PlacedVoxelBlock[];
  resources: Record<string, number>;
  placed?: PlacedVoxelBlock;
  reason?: string;
} {
  const gx = Math.round(x);
  const gy = Math.round(y);
  const gz = Math.round(z);
  const check = canPlaceVoxelBlock(blocks, resources, resourceId, gx, gy, gz, bounds, dugDepths);
  if (!check.ok) {
    return { ok: false, blocks, resources, reason: check.reason };
  }

  const placed: PlacedVoxelBlock = {
    id: `blk-${gx}-${gy}-${gz}-${Date.now()}`,
    resourceId,
    x: gx,
    y: gy,
    z: gz,
  };

  return {
    ok: true,
    blocks: [...blocks, placed],
    resources: {
      ...resources,
      [resourceId]: Math.max(0, (resources[resourceId] ?? 0) - 1),
    },
    placed,
  };
}

export function removeVoxelBlock(
  blocks: PlacedVoxelBlock[],
  resources: Record<string, number>,
  x: number,
  y: number,
  z: number,
): {
  ok: boolean;
  blocks: PlacedVoxelBlock[];
  resources: Record<string, number>;
  removed?: PlacedVoxelBlock;
} {
  const key = blockKey(x, y, z);
  const target = blocks.find((b) => blockKey(b.x, b.y, b.z) === key);
  if (!target) {
    return { ok: false, blocks, resources };
  }

  return {
    ok: true,
    blocks: blocks.filter((b) => blockKey(b.x, b.y, b.z) !== key),
    resources: {
      ...resources,
      [target.resourceId]: (resources[target.resourceId] ?? 0) + 1,
    },
    removed: target,
  };
}

export function digMyWorldCell(params: {
  blocks: PlacedVoxelBlock[];
  dugDepths: Record<string, number>;
  resources: Record<string, number>;
  x: number;
  z: number;
  targetBlockY?: number;
  bounds?: MyWorldBounds;
}): {
  ok: boolean;
  kind?: 'block' | 'terrain';
  blocks: PlacedVoxelBlock[];
  dugDepths: Record<string, number>;
  resources: Record<string, number>;
  removedBlock?: PlacedVoxelBlock;
  newDepth?: number;
  dugY?: number;
  reason?: string;
} {
  const {
    blocks,
    dugDepths,
    resources,
    x,
    z,
    targetBlockY,
    bounds = MY_WORLD_BOUNDS,
  } = params;
  const gx = Math.round(x);
  const gz = Math.round(z);

  // 1. If a specific placed block Y was targeted, break it first
  if (typeof targetBlockY === 'number') {
    const gy = Math.round(targetBlockY);
    const rem = removeVoxelBlock(blocks, resources, gx, gy, gz);
    if (rem.ok && rem.removed) {
      return {
        ok: true,
        kind: 'block',
        blocks: rem.blocks,
        dugDepths,
        resources: rem.resources,
        removedBlock: rem.removed,
      };
    }
  } else {
    // Column-mode dig: break the highest placed block in this column if any exist
    let topBlock: PlacedVoxelBlock | null = null;
    for (const b of blocks) {
      if (Math.round(b.x) === gx && Math.round(b.z) === gz) {
        if (!topBlock || b.y > topBlock.y) topBlock = b;
      }
    }
    if (topBlock) {
      const rem = removeVoxelBlock(blocks, resources, gx, topBlock.y, gz);
      if (rem.ok && rem.removed) {
        return {
          ok: true,
          kind: 'block',
          blocks: rem.blocks,
          dugDepths,
          resources: rem.resources,
          removedBlock: rem.removed,
        };
      }
    }
  }

  // 2. Otherwise dig into the natural plaza terrain (up to MAX_DIG_DEPTH = 2 blocks deep)
  if (!isInsidePlazaXZ(gx, gz, bounds)) {
    return {
      ok: false,
      blocks,
      dugDepths,
      resources,
      reason: 'You can only dig inside the buildable My World plaza.',
    };
  }

  const key = groundColKey(gx, gz);
  const currentDepth = dugDepths[key] ?? 0;
  if (currentDepth >= MAX_DIG_DEPTH) {
    return {
      ok: false,
      blocks,
      dugDepths,
      resources,
      reason: 'Bedrock reached! You cannot dig deeper than 2 blocks here.',
    };
  }

  const nextDepth = currentDepth + 1;
  const nextDugDepths = {
    ...dugDepths,
    [key]: nextDepth,
  };
  return {
    ok: true,
    kind: 'terrain',
    blocks,
    dugDepths: nextDugDepths,
    resources: {
      ...resources,
      granite_block: (resources.granite_block ?? 0) + 1,
    },
    newDepth: nextDepth,
    dugY: -nextDepth,
  };
}

export function clearMyWorldBlocks(
  blocks: PlacedVoxelBlock[],
  resources: Record<string, number>,
): {
  blocks: PlacedVoxelBlock[];
  resources: Record<string, number>;
  refundedCount: number;
} {
  const nextResources = { ...resources };
  for (const b of blocks) {
    nextResources[b.resourceId] = (nextResources[b.resourceId] ?? 0) + 1;
  }
  return {
    blocks: [],
    resources: nextResources,
    refundedCount: blocks.length,
  };
}

export function pickDefaultBuildResourceId(
  resources: Record<string, number>,
  stages: TopicStage[],
): string {
  const available = stages.find((s) => (resources[s.rewardResource.id] ?? 0) > 0);
  return available ? available.rewardResource.id : stages[0].rewardResource.id;
}

export function sortResourcesForHotbar(
  resources: Record<string, number>,
  stages: TopicStage[],
): Array<TopicStage['rewardResource'] & { count: number }> {
  return stages
    .map((s) => ({
      ...s.rewardResource,
      count: resources[s.rewardResource.id] ?? 0,
    }))
    .sort((a, b) => {
      if (a.count > 0 && b.count === 0) return -1;
      if (a.count === 0 && b.count > 0) return 1;
      return 0;
    });
}

/**
 * Computes the highest solid floor Y underneath an actor's footprint
 * that is at or below the actor's current foot height (plus small landing tolerance),
 * accounting for dug terrain pits, placed blocks, and habitat colliders.
 */
export function getMyWorldSupportHeight(
  x: number,
  y: number,
  z: number,
  blocks: PlacedVoxelBlock[],
  extraColliders: SolidBoxCollider[] = [],
  radius = PLAYER_COLLISION_RADIUS,
  dugDepths: Record<string, number> = {},
  bounds?: MyWorldBounds,
): number {
  const footReach = y + 0.18;
  let supportY = -MAX_DIG_DEPTH;

  // Natural terrain columns overlapping the actor footprint
  const minColX = Math.round(x - radius);
  const maxColX = Math.round(x + radius);
  const minColZ = Math.round(z - radius);
  const maxColZ = Math.round(z + radius);
  for (let gx = minColX; gx <= maxColX; gx++) {
    for (let gz = minColZ; gz <= maxColZ; gz++) {
      const colTop =
        bounds && !isInsidePlazaXZ(gx, gz, bounds) ? 0 : getGroundTopY(gx, gz, dugDepths);
      if (colTop <= footReach && colTop > supportY) {
        supportY = colTop;
      }
    }
  }
  if (supportY < -MAX_DIG_DEPTH) supportY = 0;

  for (const b of blocks) {
    const topY = b.y + 1;
    if (topY <= footReach && topY > supportY) {
      if (x + radius > b.x - 0.5 && x - radius < b.x + 0.5 && z + radius > b.z - 0.5 && z - radius < b.z + 0.5) {
        supportY = topY;
      }
    }
  }

  for (const c of extraColliders) {
    if (c.maxY <= footReach && c.maxY > supportY) {
      if (x + radius > c.minX && x - radius < c.maxX && z + radius > c.minZ && z - radius < c.maxZ) {
        supportY = c.maxY;
      }
    }
  }

  return supportY;
}

function overlapsVertically(
  actorY: number,
  actorHeight: number,
  boxMinY: number,
  boxMaxY: number,
): boolean {
  return actorY + heightCheckOffset(actorHeight) > boxMinY + 0.04 && actorY < boxMaxY - 0.08;
}

function heightCheckOffset(actorHeight: number): number {
  return actorHeight;
}

/**
 * Axis-separated AABB solid collision for My World blocks, dug terrain walls & pedestals.
 * Prevents Bryan, Caden, or partners from passing through placed blocks or dug pit walls
 * while allowing smooth wall sliding and jumping onto block tops.
 */
export function resolveMyWorldHorizontalCollision(params: {
  prevX: number;
  prevZ: number;
  targetX: number;
  targetZ: number;
  playerY: number;
  islandHalfExtent: number;
  blocks: PlacedVoxelBlock[];
  extraColliders?: SolidBoxCollider[];
  radius?: number;
  height?: number;
  dugDepths?: Record<string, number>;
  bounds?: MyWorldBounds;
}): { x: number; z: number } {
  const {
    prevX,
    prevZ,
    targetX,
    targetZ,
    playerY,
    islandHalfExtent,
    blocks,
    extraColliders = [],
    radius = PLAYER_COLLISION_RADIUS,
    height = PLAYER_COLLISION_HEIGHT,
    dugDepths = {},
    bounds,
  } = params;

  const terrainWallColliders: SolidBoxCollider[] = [];
  if (playerY < -0.05) {
    const minGx = Math.floor(Math.min(prevX, targetX) - radius - 1);
    const maxGx = Math.ceil(Math.max(prevX, targetX) + radius + 1);
    const minGz = Math.floor(Math.min(prevZ, targetZ) - radius - 1);
    const maxGz = Math.ceil(Math.max(prevZ, targetZ) + radius + 1);
    for (let gx = minGx; gx <= maxGx; gx++) {
      for (let gz = minGz; gz <= maxGz; gz++) {
        const colTop =
          bounds && !isInsidePlazaXZ(gx, gz, bounds) ? 0 : getGroundTopY(gx, gz, dugDepths);
        if (colTop > playerY + 0.08) {
          terrainWallColliders.push({
            minX: gx - 0.5,
            maxX: gx + 0.5,
            minY: -MAX_DIG_DEPTH - 1,
            maxY: colTop,
            minZ: gz - 0.5,
            maxZ: gz + 0.5,
          });
        }
      }
    }
  }

  const eps = 0.001;
  let x = Math.max(-islandHalfExtent, Math.min(islandHalfExtent, targetX));
  const clampedPrevZ = Math.max(-islandHalfExtent, Math.min(islandHalfExtent, prevZ));

  const checkAndResolveX = (
    boxMinX: number,
    boxMaxX: number,
    boxMinY: number,
    boxMaxY: number,
    boxMinZ: number,
    boxMaxZ: number,
  ) => {
    if (!overlapsVertically(playerY, height, boxMinY, boxMaxY)) return;
    if (clampedPrevZ + radius <= boxMinZ || clampedPrevZ - radius >= boxMaxZ) return;
    if (x + radius > boxMinX && x - radius < boxMaxX) {
      if (prevX <= boxMinX - radius + 0.05) {
        x = Math.min(x, boxMinX - radius - eps);
      } else if (prevX >= boxMaxX + radius - 0.05) {
        x = Math.max(x, boxMaxX + radius + eps);
      } else {
        const pushLeft = Math.abs(x - (boxMinX - radius));
        const pushRight = Math.abs(boxMaxX + radius - x);
        x = pushLeft <= pushRight ? boxMinX - radius - eps : boxMaxX + radius + eps;
      }
    }
  };

  for (const b of blocks) {
    checkAndResolveX(b.x - 0.5, b.x + 0.5, b.y, b.y + 1, b.z - 0.5, b.z + 0.5);
  }
  for (const c of extraColliders) {
    checkAndResolveX(c.minX, c.maxX, c.minY, c.maxY, c.minZ, c.maxZ);
  }
  for (const t of terrainWallColliders) {
    checkAndResolveX(t.minX, t.maxX, t.minY, t.maxY, t.minZ, t.maxZ);
  }
  x = Math.max(-islandHalfExtent, Math.min(islandHalfExtent, x));

  let z = Math.max(-islandHalfExtent, Math.min(islandHalfExtent, targetZ));

  const checkAndResolveZ = (
    boxMinX: number,
    boxMaxX: number,
    boxMinY: number,
    boxMaxY: number,
    boxMinZ: number,
    boxMaxZ: number,
  ) => {
    if (!overlapsVertically(playerY, height, boxMinY, boxMaxY)) return;
    if (x + radius <= boxMinX || x - radius >= boxMaxX) return;
    if (z + radius > boxMinZ && z - radius < boxMaxZ) {
      if (clampedPrevZ <= boxMinZ - radius + 0.05) {
        z = Math.min(z, boxMinZ - radius - eps);
      } else if (clampedPrevZ >= boxMaxZ + radius - 0.05) {
        z = Math.max(z, boxMaxZ + radius + eps);
      } else {
        const pushFront = Math.abs(z - (boxMinZ - radius));
        const pushBack = Math.abs(boxMaxZ + radius - z);
        z = pushFront <= pushBack ? boxMinZ - radius - eps : boxMaxZ + radius + eps;
      }
    }
  };

  for (const b of blocks) {
    checkAndResolveZ(b.x - 0.5, b.x + 0.5, b.y, b.y + 1, b.z - 0.5, b.z + 0.5);
  }
  for (const c of extraColliders) {
    checkAndResolveZ(c.minX, c.maxX, c.minY, c.maxY, c.minZ, c.maxZ);
  }
  for (const t of terrainWallColliders) {
    checkAndResolveZ(t.minX, t.maxX, t.minY, t.maxY, t.minZ, t.maxZ);
  }
  z = Math.max(-islandHalfExtent, Math.min(islandHalfExtent, z));

  return { x, z };
}

/**
 * Computes world-space movement vector in Self View (1st-person) given
 * forward/back (+1/-1), right/left strafe (+1/-1), and facing yaw.
 */
export function computeFirstPersonMoveVector(
  forwardInput: number,
  strafeRightInput: number,
  yaw: number,
): { nx: number; nz: number } {
  const fwdX = Math.sin(yaw);
  const fwdZ = Math.cos(yaw);
  const rightX = -Math.cos(yaw);
  const rightZ = Math.sin(yaw);

  const vx = fwdX * forwardInput + rightX * strafeRightInput;
  const vz = fwdZ * forwardInput + rightZ * strafeRightInput;
  const len = Math.hypot(vx, vz);
  if (len < 0.0001) return { nx: 0, nz: 0 };
  return { nx: vx / len, nz: vz / len };
}

/**
 * Computes eye position & look-at target for Self View (1st-person camera).
 */
export function computeFirstPersonCameraPose(
  playerX: number,
  playerY: number,
  playerZ: number,
  yaw: number,
  pitch = -0.1,
): {
  eyeX: number;
  eyeY: number;
  eyeZ: number;
  lookX: number;
  lookY: number;
  lookZ: number;
} {
  const eyeX = playerX;
  const eyeY = playerY + 1.42;
  const eyeZ = playerZ;
  const clampedPitch = Math.max(-1.05, Math.min(1.05, pitch));
  const cosPitch = Math.cos(clampedPitch);
  return {
    eyeX,
    eyeY,
    eyeZ,
    lookX: eyeX + Math.sin(yaw) * cosPitch * 10,
    lookY: eyeY + Math.sin(clampedPitch) * 10,
    lookZ: eyeZ + Math.cos(yaw) * cosPitch * 10,
  };
}
