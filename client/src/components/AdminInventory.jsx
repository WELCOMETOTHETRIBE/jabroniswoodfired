import { useState, useEffect, useMemo } from 'react'
import { useIsMobile } from '../hooks/useIsMobile.js'

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORY_COLORS = {
  'PROTEINS':                    '#C94B1A',
  'PRODUCE':                     '#6ecf6e',
  'DAIRY & CHEESE':              '#C9952A',
  'DRY GOODS':                   '#b8a070',
  'SWEETENERS':                  '#e8c96e',
  'SPICES & SEASONINGS':         '#e87c3e',
  'OILS, VINEGARS & CONDIMENTS': '#8ec9c9',
  'BAR':                         '#9b7fd4',
  'WOOD & FIRE':                 '#8B5E3C',
}

const CATEGORY_ORDER = [
  'PROTEINS', 'PRODUCE', 'DAIRY & CHEESE', 'DRY GOODS', 'SWEETENERS',
  'SPICES & SEASONINGS', 'OILS, VINEGARS & CONDIMENTS', 'BAR', 'WOOD & FIRE',
]

const UNITS = ['lbs', 'oz', 'each', 'gallons', 'quarts', 'bottles', 'cases', 'sheets', 'rolls', 'cans']

const STATUS = {
  OK:  { label: 'In Stock', color: '#6ecf6e',     bg: 'rgba(80,200,80,0.1)',   border: 'rgba(80,200,80,0.3)'   },
  LOW: { label: 'Low',      color: '#C9952A',      bg: 'rgba(201,149,42,0.1)', border: 'rgba(201,149,42,0.3)' },
  OUT: { label: 'Out',      color: '#C94B1A',      bg: 'rgba(201,75,26,0.1)',  border: 'rgba(201,75,26,0.3)'  },
}

const M = { fontFamily: 'var(--font-mono)' }
const S = { fontFamily: 'var(--font-cormorant)' }
const D = { fontFamily: 'var(--font-playfair)' }

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getStatus(qty, par) {
  const q = parseFloat(qty)
  const p = parseFloat(par)
  if (q <= 0) return 'OUT'
  if (p > 0 && q < p) return 'LOW'
  return 'OK'
}

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  return `${d}d ago`
}

function fmtQty(qty) {
  const n = parseFloat(qty)
  return n % 1 === 0 ? String(n) : n.toFixed(1)
}

function catColor(cat) {
  return CATEGORY_COLORS[cat] || 'var(--bone)'
}

// ─── Shared input style ───────────────────────────────────────────────────────

function inputSt(err) {
  return {
    display: 'block', width: '100%', boxSizing: 'border-box',
    background: 'var(--stage)',
    border: err ? '1px solid var(--ember)' : '1px solid var(--char)',
    color: 'var(--cream)', ...M, fontSize: '13px', letterSpacing: '0.5px',
    padding: '10px 12px', outline: 'none',
  }
}

function labelSt() {
  return {
    ...M, fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase',
    color: 'var(--gold)', display: 'block', marginBottom: '5px',
  }
}

function Err({ msg }) {
  if (!msg) return null
  return (
    <div style={{
      ...M, fontSize: '11px', color: 'var(--ember)',
      background: 'rgba(201,75,26,0.08)', border: '1px solid rgba(201,75,26,0.25)',
      padding: '8px 12px', marginTop: '8px', letterSpacing: '0.5px',
    }}>
      {msg}
    </div>
  )
}

// ─── Summary Bar ──────────────────────────────────────────────────────────────

function SummaryBar({ items, isMobile }) {
  const total = items.length
  const out   = items.filter(i => getStatus(i.quantity, i.par_level) === 'OUT').length
  const low   = items.filter(i => getStatus(i.quantity, i.par_level) === 'LOW').length
  const ok    = total - out - low

  const stats = [
    { label: 'Total',    value: total, color: 'var(--bone)' },
    { label: 'In Stock', value: ok,    color: '#6ecf6e' },
    { label: 'Low',      value: low,   color: '#C9952A' },
    { label: 'Out',      value: out,   color: '#C94B1A' },
  ]

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)',
      gap: '8px',
      marginBottom: '20px',
    }}>
      {stats.map(s => (
        <div key={s.label} style={{
          background: 'var(--smoke)', border: '1px solid var(--char)',
          padding: isMobile ? '12px 16px' : '16px 20px',
        }}>
          <div style={{ ...M, fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--bone)', opacity: 0.5, marginBottom: '6px' }}>
            {s.label}
          </div>
          <div style={{ ...D, fontWeight: 900, fontSize: isMobile ? '1.6rem' : '2rem', color: s.color, lineHeight: 1 }}>
            {s.value}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Filter Bar ───────────────────────────────────────────────────────────────

function FilterBar({ search, setSearch, statusFilter, setStatusFilter, catFilter, setCatFilter, categories, onAdd, isMobile }) {
  const filters = ['ALL', 'OK', 'LOW', 'OUT']
  const filterLabels = { ALL: 'All', OK: 'In Stock', LOW: 'Low', OUT: 'Out' }

  if (isMobile) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search ingredients..."
          style={{ ...inputSt(false), background: 'var(--smoke)' }}
        />
        <div style={{ display: 'flex', gap: '4px' }}>
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              style={{
                ...M, fontSize: '9px', letterSpacing: '1px', textTransform: 'uppercase',
                padding: '8px 0', flex: 1, border: '1px solid var(--char)', cursor: 'pointer',
                background: statusFilter === f ? 'var(--ember)' : 'transparent',
                color: statusFilter === f ? 'var(--cream)' : 'var(--bone)',
              }}
            >
              {filterLabels[f]}
            </button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <select
            value={catFilter}
            onChange={e => setCatFilter(e.target.value)}
            style={{ ...inputSt(false), background: 'var(--smoke)', flex: 1 }}
          >
            <option value="">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button
            onClick={onAdd}
            style={{
              ...M, fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase',
              padding: '10px 16px', background: 'var(--ember)', border: 'none',
              color: 'var(--cream)', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0,
            }}
          >
            + Add
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap' }}>
      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search ingredients..."
        style={{ ...inputSt(false), flex: '1', minWidth: '200px', display: 'block', background: 'var(--smoke)' }}
      />
      <div style={{ display: 'flex', gap: '4px' }}>
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setStatusFilter(f)}
            style={{
              ...M, fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase',
              padding: '8px 14px', border: '1px solid var(--char)', cursor: 'pointer',
              background: statusFilter === f ? 'var(--ember)' : 'transparent',
              color: statusFilter === f ? 'var(--cream)' : 'var(--bone)',
              transition: 'all 0.15s ease',
            }}
          >
            {filterLabels[f]}
          </button>
        ))}
      </div>
      <select
        value={catFilter}
        onChange={e => setCatFilter(e.target.value)}
        style={{ ...inputSt(false), width: 'auto', background: 'var(--smoke)', padding: '8px 12px', cursor: 'pointer' }}
      >
        <option value="">All Categories</option>
        {categories.map(c => <option key={c} value={c}>{c}</option>)}
      </select>
      <button
        onClick={onAdd}
        style={{
          ...M, fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase',
          padding: '9px 20px', background: 'var(--ember)', border: 'none',
          color: 'var(--cream)', cursor: 'pointer', whiteSpace: 'nowrap',
        }}
      >
        + Add Item
      </button>
    </div>
  )
}

// ─── Add / Edit Item Panel ────────────────────────────────────────────────────

function ItemForm({ token, item, categories, onSaved, onDeleted, onCancel, isMobile }) {
  const isNew = !item
  const [form, setForm] = useState({
    name:      item?.name      || '',
    category:  item?.category  || '',
    unit:      item?.unit      || 'lbs',
    quantity:  item ? fmtQty(item.quantity)  : '0',
    par_level: item ? fmtQty(item.par_level) : '0',
    notes:     item?.notes     || '',
  })
  const [customCat, setCustomCat] = useState(false)
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmDel, setConfirmDel] = useState(false)
  const [error, setError] = useState('')

  const allCats = [...new Set([...CATEGORY_ORDER, ...categories])]
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setLoading(true)
    const body = { ...form, quantity: parseFloat(form.quantity) || 0, par_level: parseFloat(form.par_level) || 0 }
    try {
      const url = isNew ? '/api/admin/inventory' : `/api/admin/inventory/${item.id}`
      const res = await fetch(url, {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      })
      const data = await res.json()
      if (res.ok) onSaved(data.item)
      else setError(data.error)
    } catch { setError('Network error.') }
    finally { setLoading(false) }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/inventory/${item.id}`, {
        method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (res.ok) onDeleted(item.id)
      else setError(data.error)
    } catch { setError('Network error.') }
    finally { setDeleting(false) }
  }

  return (
    <form onSubmit={handleSubmit} style={{
      background: 'rgba(255,255,255,0.025)', borderTop: '1px solid var(--char)',
      padding: isMobile ? '16px' : '24px',
      display: 'flex', flexDirection: 'column', gap: '12px',
    }}>
      {/* Name + unit + par — stacked on mobile */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr 1fr', gap: '10px' }}>
        <div>
          <label style={labelSt()}>Name</label>
          <input type="text" value={form.name} onChange={e => set('name', e.target.value)} style={inputSt(!form.name)} placeholder="Ingredient name" />
        </div>
        <div>
          <label style={labelSt()}>Unit</label>
          <select value={form.unit} onChange={e => set('unit', e.target.value)} style={inputSt(false)}>
            {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
        <div>
          <label style={labelSt()}>Par Level</label>
          <input type="number" min="0" step="0.5" value={form.par_level} onChange={e => set('par_level', e.target.value)} style={inputSt(false)} />
        </div>
      </div>

      {/* Category + qty + notes */}
      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr', gap: '10px' }}>
        <div>
          <label style={labelSt()}>Category</label>
          {customCat ? (
            <div style={{ display: 'flex', gap: '8px' }}>
              <input type="text" value={form.category} onChange={e => set('category', e.target.value.toUpperCase())} style={{ ...inputSt(!form.category), flex: 1 }} placeholder="NEW CATEGORY" />
              <button type="button" onClick={() => setCustomCat(false)} style={{ ...M, fontSize: '10px', padding: '9px 12px', background: 'transparent', border: '1px solid var(--char)', color: 'var(--bone)', cursor: 'pointer' }}>↩</button>
            </div>
          ) : (
            <select value={form.category} onChange={e => { if (e.target.value === '__new__') { setCustomCat(true); set('category', '') } else set('category', e.target.value) }} style={inputSt(!form.category)}>
              <option value="">Select category</option>
              {allCats.map(c => <option key={c} value={c}>{c}</option>)}
              <option value="__new__">+ New category...</option>
            </select>
          )}
        </div>
        {isNew && (
          <div>
            <label style={labelSt()}>Initial Qty</label>
            <input type="number" min="0" step="0.5" value={form.quantity} onChange={e => set('quantity', e.target.value)} style={inputSt(false)} />
          </div>
        )}
        <div>
          <label style={labelSt()}>Notes</label>
          <input type="text" value={form.notes} onChange={e => set('notes', e.target.value)} style={inputSt(false)} placeholder="Optional" />
        </div>
      </div>

      <Err msg={error} />

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
        <button type="submit" disabled={loading || !form.name || !form.category} style={{
          ...M, fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase',
          padding: '11px 20px', background: 'var(--ember)', border: 'none',
          color: 'var(--cream)', cursor: loading || !form.name || !form.category ? 'default' : 'pointer',
          opacity: loading || !form.name || !form.category ? 0.5 : 1,
          flex: isMobile ? 1 : 'none',
        }}>
          {loading ? 'Saving...' : isNew ? 'Add Item' : 'Save'}
        </button>
        <button type="button" onClick={onCancel} style={{
          ...M, fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase',
          padding: '11px 16px', background: 'transparent', border: '1px solid var(--char)',
          color: 'var(--bone)', cursor: 'pointer',
          flex: isMobile ? 1 : 'none',
        }}>
          Cancel
        </button>
        {!isNew && !confirmDel && (
          <button type="button" onClick={() => setConfirmDel(true)} style={{
            ...M, fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase',
            padding: '11px 16px', background: 'transparent', border: '1px solid rgba(201,75,26,0.4)',
            color: 'var(--ember)', cursor: 'pointer', marginLeft: isMobile ? '0' : 'auto',
          }}>
            Delete
          </button>
        )}
        {!isNew && confirmDel && (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginLeft: isMobile ? '0' : 'auto', flexWrap: 'wrap' }}>
            <span style={{ ...M, fontSize: '10px', color: 'var(--bone)' }}>Confirm?</span>
            <button type="button" onClick={handleDelete} disabled={deleting} style={{
              ...M, fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase',
              padding: '9px 14px', background: 'var(--ember)', border: 'none',
              color: 'var(--cream)', cursor: deleting ? 'wait' : 'pointer',
            }}>
              {deleting ? '...' : 'Yes, Delete'}
            </button>
            <button type="button" onClick={() => setConfirmDel(false)} style={{
              ...M, fontSize: '10px', padding: '9px 12px', background: 'transparent',
              border: '1px solid var(--char)', color: 'var(--bone)', cursor: 'pointer',
            }}>No</button>
          </div>
        )}
      </div>
    </form>
  )
}

// ─── Adjust Panel ─────────────────────────────────────────────────────────────

function AdjustPanel({ token, item, onAdjusted, onClose, isMobile }) {
  const [mode, setMode] = useState('delta')
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const current = parseFloat(item.quantity)

  const apply = async (delta) => {
    setError(''); setLoading(true)
    try {
      const body = mode === 'exact'
        ? { delta: (parseFloat(input) || 0) - current }
        : { delta }
      const res = await fetch(`/api/admin/inventory/${item.id}/adjust`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ delta: body.delta }),
      })
      const data = await res.json()
      if (res.ok) { onAdjusted(data.item); onClose() }
      else setError(data.error)
    } catch { setError('Network error.') }
    finally { setLoading(false) }
  }

  const presets = item.unit === 'lbs' ? [1, 2, 5, 10]
    : item.unit === 'oz' ? [1, 4, 8, 16]
    : [1, 2, 5]

  return (
    <div style={{
      background: 'rgba(255,255,255,0.025)', borderTop: '1px solid var(--char)',
      padding: isMobile ? '16px' : '20px 24px',
    }}>
      {/* Current qty + mode toggle */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <span style={{ ...D, fontWeight: 900, fontSize: isMobile ? '1.8rem' : '2.2rem', color: 'var(--cream)', lineHeight: 1 }}>{fmtQty(current)}</span>
          <span style={{ ...M, fontSize: '11px', color: 'var(--bone)', letterSpacing: '1px' }}>{item.unit}</span>
          <span style={{ ...M, fontSize: '9px', color: 'var(--bone)', opacity: 0.4 }}>/ {fmtQty(item.par_level)} par</span>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {['delta', 'exact'].map(m => (
            <button key={m} onClick={() => { setMode(m); setInput('') }} style={{
              ...M, fontSize: '9px', letterSpacing: '1.5px', textTransform: 'uppercase',
              padding: '5px 10px', cursor: 'pointer',
              background: mode === m ? 'rgba(201,149,42,0.15)' : 'transparent',
              border: `1px solid ${mode === m ? 'rgba(201,149,42,0.4)' : 'var(--char)'}`,
              color: mode === m ? '#C9952A' : 'var(--bone)',
            }}>{m === 'delta' ? 'Adjust' : 'Set Exact'}</button>
          ))}
        </div>
      </div>

      {mode === 'delta' && (
        <div>
          {/* Preset chips — larger on mobile */}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
            {presets.map(p => (
              <button key={`+${p}`} onClick={() => apply(p)} disabled={loading} style={{
                ...M, fontSize: isMobile ? '13px' : '11px',
                padding: isMobile ? '10px 16px' : '7px 14px',
                cursor: 'pointer',
                background: 'rgba(110,207,110,0.08)', border: '1px solid rgba(110,207,110,0.25)',
                color: '#6ecf6e', minWidth: isMobile ? '52px' : 'auto',
              }}>+{p}</button>
            ))}
            {presets.slice(0, 3).map(p => (
              <button key={`-${p}`} onClick={() => apply(-p)} disabled={loading} style={{
                ...M, fontSize: isMobile ? '13px' : '11px',
                padding: isMobile ? '10px 16px' : '7px 14px',
                cursor: 'pointer',
                background: 'rgba(201,75,26,0.08)', border: '1px solid rgba(201,75,26,0.25)',
                color: '#C94B1A', minWidth: isMobile ? '52px' : 'auto',
              }}>−{p}</button>
            ))}
          </div>
          {/* Custom delta */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
            <input
              type="number" step="0.5" value={input} onChange={e => setInput(e.target.value)}
              placeholder="custom amount"
              style={{ ...inputSt(false), width: isMobile ? '100%' : '140px', display: 'block', flex: isMobile ? 1 : 'none' }}
            />
            <button onClick={() => apply(parseFloat(input) || 0)} disabled={loading || !input} style={{
              ...M, fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase',
              padding: isMobile ? '11px 0' : '9px 16px',
              background: 'rgba(110,207,110,0.1)', border: '1px solid rgba(110,207,110,0.3)',
              color: '#6ecf6e', cursor: !input || loading ? 'default' : 'pointer',
              opacity: !input ? 0.5 : 1,
              flex: isMobile ? 1 : 'none',
            }}>Add</button>
            <button onClick={() => apply(-(parseFloat(input) || 0))} disabled={loading || !input} style={{
              ...M, fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase',
              padding: isMobile ? '11px 0' : '9px 16px',
              background: 'rgba(201,75,26,0.08)', border: '1px solid rgba(201,75,26,0.25)',
              color: '#C94B1A', cursor: !input || loading ? 'default' : 'pointer',
              opacity: !input ? 0.5 : 1,
              flex: isMobile ? 1 : 'none',
            }}>Remove</button>
            {!isMobile && (
              <button onClick={onClose} style={{
                ...M, fontSize: '10px', padding: '9px 14px', background: 'transparent',
                border: '1px solid var(--char)', color: 'var(--bone)', cursor: 'pointer', marginLeft: 'auto',
              }}>Cancel</button>
            )}
          </div>
        </div>
      )}

      {mode === 'exact' && (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
          <input
            type="number" step="0.5" min="0" value={input} onChange={e => setInput(e.target.value)}
            placeholder={`set exact ${item.unit}`}
            style={{ ...inputSt(false), width: isMobile ? '100%' : '160px', display: 'block', flex: isMobile ? 1 : 'none' }}
            autoFocus
          />
          {!isMobile && <span style={{ ...M, fontSize: '11px', color: 'var(--bone)', letterSpacing: '1px' }}>{item.unit}</span>}
          <button onClick={() => apply(0)} disabled={loading || input === ''} style={{
            ...M, fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase',
            padding: isMobile ? '11px 0' : '9px 20px',
            background: 'var(--ember)', border: 'none',
            color: 'var(--cream)', cursor: input === '' || loading ? 'default' : 'pointer',
            opacity: input === '' ? 0.5 : 1,
            flex: isMobile ? 1 : 'none',
          }}>Set to {input || '?'} {item.unit}</button>
        </div>
      )}

      {/* Cancel always visible on mobile at bottom */}
      {isMobile && (
        <button onClick={onClose} style={{
          ...M, fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase',
          padding: '11px', background: 'transparent', border: '1px solid var(--char)',
          color: 'var(--bone)', cursor: 'pointer', width: '100%', marginTop: '8px',
        }}>Cancel</button>
      )}

      <Err msg={error} />
    </div>
  )
}

// ─── Item Row ─────────────────────────────────────────────────────────────────

function ItemRow({ item, token, onUpdated, onDeleted, categories, activePanel, setActivePanel, isMobile }) {
  const status = getStatus(item.quantity, item.par_level)
  const st = STATUS[status]
  const qty = parseFloat(item.quantity)
  const par = parseFloat(item.par_level)
  const barPct = par > 0 ? Math.min((qty / par) * 100, 100) : qty > 0 ? 100 : 0
  const rowId = item.id
  const panelOpen = activePanel?.id === rowId
  const mode = panelOpen ? activePanel.mode : null

  const open = (m) => setActivePanel({ id: rowId, mode: m })
  const close = () => setActivePanel(null)

  return (
    <div style={{
      borderBottom: '1px solid var(--char)',
      background: status === 'OUT' ? 'rgba(201,75,26,0.03)' : 'transparent',
    }}>
      {isMobile ? (
        /* ── Mobile card layout ── */
        <div style={{ padding: '12px 14px' }}>
          {/* Row 1: name + status */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px', marginBottom: '8px' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ ...D, fontWeight: 600, fontSize: '0.95rem', color: 'var(--cream)', lineHeight: 1.2 }}>
                {item.name}
              </div>
              {item.notes && (
                <div style={{ ...S, fontSize: '0.8rem', color: 'var(--bone)', opacity: 0.5, fontStyle: 'italic', marginTop: '2px' }}>
                  {item.notes}
                </div>
              )}
            </div>
            <div style={{
              ...M, fontSize: '8px', letterSpacing: '1.5px', textTransform: 'uppercase',
              color: st.color, background: st.bg, border: `1px solid ${st.border}`,
              padding: '3px 7px', flexShrink: 0, whiteSpace: 'nowrap',
            }}>
              {st.label}
            </div>
          </div>

          {/* Row 2: qty + par + bar */}
          <div style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '5px' }}>
              <div>
                <span style={{ ...D, fontWeight: 700, fontSize: '1.2rem', color: 'var(--cream)' }}>{fmtQty(qty)}</span>
                <span style={{ ...M, fontSize: '10px', color: 'var(--bone)', opacity: 0.7, marginLeft: '4px' }}>{item.unit}</span>
              </div>
              <div style={{ ...M, fontSize: '9px', color: 'var(--bone)', opacity: 0.4 }}>
                par: {fmtQty(par)} {item.unit}
              </div>
            </div>
            <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${barPct}%`, background: st.color, transition: 'width 0.4s ease' }} />
            </div>
            <div style={{ ...M, fontSize: '8px', color: 'var(--bone)', opacity: 0.25, marginTop: '3px', letterSpacing: '0.5px' }}>
              {timeAgo(item.updated_at)}
            </div>
          </div>

          {/* Row 3: action buttons */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => mode === 'adjust' ? close() : open('adjust')}
              style={{
                ...M, fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase',
                padding: '10px 0', flex: 1, cursor: 'pointer',
                background: mode === 'adjust' ? 'rgba(110,207,110,0.1)' : 'transparent',
                border: `1px solid ${mode === 'adjust' ? 'rgba(110,207,110,0.3)' : 'var(--char)'}`,
                color: mode === 'adjust' ? '#6ecf6e' : 'var(--bone)',
              }}
            >
              Adjust
            </button>
            <button
              onClick={() => mode === 'edit' ? close() : open('edit')}
              style={{
                ...M, fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase',
                padding: '10px 0', flex: 1, cursor: 'pointer',
                background: mode === 'edit' ? 'rgba(201,149,42,0.1)' : 'transparent',
                border: `1px solid ${mode === 'edit' ? 'rgba(201,149,42,0.3)' : 'var(--char)'}`,
                color: mode === 'edit' ? '#C9952A' : 'var(--bone)',
              }}
            >
              Edit
            </button>
          </div>
        </div>
      ) : (
        /* ── Desktop table row ── */
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 90px 110px 130px 80px 80px',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 16px',
        }}>
          <div>
            <div style={{ ...D, fontWeight: 600, fontSize: '0.95rem', color: 'var(--cream)', lineHeight: 1.2 }}>{item.name}</div>
            {item.notes && <div style={{ ...S, fontSize: '0.8rem', color: 'var(--bone)', opacity: 0.5, fontStyle: 'italic', marginTop: '2px' }}>{item.notes}</div>}
            <div style={{ ...M, fontSize: '9px', color: 'var(--bone)', opacity: 0.3, marginTop: '2px', letterSpacing: '0.5px' }}>{timeAgo(item.updated_at)}</div>
          </div>
          <div style={{
            ...M, fontSize: '9px', letterSpacing: '1.5px', textTransform: 'uppercase',
            color: st.color, background: st.bg, border: `1px solid ${st.border}`,
            padding: '3px 8px', textAlign: 'center', whiteSpace: 'nowrap',
          }}>{st.label}</div>
          <div>
            <span style={{ ...D, fontWeight: 700, fontSize: '1.1rem', color: 'var(--cream)' }}>{fmtQty(qty)}</span>
            <span style={{ ...M, fontSize: '10px', color: 'var(--bone)', opacity: 0.6, marginLeft: '4px' }}>{item.unit}</span>
          </div>
          <div>
            <div style={{ ...M, fontSize: '9px', color: 'var(--bone)', opacity: 0.4, letterSpacing: '0.5px', marginBottom: '4px' }}>
              par: {fmtQty(par)} {item.unit}
            </div>
            <div style={{ height: '3px', background: 'rgba(255,255,255,0.06)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${barPct}%`, background: st.color, transition: 'width 0.4s ease' }} />
            </div>
          </div>
          <button
            onClick={() => mode === 'adjust' ? close() : open('adjust')}
            style={{
              ...M, fontSize: '9px', letterSpacing: '1.5px', textTransform: 'uppercase',
              padding: '6px 0', width: '100%', cursor: 'pointer',
              background: mode === 'adjust' ? 'rgba(110,207,110,0.1)' : 'transparent',
              border: `1px solid ${mode === 'adjust' ? 'rgba(110,207,110,0.3)' : 'var(--char)'}`,
              color: mode === 'adjust' ? '#6ecf6e' : 'var(--bone)',
            }}
          >Adjust</button>
          <button
            onClick={() => mode === 'edit' ? close() : open('edit')}
            style={{
              ...M, fontSize: '9px', letterSpacing: '1.5px', textTransform: 'uppercase',
              padding: '6px 0', width: '100%', cursor: 'pointer',
              background: mode === 'edit' ? 'rgba(201,149,42,0.1)' : 'transparent',
              border: `1px solid ${mode === 'edit' ? 'rgba(201,149,42,0.3)' : 'var(--char)'}`,
              color: mode === 'edit' ? '#C9952A' : 'var(--bone)',
            }}
          >Edit</button>
        </div>
      )}

      {mode === 'adjust' && (
        <AdjustPanel token={token} item={item} isMobile={isMobile}
          onAdjusted={(updated) => { onUpdated(updated); close() }} onClose={close} />
      )}
      {mode === 'edit' && (
        <ItemForm token={token} item={item} categories={categories} isMobile={isMobile}
          onSaved={(updated) => { onUpdated(updated); close() }}
          onDeleted={(id) => { onDeleted(id); close() }}
          onCancel={close}
        />
      )}
    </div>
  )
}

// ─── Category Section ─────────────────────────────────────────────────────────

function CategorySection({ category, items, token, onUpdated, onDeleted, categories, activePanel, setActivePanel, isMobile }) {
  const [collapsed, setCollapsed] = useState(false)
  const cc = catColor(category)
  const outCount = items.filter(i => getStatus(i.quantity, i.par_level) === 'OUT').length
  const lowCount = items.filter(i => getStatus(i.quantity, i.par_level) === 'LOW').length

  return (
    <div style={{ marginBottom: '4px' }}>
      <button
        onClick={() => setCollapsed(p => !p)}
        style={{
          width: '100%', background: 'var(--smoke)', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: isMobile ? '10px 14px' : '10px 16px', textAlign: 'left',
          borderBottom: collapsed ? 'none' : '1px solid var(--char)',
          borderTop: '1px solid var(--char)',
        }}
      >
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: cc, flexShrink: 0 }} />
        <span style={{ ...M, fontSize: isMobile ? '9px' : '10px', letterSpacing: isMobile ? '2px' : '3px', textTransform: 'uppercase', color: cc, flex: 1, textAlign: 'left' }}>
          {category}
        </span>
        <span style={{ ...M, fontSize: '9px', color: 'var(--bone)', opacity: 0.4 }}>{items.length}</span>
        {outCount > 0 && <span style={{ ...M, fontSize: '9px', color: '#C94B1A', background: 'rgba(201,75,26,0.1)', border: '1px solid rgba(201,75,26,0.2)', padding: '2px 6px' }}>{outCount} out</span>}
        {lowCount > 0 && <span style={{ ...M, fontSize: '9px', color: '#C9952A', background: 'rgba(201,149,42,0.1)', border: '1px solid rgba(201,149,42,0.2)', padding: '2px 6px' }}>{lowCount} low</span>}
        <span style={{ ...M, fontSize: '10px', color: 'var(--bone)', opacity: 0.3, transform: collapsed ? 'none' : 'rotate(90deg)', display: 'inline-block', transition: 'transform 0.2s ease' }}>▶</span>
      </button>

      {!collapsed && (
        <div>
          {/* Column headers — desktop only */}
          {!isMobile && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 90px 110px 130px 80px 80px',
              gap: '12px', padding: '6px 16px',
              background: 'rgba(255,255,255,0.01)',
              borderBottom: '1px solid rgba(255,255,255,0.04)',
            }}>
              {['Ingredient', 'Status', 'On Hand', 'Par Level', '', ''].map((h, i) => (
                <div key={i} style={{ ...M, fontSize: '8px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--bone)', opacity: 0.3 }}>{h}</div>
              ))}
            </div>
          )}
          {items.map(item => (
            <ItemRow
              key={item.id} item={item} token={token}
              onUpdated={onUpdated} onDeleted={onDeleted} categories={categories}
              activePanel={activePanel} setActivePanel={setActivePanel}
              isMobile={isMobile}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Add Item Panel ───────────────────────────────────────────────────────────

function AddItemPanel({ token, categories, onSaved, onCancel, isMobile }) {
  return (
    <div style={{
      background: 'var(--smoke)', border: '1px solid var(--char)',
      borderLeft: '3px solid var(--ember)', marginBottom: '16px',
    }}>
      <div style={{ padding: isMobile ? '12px 16px 0' : '16px 24px 0', ...M, fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--ember)' }}>
        New Item
      </div>
      <ItemForm token={token} item={null} categories={categories} onSaved={onSaved} onDeleted={() => {}} onCancel={onCancel} isMobile={isMobile} />
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminInventory({ token }) {
  const isMobile = useIsMobile()
  const [items, setItems] = useState([])
  const [status, setStatus] = useState('loading')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [catFilter, setCatFilter] = useState('')
  const [activePanel, setActivePanel] = useState(null)
  const [showAdd, setShowAdd] = useState(false)

  useEffect(() => {
    fetch('/api/admin/inventory', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { setItems(data.inventory || []); setStatus('ready') })
      .catch(() => setStatus('error'))
  }, [token])

  const categories = useMemo(() => {
    const fromItems = [...new Set(items.map(i => i.category))]
    const ordered = CATEGORY_ORDER.filter(c => fromItems.includes(c))
    const extra = fromItems.filter(c => !CATEGORY_ORDER.includes(c))
    return [...ordered, ...extra]
  }, [items])

  const filtered = useMemo(() => {
    return items.filter(item => {
      if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false
      if (catFilter && item.category !== catFilter) return false
      if (statusFilter !== 'ALL' && getStatus(item.quantity, item.par_level) !== statusFilter) return false
      return true
    })
  }, [items, search, statusFilter, catFilter])

  const grouped = useMemo(() => {
    const map = {}
    filtered.forEach(item => {
      if (!map[item.category]) map[item.category] = []
      map[item.category].push(item)
    })
    Object.keys(map).forEach(cat => {
      map[cat].sort((a, b) => {
        const order = { OUT: 0, LOW: 1, OK: 2 }
        const sa = order[getStatus(a.quantity, a.par_level)]
        const sb = order[getStatus(b.quantity, b.par_level)]
        if (sa !== sb) return sa - sb
        return a.name.localeCompare(b.name)
      })
    })
    return map
  }, [filtered])

  const visibleCategories = categories.filter(c => grouped[c])

  const onUpdated = (updated) => setItems(prev => prev.map(i => i.id === updated.id ? updated : i))
  const onDeleted = (id) => setItems(prev => prev.filter(i => i.id !== id))
  const onAdded = (item) => { setItems(prev => [...prev, item]); setShowAdd(false) }

  return (
    <div>
      <div style={{ marginBottom: isMobile ? '20px' : '32px' }}>
        <div style={{ ...M, fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '8px' }}>
          Kitchen Management
        </div>
        <h1 style={{ ...D, fontWeight: 900, fontSize: isMobile ? '1.8rem' : 'clamp(1.6rem, 3vw, 2.4rem)', color: 'var(--cream)', lineHeight: 1.1, letterSpacing: '-0.3px', margin: 0 }}>
          Inventory
        </h1>
        <div style={{ height: '1px', background: 'linear-gradient(90deg, var(--char), transparent)', marginTop: '20px' }} />
      </div>

      {status === 'loading' && <div style={{ ...M, fontSize: '11px', letterSpacing: '2px', color: 'var(--bone)', opacity: 0.4, textTransform: 'uppercase' }}>Loading...</div>}
      {status === 'error'   && <div style={{ ...M, fontSize: '11px', color: 'var(--ember)', background: 'rgba(201,75,26,0.08)', border: '1px solid rgba(201,75,26,0.3)', padding: '16px' }}>Failed to load inventory.</div>}

      {status === 'ready' && (
        <>
          <SummaryBar items={items} isMobile={isMobile} />

          {showAdd && (
            <AddItemPanel token={token} categories={categories} onSaved={onAdded} onCancel={() => setShowAdd(false)} isMobile={isMobile} />
          )}

          <FilterBar
            search={search} setSearch={setSearch}
            statusFilter={statusFilter} setStatusFilter={setStatusFilter}
            catFilter={catFilter} setCatFilter={setCatFilter}
            categories={categories}
            onAdd={() => { setShowAdd(p => !p); setActivePanel(null) }}
            isMobile={isMobile}
          />

          {filtered.length === 0 && (
            <div style={{ ...S, fontSize: '1.1rem', fontStyle: 'italic', color: 'var(--bone)', opacity: 0.4, paddingTop: '16px' }}>
              No items match your filters.
            </div>
          )}

          {visibleCategories.map(cat => (
            <CategorySection
              key={cat} category={cat} items={grouped[cat] || []}
              token={token} onUpdated={onUpdated} onDeleted={onDeleted}
              categories={categories} activePanel={activePanel} setActivePanel={setActivePanel}
              isMobile={isMobile}
            />
          ))}
        </>
      )}
    </div>
  )
}
