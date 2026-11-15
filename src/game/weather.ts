export type WeatherCondition = 'sunny' | 'rain';

export interface WeatherScheduleState {
  condition: WeatherCondition;
  inGameMinutes: number;
  formattedTime: string;
  rainTarget: number;
  daylightFactor: number;
  sunAngleRad: number;
  label: string;
}

export interface WeatherDisplayState {
  condition: WeatherCondition;
  formattedTime: string;
  label: string;
}

export const MINUTES_PER_DAY = 1440;
export const DEFAULT_START_MINUTES = 8 * 60 + 30; // 08:30 Sunny morning
export const IN_GAME_MINUTES_PER_REAL_SECOND = 22; // ~65s per full 24h day cycle

/**
 * Normalizes any minute value into [0, 1440).
 */
export function normalizeInGameMinutes(minutes: number): number {
  if (!Number.isFinite(minutes)) return DEFAULT_START_MINUTES;
  const mod = minutes % MINUTES_PER_DAY;
  return mod < 0 ? mod + MINUTES_PER_DAY : mod;
}

/**
 * Formats in-game minutes (0..1439) as HH:MM 24h clock rounded to 5-minute steps
 * so HUD updates smoothly without noisy single-minute flicker.
 */
export function formatInGameClock(inGameMinutes: number): string {
  const norm = normalizeInGameMinutes(inGameMinutes);
  const totalStepped = Math.floor(norm / 5) * 5;
  const hrs = Math.floor(totalStepped / 60) % 24;
  const mins = totalStepped % 60;
  return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
}

/**
 * Determines sunny vs rain weather strictly from the current in-game time:
 * - 00:00 - 03:30 (0..210): Night Rain
 * - 03:30 - 12:30 (210..750): Sunny Morning & Noon
 * - 12:30 - 16:30 (750..990): Afternoon Rain Shower
 * - 16:30 - 21:00 (990..1260): Sunny Evening / Golden Hour
 * - 21:00 - 24:00 (1260..1440): Evening Rain
 */
export function getWeatherForInGameTime(inGameMinutes: number): WeatherScheduleState {
  const norm = normalizeInGameMinutes(inGameMinutes);
  const isRain =
    norm < 210 || (norm >= 750 && norm < 990) || norm >= 1260;
  const condition: WeatherCondition = isRain ? 'rain' : 'sunny';

  // Daylight curve: brightest at 12:00 (720), softer twilight at 00:00 (still well-lit for P4 visibility)
  const dayPhase = ((norm - 360) / MINUTES_PER_DAY) * Math.PI * 2; // 0 rad at 06:00 sunrise
  const sunSin = Math.sin(dayPhase);
  const daylightFactor = Math.max(0.42, Math.min(1, 0.72 + sunSin * 0.32));

  const label = isRain ? 'Rainy' : norm >= 1020 ? 'Golden Sun' : 'Sunny';

  return {
    condition,
    inGameMinutes: norm,
    formattedTime: formatInGameClock(norm),
    rainTarget: isRain ? 1 : 0,
    daylightFactor,
    sunAngleRad: dayPhase,
    label,
  };
}

export interface RainDrop {
  x: number;
  y: number;
  z: number;
  vy: number;
  length: number;
}

export interface RainPool {
  capacity: number;
  drops: RainDrop[];
}

export function createRainPool(capacity = 180, span = 15): RainPool {
  const drops: RainDrop[] = [];
  for (let i = 0; i < capacity; i++) {
    // Deterministic seeded scatter so initial distribution is balanced
    const h1 = ((i * 73 + 19) % 997) / 997;
    const h2 = ((i * 137 + 41) % 991) / 991;
    const h3 = ((i * 211 + 83) % 983) / 983;
    drops.push({
      x: (h1 * 2 - 1) * span,
      y: 0.4 + h2 * 15,
      z: (h3 * 2 - 1) * span,
      vy: 21 + (i % 7) * 1.1,
      length: 0.62 + (i % 4) * 0.12,
    });
  }
  return { capacity, drops };
}

export function stepRainPool(
  pool: RainPool,
  dt: number,
  centerX: number,
  centerZ: number,
  rainIntensity: number,
  span = 15,
): void {
  if (rainIntensity <= 0.01 || dt <= 0) return;
  const windVx = -1.6;
  const maxHeight = 15.5;

  for (let i = 0; i < pool.capacity; i++) {
    const d = pool.drops[i];
    d.x += windVx * dt;
    d.y -= d.vy * dt;

    // Wrap horizontally around moving focus center
    if (d.x < centerX - span) d.x += span * 2;
    else if (d.x > centerX + span) d.x -= span * 2;

    if (d.z < centerZ - span) d.z += span * 2;
    else if (d.z > centerZ + span) d.z -= span * 2;

    // Reset to sky when reaching ground
    if (d.y <= 0.05) {
      d.y = maxHeight - ((i * 0.37) % 2.4);
      const rawX = i * 97 + Math.round(centerX * 11);
      const rawZ = i * 151 + Math.round(centerZ * 13);
      const modX = ((rawX % 199) + 199) % 199;
      const modZ = ((rawZ % 197) + 197) % 197;
      const offsetX = (modX / 199) * 2 - 1;
      const offsetZ = (modZ / 197) * 2 - 1;
      d.x = centerX + offsetX * span;
      d.z = centerZ + offsetZ * span;
    }
  }
}
