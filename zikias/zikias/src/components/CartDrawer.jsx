import { useState } from 'react'
import Icon from './Icon'
import { theme } from '../styles/theme'
import { openWhatsApp } from '../utils/whatsapp'
import { config } from '../data/config'

export default function CartDrawer({ cart, onClose, onUpdateQty, onRemove, cartTotal }) {
  const [view, setView]       = useState('cart')   // 'cart' | 'checkout' | 'success'
  const [loading, setLoading] = useState(false)
  const [form, setForm]       = useState({ name: '', phone: '', address: '', notes: '' })

  const handleField = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const placeOrder = () => {
    if (!form.name || !form.phone || !form.address) {
      alert('Please fill in Name, Phone, and Address.')
      return
    }
    setLoading(true)
    setTimeout(() => {
      openWhatsApp(cart, form)
      setLoading(false)
      setView('success')
    }, 800)
  }

  return (
    <>
      <div className="overlay" onClick={onClose} />
      <div className="drawer">

        {/* Header */}
        <div style={{
          padding: '20px 20px 16px',
          borderBottom: `1px solid ${theme.border}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexShrink: 0,
        }}>
          <div className="serif" style={{ fontSize: 22, color: theme.gold }}>
            {{ cart: 'Your Cart', checkout: 'Checkout', success: 'Order Placed!' }[view]}
          </div>
          <button
            onClick={onClose}
            style={{
              background: theme.whiteAlpha, border: 'none', borderRadius: '50%',
              width: 36, height: 36,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: theme.white,
            }}
            aria-label="Close"
          >
            <Icon name="x" size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>

          {/* ── CART VIEW ── */}
          {view === 'cart' && (
            cart.length === 0
              ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.3)' }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>🌿</div>
                  <div>Your cart is empty</div>
                  <div style={{ fontSize: 12, marginTop: 6 }}>Browse the collection and add items</div>
                </div>
              )
              : cart.map(item => (
                <div key={item.id} style={{
                  display: 'flex', gap: 12, alignItems: 'center',
                  marginBottom: 14,
                  background: theme.whiteAlpha,
                  borderRadius: 14, padding: '12px',
                }}>
                  <div style={{ fontSize: 32, flexShrink: 0 }}>{item.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div className="serif" style={{ fontSize: 15, color: theme.white }}>{item.name}</div>
                    <div style={{ fontSize: 12, color: theme.gold }}>
                      {config.currency} {(item.price * item.qty).toLocaleString()}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <button
                      onClick={() => onUpdateQty(item.id, -1)}
                      style={{ background: theme.whiteAlpha, border: 'none', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: theme.white }}
                    >
                      <Icon name="minus" size={14} />
                    </button>
                    <span style={{ fontSize: 14, minWidth: 16, textAlign: 'center' }}>{item.qty}</span>
                    <button
                      onClick={() => onUpdateQty(item.id, 1)}
                      style={{ background: theme.whiteAlpha, border: 'none', borderRadius: '50%', width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: theme.white }}
                    >
                      <Icon name="plus" size={14} />
                    </button>
                  </div>
                </div>
              ))
          )}

          {/* ── CHECKOUT VIEW ── */}
          {view === 'checkout' && (
            <div>
              {[
                ['Full Name *',        'name',    'text'],
                ['Phone Number *',     'phone',   'tel' ],
                ['Delivery Address *', 'address', 'text'],
                ['Order Notes',        'notes',   'text'],
              ].map(([label, key, type]) => (
                <div key={key} style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginBottom: 6, letterSpacing: .5 }}>
                    {label}
                  </div>
                  <input
                    className="zk-input"
                    type={type}
                    placeholder={label.replace(' *', '')}
                    value={form[key]}
                    onChange={e => handleField(key, e.target.value)}
                  />
                </div>
              ))}

              {/* Order summary */}
              <div style={{ background: theme.whiteAlpha, borderRadius: 14, padding: '14px', marginTop: 8 }}>
                {cart.map(i => (
                  <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>
                    <span>{i.name} × {i.qty}</span>
                    <span>{config.currency} {(i.price * i.qty).toLocaleString()}</span>
                  </div>
                ))}
                <div style={{ borderTop: `1px solid ${theme.border}`, paddingTop: 10, display: 'flex', justifyContent: 'space-between', fontWeight: 600, color: theme.gold }}>
                  <span>Total</span>
                  <span>{config.currency} {cartTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* ── SUCCESS VIEW ── */}
          {view === 'success' && (
            <div style={{ textAlign: 'center', padding: '48px 20px' }}>
              <div style={{ width: 72, height: 72, background: 'rgba(37,211,102,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, margin: '0 auto 20px' }}>
                ✅
              </div>
              <div className="serif" style={{ fontSize: 26, color: theme.gold, marginBottom: 10 }}>
                Order Sent!
              </div>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>
                Your order has been sent via WhatsApp.<br />We'll confirm shortly.
              </div>
            </div>
          )}
        </div>

        {/* Footer CTA */}
        <div style={{ padding: '16px 20px', borderTop: `1px solid ${theme.border}`, flexShrink: 0 }}>
          {view === 'cart' && cart.length > 0 && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14, color: theme.gold, fontSize: 16, fontWeight: 500 }}>
                <span>Total</span>
                <span>{config.currency} {cartTotal.toLocaleString()}</span>
              </div>
              <button className="btn-gold" style={{ width: '100%', padding: '14px', fontSize: 14 }} onClick={() => setView('checkout')}>
                Proceed to Checkout
              </button>
            </>
          )}

          {view === 'checkout' && (
            <button
              className="btn-gold"
              style={{ width: '100%', padding: '14px', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}
              onClick={placeOrder}
            >
              {loading
                ? <span className="spinner" />
                : <>📲 Place Order via WhatsApp</>
              }
            </button>
          )}

          {view === 'success' && (
            <button className="btn-gold" style={{ width: '100%', padding: '14px', fontSize: 14 }} onClick={onClose}>
              Continue Shopping
            </button>
          )}
        </div>
      </div>
    </>
  )
}
