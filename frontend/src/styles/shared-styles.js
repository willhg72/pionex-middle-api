/**
 * Shared Lit CSS module — imported by Shadow DOM components so they get
 * the same polished button / input / panel system as the global stylesheet.
 */
import { css } from 'lit';

export const numericStyles = css`
  .num-ui,
  .num-ui-strong {
    font-family: var(--font-numeric);
    font-variant-numeric: var(--font-numeric-variant);
    font-feature-settings: var(--font-numeric-features);
  }

  .num-ui {
    letter-spacing: var(--font-numeric-spacing);
  }

  .num-ui-strong {
    letter-spacing: var(--font-numeric-spacing-strong);
    font-weight: var(--weight-semibold);
  }
`;

export const buttonStyles = css`
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    padding: 6px 14px;
    border-radius: 7px;
    font-family: var(--font-sans);
    font-size: 11.5px;
    font-weight: 500;
    letter-spacing: 0.015em;
    cursor: pointer;
    transition: background 130ms ease, box-shadow 130ms ease, transform 130ms ease, border-color 130ms ease, color 130ms ease;
    border: 1px solid transparent;
    white-space: nowrap;
    user-select: none;
    line-height: 1;
    text-decoration: none;
  }
  .btn:disabled {
    opacity: 0.35;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }

  /* Primary — blue gradient */
  .btn-primary {
    background: linear-gradient(160deg, #6b9cf5 0%, #4274de 100%);
    color: #fff;
    border-color: rgba(91,141,239,0.3);
    box-shadow: 0 1px 2px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08);
    text-shadow: 0 1px 2px rgba(0,0,0,0.25);
  }
  .btn-primary:hover:not(:disabled) {
    background: linear-gradient(160deg, #7eadf7 0%, #5b8def 100%);
    box-shadow: 0 3px 12px rgba(0,0,0,0.4), 0 0 20px rgba(91,141,239,0.3), inset 0 1px 0 rgba(255,255,255,0.1);
    transform: translateY(-1px);
  }
  .btn-primary:active:not(:disabled) { transform: translateY(0); box-shadow: 0 1px 3px rgba(0,0,0,0.45); }

  /* Ghost — frosted */
  .btn-ghost {
    background: rgba(255,255,255,0.025);
    color: var(--color-text-secondary);
    border-color: var(--color-border-strong);
  }
  .btn-ghost:hover:not(:disabled) {
    background: rgba(255,255,255,0.06);
    color: var(--color-text-primary);
    border-color: #4a4e63;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    transform: translateY(-1px);
  }
  .btn-ghost:active:not(:disabled) { transform: translateY(0); }

  /* Danger */
  .btn-danger {
    background: rgba(240,74,94,0.08);
    color: var(--color-negative);
    border-color: rgba(240,74,94,0.2);
  }
  .btn-danger:hover:not(:disabled) {
    background: linear-gradient(160deg, #f25a6e 0%, #d43750 100%);
    color: #fff;
    border-color: #f04a5e;
    box-shadow: 0 3px 12px rgba(0,0,0,0.4), 0 0 20px rgba(240,74,94,0.3);
    transform: translateY(-1px);
  }
  .btn-danger:active:not(:disabled) { transform: translateY(0); }

  /* Warning */
  .btn-warning {
    background: rgba(245,166,35,0.08);
    color: var(--color-warning);
    border-color: rgba(245,166,35,0.2);
  }
  .btn-warning:hover:not(:disabled) {
    background: linear-gradient(160deg, #f7b83a 0%, #df9418 100%);
    color: #0a0b0f;
    border-color: #f5a623;
    box-shadow: 0 3px 12px rgba(0,0,0,0.4), 0 0 20px rgba(245,166,35,0.3);
    transform: translateY(-1px);
    font-weight: 600;
  }
  .btn-warning:active:not(:disabled) { transform: translateY(0); }

  /* Positive */
  .btn-positive {
    background: rgba(34,211,160,0.08);
    color: var(--color-positive);
    border-color: rgba(34,211,160,0.2);
  }
  .btn-positive:hover:not(:disabled) {
    background: linear-gradient(160deg, #28e0ab 0%, #17b589 100%);
    color: #0a0b0f;
    border-color: #22d3a0;
    box-shadow: 0 3px 12px rgba(0,0,0,0.4), 0 0 20px rgba(34,211,160,0.3);
    transform: translateY(-1px);
    font-weight: 600;
  }
  .btn-positive:active:not(:disabled) { transform: translateY(0); }

  /* Small variant */
  .btn-sm { padding: 4px 10px; font-size: 11px; border-radius: 5px; }
`;
