import { theme } from '../styles/theme'

export default function OffersPage({ activeOffers }) {
  return (
    <div style={{ padding: '24px 16px', paddingBottom: 90 }}>

      <div className="serif fade-up" style={{ fontSize: 34, color: theme.gold, marginBottom: 4 }}>Offers</div>
      <div className="fade-up-2" style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', marginBottom: 24 }}>
        Exclusive deals, just for you
      </div>

      {activeOffers.length > 0
        ? activeOffers.map((o, i) => (
          <div
            key={o.id}
            className="offer-card fade-up"
            style={{ animationDelay: `${i * 0.1}s`, borderLeft: `4px solid ${o.color}` }}
          >
            <div style={{ fontSize: 36, marginBottom: 12 }}>🎁</div>
            <div className="serif" style={{ fontSize: 26, color: theme.gold, marginBottom: 6 }}>{o.title}</div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 18, lineHeight: 1.6 }}>{o.desc}</div>
            <div style={{
              background: 'rgba(197,160,89,0.08)',
              border: `1px dashed ${theme.border}`,
              borderRadius: 10,
              padding: '12px 18px',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', letterSpacing: 1, textTransform: 'uppercase' }}>
                Promo Code
              </span>
              <span style={{ color: theme.gold, fontWeight: 600, letterSpacing: 3, fontSize: 15 }}>
                {o.code}
              </span>
            </div>
          </div>
        ))
        : (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'rgba(255,255,255,0.25)' }}>
            <div style={{ fontSize: 48, marginBottom: 14 }}>🌿</div>
            <div style={{ fontSize: 16 }}>No active offers right now</div>
            <div style={{ fontSize: 13, marginTop: 6 }}>Check back soon</div>
          </div>
        )
      }
    </div>
  )
}
