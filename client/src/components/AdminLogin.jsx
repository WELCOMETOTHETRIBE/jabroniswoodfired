import { useState } from 'react'
import { useIsMobile } from '../hooks/useIsMobile.js'

export default function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [status, setStatus] = useState('idle')
  const isMobile = useIsMobile()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!username.trim() || !password.trim()) {
      setError('Username and password are required.')
      return
    }
    setStatus('loading')
    setError('')
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })
      const data = await res.json()
      if (res.ok && data.token) {
        onLogin({ token: data.token, userId: data.userId })
      } else {
        setStatus('error')
        setError(data.error || 'Invalid credentials.')
      }
    } catch {
      setStatus('error')
      setError('Unable to reach the server. Check your connection.')
    }
  }

  const isLoading = status === 'loading'

  const clearError = () => {
    if (error) setError('')
    if (status === 'error') setStatus('idle')
  }

  const inputStyle = (hasError) => ({
    display: 'block',
    width: '100%',
    boxSizing: 'border-box',
    background: 'var(--stage)',
    border: hasError ? '1px solid var(--ember)' : '1px solid var(--char)',
    color: 'var(--cream)',
    fontFamily: 'var(--font-mono)',
    fontSize: '14px',
    letterSpacing: '1px',
    padding: '13px 16px',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    opacity: isLoading ? 0.6 : 1,
    WebkitAppearance: 'none',
  })

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--stage)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: isMobile ? '24px 20px' : '48px 24px',
    }}>
      {/* Ambient glow */}
      <div style={{
        position: 'fixed',
        top: '30%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px', height: '400px',
        background: 'radial-gradient(ellipse at center, rgba(201, 75, 26, 0.07) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      <div style={{
        position: 'relative', zIndex: 1,
        width: '100%',
        maxWidth: isMobile ? '100%' : '400px',
      }}>
        {/* Wordmark */}
        <div style={{ textAlign: 'center', marginBottom: isMobile ? '32px' : '48px' }}>
          <div style={{
            fontFamily: 'var(--font-playfair)',
            fontSize: isMobile ? '2.2rem' : '2.8rem',
            fontWeight: 900,
            color: 'var(--cream)',
            letterSpacing: '-0.5px',
            lineHeight: 1,
            marginBottom: '8px',
          }}>
            Jabroni's
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '4px',
            color: 'var(--gold)',
            textTransform: 'uppercase',
            marginBottom: '20px',
          }}>
            Wood Fired
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--char)' }} />
            <div style={{ width: '6px', height: '6px', background: 'var(--ember)', transform: 'rotate(45deg)', flexShrink: 0 }} />
            <div style={{ flex: 1, height: '1px', background: 'var(--char)' }} />
          </div>

          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '4px',
            color: 'var(--bone)',
            textTransform: 'uppercase',
            opacity: 0.6,
          }}>
            Staff Access
          </div>
        </div>

        {/* Login card */}
        <div style={{
          background: 'var(--smoke)',
          border: '1px solid var(--char)',
          padding: isMobile ? '24px 20px' : '40px',
        }}>
          <form onSubmit={handleSubmit} noValidate>
            {/* Username */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{
                display: 'block',
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: 'var(--gold)',
                marginBottom: '8px',
              }}>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => { setUsername(e.target.value); clearError() }}
                placeholder="username"
                autoFocus={!isMobile}
                autoComplete="username"
                autoCapitalize="none"
                disabled={isLoading}
                style={inputStyle(!!error)}
                onFocus={(e) => { if (!error) e.target.style.borderColor = 'var(--gold)' }}
                onBlur={(e)  => { if (!error) e.target.style.borderColor = 'var(--char)' }}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                color: 'var(--gold)',
                marginBottom: '8px',
              }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); clearError() }}
                placeholder="••••••••"
                autoComplete="current-password"
                disabled={isLoading}
                style={inputStyle(!!error)}
                onFocus={(e) => { if (!error) e.target.style.borderColor = 'var(--gold)' }}
                onBlur={(e)  => { if (!error) e.target.style.borderColor = 'var(--char)' }}
              />
            </div>

            {/* Error */}
            {error && (
              <div style={{
                background: 'rgba(201, 75, 26, 0.08)',
                border: '1px solid rgba(201, 75, 26, 0.4)',
                padding: '10px 14px',
                marginBottom: '16px',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '0.5px',
                color: 'var(--ember-glow)',
                lineHeight: 1.5,
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                background: isLoading ? 'rgba(201, 75, 26, 0.5)' : 'var(--ember)',
                border: 'none',
                color: 'var(--cream)',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                padding: isMobile ? '18px' : '16px',
                cursor: isLoading ? 'wait' : 'pointer',
                transition: 'background 0.2s ease',
                WebkitAppearance: 'none',
              }}
              onMouseEnter={(e) => { if (!isLoading) e.target.style.background = 'var(--ember-glow)' }}
              onMouseLeave={(e) => { if (!isLoading) e.target.style.background = 'var(--ember)' }}
            >
              {isLoading ? 'Checking...' : 'Enter'}
            </button>
          </form>
        </div>

        <div style={{
          textAlign: 'center',
          marginTop: '24px',
          fontFamily: 'var(--font-mono)',
          fontSize: '9px',
          letterSpacing: '2px',
          color: 'var(--bone)',
          opacity: 0.3,
          textTransform: 'uppercase',
        }}>
          Internal use only — Jabroni's Wood Fired
        </div>
      </div>
    </div>
  )
}
