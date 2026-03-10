import { useState } from 'react'
import { PRODUCTS, FAMILIES } from '../data/products'
import ProductCard from '../components/ProductCard'
import { theme } from '../styles/theme'

export default function ShopPage({ onAddToCart, onViewProduct }) {
  const [filter, setFilter] = useState('all')

  const filtered = filter === 'all'
    ? PRODUCTS
    : PRODUCTS.filter(p => p.family === filter)

  return (
    <div style={{ padding: '24px 16px', paddingBottom: 90 }}>

      {/* Header */}
      <div className="serif fade-up" style={{ fontSize: 34, color: theme.gold, marginBottom: 4 }}>
        Collection
      </div>
      <div className="fade-up-2" style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 20 }}>
        {PRODUCTS.length} fragrances
      </div>

      {/* Family filter pills */}
      <div className="scroll-row" style={{ marginBottom: 20 }}>
        {FAMILIES.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              whiteSpace: 'nowrap',
              padding: '8px 18px',
              borderRadius: 99,
              border: `1px solid ${filter === f ? theme.gold : theme.border}`,
              background: filter === f ? 'rgba(197,160,89,0.15)' : 'transparent',
              color: filter === f ? theme.gold : 'rgba(255,255,255,0.45)',
              cursor: 'pointer',
              fontFamily: "'Jost',sans-serif",
              fontSize: 12,
              letterSpacing: 0.5,
              textTransform: 'capitalize',
              transition: 'all .2s',
              flexShrink: 0,
            }}
          >
            {f === 'all' ? 'All' : f}
          </button>
        ))}
      </div>

      {/* Product grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        {filtered.map((p, i) => (
          <ProductCard key={p.id} product={p} delay={i * 0.06} onView={onViewProduct} onAddToCart={onAddToCart} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'rgba(255,255,255,0.3)' }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>🌿</div>
          <div>No fragrances found</div>
        </div>
      )}
    </div>
  )
}
