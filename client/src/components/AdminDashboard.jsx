import { useState, useEffect } from 'react'
import { cookbookData } from '../data/recipes.js'
import AdminUsers from './AdminUsers.jsx'
import AdminInventory from './AdminInventory.jsx'
import { useIsMobile } from '../hooks/useIsMobile.js'

// ─── Sidebar Nav Item (desktop) ─────────────────────────────────────────────

function SidebarItem({ label, active, disabled, sublabel, onClick }) {
  return (
    <div
      onClick={disabled ? undefined : onClick}
      style={{
        padding: '12px 20px',
        borderLeft: active ? '2px solid var(--ember)' : '2px solid transparent',
        background: active ? 'rgba(201, 75, 26, 0.08)' : 'transparent',
        cursor: disabled ? 'default' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        transition: 'background 0.15s ease',
        marginBottom: '2px',
      }}
    >
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: '10px',
        letterSpacing: '2px',
        textTransform: 'uppercase',
        color: active ? 'var(--cream)' : 'var(--bone)',
      }}>
        {label}
      </div>
      {sublabel && (
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '9px',
          letterSpacing: '1px',
          color: 'var(--bone)',
          opacity: 0.5,
          marginTop: '3px',
        }}>
          {sublabel}
        </div>
      )}
    </div>
  )
}

// ─── Bottom Tab Bar (mobile) ─────────────────────────────────────────────────

const TABS = [
  { id: 'cookbook',   label: 'Cook' },
  { id: 'inquiries',  label: 'Leads' },
  { id: 'inventory',  label: 'Stock' },
  { id: 'users',      label: 'Users' },
]

function BottomNav({ activeTab, setActiveTab, onLogout }) {
  return (
    <nav style={{
      position: 'fixed',
      bottom: 0, left: 0, right: 0,
      zIndex: 100,
      height: '60px',
      background: 'rgba(10, 9, 7, 0.98)',
      borderTop: '1px solid var(--char)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'stretch',
    }}>
      {TABS.map(tab => {
        const active = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px',
              padding: '0',
              borderTop: active ? '2px solid var(--ember)' : '2px solid transparent',
              transition: 'border-color 0.15s ease',
            }}
          >
            <div style={{
              width: '6px', height: '6px',
              borderRadius: '50%',
              background: active ? 'var(--ember)' : 'transparent',
              transition: 'background 0.15s ease',
            }} />
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '9px',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              color: active ? 'var(--cream)' : 'var(--bone)',
              opacity: active ? 1 : 0.5,
            }}>
              {tab.label}
            </span>
          </button>
        )
      })}
      {/* Logout tab */}
      <button
        onClick={onLogout}
        style={{
          flex: 1,
          background: 'none',
          border: 'none',
          borderTop: '2px solid transparent',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '4px',
          padding: '0',
        }}
      >
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'transparent' }} />
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '9px',
          letterSpacing: '1.5px',
          textTransform: 'uppercase',
          color: 'var(--bone)',
          opacity: 0.4,
        }}>
          Exit
        </span>
      </button>
    </nav>
  )
}

// ─── Ingredient Row ──────────────────────────────────────────────────────────

function IngredientRow({ item, amount, index }) {
  const isSectionHeader = !amount && item.startsWith('—')
  if (isSectionHeader) {
    return (
      <tr>
        <td colSpan={2} style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '9px',
          letterSpacing: '2px',
          color: 'var(--gold)',
          textTransform: 'uppercase',
          padding: '12px 12px 6px',
        }}>
          {item.replace(/—/g, '').trim()}
        </td>
      </tr>
    )
  }
  return (
    <tr style={{ background: index % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
      <td style={{
        padding: '8px 12px',
        fontFamily: 'var(--font-cormorant)',
        fontSize: '0.95rem',
        color: 'var(--bone)',
        borderBottom: '1px solid rgba(61, 53, 48, 0.5)',
        lineHeight: 1.4,
      }}>
        {item}
      </td>
      <td style={{
        padding: '8px 12px',
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
        letterSpacing: '0.5px',
        color: 'var(--cream)',
        borderBottom: '1px solid rgba(61, 53, 48, 0.5)',
        textAlign: 'right',
        whiteSpace: 'nowrap',
      }}>
        {amount}
      </td>
    </tr>
  )
}

// ─── Recipe Card ─────────────────────────────────────────────────────────────

function RecipeCard({ recipe, partColor, isExpanded, onToggle, isMobile }) {
  return (
    <div style={{
      border: '1px solid var(--char)',
      borderLeft: `3px solid ${isExpanded ? partColor : 'var(--char)'}`,
      marginBottom: '8px',
      transition: 'border-color 0.2s ease',
      background: isExpanded ? 'rgba(255,255,255,0.02)' : 'transparent',
    }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: isMobile ? '14px 16px' : '20px 24px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: isMobile ? '12px' : '20px',
          textAlign: 'left',
        }}
      >
        {/* Number */}
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          letterSpacing: '2px',
          color: partColor,
          flexShrink: 0,
          width: '24px',
          paddingTop: '2px',
        }}>
          {recipe.number}
        </div>

        {/* Name + subtitle */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: 'var(--font-playfair)',
            fontWeight: 700,
            fontSize: isMobile ? '1rem' : '1.05rem',
            color: 'var(--cream)',
            lineHeight: 1.2,
            marginBottom: '3px',
          }}>
            {recipe.name}
          </div>
          <div style={{
            fontFamily: 'var(--font-cormorant)',
            fontSize: '0.9rem',
            fontStyle: 'italic',
            color: 'var(--bone)',
            opacity: 0.7,
          }}>
            {recipe.subtitle}
          </div>
          {/* Yield shown inline on mobile (below subtitle) */}
          {isMobile && recipe.yield && (
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '9px',
              letterSpacing: '1px',
              color: 'var(--gold)',
              opacity: 0.7,
              marginTop: '4px',
              lineHeight: 1.4,
            }}>
              {recipe.yield}
            </div>
          )}
        </div>

        {/* Yield tag — desktop only */}
        {!isMobile && recipe.yield && (
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '9px',
            letterSpacing: '1px',
            color: 'var(--gold)',
            flexShrink: 0,
            maxWidth: '160px',
            textAlign: 'right',
            lineHeight: 1.4,
          }}>
            {recipe.yield}
          </div>
        )}

        <div style={{
          flexShrink: 0,
          color: 'var(--bone)',
          opacity: 0.4,
          fontSize: '12px',
          marginLeft: '4px',
          paddingTop: '2px',
          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.2s ease',
        }}>
          ▾
        </div>
      </button>

      {isExpanded && (
        <div style={{ borderTop: '1px solid var(--char)', padding: isMobile ? '0 16px 24px' : '0 24px 28px' }}>
          {recipe.ingredients && recipe.ingredients.length > 0 && (
            <div style={{ marginTop: '20px', marginBottom: '24px' }}>
              <div style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                color: partColor,
                marginBottom: '10px',
              }}>
                Ingredients
              </div>
              {/* Scrollable table wrapper on mobile */}
              <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                <table style={{ width: '100%', minWidth: isMobile ? '280px' : 'auto', borderCollapse: 'collapse', border: '1px solid var(--char)' }}>
                  <thead>
                    <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                      <th style={{
                        fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '2px',
                        textTransform: 'uppercase', color: 'var(--gold)', padding: '8px 12px',
                        textAlign: 'left', borderBottom: '1px solid var(--char)', fontWeight: 400,
                      }}>Item</th>
                      <th style={{
                        fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '2px',
                        textTransform: 'uppercase', color: 'var(--gold)', padding: '8px 12px',
                        textAlign: 'right', borderBottom: '1px solid var(--char)', fontWeight: 400,
                      }}>Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recipe.ingredients.map((ing, i) => (
                      <IngredientRow key={i} item={ing.item} amount={ing.amount} index={i} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {recipe.method && recipe.method.length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '3px',
                textTransform: 'uppercase', color: partColor, marginBottom: '14px',
              }}>
                Method
              </div>
              <ol style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                {recipe.method.map((step, i) => (
                  <li key={i} style={{ display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'flex-start' }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '1px',
                      color: partColor, opacity: 0.7, flexShrink: 0, paddingTop: '3px', minWidth: '20px',
                    }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-cormorant)', fontSize: isMobile ? '1rem' : '1rem',
                      color: 'var(--bone)', lineHeight: 1.65,
                    }}>
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {recipe.note && (
            <div style={{ borderLeft: '2px solid var(--char)', paddingLeft: '14px', marginTop: '8px' }}>
              <div style={{
                fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '2px',
                textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '6px',
              }}>
                {recipe.wood ? 'Fire Note' : 'Note'}
              </div>
              <p style={{
                fontFamily: 'var(--font-cormorant)', fontSize: '1rem', fontStyle: 'italic',
                color: 'var(--bone)', lineHeight: 1.6, margin: 0,
              }}>
                {recipe.note}
              </p>
              {recipe.wood && (
                <p style={{
                  fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '1px',
                  color: partColor, opacity: 0.8, marginTop: '6px', marginBottom: 0,
                }}>
                  Wood: {recipe.wood}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Cookbook Viewer ─────────────────────────────────────────────────────────

function CookbookViewer({ isMobile }) {
  const [expandedId, setExpandedId] = useState(null)
  const handleToggle = (id) => setExpandedId(prev => prev === id ? null : id)

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '3px',
          textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '8px',
        }}>
          Internal Reference
        </div>
        <h1 style={{
          fontFamily: 'var(--font-playfair)', fontWeight: 900,
          fontSize: isMobile ? '1.8rem' : 'clamp(1.6rem, 3vw, 2.4rem)',
          color: 'var(--cream)', lineHeight: 1.1, letterSpacing: '-0.3px', marginBottom: '6px',
        }}>
          The Recipe Playbook
        </h1>
        <p style={{
          fontFamily: 'var(--font-cormorant)', fontSize: '1rem',
          fontStyle: 'italic', color: 'var(--bone)', opacity: 0.7,
        }}>
          Old World Fire. New World Smoke.
        </p>
        <div style={{ height: '1px', background: 'linear-gradient(90deg, var(--char), transparent)', marginTop: '20px' }} />
      </div>

      {cookbookData.map((part) => (
        <div key={part.part} style={{ marginBottom: isMobile ? '32px' : '48px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: isMobile ? '20px' : '28px' }}>
            <div style={{ height: '2px', width: '24px', background: part.color, flexShrink: 0 }} />
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '2px',
              textTransform: 'uppercase', color: part.color, flexShrink: 0,
            }}>
              {part.part}
            </div>
            <div style={{ flex: 1, height: '1px', background: 'var(--char)' }} />
          </div>

          {part.sections.map((section) => (
            <div key={section.title} style={{ marginBottom: '24px' }}>
              <div style={{
                fontFamily: 'var(--font-playfair)', fontWeight: 700,
                fontSize: isMobile ? '1rem' : '1.1rem',
                fontStyle: 'italic', color: 'var(--cream)', opacity: 0.5,
                marginBottom: '12px', paddingBottom: '10px', borderBottom: '1px solid var(--char)',
              }}>
                {section.title}
              </div>
              {section.recipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  partColor={part.color}
                  isExpanded={expandedId === recipe.id}
                  onToggle={() => handleToggle(recipe.id)}
                  isMobile={isMobile}
                />
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

// ─── Inquiries Viewer ─────────────────────────────────────────────────────────

function InquiriesViewer({ token, isMobile }) {
  const [inquiries, setInquiries] = useState([])
  const [status, setStatus] = useState('loading')
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    fetch('/api/admin/inquiries', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json())
      .then(data => { setInquiries(data.inquiries || []); setStatus('ready') })
      .catch(() => setStatus('error'))
  }, [token])

  const fmt = (iso) => {
    const d = new Date(iso)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
      ' · ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  }

  const fmtShort = (iso) => {
    const d = new Date(iso)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div>
      <div style={{ marginBottom: '32px' }}>
        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '3px',
          textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '8px',
        }}>
          Booking Leads
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
          <h1 style={{
            fontFamily: 'var(--font-playfair)', fontWeight: 900,
            fontSize: isMobile ? '1.8rem' : 'clamp(1.6rem, 3vw, 2.4rem)',
            color: 'var(--cream)', lineHeight: 1.1, letterSpacing: '-0.3px', margin: 0,
          }}>
            Inquiries
          </h1>
          {status === 'ready' && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--bone)', opacity: 0.5 }}>
              {inquiries.length} total
            </span>
          )}
        </div>
        <div style={{ height: '1px', background: 'linear-gradient(90deg, var(--char), transparent)', marginTop: '20px' }} />
      </div>

      {status === 'loading' && (
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '2px', color: 'var(--bone)', opacity: 0.4, textTransform: 'uppercase' }}>
          Loading...
        </div>
      )}

      {status === 'error' && (
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--ember)', background: 'rgba(201,75,26,0.08)', border: '1px solid rgba(201,75,26,0.3)', padding: '16px' }}>
          Failed to load inquiries.
        </div>
      )}

      {status === 'ready' && inquiries.length === 0 && (
        <div style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.1rem', fontStyle: 'italic', color: 'var(--bone)', opacity: 0.4 }}>
          No inquiries yet. The first one will appear here.
        </div>
      )}

      {status === 'ready' && inquiries.length > 0 && (
        <div>
          {inquiries.map((inq) => {
            const isOpen = expanded === inq.id
            return (
              <div
                key={inq.id}
                style={{
                  border: '1px solid var(--char)',
                  borderLeft: `3px solid ${isOpen ? 'var(--ember)' : 'var(--char)'}`,
                  marginBottom: '8px',
                  background: isOpen ? 'rgba(255,255,255,0.02)' : 'transparent',
                  transition: 'border-color 0.2s ease',
                }}
              >
                <button
                  onClick={() => setExpanded(isOpen ? null : inq.id)}
                  style={{
                    width: '100%', background: 'none', border: 'none', cursor: 'pointer',
                    padding: isMobile ? '14px 16px' : '18px 24px',
                    display: 'flex', alignItems: 'center',
                    gap: isMobile ? '10px' : '16px', textAlign: 'left',
                  }}
                >
                  {/* Type badge */}
                  <div style={{
                    fontFamily: 'var(--font-mono)', fontSize: '8px', letterSpacing: '1px',
                    textTransform: 'uppercase', color: 'var(--ember)',
                    background: 'rgba(201,75,26,0.1)', border: '1px solid rgba(201,75,26,0.25)',
                    padding: '3px 7px', flexShrink: 0, whiteSpace: 'nowrap',
                  }}>
                    {isMobile ? inq.type.split(' ')[0] : inq.type}
                  </div>

                  {/* Name */}
                  <div style={{
                    fontFamily: 'var(--font-playfair)', fontWeight: 700,
                    fontSize: isMobile ? '0.95rem' : '1rem',
                    color: 'var(--cream)', flexShrink: 0,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    maxWidth: isMobile ? '120px' : 'none',
                  }}>
                    {inq.first_name} {inq.last_name}
                  </div>

                  {/* Email — hidden on mobile */}
                  {!isMobile && (
                    <div style={{
                      fontFamily: 'var(--font-mono)', fontSize: '11px',
                      color: 'var(--bone)', opacity: 0.6, flex: 1, minWidth: 0,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {inq.email}
                    </div>
                  )}

                  {/* Date */}
                  <div style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: isMobile ? '9px' : '10px',
                    color: 'var(--gold)', flexShrink: 0, whiteSpace: 'nowrap',
                    marginLeft: isMobile ? 'auto' : '0',
                  }}>
                    {isMobile ? fmtShort(inq.created_at) : fmt(inq.created_at)}
                  </div>

                  <div style={{
                    flexShrink: 0, color: 'var(--bone)', opacity: 0.4, fontSize: '12px',
                    transform: isOpen ? 'rotate(180deg)' : 'none',
                    transition: 'transform 0.2s ease',
                  }}>
                    ▾
                  </div>
                </button>

                {isOpen && (
                  <div style={{ borderTop: '1px solid var(--char)', padding: isMobile ? '16px' : '24px' }}>
                    {/* Email shown in expanded on mobile */}
                    {isMobile && (
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '4px' }}>Email</div>
                        <div style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1rem', color: 'var(--bone)', wordBreak: 'break-all' }}>{inq.email}</div>
                      </div>
                    )}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                      gap: isMobile ? '12px' : '16px 32px',
                      marginBottom: '16px',
                    }}>
                      {[
                        ['Phone', inq.phone || '—'],
                        ['Guests', inq.guests || '—'],
                        ['Date & Location', inq.date_location || '—'],
                        ['Submitted', fmt(inq.created_at)],
                      ].map(([label, value]) => (
                        <div key={label}>
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '4px' }}>
                            {label}
                          </div>
                          <div style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1rem', color: 'var(--bone)', lineHeight: 1.4 }}>
                            {value}
                          </div>
                        </div>
                      ))}
                    </div>

                    {inq.message && (
                      <div style={{ marginBottom: '16px' }}>
                        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: '8px' }}>
                          Message
                        </div>
                        <p style={{ fontFamily: 'var(--font-cormorant)', fontSize: '1.05rem', color: 'var(--bone)', lineHeight: 1.7, margin: 0, whiteSpace: 'pre-wrap' }}>
                          {inq.message}
                        </p>
                      </div>
                    )}

                    <a
                      href={`mailto:${inq.email}?subject=Re: Your Jabroni's Inquiry`}
                      style={{
                        fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '2px',
                        textTransform: 'uppercase', color: 'var(--cream)',
                        background: 'var(--ember)', padding: isMobile ? '12px 0' : '10px 20px',
                        textDecoration: 'none',
                        display: isMobile ? 'block' : 'inline-block',
                        textAlign: isMobile ? 'center' : 'left',
                      }}
                    >
                      Reply via Email
                    </a>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function AdminDashboard({ onLogout, token, currentUserId }) {
  const [activeTab, setActiveTab] = useState('cookbook')
  const isMobile = useIsMobile()

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
    } catch { /* ignore */ }
    onLogout()
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--stage)', display: 'flex', flexDirection: 'column' }}>

      {/* Header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(15, 13, 11, 0.97)',
        borderBottom: '1px solid var(--char)',
        backdropFilter: 'blur(8px)',
        height: isMobile ? '52px' : '60px',
        display: 'flex', alignItems: 'center',
        padding: isMobile ? '0 16px' : '0 24px',
        gap: '16px',
      }}>
        <div style={{
          fontFamily: 'var(--font-playfair)', fontWeight: 900,
          fontSize: isMobile ? '1.2rem' : '1.4rem',
          color: 'var(--cream)', letterSpacing: '-0.3px', flex: 1,
        }}>
          Jabroni's
        </div>

        <div style={{
          fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '3px',
          textTransform: 'uppercase', color: 'var(--gold)',
          background: 'rgba(201, 149, 42, 0.1)', border: '1px solid rgba(201, 149, 42, 0.3)',
          padding: isMobile ? '4px 8px' : '5px 12px',
        }}>
          Admin
        </div>

        {/* Logout — desktop only (mobile uses bottom nav) */}
        {!isMobile && (
          <button
            onClick={handleLogout}
            style={{
              background: 'none', border: '1px solid var(--char)', color: 'var(--bone)',
              fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '2px',
              textTransform: 'uppercase', padding: '7px 14px', cursor: 'pointer',
              transition: 'border-color 0.2s ease, color 0.2s ease',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--ember)'; e.currentTarget.style.color = 'var(--ember-glow)' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--char)'; e.currentTarget.style.color = 'var(--bone)' }}
          >
            Logout
          </button>
        )}
      </header>

      {/* Body */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>

        {/* Sidebar — desktop only */}
        {!isMobile && (
          <aside style={{
            width: '200px', flexShrink: 0,
            borderRight: '1px solid var(--char)',
            background: 'var(--smoke)',
            paddingTop: '24px', paddingBottom: '24px',
          }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: '9px', letterSpacing: '2px',
              textTransform: 'uppercase', color: 'var(--bone)', opacity: 0.4,
              padding: '0 20px 12px',
            }}>
              Navigation
            </div>
            <SidebarItem label="Cookbook"   active={activeTab === 'cookbook'}   onClick={() => setActiveTab('cookbook')} />
            <SidebarItem label="Inquiries"  active={activeTab === 'inquiries'}  onClick={() => setActiveTab('inquiries')} />
            <SidebarItem label="Inventory"  active={activeTab === 'inventory'}  onClick={() => setActiveTab('inventory')} />
            <SidebarItem label="Users"      active={activeTab === 'users'}      onClick={() => setActiveTab('users')} />
            <SidebarItem label="Marketing"  disabled sublabel="coming soon" />
            <SidebarItem label="Pricing"    disabled sublabel="coming soon" />
          </aside>
        )}

        {/* Main content */}
        <main style={{
          flex: 1,
          overflowY: 'auto',
          padding: isMobile ? '20px 16px' : '40px 48px',
          paddingBottom: isMobile ? '80px' : '40px',
          minWidth: 0,
        }}>
          <div style={{ maxWidth: isMobile ? 'none' : '900px' }}>
            {activeTab === 'cookbook'   && <CookbookViewer isMobile={isMobile} />}
            {activeTab === 'inquiries'  && <InquiriesViewer token={token} isMobile={isMobile} />}
            {activeTab === 'inventory'  && <AdminInventory token={token} />}
            {activeTab === 'users'      && <AdminUsers token={token} currentUserId={currentUserId} />}
          </div>
        </main>
      </div>

      {/* Mobile bottom nav */}
      {isMobile && (
        <BottomNav
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogout={handleLogout}
        />
      )}
    </div>
  )
}
