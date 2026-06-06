/**
 * Polling utility — prepared for real backend integration.
 * Supports configurable intervals, stale detection, and pause/resume.
 */

export class Poller {
  constructor(fn, { interval = 30_000, immediate = true } = {}) {
    this._fn = fn;
    this._interval = interval;
    this._timer = null;
    this._running = false;
    this._lastFetch = null;
    this._staleThreshold = interval * 2;

    if (immediate) this.start();
  }

  start() {
    if (this._running) return;
    this._running = true;
    this._tick();
  }

  stop() {
    this._running = false;
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = null;
    }
  }

  setInterval(ms) {
    this._interval = ms;
    this.stop();
    this.start();
  }

  get isStale() {
    if (!this._lastFetch) return true;
    return (Date.now() - this._lastFetch) > this._staleThreshold;
  }

  async _tick() {
    try {
      await this._fn();
      this._lastFetch = Date.now();
    } catch (e) {
      console.warn('[poller] fetch error:', e);
    }
    if (this._running) {
      this._timer = setTimeout(() => this._tick(), this._interval);
    }
  }
}

/**
 * Simple one-shot delay utility.
 */
export const sleep = (ms) => new Promise(r => setTimeout(r, ms));
