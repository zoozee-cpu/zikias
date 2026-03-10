import { useState } from 'react'
import { PRODUCTS } from '../data/products'
import { config } from '../data/config'
import Icon from '../components/Icon'
import { theme } from '../styles/theme'

const EMPTY_OFFER = { title: '', desc: '', code: '' }

export default function AdminPage({ offers, onToggle, onAdd, onRemove }) {
  const [authed,    setAuthed]    = useState(false)
  const [pin,       setPin]       = useState('')
  const [pinError,  setPinError]  = useState(false)
  const [tab,       setTab]       = useState('offers')
  const [newOffer,  setNewOffer]  = useState(EMPTY_OFFER)

  const handleLogin = () => {
    if (pin === config.adminPin) { setAuthed(true); setPinError(false) }
    else { setPinError(true); setPin('') }
  }

  const handleAdd = () => {
    if (!newOffer.title.trim()) return
    onAdd(newOffer)
    setNewOffer(EMPTY_OFFER)
  }

  /* ── PIN SCREEN ── */
  if (!authed) return (
    <div style={{ padding: '80px 32px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
      <div style={{ fontSize: 44, marginBottom: 4 }}>🔐</div>
      <div className="serif" style={{ fontSize: 28, color: theme.gold }}>Admin Panel</div>
      <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 8, textAlign: 'center' }}>
        Enter your PIN to manage products and offers
      </div>
      <input
        className="zk-input"
        type="password"
        placeholder="Enter PIN"
        value={pin}
        onChange={e => { setPin(e.target.value); setPinError(false) }}
        onKeyDown={e => e.key === 'Enter' && handleLogin()}
        style={{ maxWidth: 240, textAlign: 'center', letterSpacing: 8, fontSize: 20 }}
        autoFocus
      />
      {pinError && (
        <div style={{ color: '#ff6b6b', fontSize: 13 }}>Incorrect PIN. Try again.</div>
      )}
      <button className="btn-gold" style={{ padding: '12px 36px', fontSize: 14 }} onClick={handleLogin}>
        Enter
      </button>
      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', marginTop: 4 }}>
        Default PIN: 1234 (change in src/data/config.js)
      </div>
    </div>
  )

  /* ── ADMIN DASHBOARD ── */
  return (
    <div style={{ padding: '24px 16px', paddingBottom: 90 }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
        <div className="serif" style={{ fontSize: 30, color: theme.gold }}>Admin</div>
        <button className="btn-outline" style={{ padding: '7px 16px', fontSize: 12 }} onClick={() => setAuthed(false)}>
          Logout
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 22 }}>
        {['offers', 'products'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '9px 22px', borderRadius: 99,
              border: `1px solid ${tab === t ? theme.gold : theme.border}`,
              background: tab === t ? 'rgba(197,160,89,0.15)' : 'transparent',
              color: tab === t ? theme.gold : 'rgba(255,255,255,0.4)',
              cursor: 'pointer', fontFamily: "'Jost',sans-serif", fontSize: 13,
              textTransform: 'capitalize', transition: 'all .2s',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* ── OFFERS TAB ── */}
      {tab === 'offers' && (
        <>
          <div style={{ marginBottom: 20 }}>
            {offers.length === 0 && (
              <div style={{ textAlign: 'center', padding: '32px 0', color: 'rgba(255,255,255,0.3)', fontSize: 14 }}>
                No offers yet. Add one below.
              </div>
            )}
            {offers.map(o => (
              <div key={o.id} className="admin-row" style={{ marginBottom: 10 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, color: theme.white }}>{o.title}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>
                    {o.desc} · <span style={{ color: theme.goldDark }}>{o.code}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexShrink: 0 }}>
                  <button
                    className={`toggle ${o.active ? 'on' : ''}`}
                    onClick={() => onToggle(o.id)}
                    aria-label="Toggle offer"
                  />
                  <button
                    onClick={() => onRemove(o.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.3)', padding: 4 }}
                    aria-label="Delete offer"
                  >
                    <Icon name="trash" size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add new offer form */}
          <div style={{ background: theme.whiteAlpha, border: `1px solid ${theme.border}`, borderRadius: 16, padding: '18px' }}>
            <div style={{ fontSize: 11, letterSpacing: 1.5, color: theme.goldDark, textTransform: 'uppercase', marginBottom: 14 }}>
              Add New Offer
            </div>
            {[
              ['Offer Title',    'title', 'text'],
              ['Description',    'desc',  'text'],
              ['Promo Code',     'code',  'text'],
            ].map(([label, key, type]) => (
              <div key={key} style={{ marginBottom: 10 }}>
                <input
                  className="zk-input"
                  type={type}
                  placeholder={label}
                  value={newOffer[key]}
                  onChange={e => setNewOffer(f => ({ ...f, [key]: e.target.value }))}
                />
              </div>
            ))}
            <button className="btn-gold" style={{ width: '100%', padding: '12px', fontSize: 13, marginTop: 4 }} onClick={handleAdd}>
              + Add Offer
            </button>
          </div>
        </>
      )}

      {/* ── PRODUCTS TAB ── */}
      {tab === 'products' && (
        <div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 16, lineHeight: 1.5 }}>
            To edit products, update <code style={{ color: theme.gold, background: 'rgba(197,160,89,0.1)', padding: '2px 6px', borderRadius: 4 }}>src/data/products.js</code>
          </div>
          {PRODUCTS.map(p => (
            <div key={p.id} className="admin-row" style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', flex: 1 }}>
                <span style={{ fontSize: 28 }}>{p.emoji}</span>
                <div>
                  <div style={{ fontSize: 14, color: theme.white }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2, textTransform: 'capitalize' }}>
                    {p.family} · {p.size}
                  </div>
                </div>
              </div>
              <div style={{ color: theme.gold, fontSize: 14, fontWeight: 500, flexShrink: 0 }}>
                {config.currency} {p.price.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
