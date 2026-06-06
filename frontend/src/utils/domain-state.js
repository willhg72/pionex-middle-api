/**
 * Per-domain UI state persistence.
 * Each domain view can save/load its filter, segment, and panel toggles.
 * This ensures UI state (filters, tabs, segments) survives page refreshes.
 */

import { persistence } from './persistence.js';

const PREFIX = 'capintel_domain_';

export const domainState = {
  /**
   * Save domain-specific UI state.
   * @param {string} domain — e.g. 'miners', 'opportunities'
   * @param {object} state  — any serializable object (filter, segment, etc.)
   */
  save(domain, state) {
    persistence.save(`${PREFIX}${domain}`, state);
  },

  /**
   * Load domain-specific UI state.
   * @param {string} domain
   * @returns {object} saved state, or {} if nothing stored
   */
  load(domain) {
    const saved = persistence.load(`${PREFIX}${domain}`);
    if (!saved) return {};
    // Strip the internal _savedAt key persistence adds
    const { _savedAt, ...rest } = saved;
    return rest;
  },

  /**
   * Clear domain-specific UI state.
   */
  clear(domain) {
    persistence.remove(`${PREFIX}${domain}`);
  },
};
