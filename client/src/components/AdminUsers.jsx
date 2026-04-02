import { useState, useEffect } from 'react'

const MONO = { fontFamily: 'var(--font-mono)' }
const SERIF = { fontFamily: 'var(--font-cormorant)' }
const DISPLAY = { fontFamily: 'var(--font-playfair)' }

function labelStyle() {
  return {
    ...MONO,
    fontSize: '10px',
    letterSpacing: '2px',
    textTransform: 'uppercase',
    color: 'var(--gold)',
    display: 'block',
    marginBottom: '6px',
  }
}

function inputStyle(hasError) {
  return {
    display: 'block',
    width: '100%',
    boxSizing: 'border-box',
    background: 'var(--stage)',
    border: hasError ? '1px solid var(--ember)' : '1px solid var(--char)',
    color: 'var(--cream)',
    ...MONO,
    fontSize: '13px',
    letterSpacing: '0.5px',
    padding: '10px 14px',
    outline: 'none',
  }
}

function ErrorMsg({ msg }) {
  if (!msg) return null
  return (
    <div style={{
      background: 'rgba(201,75,26,0.08)',
      border: '1px solid rgba(201,75,26,0.3)',
      padding: '8px 12px',
      marginTop: '8px',
      ...MONO,
      fontSize: '11px',
      color: 'var(--ember-glow)',
      letterSpacing: '0.5px',
    }}>
      {msg}
    </div>
  )
}

function SuccessMsg({ msg }) {
  if (!msg) return null
  return (
    <div style={{
      background: 'rgba(42,140,42,0.08)',
      border: '1px solid rgba(42,140,42,0.3)',
      padding: '8px 12px',
      marginTop: '8px',
      ...MONO,
      fontSize: '11px',
      color: '#6ecf6e',
      letterSpacing: '0.5px',
    }}>
      {msg}
    </div>
  )
}

// ─── Create User Form ─────────────────────────────────────────────────────────

function CreateUserForm({ token, onCreated }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()
      if (res.ok) {
        setUsername('')
        setPassword('')
        onCreated(data.user)
      } else {
        setError(data.error)
      }
    } catch {
      setError('Network error. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{
      background: 'var(--smoke)',
      border: '1px solid var(--char)',
      borderLeft: '3px solid var(--ember)',
      padding: '28px',
      marginBottom: '40px',
    }}>
      <div style={{
        ...MONO, fontSize: '10px', letterSpacing: '3px',
        textTransform: 'uppercase', color: 'var(--ember)', marginBottom: '20px',
      }}>
        Create New User
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div>
          <label style={labelStyle()}>Username</label>
          <input
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            placeholder="username"
            autoComplete="off"
            style={inputStyle(false)}
          />
        </div>
        <div>
          <label style={labelStyle()}>Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="min 8 characters"
            autoComplete="new-password"
            style={inputStyle(false)}
          />
        </div>
      </div>

      <ErrorMsg msg={error} />

      <button
        type="submit"
        disabled={loading || !username || !password}
        style={{
          marginTop: '16px',
          background: loading || !username || !password ? 'rgba(201,75,26,0.4)' : 'var(--ember)',
          border: 'none',
          color: 'var(--cream)',
          ...MONO, fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase',
          padding: '11px 24px',
          cursor: loading || !username || !password ? 'default' : 'pointer',
        }}
      >
        {loading ? 'Creating...' : 'Create User'}
      </button>
    </form>
  )
}

// ─── User Row ─────────────────────────────────────────────────────────────────

function UserRow({ user, token, currentUserId, onUpdated, onDeleted }) {
  const [mode, setMode] = useState(null) // null | 'username' | 'password' | 'delete'
  const [value, setValue] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const isSelf = user.id === currentUserId

  const close = () => { setMode(null); setValue(''); setConfirm(''); setError(''); setSuccess('') }

  const changeUsername = async (e) => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      const res = await fetch(`/api/admin/users/${user.id}/username`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ username: value }),
      })
      const data = await res.json()
      if (res.ok) { onUpdated(data.user); close() }
      else setError(data.error)
    } catch { setError('Network error.') }
    finally { setLoading(false) }
  }

  const changePassword = async (e) => {
    e.preventDefault()
    if (value !== confirm) { setError('Passwords do not match.'); return }
    setError(''); setLoading(true)
    try {
      const res = await fetch(`/api/admin/users/${user.id}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ password: value }),
      })
      const data = await res.json()
      if (res.ok) { setSuccess('Password updated.'); setTimeout(close, 1500) }
      else setError(data.error)
    } catch { setError('Network error.') }
    finally { setLoading(false) }
  }

  const deleteUser = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/users/${user.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (res.ok) onDeleted(user.id)
      else setError(data.error)
    } catch { setError('Network error.') }
    finally { setLoading(false) }
  }

  const fmt = (iso) => new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

  const actionBtnStyle = (color) => ({
    background: 'none',
    border: `1px solid ${color}`,
    color: color,
    ...MONO, fontSize: '9px', letterSpacing: '1.5px', textTransform: 'uppercase',
    padding: '5px 10px', cursor: 'pointer',
  })

  return (
    <div style={{
      border: '1px solid var(--char)',
      borderLeft: `3px solid ${isSelf ? 'var(--gold)' : 'var(--char)'}`,
      marginBottom: '8px',
    }}>
      {/* Main row */}
      <div style={{
        padding: '16px 24px',
        display: 'flex', alignItems: 'center', gap: '20px',
      }}>
        {/* Username */}
        <div style={{ flex: 1 }}>
          <div style={{
            ...DISPLAY, fontWeight: 700, fontSize: '1rem', color: 'var(--cream)',
          }}>
            {user.username}
          </div>
          <div style={{
            ...MONO, fontSize: '10px', letterSpacing: '0.5px',
            color: 'var(--bone)', opacity: 0.5, marginTop: '2px',
          }}>
            ID #{user.id} · Created {fmt(user.created_at)}
          </div>
        </div>

        {/* You badge */}
        {isSelf && (
          <div style={{
            ...MONO, fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase',
            color: 'var(--gold)', background: 'rgba(201,149,42,0.1)',
            border: '1px solid rgba(201,149,42,0.25)', padding: '3px 8px',
          }}>
            You
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            style={actionBtnStyle('var(--bone)')}
            onClick={() => mode === 'username' ? close() : (setMode('username'), setError(''), setSuccess(''))}
          >
            Rename
          </button>
          <button
            style={actionBtnStyle('var(--gold)')}
            onClick={() => mode === 'password' ? close() : (setMode('password'), setError(''), setSuccess(''))}
          >
            Password
          </button>
          {!isSelf && (
            <button
              style={actionBtnStyle('var(--ember)')}
              onClick={() => mode === 'delete' ? close() : (setMode('delete'), setError(''))}
            >
              Delete
            </button>
          )}
        </div>
      </div>

      {/* Inline forms */}
      {mode === 'username' && (
        <form onSubmit={changeUsername} style={{
          borderTop: '1px solid var(--char)', padding: '20px 24px',
          background: 'rgba(255,255,255,0.02)',
        }}>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle()}>New Username</label>
              <input
                type="text" value={value} onChange={e => setValue(e.target.value)}
                placeholder="new username" autoFocus autoComplete="off"
                style={inputStyle(!!error)}
              />
            </div>
            <button
              type="submit" disabled={loading || !value}
              style={{
                background: 'var(--ember)', border: 'none', color: 'var(--cream)',
                ...MONO, fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase',
                padding: '10px 20px', cursor: loading || !value ? 'default' : 'pointer',
                opacity: loading || !value ? 0.5 : 1, flexShrink: 0,
              }}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
            <button type="button" onClick={close} style={{
              background: 'none', border: '1px solid var(--char)', color: 'var(--bone)',
              ...MONO, fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase',
              padding: '10px 16px', cursor: 'pointer', flexShrink: 0,
            }}>
              Cancel
            </button>
          </div>
          <ErrorMsg msg={error} />
        </form>
      )}

      {mode === 'password' && (
        <form onSubmit={changePassword} style={{
          borderTop: '1px solid var(--char)', padding: '20px 24px',
          background: 'rgba(255,255,255,0.02)',
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={labelStyle()}>New Password</label>
              <input
                type="password" value={value} onChange={e => setValue(e.target.value)}
                placeholder="min 8 characters" autoFocus autoComplete="new-password"
                style={inputStyle(!!error)}
              />
            </div>
            <div>
              <label style={labelStyle()}>Confirm Password</label>
              <input
                type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                placeholder="repeat password" autoComplete="new-password"
                style={inputStyle(!!error && value !== confirm)}
              />
            </div>
          </div>
          <SuccessMsg msg={success} />
          <ErrorMsg msg={error} />
          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
            <button
              type="submit" disabled={loading || !value || !confirm}
              style={{
                background: 'var(--gold)', border: 'none', color: 'var(--stage)',
                ...MONO, fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase',
                padding: '10px 20px', cursor: loading || !value || !confirm ? 'default' : 'pointer',
                opacity: loading || !value || !confirm ? 0.5 : 1,
              }}
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
            <button type="button" onClick={close} style={{
              background: 'none', border: '1px solid var(--char)', color: 'var(--bone)',
              ...MONO, fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase',
              padding: '10px 16px', cursor: 'pointer',
            }}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {mode === 'delete' && (
        <div style={{
          borderTop: '1px solid var(--char)', padding: '20px 24px',
          background: 'rgba(201,75,26,0.04)',
        }}>
          <div style={{
            ...MONO, fontSize: '11px', letterSpacing: '0.5px',
            color: 'var(--bone)', marginBottom: '14px',
          }}>
            Delete <span style={{ color: 'var(--cream)' }}>{user.username}</span>? This will also invalidate all their sessions. This cannot be undone.
          </div>
          <ErrorMsg msg={error} />
          <div style={{ display: 'flex', gap: '8px', marginTop: error ? '12px' : '0' }}>
            <button
              onClick={deleteUser} disabled={loading}
              style={{
                background: 'var(--ember)', border: 'none', color: 'var(--cream)',
                ...MONO, fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase',
                padding: '10px 20px', cursor: loading ? 'wait' : 'pointer',
              }}
            >
              {loading ? 'Deleting...' : 'Confirm Delete'}
            </button>
            <button onClick={close} style={{
              background: 'none', border: '1px solid var(--char)', color: 'var(--bone)',
              ...MONO, fontSize: '10px', letterSpacing: '1px', textTransform: 'uppercase',
              padding: '10px 16px', cursor: 'pointer',
            }}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Users Viewer (exported) ──────────────────────────────────────────────────

export default function AdminUsers({ token, currentUserId }) {
  const [users, setUsers] = useState([])
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { setUsers(data.users || []); setStatus('ready') })
      .catch(() => setStatus('error'))
  }, [token])

  const handleCreated = (user) => setUsers(prev => [...prev, user])
  const handleUpdated = (updated) => setUsers(prev => prev.map(u => u.id === updated.id ? updated : u))
  const handleDeleted = (id) => setUsers(prev => prev.filter(u => u.id !== id))

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{
          ...MONO, fontSize: '9px', letterSpacing: '3px',
          textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '10px',
        }}>
          Access Control
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px' }}>
          <h1 style={{
            ...DISPLAY, fontWeight: 900,
            fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', color: 'var(--cream)',
            lineHeight: 1.1, letterSpacing: '-0.3px', margin: 0,
          }}>
            Users
          </h1>
          {status === 'ready' && (
            <span style={{ ...MONO, fontSize: '11px', letterSpacing: '1px', color: 'var(--bone)', opacity: 0.5 }}>
              {users.length} {users.length === 1 ? 'account' : 'accounts'}
            </span>
          )}
        </div>
        <div style={{ height: '1px', background: 'linear-gradient(90deg, var(--char), transparent)', marginTop: '24px' }} />
      </div>

      <CreateUserForm token={token} onCreated={handleCreated} />

      {status === 'loading' && (
        <div style={{ ...MONO, fontSize: '11px', letterSpacing: '2px', color: 'var(--bone)', opacity: 0.4, textTransform: 'uppercase' }}>
          Loading...
        </div>
      )}

      {status === 'error' && (
        <div style={{
          ...MONO, fontSize: '11px', color: 'var(--ember)',
          background: 'rgba(201,75,26,0.08)', border: '1px solid rgba(201,75,26,0.3)', padding: '16px',
        }}>
          Failed to load users.
        </div>
      )}

      {status === 'ready' && users.map(user => (
        <UserRow
          key={user.id}
          user={user}
          token={token}
          currentUserId={currentUserId}
          onUpdated={handleUpdated}
          onDeleted={handleDeleted}
        />
      ))}
    </div>
  )
}
