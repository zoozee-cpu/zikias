import { useState } from 'react'
import Icon from './Icon'
import { theme } from '../styles/theme'

export default function ProductDetail({ product, onClose, onAddToCart }) {
  const [added, setAdded] = useState(false)

  const handleAdd = () => {
    onAddToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <>
      <div className="overlay" onClick={onClose} />
      <div className="modal" style={{ paddingBottom: 32 }}>

        {/* Hero emoji */}
        <div style={{
          background: `radial-gradient(circle at 40% 30%, rgba(197,160,89,0.1), transparent 60%), ${theme.bgDark}`,
          height: 200,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 90,
          position: 'relative',
        }}>
          {product.emoji}
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: 16, right: 16,
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

        <div style={{ padding: '20px 20px 0' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
            <div>
              <span className="tag">{product.tag}</span>
              <div className="serif" style={{ fontSize: 28, color: theme.white, marginTop: 6 }}>
                {product.name}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: theme.gold, fontSize: 22, fontWeight: 500 }}>
                PKR {product.price.toLocaleString()}
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{product.size}</div>
            </div>
          </div>

          <div className="stars" style={{ marginBottom: 10 }}>★★★★★</div>

          {/* Description */}
          {product.description && (
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, marginBottom: 20, fontStyle: 'italic' }}>
              {product.description}
            </p>
          )}

          {/* Fragrance pyramid */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, letterSpacing: 2, color: theme.goldDark, textTransform: 'uppercase', marginBottom: 14 }}>
              Fragrance Pyramid
            </div>
            {[
              ['Top Notes',   product.notes.top,   '75%'],
              ['Heart Notes', product.notes.heart, '55%'],
              ['Base Notes',  product.notes.base,  '40%'],
            ].map(([label, notes, width]) => (
              <div key={label} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
                  <span style={{ color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 1 }}>{label}</span>
                  <span style={{ color: theme.white, fontSize: 13 }}>{notes}</span>
                </div>
                <div style={{ height: 2, background: 'rgba(255,255,255,0.06)', borderRadius: 99 }}>
                  <div className="note-bar" style={{ width }} />
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <button
            className="btn-gold"
            style={{ width: '100%', padding: '15px', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}
            onClick={handleAdd}
          >
            {added
              ? <><Icon name="check" size={16} color={theme.bgDark} /> Added to Cart!</>
              : 'Add to Cart'
            }
          </button>
        </div>
      </div>
    </>
  )
}
