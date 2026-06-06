import { LitElement, html, css } from 'lit';

/**
 * Reusable data table component.
 * columns: Array<{ key, label, width?, align?, render? }>
 * rows: Array<object>
 * onRowClick: function(row)
 */
class DataTable extends LitElement {
  static properties = {
    columns:     { type: Array },
    rows:        { type: Array },
    emptyText:   { type: String },
    compact:     { type: Boolean },
    highlightFn: { type: Object }, // row => 'warning' | 'danger' | ''
  };

  static styles = css`
    :host { display: block; }
    .table-wrap {
      width: 100%;
      overflow-x: auto;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: var(--text-sm);
    }
    thead th {
      padding: var(--space-2) var(--space-3);
      text-align: left;
      font-size: var(--text-xs);
      font-weight: var(--weight-semibold);
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--color-text-muted);
      border-bottom: 1px solid var(--color-border-subtle);
      white-space: nowrap;
    }
    thead th.right { text-align: right; }
    thead th.center { text-align: center; }

    tbody tr {
      border-bottom: 1px solid var(--color-border-subtle);
      cursor: default;
      transition: background var(--transition-fast);
    }
    tbody tr:last-child { border-bottom: none; }
    tbody tr:hover { background: var(--color-bg-hover); }

    tbody tr.warning { border-left: 2px solid var(--color-warning); }
    tbody tr.danger  { border-left: 2px solid var(--color-negative); }

    td {
      padding: var(--space-2) var(--space-3);
      color: var(--color-text-primary);
      vertical-align: middle;
    }
    td.right  { text-align: right; }
    td.center { text-align: center; }

    .empty-row td {
      text-align: center;
      color: var(--color-text-muted);
      padding: var(--space-10);
      font-size: var(--text-sm);
    }

    .compact thead th, .compact td {
      padding: var(--space-1) var(--space-3);
    }
  `;

  _renderCell(col, row) {
    if (col.render) return col.render(row[col.key], row);
    const val = row[col.key];
    return val !== undefined && val !== null ? val : '—';
  }

  render() {
    const cols = this.columns || [];
    const rows = this.rows || [];

    return html`
      <div class="table-wrap">
        <table class="${this.compact ? 'compact' : ''}">
          <thead>
            <tr>
              ${cols.map(col => html`
                <th class="${col.align || 'left'}" style="${col.width ? `width:${col.width}` : ''}">${col.label}</th>
              `)}
            </tr>
          </thead>
          <tbody>
            ${rows.length === 0 ? html`
              <tr class="empty-row">
                <td colspan="${cols.length}">${this.emptyText || 'No data'}</td>
              </tr>
            ` : rows.map(row => {
              const hlClass = this.highlightFn ? this.highlightFn(row) : '';
              return html`
                <tr class="${hlClass}" @click=${() => this.dispatchEvent(new CustomEvent('row-click', { detail: row, bubbles: true }))}>
                  ${cols.map(col => html`
                    <td class="${col.align || 'left'}">${this._renderCell(col, row)}</td>
                  `)}
                </tr>
              `;
            })}
          </tbody>
        </table>
      </div>
    `;
  }
}

customElements.define('data-table', DataTable);
