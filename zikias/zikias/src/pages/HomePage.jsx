import { PRODUCTS } from '../data/products'
import { config } from '../data/config'
import ProductCard from '../components/ProductCard'
import { theme } from '../styles/theme'

export default function HomePage({ onShop, onFinder, onAddToCart, onViewProduct, activeOffers }) {
  return (
    <div style={{ paddingBottom: 90 }}>

      {/* ── HERO ── */}
      <div style={{
        background: `linear-gradient(160deg, ${theme.bgDark} 0%, ${theme.bg} 65%)`,
        padding: '64px 24px 44px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Radial glow */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 0%, rgba(197,160,89,0.09) 0%, transparent 65%)', pointerEvents: 'none' }} />

        <div className="fade-up" style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 12, letterSpacing: 8, color: theme.gold, textTransform: 'uppercase', marginBottom: 10 }}>
          {config.brandSlogan}
        </div>
        <div className="fade-up-2" style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 72, fontWeight: 300, color: theme.gold, lineHeight: 1, letterSpacing: 6 }}>
          ZKS
        </div>
        <div className="fade-up-2" style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, fontWeight: 300, color: theme.white, letterSpacing: 14, marginTop: 4, marginBottom: 4 }}>
          ILLUSION
        </div>
        <div className="fade-up-3" style={{ width: 36, height: 1, background: theme.gold, margin: '18px auto', opacity: 0.4 }} />
        <div className="fade-up-3" style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', letterSpacing: 0.5, fontStyle: 'italic', marginBottom: 34 }}>
          {config.brandTagline}
        </div>
        <div className="fade-up-4" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn-gold" style={{ padding: '13px 28px', fontSize: 13 }} onClick={onShop}>
            Explore Collection
          </button>
          <button className="btn-outline" style={{ padding: '13px 28px', fontSize: 13 }} onClick={onFinder}>
            Find Your Scent
          </button>
        </div>
      </div>

      {/* ── ACTIVE OFFERS STRIP ── */}
      {activeOffers.length > 0 && (
        <div style={{ padding: '0 16px', marginTop: 24 }}>
          <div className="section-divider">
            <span className="serif" style={{ color: theme.gold, fontSize: 18, whiteSpace: 'nowrap' }}>Current Offers</span>
          </div>
          <div className="scroll-row">
            {activeOffers.map(offer => (
              <div key={offer.id} style={{
                minWidth: 220,
                background: `linear-gradient(135deg, ${theme.bgCard}, ${theme.bgDark})`,
                border: `1px solid ${theme.border}`,
                borderLeft: `3px solid ${offer.color}`,
                borderRadius: 16,
                padding: '16px 18px',
                flexShrink: 0,
              }}>
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, color: theme.gold }}>{offer.title}</div>
                <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 4, lineHeight: 1.4 }}>{offer.desc}</div>
                <div style={{ marginTop: 10, fontSize: 11, color: theme.goldDark, letterSpacing: 1, background: 'rgba(197,160,89,0.1)', borderRadius: 6, padding: '4px 10px', display: 'inline-block' }}>
                  USE: {offer.code}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── BESTSELLERS GRID ── */}
      <div style={{ padding: '0 16px', marginTop: activeOffers.length ? 8 : 24 }}>
        <div className="section-divider">
          <span className="serif" style={{ color: theme.gold, fontSize: 18, whiteSpace: 'nowrap' }}>Bestsellers</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
          {PRODUCTS.slice(0, 4).map((p, i) => (
            <ProductCard key={p.id} product={p} delay={i * 0.08} onView={onViewProduct} onAddToCart={onAddToCart} />
          ))}
        </div>
        <button
          className="btn-outline"
          style={{ width: '100%', padding: '13px', fontSize: 13, marginTop: 14 }}
          onClick={onShop}
        >
          View Full Collection →
        </button>
      </div>

      {/* ── FINDER TEASER ── */}
      <div style={{ margin: '24px 16px 0', background: `linear-gradient(135deg, ${theme.bgCard}, ${theme.bgDark})`, border: `1px solid ${theme.border}`, borderRadius: 20, padding: '24px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: 34, marginBottom: 10 }}>🧪</div>
        <div className="serif" style={{ fontSize: 22, color: theme.gold, marginBottom: 6 }}>
          Not sure which scent?
        </div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 18, lineHeight: 1.5 }}>
          Take our 4-step quiz and discover your perfect fragrance
        </div>
        <button className="btn-gold" style={{ padding: '12px 28px', fontSize: 13 }} onClick={onFinder}>
          Start Quiz →
        </button>
      </div>

      {/* ── SOCIAL LINKS ── */}
      <div style={{ padding: '28px 16px 0', textAlign: 'center' }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', letterSpacing: 2, marginBottom: 16, textTransform: 'uppercase' }}>
          Follow Zikias
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 20 }}>
          {[
            ['📸', 'Instagram', config.socials.instagram],
            ['📘', 'Facebook',  config.socials.facebook],
            ['🎵', 'TikTok',    config.socials.tiktok],
          ].map(([icon, label, href]) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, textDecoration: 'none', color: 'rgba(255,255,255,0.45)', fontSize: 11, letterSpacing: 0.5 }}
            >
              <div style={{ width: 46, height: 46, background: theme.whiteAlpha, border: `1px solid ${theme.border}`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>
                {icon}
              </div>
              {label}
            </a>
          ))}
        </div>
      </div>

    </div>
  )
}
