import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MAX_DIG_DEPTH,
  MY_WORLD_BOUNDS,
  PLAYER_COLLISION_RADIUS,
  blockKey,
  canPlaceVoxelBlock,
  clearMyWorldBlocks,
  computeFirstPersonCameraPose,
  computeFirstPersonMoveVector,
  computeMyWorldLayout,
  digMyWorldCell,
  doesBlockOverlapActor,
  getBlockFinishStyle,
  getCompletedTopicIds,
  getGroundTopY,
  getMyWorldSupportHeight,
  groundColKey,
  isValidBlockCoord,
  pickDefaultBuildResourceId,
  placeVoxelBlock,
  removeVoxelBlock,
  resolveMyWorldHorizontalCollision,
  sortResourcesForHotbar,
} from './myWorld';
import { createInitialStudentProfiles } from './rules';
import { TOPIC_STAGES } from '../data/curriculum';

test('isValidBlockCoord enforces buildable island bounds and max height', () => {
  assert.equal(isValidBlockCoord(0, 0, 0), true);
  assert.equal(
    isValidBlockCoord(MY_WORLD_BOUNDS.maxX, MY_WORLD_BOUNDS.maxY, MY_WORLD_BOUNDS.minZ),
    true,
  );
  assert.equal(isValidBlockCoord(MY_WORLD_BOUNDS.maxX + 1, 0, 0), false);
  assert.equal(isValidBlockCoord(0, MY_WORLD_BOUNDS.maxY + 1, 0), false);
  assert.equal(isValidBlockCoord(0, -1, 0), false);
  assert.equal(isValidBlockCoord(1.5, 0, 0), false);
});

test('placeVoxelBlock deducts inventory stock and prevents duplicate or empty placement', () => {
  const initialResources = { granite_block: 2, ecosystem_emerald: 0 };
  const r1 = placeVoxelBlock([], initialResources, 'granite_block', 1, 0, 2);
  assert.equal(r1.ok, true);
  assert.equal(r1.blocks.length, 1);
  assert.equal(r1.resources.granite_block, 1);
  assert.equal(blockKey(r1.blocks[0].x, r1.blocks[0].y, r1.blocks[0].z), '1,0,2');

  // Cannot place on occupied spot
  const dup = canPlaceVoxelBlock(r1.blocks, r1.resources, 'granite_block', 1, 0, 2);
  assert.equal(dup.ok, false);

  // Stack on top at y = 1
  const r2 = placeVoxelBlock(r1.blocks, r1.resources, 'granite_block', 1, 1, 2);
  assert.equal(r2.ok, true);
  assert.equal(r2.resources.granite_block, 0);

  // Cannot place when stock is 0
  const empty = placeVoxelBlock(r2.blocks, r2.resources, 'granite_block', 2, 0, 2);
  assert.equal(empty.ok, false);
});

test('removeVoxelBlock and clearMyWorldBlocks refund resources back to student backpack', () => {
  let blocks = [] as ReturnType<typeof placeVoxelBlock>['blocks'];
  let resources: Record<string, number> = { granite_block: 2, ecosystem_emerald: 1 };

  const p1 = placeVoxelBlock(blocks, resources, 'granite_block', 0, 0, 0);
  blocks = p1.blocks;
  resources = p1.resources;
  const p2 = placeVoxelBlock(blocks, resources, 'ecosystem_emerald', 0, 1, 0);
  blocks = p2.blocks;
  resources = p2.resources;

  assert.equal(resources.granite_block, 1);
  assert.equal(resources.ecosystem_emerald, 0);

  const rem = removeVoxelBlock(blocks, resources, 0, 1, 0);
  assert.equal(rem.ok, true);
  assert.equal(rem.blocks.length, 1);
  assert.equal(rem.resources.ecosystem_emerald, 1);

  const cleared = clearMyWorldBlocks(rem.blocks, rem.resources);
  assert.equal(cleared.blocks.length, 0);
  assert.equal(cleared.refundedCount, 1);
  assert.equal(cleared.resources.granite_block, 2);
  assert.equal(cleared.resources.ecosystem_emerald, 1);
});

test('pickDefaultBuildResourceId, sortResourcesForHotbar, and getBlockFinishStyle select valid defaults', () => {
  const picked = pickDefaultBuildResourceId({ ecosystem_emerald: 3 }, TOPIC_STAGES);
  assert.equal(picked, 'ecosystem_emerald');

  const hotbar = sortResourcesForHotbar({ ecosystem_emerald: 3 }, TOPIC_STAGES);
  assert.equal(hotbar[0].id, 'ecosystem_emerald');
  assert.equal(hotbar[0].count, 3);
  assert.equal(hotbar.length, TOPIC_STAGES.length);

  const fallback = pickDefaultBuildResourceId({}, TOPIC_STAGES);
  assert.equal(fallback, TOPIC_STAGES[0].rewardResource.id);

  assert.equal(getBlockFinishStyle('sun_crystal'), 'emissive');
  assert.equal(getBlockFinishStyle('copper_ingot'), 'metallic');
  assert.equal(getBlockFinishStyle('granite_block'), 'matte');
});

test('computeMyWorldLayout expands map size and adds topic terrain & living elements for each completed stage', () => {
  const profiles = createInitialStudentProfiles();
  const bryan = profiles[0];
  const bryanCompleted = getCompletedTopicIds(bryan, TOPIC_STAGES);
  assert.deepEqual(bryanCompleted, []);

  const emptyLayout = computeMyWorldLayout(bryanCompleted, TOPIC_STAGES);
  assert.equal(emptyLayout.buildHalfExtent, 6);
  assert.equal(emptyLayout.gridSide, 13);
  assert.equal(emptyLayout.topicElements.length, 0);

  // Completing Topic 1 expands Bryan's world from 13x13 to 17x17 and unlocks Volcanic Mountain with Lava & soil life
  const afterTopic1 = computeMyWorldLayout([1], TOPIC_STAGES);
  assert.equal(afterTopic1.buildHalfExtent, 8);
  assert.equal(afterTopic1.gridSide, 17);
  assert.equal(afterTopic1.topicElements.length, 1);
  assert.equal(afterTopic1.topicElements[0].stage.id, 1);
  assert.equal(afterTopic1.topicElements[0].terrainLabel, 'Volcanic Mountain with Lava');
  assert.ok(afterTopic1.topicElements[0].livingThingsLabel.includes('Lava Crater'));
  assert.ok(afterTopic1.topicElements[0].livingThingsLabel.includes('Ferns'));

  // Mei Wong has Topics 1 & 5 completed -> 21x21 plaza with 2 habitats
  const mei = profiles[2];
  const meiCompleted = getCompletedTopicIds(mei, TOPIC_STAGES);
  assert.deepEqual(meiCompleted, [1, 5]);

  const meiLayout = computeMyWorldLayout(meiCompleted, TOPIC_STAGES);
  assert.equal(meiLayout.buildHalfExtent, 10);
  assert.equal(meiLayout.gridSide, 21);
  assert.equal(meiLayout.topicElements.length, 2);
  assert.equal(meiLayout.topicElements[0].stage.id, 1);
  assert.equal(meiLayout.topicElements[1].stage.id, 5);
  assert.ok(meiLayout.topicElements[1].livingThingsLabel.includes('Rabbit'));

  // Completing all 14 stages unlocks full 69x69 plaza and all 14 topic habitats
  const allLayout = computeMyWorldLayout(
    TOPIC_STAGES.map((s) => s.id),
    TOPIC_STAGES,
  );
  assert.equal(allLayout.gridSide, 69);
  assert.equal(allLayout.topicElements.length, 14);
});

test('resolveMyWorldHorizontalCollision prevents walking through blocks while allowing wall slide & top traversal', () => {
  const wallBlocks = [
    { id: 'b1', resourceId: 'granite_block', x: 0, y: 0, z: 4 },
  ];

  // Attempt to walk north (-Z) straight through block at (0, 0, 4)
  const blocked = resolveMyWorldHorizontalCollision({
    prevX: 0,
    prevZ: 5.2,
    targetX: 0,
    targetZ: 3.5,
    playerY: 0,
    islandHalfExtent: 10,
    blocks: wallBlocks,
  });
  assert.ok(blocked.z >= 4 + 0.5 + PLAYER_COLLISION_RADIUS);
  assert.equal(blocked.x, 0);

  // Attempt to walk diagonally against block face: Z is stopped, X slides smoothly
  const slid = resolveMyWorldHorizontalCollision({
    prevX: 0.1,
    prevZ: 4.9,
    targetX: 0.45,
    targetZ: 4.2,
    playerY: 0,
    islandHalfExtent: 10,
    blocks: wallBlocks,
  });
  assert.ok(slid.z >= 4 + 0.5 + PLAYER_COLLISION_RADIUS);
  assert.ok(slid.x > 0.1);

  // When jumped above the 1-unit block (playerY >= 1.0), player walks over the top cleanly
  const topY = getMyWorldSupportHeight(0, 1.05, 4, wallBlocks);
  assert.equal(topY, 1);

  const overTop = resolveMyWorldHorizontalCollision({
    prevX: 0,
    prevZ: 5.0,
    targetX: 0,
    targetZ: 4.0,
    playerY: 1.0,
    islandHalfExtent: 10,
    blocks: wallBlocks,
  });
  assert.equal(overTop.z, 4.0);
});

test('doesBlockOverlapActor prevents burying hero inside placed block', () => {
  assert.equal(doesBlockOverlapActor(0, 0, 5, 0.1, 0, 5.1), true);
  assert.equal(doesBlockOverlapActor(0, 0, 4, 0, 0, 5.5), false);
  assert.equal(doesBlockOverlapActor(0, 2, 5, 0, 0, 5.0), false);
});

test('digMyWorldCell excavates terrain up to bedrock, refunds placed blocks, and supports pit building & collision', () => {
  // 1. Place a block at (2, 0, 2) and dig it first -> returns block instead of digging ground
  const placed = placeVoxelBlock([], { granite_block: 1 }, 'granite_block', 2, 0, 2);
  assert.equal(placed.ok, true);

  const d0 = digMyWorldCell({
    blocks: placed.blocks,
    dugDepths: {},
    resources: placed.resources,
    x: 2,
    z: 2,
    targetBlockY: 0,
  });
  assert.equal(d0.ok, true);
  assert.equal(d0.kind, 'block');
  assert.equal(d0.blocks.length, 0);
  assert.equal(d0.resources.granite_block, 1);

  // 2. Dig natural ground 1 layer deep -> awards +1 Granite Block and lowers ground floor to -1
  const d1 = digMyWorldCell({
    blocks: [],
    dugDepths: {},
    resources: {},
    x: 1,
    z: 1,
  });
  assert.equal(d1.ok, true);
  assert.equal(d1.kind, 'terrain');
  assert.equal(d1.newDepth, 1);
  assert.equal(d1.dugY, -1);
  assert.equal(d1.resources.granite_block, 1);
  assert.equal(getGroundTopY(1, 1, d1.dugDepths), -1);

  // 3. Dig same tile second time -> depth 2 (bedrock)
  const d2 = digMyWorldCell({
    blocks: [],
    dugDepths: d1.dugDepths,
    resources: d1.resources,
    x: 1,
    z: 1,
  });
  assert.equal(d2.ok, true);
  assert.equal(d2.newDepth, MAX_DIG_DEPTH);
  assert.equal(d2.resources.granite_block, 2);
  assert.equal(getGroundTopY(1, 1, d2.dugDepths), -2);

  // 4. Cannot dig deeper past bedrock
  const d3 = digMyWorldCell({
    blocks: [],
    dugDepths: d2.dugDepths,
    resources: d2.resources,
    x: 1,
    z: 1,
  });
  assert.equal(d3.ok, false);

  // 5. Cannot dig outside buildable plaza bounds
  const out = digMyWorldCell({
    blocks: [],
    dugDepths: {},
    resources: {},
    x: MY_WORLD_BOUNDS.maxX + 2,
    z: 0,
  });
  assert.equal(out.ok, false);

  // 6. Can place a block inside the dug pit at y = -2
  assert.equal(isValidBlockCoord(1, -2, 1, MY_WORLD_BOUNDS, d2.dugDepths), true);
  const pitPlace = placeVoxelBlock(
    [],
    d2.resources,
    'granite_block',
    1,
    -2,
    1,
    MY_WORLD_BOUNDS,
    d2.dugDepths,
  );
  assert.equal(pitPlace.ok, true);

  // 7. Standing inside dug pit (depth 1) lowers support height to -1, and surrounding ground blocks horizontal exit unless jumped
  const pitDug = { [groundColKey(0, 0)]: 1 };
  assert.equal(getMyWorldSupportHeight(0, 0, 0, [], [], PLAYER_COLLISION_RADIUS, pitDug), -1);

  const wallStop = resolveMyWorldHorizontalCollision({
    prevX: 0,
    prevZ: 0,
    targetX: 0,
    targetZ: -0.9,
    playerY: -1,
    islandHalfExtent: 8,
    blocks: [],
    dugDepths: pitDug,
  });
  assert.ok(wallStop.z >= -0.5 + PLAYER_COLLISION_RADIUS);
});

test('computeFirstPersonMoveVector and computeFirstPersonCameraPose compute forward/strafe & eye pose cleanly', () => {
  // Facing North (yaw = PI -> sin=0, cos=-1): forward moves -Z, strafe right moves +X
  const fwd = computeFirstPersonMoveVector(1, 0, Math.PI);
  assert.ok(Math.abs(fwd.nx) < 1e-6);
  assert.ok(fwd.nz < -0.99);

  const right = computeFirstPersonMoveVector(0, 1, Math.PI);
  assert.ok(right.nx > 0.99);
  assert.ok(Math.abs(right.nz) < 1e-6);

  const pose = computeFirstPersonCameraPose(2, -1, 4, Math.PI, 0);
  assert.equal(pose.eyeX, 2);
  assert.ok(Math.abs(pose.eyeY - 0.42) < 1e-6);
  assert.equal(pose.eyeZ, 4);
  assert.ok(pose.lookZ < pose.eyeZ);
});
