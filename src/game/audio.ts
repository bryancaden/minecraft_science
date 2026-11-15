class ProceduralAudioEngine {
  private ctx: AudioContext | null = null;
  private muted = false;

  private ensureContext(): AudioContext | null {
    if (this.muted || typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!AudioCtx) return null;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setMuted(muted: boolean) {
    this.muted = muted;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  private playTone(
    freq: number,
    duration: number,
    type: OscillatorType = 'triangle',
    gainPeak = 0.14,
    delay = 0,
    endFreq?: number,
  ) {
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (endFreq) {
      osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration);
    }

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(gainPeak, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  }

  public playJump() {
    const jitter = 0.94 + Math.random() * 0.12;
    this.playTone(260 * jitter, 0.14, 'square', 0.08, 0, 520 * jitter);
  }

  public playPickup() {
    const jitter = 0.96 + Math.random() * 0.08;
    this.playTone(587 * jitter, 0.08, 'triangle', 0.12, 0);
    this.playTone(880 * jitter, 0.14, 'triangle', 0.12, 0.06);
  }

  public playBeaconOpen() {
    this.playTone(440, 0.09, 'sine', 0.12, 0);
    this.playTone(659, 0.12, 'sine', 0.12, 0.05);
  }

  public playCorrect() {
    this.playTone(523.25, 0.11, 'triangle', 0.14, 0);
    this.playTone(659.25, 0.11, 'triangle', 0.14, 0.08);
    this.playTone(783.99, 0.14, 'triangle', 0.15, 0.16);
    this.playTone(1046.5, 0.24, 'sine', 0.16, 0.24);
  }

  public playWrong() {
    this.playTone(210, 0.16, 'sawtooth', 0.09, 0, 155);
    this.playTone(165, 0.22, 'sawtooth', 0.09, 0.11, 120);
  }

  public playVictory() {
    const notes = [523.25, 659.25, 783.99, 1046.5, 1318.5];
    notes.forEach((n, idx) => {
      this.playTone(n, idx === notes.length - 1 ? 0.36 : 0.13, 'triangle', 0.15, idx * 0.09);
    });
  }

  public playDefeat() {
    this.playTone(392, 0.18, 'triangle', 0.12, 0);
    this.playTone(349.23, 0.18, 'triangle', 0.12, 0.16);
    this.playTone(293.66, 0.32, 'sawtooth', 0.1, 0.32);
  }

  public playSwitchHero() {
    this.playTone(493.88, 0.07, 'square', 0.07, 0);
    this.playTone(739.99, 0.1, 'square', 0.07, 0.06);
  }

  public playConfettiPop() {
    const jitter = 0.96 + Math.random() * 0.08;
    this.playTone(320 * jitter, 0.07, 'triangle', 0.15, 0, 760 * jitter);
    this.playTone(660 * jitter, 0.1, 'sine', 0.12, 0.05);
    this.playTone(880 * jitter, 0.12, 'sine', 0.12, 0.11);
    this.playTone(1174.66 * jitter, 0.18, 'triangle', 0.11, 0.17);
  }

  public playBlockPlace() {
    const jitter = 0.94 + Math.random() * 0.12;
    this.playTone(290 * jitter, 0.06, 'square', 0.09, 0, 420 * jitter);
    this.playTone(580 * jitter, 0.08, 'triangle', 0.1, 0.03);
  }

  public playBlockBreak() {
    const jitter = 0.94 + Math.random() * 0.12;
    this.playTone(420 * jitter, 0.07, 'triangle', 0.09, 0, 210 * jitter);
  }
}

export const soundFX = new ProceduralAudioEngine();
