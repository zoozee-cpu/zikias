import Icon from './Icon'
import { theme } from '../styles/theme'

export default function TopBar({ cartCount, onCartOpen }) {
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: `${theme.bgDark}ee`,
      backdropFilter: 'blur(12px)',
      borderBottom: `1px solid ${theme.border}`,
      padding: '14px 20px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      maxWidth: 480, margin: '0 auto',
    }}>
      {/* Brand mark */}
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: theme.gold, letterSpacing: 4 }}>
        ZKS
      </div>

      {/* Wordmark */}
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 12, letterSpacing: 8, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase' }}>
        Illusion
      </div>

      {/* Cart button */}
      <button
        onClick={onCartOpen}
        style={{
          position: 'relative',
          background: theme.whiteAlpha,
          border: `1px solid ${theme.border}`,
          borderRadius: '50%',
          width: 40, height: 40,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', color: theme.white,
        }}
        aria-label="Open cart"
      >
        <Icon name="shop" size={18} />
        {cartCount > 0 && (
          <span className="nav-badge">{cartCount}</span>
        )}
      </button>
    </div>
  )
}
