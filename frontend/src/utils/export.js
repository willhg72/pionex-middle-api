/**
 * JSON import/export utilities for dashboard state backup.
 */

import { persistence } from './persistence.js';

export const exportDashboard = () => {
  const data = persistence.exportAll();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `capintel-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const importDashboard = () => {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return reject(new Error('No file selected'));
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        const ok = persistence.importAll(data);
        if (ok) resolve(data);
        else reject(new Error('Import failed'));
      } catch (err) {
        reject(err);
      }
    };
    input.click();
  });
};
