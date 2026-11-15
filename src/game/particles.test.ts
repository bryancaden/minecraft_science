import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CONFETTI_PALETTE,
  computeParticleLifeScale,
  createVoxelParticlePool,
  emitConfettiExplosion,
  emitVoxelBurst,
  parseHexColor,
  resetVoxelParticlePool,
  stepVoxelParticles,
} from './particles';

test('parseHexColor parses hex strings and numbers safely', () => {
  assert.equal(parseHexColor('#f97316'), 0xf97316);
  assert.equal(parseHexColor('38bdf8'), 0x38bdf8);
  assert.equal(parseHexColor(0x10b981), 0x10b981);
  assert.equal(parseHexColor('invalid'), 0x10b981);
});

test('emitConfettiExplosion creates multi-color radial confetti around beacon', () => {
  const pool = createVoxelParticlePool(260);
  let seed = 42;
  const detRng = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };

  emitConfettiExplosion(pool, {
    x: -5.5,
    y: 1.75,
    z: 0.5,
    accentColor: '#f59e0b',
    confettiCount: 72,
    sparkCount: 24,
    rng: detRng,
  });

  const activeSlots = pool.slots.filter((s) => s.active);
  assert.equal(activeSlots.length, 96);

  const confettiSlots = activeSlots.filter((s) => s.kind === 'confetti');
  const sparkSlots = activeSlots.filter((s) => s.kind === 'spark');
  assert.equal(confettiSlots.length, 72);
  assert.equal(sparkSlots.length, 24);

  // Ensure vibrant multi-color confetti spread (not monochrome)
  const uniqueColors = new Set(confettiSlots.map((s) => s.colorHex));
  assert.ok(uniqueColors.size >= 5, `expected >= 5 colors, got ${uniqueColors.size}`);
  assert.ok(CONFETTI_PALETTE.some((c) => uniqueColors.has(c)));

  // Ensure particles originate around the beacon with outward/upward velocities
  for (const s of confettiSlots) {
    const distXZ = Math.hypot(s.x - -5.5, s.z - 0.5);
    assert.ok(distXZ <= 1.2, `spawn radius too wide: ${distXZ}`);
    assert.ok(s.vy > 4.5, `expected strong upward burst, got ${s.vy}`);
  }
});

test('stepVoxelParticles simulates ascent, flutter, bounce, and clean expiration', () => {
  const pool = createVoxelParticlePool(64);
  emitConfettiExplosion(pool, {
    x: 0,
    y: 1.75,
    z: -4.2,
    confettiCount: 20,
    sparkCount: 8,
    rng: () => 0.5,
  });

  // Step forward 0.15s -> particles should rise and tumble
  let changed = stepVoxelParticles(pool, 0.15, 0.15);
  assert.equal(changed, true);
  assert.equal(pool.activeCount, 28);
  const firstConfetti = pool.slots[0];
  assert.ok(firstConfetti.y > 1.75);
  assert.equal(computeParticleLifeScale(firstConfetti), 1);

  // Step forward until ground bounce & full expiration
  let t = 0.15;
  for (let i = 0; i < 40; i++) {
    t += 0.1;
    stepVoxelParticles(pool, 0.1, t);
    for (const slot of pool.slots) {
      if (slot.active) {
        assert.ok(slot.y >= slot.floorY, `particle fell below floor: ${slot.y}`);
      }
    }
  }

  assert.equal(pool.activeCount, 0);
  assert.equal(computeParticleLifeScale(pool.slots[0]), 0);
});

test('ring buffer wraps safely without overflowing pool capacity', () => {
  const pool = createVoxelParticlePool(32);
  emitVoxelBurst(pool, {
    x: 0,
    y: 1,
    z: 0,
    colorHex: 0xfacc15,
    count: 50,
    rng: () => 0.3,
  });

  assert.equal(pool.slots.length, 32);
  assert.equal(pool.slots.filter((s) => s.active).length, 32);

  resetVoxelParticlePool(pool);
  assert.equal(pool.activeCount, 0);
  assert.equal(pool.slots.filter((s) => s.active).length, 0);
});
