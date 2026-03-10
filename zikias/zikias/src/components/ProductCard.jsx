import { theme } from '../styles/theme'

export default function ProductCard({ product, onView, onAddToCart, delay = 0 }) {
  return (
    <div
      className="product-card fade-up"
      style={{ animationDelay: `${delay}s` }}
      onClick={() => onView(product)}
    >
      {/* Visual */}
      <div style={{
        background: `radial-gradient(circle at 35% 30%, rgba(197,160,89,0.12), transparent 65%), ${theme.bgDark}`,
        height: 120,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 50,
        position: 'relative',
      }}>
        {product.emoji}
        <span className="tag" style={{ position: 'absolute', top: 8, right: 8, fontSize: 9 }}>
          {product.tag}
        </span>
      </div>

      {/* Info */}
      <div style={{ padding: '12px 13px 14px' }}>
        <div
          className="serif"
          style={{ fontSize: 16, color: theme.white, lineHeight: 1.2, marginBottom: 4 }}
        >
          {product.name}
        </div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 8, textTransform: 'capitalize' }}>
          {product.family} · {product.size}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: theme.gold, fontSize: 14, fontWeight: 500 }}>
            PKR {product.price.toLocaleString()}
          </span>
          <button
            className="btn-gold"
            style={{ padding: '6px 12px', fontSize: 11 }}
            onClick={e => { e.stopPropagation(); onAddToCart(product) }}
          >
            + Add
          </button>
        </div>
      </div>
    </div>
  )
}
