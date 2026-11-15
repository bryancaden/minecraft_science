import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_START_MINUTES,
  MINUTES_PER_DAY,
  createRainPool,
  formatInGameClock,
  getWeatherForInGameTime,
  normalizeInGameMinutes,
  stepRainPool,
} from './weather';

test('normalizeInGameMinutes wraps around 1440-minute day cleanly', () => {
  assert.equal(normalizeInGameMinutes(DEFAULT_START_MINUTES), 510);
  assert.equal(normalizeInGameMinutes(1500), 60);
  assert.equal(normalizeInGameMinutes(-60), MINUTES_PER_DAY - 60);
});

test('formatInGameClock produces padded 24-hour HH:MM strings in 5-minute steps', () => {
  assert.equal(formatInGameClock(510), '08:30');
  assert.equal(formatInGameClock(513), '08:30');
  assert.equal(formatInGameClock(755), '12:35');
  assert.equal(formatInGameClock(15), '00:15');
});

test('getWeatherForInGameTime cycles between sunny and rain based on in-game time', () => {
  const morningSunny = getWeatherForInGameTime(8 * 60 + 30); // 08:30
  assert.equal(morningSunny.condition, 'sunny');
  assert.equal(morningSunny.rainTarget, 0);
  assert.equal(morningSunny.formattedTime, '08:30');

  const afternoonRain = getWeatherForInGameTime(13 * 60); // 13:00
  assert.equal(afternoonRain.condition, 'rain');
  assert.equal(afternoonRain.rainTarget, 1);

  const goldenEvening = getWeatherForInGameTime(18 * 60); // 18:00
  assert.equal(goldenEvening.condition, 'sunny');
  assert.equal(goldenEvening.rainTarget, 0);
  assert.equal(goldenEvening.label, 'Golden Sun');

  const nightRain = getWeatherForInGameTime(22 * 60); // 22:00
  assert.equal(nightRain.condition, 'rain');
  assert.equal(nightRain.rainTarget, 1);
  assert.ok(nightRain.daylightFactor < morningSunny.daylightFactor);
});

test('createRainPool and stepRainPool simulate falling raindrops and recycle on ground impact', () => {
  const pool = createRainPool(24, 12);
  assert.equal(pool.drops.length, 24);

  pool.drops[0].y = 10.0;
  const initialY = pool.drops[0].y;
  stepRainPool(pool, 0.1, 0, 0, 1, 12);
  assert.ok(pool.drops[0].y < initialY);

  // Force drop near ground to verify recycling back to sky
  pool.drops[0].y = 0.2;
  stepRainPool(pool, 0.1, 4, -3, 1, 12);
  assert.ok(pool.drops[0].y > 10);
  assert.ok(Math.abs(pool.drops[0].x - 4) <= 12);
  assert.ok(Math.abs(pool.drops[0].z - -3) <= 12);
});
