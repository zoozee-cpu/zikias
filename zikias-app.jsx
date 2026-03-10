import { useState, useEffect, useRef } from "react";

// ── DATA ──────────────────────────────────────────────────────────────────────
const OWNER_WHATSAPP = "923001234567"; // ← change to real number

const PRODUCTS = [
  { id: 1, name: "Illusion Noir", family: "woody", mood: "mysterious", occasion: "evening", intensity: "intense", price: 4500, size: "50ml", notes: { top: "Black Pepper, Bergamot", heart: "Oud, Sandalwood", base: "Amber, Musk" }, tag: "Bestseller", emoji: "🖤" },
  { id: 2, name: "Forest Whisper", family: "green", mood: "calm", occasion: "daily", intensity: "light", price: 3800, size: "50ml", notes: { top: "Green Tea, Mint", heart: "Cedar, Vetiver", base: "Oakmoss, Earth" }, tag: "New", emoji: "🌿" },
  { id: 3, name: "Golden Dusk", family: "oriental", mood: "romantic", occasion: "evening", intensity: "rich", price: 5200, size: "50ml", notes: { top: "Saffron, Rose", heart: "Jasmine, Patchouli", base: "Vanilla, Benzoin" }, tag: "Luxury", emoji: "✨" },
  { id: 4, name: "Citrus Mirage", family: "citrus", mood: "energetic", occasion: "daily", intensity: "light", price: 3200, size: "50ml", notes: { top: "Lemon, Grapefruit", heart: "Neroli, White Tea", base: "Musk, Cedarwood" }, tag: "Fresh", emoji: "🍋" },
  { id: 5, name: "Velvet Oud", family: "woody", mood: "confident", occasion: "special", intensity: "intense", price: 6800, size: "75ml", notes: { top: "Cardamom, Elemi", heart: "Oud, Rose", base: "Leather, Amber" }, tag: "Signature", emoji: "🌹" },
  { id: 6, name: "Aqua Libre", family: "aquatic", mood: "calm", occasion: "daily", intensity: "light", price: 3500, size: "50ml", notes: { top: "Sea Salt, Cucumber", heart: "Water Lily, Iris", base: "Driftwood, White Musk" }, tag: "Cool", emoji: "💧" },
];

const INITIAL_OFFERS = [
  { id: 1, title: "Eid Special", desc: "20% off all Oud fragrances", code: "EID20", active: true, color: "#C5A059" },
  { id: 2, title: "Buy 2 Get 1", desc: "On selected 50ml bottles", code: "B2G1", active: true, color: "#9F814D" },
];

const QUIZ_STEPS = [
  { key: "mood", label: "Your mood today?", options: ["mysterious", "romantic", "calm", "energetic", "confident"] },
  { key: "occasion", label: "Wearing it for?", options: ["daily", "evening", "special"] },
  { key: "family", label: "Scent preference?", options: ["woody", "citrus", "oriental", "green", "aquatic"] },
  { key: "intensity", label: "How bold?", options: ["light", "rich", "intense"] },
];

// ── UTILS ─────────────────────────────────────────────────────────────────────
function formatOrder(cart, customer) {
  const items = cart.map(i => `• ${i.name} x${i.qty} = PKR ${(i.price * i.qty).toLocaleString()}`).join("\n");
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  return `🌿 *New Zikias Order*\n\n*Customer:* ${customer.name}\n*Phone:* ${customer.phone}\n*Address:* ${customer.address}\n\n*Items:*\n${items}\n\n*Total: PKR ${total.toLocaleString()}*\n\n_Notes: ${customer.notes || "None"}_`;
}

function recommend(answers) {
  return PRODUCTS
    .map(p => ({
      ...p,
      score: [p.mood === answers.mood, p.occasion === answers.occasion, p.family === answers.family, p.intensity === answers.intensity].filter(Boolean).length
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}

// ── STYLES ────────────────────────────────────────────────────────────────────
const G = {
  bg: "#1B4242",
  bgDark: "#122e2e",
  bgCard: "#1f4d4d",
  gold: "#C5A059",
  goldDark: "#9F814D",
  white: "#FFFFFF",
  whiteAlpha: "rgba(255,255,255,0.08)",
  border: "rgba(197,160,89,0.25)",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
  body { background: ${G.bg}; color: ${G.white}; font-family: 'Jost', sans-serif; min-height: 100vh; overflow-x: hidden; }
  :root { --gold: ${G.gold}; --gold-dark: ${G.goldDark}; --bg: ${G.bg}; }
  
  .serif { font-family: 'Cormorant Garamond', serif; }
  
  @keyframes fadeUp { from { opacity:0; transform:translateY(24px); } to { opacity:1; transform:translateY(0); } }
  @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
  @keyframes shimmer { 0%,100%{opacity:.6} 50%{opacity:1} }
  @keyframes slideInRight { from{transform:translateX(100%)} to{transform:translateX(0)} }
  @keyframes slideInUp { from{transform:translateY(100%);opacity:0} to{transform:translateY(0);opacity:1} }
  @keyframes pulse { 0%,100%{box-shadow:0 0 0 0 rgba(197,160,89,0.4)} 70%{box-shadow:0 0 0 10px rgba(197,160,89,0)} }
  @keyframes spin { to{transform:rotate(360deg)} }
  
  .fade-up { animation: fadeUp 0.6s ease forwards; }
  .fade-up-2 { animation: fadeUp 0.6s 0.15s ease both; }
  .fade-up-3 { animation: fadeUp 0.6s 0.3s ease both; }
  .fade-up-4 { animation: fadeUp 0.6s 0.45s ease both; }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: ${G.bgDark}; }
  ::-webkit-scrollbar-thumb { background: ${G.goldDark}; border-radius: 2px; }

  /* Bottom nav */
  .bottom-nav { position:fixed; bottom:0; left:0; right:0; background:${G.bgDark}; border-top:1px solid ${G.border}; display:flex; justify-content:space-around; padding:10px 0 max(10px, env(safe-area-inset-bottom)); z-index:100; backdrop-filter:blur(12px); }
  .nav-btn { display:flex; flex-direction:column; align-items:center; gap:3px; background:none; border:none; color:rgba(255,255,255,0.45); cursor:pointer; font-family:'Jost',sans-serif; font-size:10px; letter-spacing:.5px; padding:4px 16px; transition:color .2s; }
  .nav-btn.active { color:${G.gold}; }
  .nav-badge { background:${G.gold}; color:${G.bgDark}; font-size:9px; font-weight:700; border-radius:99px; min-width:16px; height:16px; display:flex; align-items:center; justify-content:center; position:absolute; top:-4px; right:-4px; }

  /* Cards */
  .product-card { background:${G.bgCard}; border:1px solid ${G.border}; border-radius:16px; overflow:hidden; transition:transform .2s, box-shadow .2s; cursor:pointer; }
  .product-card:active { transform:scale(0.97); }
  
  /* Buttons */
  .btn-gold { background:linear-gradient(135deg,${G.gold},${G.goldDark}); color:${G.bgDark}; border:none; border-radius:99px; font-family:'Jost',sans-serif; font-weight:500; cursor:pointer; letter-spacing:.5px; transition:opacity .2s, transform .15s; }
  .btn-gold:active { transform:scale(0.97); opacity:.9; }
  .btn-outline { background:transparent; color:${G.gold}; border:1px solid ${G.border}; border-radius:99px; font-family:'Jost',sans-serif; cursor:pointer; letter-spacing:.5px; transition:all .2s; }
  .btn-outline:active { background:${G.whiteAlpha}; }

  /* Input */
  .zk-input { background:${G.whiteAlpha}; border:1px solid ${G.border}; border-radius:12px; color:${G.white}; font-family:'Jost',sans-serif; font-size:15px; padding:13px 16px; width:100%; outline:none; transition:border-color .2s; }
  .zk-input:focus { border-color:${G.gold}; }
  .zk-input::placeholder { color:rgba(255,255,255,0.35); }

  /* Drawer overlay */
  .overlay { position:fixed; inset:0; background:rgba(0,0,0,0.6); z-index:200; animation:fadeIn .2s ease; backdrop-filter:blur(4px); }
  .drawer { position:fixed; right:0; top:0; bottom:0; width:min(360px,100vw); background:${G.bgDark}; z-index:201; animation:slideInRight .3s ease; display:flex; flex-direction:column; }
  .modal { position:fixed; bottom:0; left:0; right:0; background:${G.bgDark}; z-index:201; animation:slideInUp .3s ease; border-radius:24px 24px 0 0; max-height:90vh; overflow-y:auto; }

  /* Tag chip */
  .tag { display:inline-block; background:rgba(197,160,89,0.15); color:${G.gold}; border:1px solid ${G.border}; border-radius:99px; font-size:10px; letter-spacing:.8px; padding:2px 10px; text-transform:uppercase; }

  /* WhatsApp FAB */
  .wa-fab { position:fixed; bottom:76px; right:16px; width:52px; height:52px; background:#25D366; border-radius:50%; display:flex; align-items:center; justify-content:center; z-index:99; box-shadow:0 4px 20px rgba(37,211,102,0.4); animation:pulse 2s infinite; cursor:pointer; border:none; }

  /* Grain overlay */
  .grain::after { content:''; position:fixed; inset:0; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E"); pointer-events:none; z-index:1000; }

  /* Section header */
  .section-divider { display:flex; align-items:center; gap:12px; margin:24px 0 16px; }
  .section-divider::before,.section-divider::after { content:''; flex:1; height:1px; background:${G.border}; }

  /* Quiz option */
  .quiz-opt { background:${G.whiteAlpha}; border:1px solid ${G.border}; border-radius:12px; padding:12px 18px; cursor:pointer; text-align:center; font-family:'Jost',sans-serif; font-size:14px; letter-spacing:.3px; transition:all .2s; color:${G.white}; text-transform:capitalize; }
  .quiz-opt.selected,.quiz-opt:active { background:rgba(197,160,89,0.2); border-color:${G.gold}; color:${G.gold}; }

  /* Admin */
  .admin-row { display:flex; align-items:center; justify-content:space-between; background:${G.whiteAlpha}; border:1px solid ${G.border}; border-radius:12px; padding:14px 16px; }
  .toggle { width:44px; height:24px; background:#333; border-radius:99px; position:relative; cursor:pointer; border:none; transition:background .2s; }
  .toggle.on { background:${G.goldDark}; }
  .toggle::after { content:''; position:absolute; top:3px; left:3px; width:18px; height:18px; background:white; border-radius:50%; transition:transform .2s; }
  .toggle.on::after { transform:translateX(20px); }

  /* Stars */
  .stars { color:${G.gold}; letter-spacing:-2px; }

  /* Fragrance notes bar */
  .note-bar { height:3px; border-radius:99px; background:linear-gradient(90deg,${G.gold},${G.goldDark}); margin-top:4px; }
`;

// ── ICONS (inline SVG) ────────────────────────────────────────────────────────
const Icon = ({ name, size = 22, color = "currentColor" }) => {
  const icons = {
    home: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>,
    shop: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 001.99-1.74L23 6H6"/></svg>,
    sparkle: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><path d="M12 2l2.4 7.2H22l-6.2 4.5 2.4 7.3L12 17l-6.2 4 2.4-7.3L2 9.2h7.6L12 2z"/></svg>,
    tag2: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
    user: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    x: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    plus: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    minus: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    arrow: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>,
    edit: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    trash: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>,
  };
  return icons[name] || null;
};

// ── PRODUCT EMOJI BG ──────────────────────────────────────────────────────────
const ProductVisual = ({ product, size = 120 }) => (
  <div style={{ width: size, height: size, display: "flex", alignItems: "center", justifyContent: "center", background: `radial-gradient(circle at 40% 40%, rgba(197,160,89,0.15), transparent 70%), ${G.bgDark}`, borderRadius: "50%", fontSize: size * 0.42, userSelect: "none" }}>
    {product.emoji}
  </div>
);

// ── HOME PAGE ─────────────────────────────────────────────────────────────────
function HomePage({ onShop, onFinder, cart, offers }) {
  return (
    <div style={{ paddingBottom: 80, minHeight: "100vh" }}>
      {/* Hero */}
      <div style={{ background: `linear-gradient(160deg, ${G.bgDark} 0%, ${G.bg} 60%)`, padding: "64px 24px 40px", textAlign: "center", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 0%, rgba(197,160,89,0.08) 0%, transparent 60%)" }} />
        <div className="fade-up" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 14, letterSpacing: 8, color: G.gold, textTransform: "uppercase", marginBottom: 8 }}>Luxury Fragrances</div>
        <div className="fade-up-2" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 64, fontWeight: 300, color: G.gold, lineHeight: 1, letterSpacing: 4 }}>ZKS</div>
        <div className="fade-up-2" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 300, color: G.white, letterSpacing: 12, marginBottom: 6 }}>ILLUSION</div>
        <div className="fade-up-3" style={{ width: 40, height: 1, background: G.gold, margin: "16px auto", opacity: 0.5 }} />
        <div className="fade-up-3" style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", letterSpacing: 1, marginBottom: 32, fontStyle: "italic" }}>Where the forest meets gold</div>
        <div className="fade-up-4" style={{ display: "flex", gap: 12, justifyContent: "center" }}>
          <button className="btn-gold" style={{ padding: "13px 28px", fontSize: 13 }} onClick={onShop}>Explore Collection</button>
          <button className="btn-outline" style={{ padding: "13px 28px", fontSize: 13 }} onClick={onFinder}>Find Your Scent</button>
        </div>
      </div>

      {/* Active Offers */}
      {offers.filter(o => o.active).length > 0 && (
        <div style={{ padding: "0 16px", marginTop: 24 }}>
          <div className="section-divider"><span className="serif" style={{ color: G.gold, fontSize: 18, whiteSpace: "nowrap" }}>Current Offers</span></div>
          <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 4 }}>
            {offers.filter(o => o.active).map(offer => (
              <div key={offer.id} style={{ minWidth: 220, background: `linear-gradient(135deg, ${G.bgCard}, ${G.bgDark})`, border: `1px solid ${G.border}`, borderRadius: 16, padding: "16px 18px", borderLeft: `3px solid ${offer.color}` }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, color: G.gold }}>{offer.title}</div>
                <div style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", marginTop: 4 }}>{offer.desc}</div>
                <div style={{ marginTop: 10, fontSize: 11, color: G.goldDark, letterSpacing: 1, background: "rgba(197,160,89,0.1)", borderRadius: 6, padding: "4px 10px", display: "inline-block" }}>USE: {offer.code}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Featured */}
      <div style={{ padding: "0 16px", marginTop: 8 }}>
        <div className="section-divider"><span className="serif" style={{ color: G.gold, fontSize: 18, whiteSpace: "nowrap" }}>Bestsellers</span></div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {PRODUCTS.slice(0, 4).map((p, i) => (
            <MiniProductCard key={p.id} product={p} delay={i * 0.1} onShop={onShop} />
          ))}
        </div>
      </div>

      {/* Finder teaser */}
      <div style={{ margin: "24px 16px 0", background: `linear-gradient(135deg, ${G.bgCard}, ${G.bgDark})`, border: `1px solid ${G.border}`, borderRadius: 20, padding: "24px 20px", textAlign: "center" }}>
        <div style={{ fontSize: 32, marginBottom: 8 }}>🧪</div>
        <div className="serif" style={{ fontSize: 20, color: G.gold, marginBottom: 6 }}>Not sure which scent?</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", marginBottom: 16 }}>Take our 4-step quiz and discover your signature fragrance</div>
        <button className="btn-gold" style={{ padding: "12px 24px", fontSize: 13 }} onClick={onFinder}>Start Quiz →</button>
      </div>

      {/* Socials */}
      <div style={{ padding: "24px 16px 0", textAlign: "center" }}>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", letterSpacing: 2, marginBottom: 14, textTransform: "uppercase" }}>Follow Us</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
          {[["📸", "Instagram"], ["📘", "Facebook"], ["🎵", "TikTok"]].map(([icon, label]) => (
            <a key={label} href="#" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, textDecoration: "none", color: "rgba(255,255,255,0.5)", fontSize: 11, letterSpacing: .5 }}>
              <div style={{ width: 44, height: 44, background: G.whiteAlpha, border: `1px solid ${G.border}`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{icon}</div>
              {label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function MiniProductCard({ product, delay, onShop }) {
  return (
    <div className="product-card fade-up" style={{ animationDelay: `${delay}s` }} onClick={onShop}>
      <div style={{ background: `radial-gradient(circle at 40% 30%, rgba(197,160,89,0.1), transparent 60%), ${G.bgDark}`, display: "flex", alignItems: "center", justifyContent: "center", height: 110, fontSize: 44 }}>
        {product.emoji}
      </div>
      <div style={{ padding: "10px 12px 14px" }}>
        <div style={{ fontSize: 10, letterSpacing: 1, color: G.goldDark, textTransform: "uppercase", marginBottom: 3 }}>{product.tag}</div>
        <div className="serif" style={{ fontSize: 15, color: G.white, lineHeight: 1.2 }}>{product.name}</div>
        <div style={{ fontSize: 13, color: G.gold, marginTop: 6, fontWeight: 500 }}>PKR {product.price.toLocaleString()}</div>
      </div>
    </div>
  );
}

// ── SHOP PAGE ─────────────────────────────────────────────────────────────────
function ShopPage({ onAddToCart, onViewProduct }) {
  const [filter, setFilter] = useState("all");
  const families = ["all", ...new Set(PRODUCTS.map(p => p.family))];
  const filtered = filter === "all" ? PRODUCTS : PRODUCTS.filter(p => p.family === filter);

  return (
    <div style={{ padding: "24px 16px", paddingBottom: 90 }}>
      <div className="serif fade-up" style={{ fontSize: 32, color: G.gold, marginBottom: 4 }}>Collection</div>
      <div className="fade-up-2" style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 20 }}>{PRODUCTS.length} fragrances</div>

      {/* Filter pills */}
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 12, marginBottom: 16 }}>
        {families.map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ whiteSpace: "nowrap", padding: "7px 16px", borderRadius: 99, border: `1px solid ${filter === f ? G.gold : G.border}`, background: filter === f ? "rgba(197,160,89,0.15)" : "transparent", color: filter === f ? G.gold : "rgba(255,255,255,0.5)", cursor: "pointer", fontFamily: "'Jost',sans-serif", fontSize: 12, letterSpacing: .5, textTransform: "capitalize", transition: "all .2s" }}>
            {f}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {filtered.map((p, i) => (
          <div key={p.id} className="product-card fade-up" style={{ animationDelay: `${i * 0.07}s` }} onClick={() => onViewProduct(p)}>
            <div style={{ background: `radial-gradient(circle at 35% 30%, rgba(197,160,89,0.12), transparent 65%), ${G.bgDark}`, height: 120, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 50, position: "relative" }}>
              {p.emoji}
              <span className="tag" style={{ position: "absolute", top: 8, right: 8, fontSize: 9 }}>{p.tag}</span>
            </div>
            <div style={{ padding: "12px 13px 14px" }}>
              <div className="serif" style={{ fontSize: 16, color: G.white, lineHeight: 1.2, marginBottom: 4 }}>{p.name}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginBottom: 8, textTransform: "capitalize" }}>{p.family} · {p.size}</div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ color: G.gold, fontSize: 14, fontWeight: 500 }}>PKR {p.price.toLocaleString()}</span>
                <button className="btn-gold" style={{ padding: "6px 12px", fontSize: 11 }} onClick={e => { e.stopPropagation(); onAddToCart(p); }}>+ Add</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── PRODUCT DETAIL MODAL ──────────────────────────────────────────────────────
function ProductDetail({ product, onClose, onAddToCart }) {
  const [added, setAdded] = useState(false);
  const handleAdd = () => { onAddToCart(product); setAdded(true); setTimeout(() => setAdded(false), 2000); };
  return (
    <>
      <div className="overlay" onClick={onClose} />
      <div className="modal" style={{ padding: "0 0 32px" }}>
        <div style={{ background: `radial-gradient(circle at 40% 30%, rgba(197,160,89,0.1), transparent 60%), ${G.bgDark}`, height: 200, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 90, position: "relative" }}>
          {product.emoji}
          <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: G.whiteAlpha, border: "none", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: G.white }}>
            <Icon name="x" size={18} />
          </button>
        </div>
        <div style={{ padding: "20px 20px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
            <div>
              <span className="tag">{product.tag}</span>
              <div className="serif" style={{ fontSize: 28, color: G.white, marginTop: 6 }}>{product.name}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ color: G.gold, fontSize: 22, fontWeight: 500 }}>PKR {product.price.toLocaleString()}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{product.size}</div>
            </div>
          </div>
          <div className="stars" style={{ marginBottom: 16 }}>★★★★★</div>

          {/* Notes */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 11, letterSpacing: 2, color: G.goldDark, textTransform: "uppercase", marginBottom: 12 }}>Fragrance Pyramid</div>
            {[["Top", product.notes.top, "75%"], ["Heart", product.notes.heart, "55%"], ["Base", product.notes.base, "40%"]].map(([label, notes, w]) => (
              <div key={label} style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                  <span style={{ color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 1 }}>{label}</span>
                  <span style={{ color: G.white, fontSize: 13 }}>{notes}</span>
                </div>
                <div style={{ height: 2, background: "rgba(255,255,255,0.08)", borderRadius: 99 }}>
                  <div className="note-bar" style={{ width: w }} />
                </div>
              </div>
            ))}
          </div>

          <button className="btn-gold" style={{ width: "100%", padding: "15px", fontSize: 14 }} onClick={handleAdd}>
            {added ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><Icon name="check" size={16} /> Added to Cart!</span> : "Add to Cart"}
          </button>
        </div>
      </div>
    </>
  );
}

// ── FINDER PAGE ───────────────────────────────────────────────────────────────
function FinderPage({ onAddToCart }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState(null);

  const select = (key, val) => {
    const next = { ...answers, [key]: val };
    setAnswers(next);
    if (step < QUIZ_STEPS.length - 1) { setTimeout(() => setStep(s => s + 1), 300); }
    else { setTimeout(() => setResults(recommend(next)), 300); }
  };

  const reset = () => { setStep(0); setAnswers({}); setResults(null); };

  if (results) return (
    <div style={{ padding: "24px 16px", paddingBottom: 90 }}>
      <div className="serif fade-up" style={{ fontSize: 28, color: G.gold, marginBottom: 4 }}>Your Matches ✨</div>
      <div className="fade-up-2" style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 24 }}>Based on your preferences</div>
      {results.map((p, i) => (
        <div key={p.id} className="fade-up" style={{ animationDelay: `${i * 0.1}s`, background: G.bgCard, border: `1px solid ${G.border}`, borderRadius: 18, padding: "18px", marginBottom: 14, display: "flex", gap: 16, alignItems: "center" }}>
          <div style={{ fontSize: 48, flexShrink: 0 }}>{p.emoji}</div>
          <div style={{ flex: 1 }}>
            <div className="serif" style={{ fontSize: 20, color: G.white }}>{p.name}</div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", margin: "4px 0 10px", textTransform: "capitalize" }}>{p.family} · {p.intensity}</div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ color: G.gold, fontWeight: 500 }}>PKR {p.price.toLocaleString()}</span>
              <button className="btn-gold" style={{ padding: "7px 16px", fontSize: 12 }} onClick={() => onAddToCart(p)}>Add to Cart</button>
            </div>
          </div>
          {i === 0 && <div style={{ position: "absolute", fontSize: 10, color: G.gold, letterSpacing: 1 }}></div>}
        </div>
      ))}
      <button className="btn-outline" style={{ width: "100%", padding: "13px", fontSize: 13, marginTop: 8 }} onClick={reset}>Retake Quiz</button>
    </div>
  );

  const current = QUIZ_STEPS[step];
  const progress = (step / QUIZ_STEPS.length) * 100;

  return (
    <div style={{ padding: "32px 20px", paddingBottom: 90, minHeight: "calc(100vh - 80px)", display: "flex", flexDirection: "column" }}>
      {/* Progress */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>
          <span>Step {step + 1} of {QUIZ_STEPS.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div style={{ height: 3, background: "rgba(255,255,255,0.08)", borderRadius: 99 }}>
          <div style={{ height: "100%", width: `${progress}%`, background: `linear-gradient(90deg, ${G.gold}, ${G.goldDark})`, borderRadius: 99, transition: "width .4s ease" }} />
        </div>
      </div>

      <div className="serif fade-up" style={{ fontSize: 28, color: G.white, marginBottom: 32, lineHeight: 1.3 }}>{current.label}</div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
        {current.options.map(opt => (
          <button key={opt} className={`quiz-opt ${answers[current.key] === opt ? "selected" : ""}`} onClick={() => select(current.key, opt)}>
            {opt}
          </button>
        ))}
      </div>

      {step > 0 && (
        <button className="btn-outline" style={{ marginTop: "auto", padding: "12px", fontSize: 13, marginTop: 32 }} onClick={() => setStep(s => s - 1)}>← Back</button>
      )}
    </div>
  );
}

// ── OFFERS PAGE ───────────────────────────────────────────────────────────────
function OffersPage({ offers }) {
  return (
    <div style={{ padding: "24px 16px", paddingBottom: 90 }}>
      <div className="serif fade-up" style={{ fontSize: 32, color: G.gold, marginBottom: 4 }}>Offers</div>
      <div className="fade-up-2" style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginBottom: 24 }}>Exclusive deals for you</div>
      {offers.filter(o => o.active).map((o, i) => (
        <div key={o.id} className="fade-up" style={{ animationDelay: `${i * 0.1}s`, background: `linear-gradient(135deg, ${G.bgCard}, ${G.bgDark})`, border: `1px solid ${G.border}`, borderRadius: 20, padding: "22px 20px", marginBottom: 14, borderLeft: `4px solid ${o.color}` }}>
          <div style={{ fontSize: 32, marginBottom: 10 }}>🎁</div>
          <div className="serif" style={{ fontSize: 24, color: G.gold, marginBottom: 6 }}>{o.title}</div>
          <div style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", marginBottom: 16, lineHeight: 1.5 }}>{o.desc}</div>
          <div style={{ background: "rgba(197,160,89,0.1)", border: `1px dashed ${G.border}`, borderRadius: 10, padding: "10px 16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", letterSpacing: 1, textTransform: "uppercase" }}>Promo Code</span>
            <span style={{ color: G.gold, fontWeight: 600, letterSpacing: 2 }}>{o.code}</span>
          </div>
        </div>
      ))}
      {offers.filter(o => o.active).length === 0 && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.3)" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🌿</div>
          <div>No active offers right now</div>
        </div>
      )}
    </div>
  );
}

// ── CART DRAWER ───────────────────────────────────────────────────────────────
function CartDrawer({ cart, onClose, onUpdateQty, onRemove }) {
  const [view, setView] = useState("cart"); // cart | checkout | success
  const [form, setForm] = useState({ name: "", phone: "", address: "", notes: "" });
  const [loading, setLoading] = useState(false);
  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);

  const placeOrder = () => {
    if (!form.name || !form.phone || !form.address) return alert("Please fill all required fields");
    setLoading(true);
    setTimeout(() => {
      const msg = formatOrder(cart, form);
      window.open(`https://wa.me/${OWNER_WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank");
      setLoading(false);
      setView("success");
    }, 800);
  };

  return (
    <>
      <div className="overlay" onClick={onClose} />
      <div className="drawer">
        <div style={{ padding: "20px 20px 16px", borderBottom: `1px solid ${G.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div className="serif" style={{ fontSize: 22, color: G.gold }}>
            {view === "cart" ? "Your Cart" : view === "checkout" ? "Checkout" : "Order Placed!"}
          </div>
          <button onClick={onClose} style={{ background: G.whiteAlpha, border: "none", borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: G.white }}>
            <Icon name="x" size={18} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px" }}>
          {view === "cart" && (
            cart.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.35)" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🌿</div>
                <div>Your cart is empty</div>
              </div>
            ) : cart.map(item => (
              <div key={item.id} style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 16, background: G.whiteAlpha, borderRadius: 14, padding: "12px" }}>
                <div style={{ fontSize: 32 }}>{item.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div className="serif" style={{ fontSize: 16, color: G.white }}>{item.name}</div>
                  <div style={{ fontSize: 12, color: G.gold }}>PKR {(item.price * item.qty).toLocaleString()}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <button onClick={() => onUpdateQty(item.id, -1)} style={{ background: G.whiteAlpha, border: "none", borderRadius: "50%", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: G.white }}><Icon name="minus" size={14} /></button>
                  <span style={{ fontSize: 14, minWidth: 16, textAlign: "center" }}>{item.qty}</span>
                  <button onClick={() => onUpdateQty(item.id, 1)} style={{ background: G.whiteAlpha, border: "none", borderRadius: "50%", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: G.white }}><Icon name="plus" size={14} /></button>
                </div>
              </div>
            ))
          )}

          {view === "checkout" && (
            <div>
              {[["Full Name *", "name", "text"], ["Phone Number *", "phone", "tel"], ["Delivery Address *", "address", "text"], ["Order Notes", "notes", "text"]].map(([label, key, type]) => (
                <div key={key} style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 6, letterSpacing: .5 }}>{label}</div>
                  <input className="zk-input" type={type} placeholder={label.replace(" *", "")} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} />
                </div>
              ))}
              <div style={{ background: G.whiteAlpha, borderRadius: 14, padding: "14px", marginTop: 8 }}>
                {cart.map(i => <div key={i.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "rgba(255,255,255,0.65)", marginBottom: 8 }}><span>{i.name} ×{i.qty}</span><span>PKR {(i.price * i.qty).toLocaleString()}</span></div>)}
                <div style={{ borderTop: `1px solid ${G.border}`, paddingTop: 10, display: "flex", justifyContent: "space-between", fontWeight: 600, color: G.gold }}>
                  <span>Total</span><span>PKR {total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {view === "success" && (
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <div style={{ width: 72, height: 72, background: "rgba(37,211,102,0.15)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, margin: "0 auto 20px" }}>✅</div>
              <div className="serif" style={{ fontSize: 24, color: G.gold, marginBottom: 8 }}>Order Sent!</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>Your order has been sent to us via WhatsApp. We'll confirm shortly.</div>
            </div>
          )}
        </div>

        <div style={{ padding: "16px 20px", borderTop: `1px solid ${G.border}` }}>
          {view === "cart" && cart.length > 0 && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14, color: G.gold, fontSize: 16, fontWeight: 500 }}>
                <span>Total</span><span>PKR {total.toLocaleString()}</span>
              </div>
              <button className="btn-gold" style={{ width: "100%", padding: "14px", fontSize: 14 }} onClick={() => setView("checkout")}>Proceed to Checkout</button>
            </>
          )}
          {view === "checkout" && (
            <button className="btn-gold" style={{ width: "100%", padding: "14px", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }} onClick={placeOrder}>
              {loading ? <span style={{ width: 18, height: 18, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: G.bgDark, borderRadius: "50%", display: "inline-block", animation: "spin .7s linear infinite" }} /> : <>📲 Place Order via WhatsApp</>}
            </button>
          )}
          {view === "success" && (
            <button className="btn-gold" style={{ width: "100%", padding: "14px", fontSize: 14 }} onClick={onClose}>Continue Shopping</button>
          )}
        </div>
      </div>
    </>
  );
}

// ── ADMIN PAGE ────────────────────────────────────────────────────────────────
function AdminPage({ offers, setOffers }) {
  const [pin, setPin] = useState("");
  const [auth, setAuth] = useState(false);
  const [tab, setTab] = useState("offers");
  const [newOffer, setNewOffer] = useState({ title: "", desc: "", code: "" });

  if (!auth) return (
    <div style={{ padding: "60px 24px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
      <div style={{ fontSize: 40, marginBottom: 8 }}>🔐</div>
      <div className="serif" style={{ fontSize: 24, color: G.gold }}>Admin Panel</div>
      <input className="zk-input" type="password" placeholder="Enter PIN" value={pin} onChange={e => setPin(e.target.value)} style={{ maxWidth: 260, textAlign: "center", letterSpacing: 6 }} />
      <button className="btn-gold" style={{ padding: "12px 32px", fontSize: 14 }} onClick={() => { if (pin === "1234") setAuth(true); else alert("Wrong PIN (default: 1234)"); }}>Enter</button>
      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>Default PIN: 1234</div>
    </div>
  );

  return (
    <div style={{ padding: "24px 16px", paddingBottom: 90 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div className="serif" style={{ fontSize: 28, color: G.gold }}>Admin</div>
        <button className="btn-outline" style={{ padding: "7px 14px", fontSize: 12 }} onClick={() => setAuth(false)}>Logout</button>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {["offers", "products"].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: "9px 20px", borderRadius: 99, border: `1px solid ${tab === t ? G.gold : G.border}`, background: tab === t ? "rgba(197,160,89,0.15)" : "transparent", color: tab === t ? G.gold : "rgba(255,255,255,0.5)", cursor: "pointer", fontFamily: "'Jost',sans-serif", fontSize: 13, textTransform: "capitalize" }}>
            {t}
          </button>
        ))}
      </div>

      {tab === "offers" && (
        <>
          <div style={{ marginBottom: 20 }}>
            {offers.map(o => (
              <div key={o.id} className="admin-row" style={{ marginBottom: 10 }}>
                <div>
                  <div style={{ fontSize: 14, color: G.white }}>{o.title}</div>
                  <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{o.code}</div>
                </div>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <button className={`toggle ${o.active ? "on" : ""}`} onClick={() => setOffers(prev => prev.map(x => x.id === o.id ? { ...x, active: !x.active } : x))} />
                  <button onClick={() => setOffers(prev => prev.filter(x => x.id !== o.id))} style={{ background: "none", border: "none", cursor: "pointer", color: "rgba(255,255,255,0.3)" }}><Icon name="trash" size={16} /></button>
                </div>
              </div>
            ))}
          </div>

          {/* Add new offer */}
          <div style={{ background: G.whiteAlpha, border: `1px solid ${G.border}`, borderRadius: 16, padding: "16px" }}>
            <div style={{ fontSize: 12, letterSpacing: 1, color: G.goldDark, textTransform: "uppercase", marginBottom: 12 }}>Add New Offer</div>
            {[["Title", "title"], ["Description", "desc"], ["Promo Code", "code"]].map(([label, key]) => (
              <input key={key} className="zk-input" placeholder={label} value={newOffer[key]} onChange={e => setNewOffer(f => ({ ...f, [key]: e.target.value }))} style={{ marginBottom: 10 }} />
            ))}
            <button className="btn-gold" style={{ width: "100%", padding: "12px", fontSize: 13 }} onClick={() => {
              if (!newOffer.title) return;
              setOffers(prev => [...prev, { id: Date.now(), ...newOffer, active: true, color: G.gold }]);
              setNewOffer({ title: "", desc: "", code: "" });
            }}>Add Offer</button>
          </div>
        </>
      )}

      {tab === "products" && (
        <div>
          {PRODUCTS.map(p => (
            <div key={p.id} className="admin-row" style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                <span style={{ fontSize: 24 }}>{p.emoji}</span>
                <div>
                  <div style={{ fontSize: 14, color: G.white }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: G.gold }}>PKR {p.price.toLocaleString()}</div>
                </div>
              </div>
              <button style={{ background: "none", border: `1px solid ${G.border}`, borderRadius: 8, padding: "5px 10px", color: "rgba(255,255,255,0.4)", cursor: "pointer", fontSize: 11 }}>Edit</button>
            </div>
          ))}
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", textAlign: "center", marginTop: 16 }}>Full product editing available in production build</div>
        </div>
      )}
    </div>
  );
}

// ── APP ROOT ──────────────────────────────────────────────────────────────────
export default function ZikiasApp() {
  const [page, setPage] = useState("home");
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [viewProduct, setViewProduct] = useState(null);
  const [offers, setOffers] = useState(INITIAL_OFFERS);

  const addToCart = (product) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === product.id);
      if (exists) return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...product, qty: 1 }];
    });
    setCartOpen(true);
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i));
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const NAV = [
    { id: "home", icon: "home", label: "Home" },
    { id: "shop", icon: "shop", label: "Shop" },
    { id: "finder", icon: "sparkle", label: "Finder" },
    { id: "offers", icon: "tag2", label: "Offers" },
    { id: "admin", icon: "user", label: "Admin" },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="grain" style={{ maxWidth: 480, margin: "0 auto", position: "relative", minHeight: "100vh" }}>

        {/* Top bar */}
        <div style={{ position: "sticky", top: 0, zIndex: 50, background: `${G.bgDark}ee`, backdropFilter: "blur(12px)", borderBottom: `1px solid ${G.border}`, padding: "14px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, color: G.gold, letterSpacing: 4 }}>ZKS</div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 12, letterSpacing: 8, color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>Illusion</div>
          <button onClick={() => setCartOpen(true)} style={{ position: "relative", background: G.whiteAlpha, border: `1px solid ${G.border}`, borderRadius: "50%", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: G.white }}>
            <Icon name="shop" size={18} />
            {cartCount > 0 && <span className="nav-badge">{cartCount}</span>}
          </button>
        </div>

        {/* Pages */}
        {page === "home" && <HomePage onShop={() => setPage("shop")} onFinder={() => setPage("finder")} cart={cart} offers={offers} />}
        {page === "shop" && <ShopPage onAddToCart={addToCart} onViewProduct={setViewProduct} />}
        {page === "finder" && <FinderPage onAddToCart={addToCart} />}
        {page === "offers" && <OffersPage offers={offers} />}
        {page === "admin" && <AdminPage offers={offers} setOffers={setOffers} />}

        {/* Bottom Nav */}
        <nav className="bottom-nav">
          {NAV.map(n => (
            <button key={n.id} className={`nav-btn ${page === n.id ? "active" : ""}`} onClick={() => setPage(n.id)}>
              <Icon name={n.icon} size={20} color={page === n.id ? G.gold : "rgba(255,255,255,0.45)"} />
              {n.label}
            </button>
          ))}
        </nav>

        {/* WhatsApp FAB */}
        <a href={`https://wa.me/${OWNER_WHATSAPP}`} target="_blank" rel="noopener noreferrer">
          <button className="wa-fab" aria-label="WhatsApp">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          </button>
        </a>

        {/* Modals */}
        {cartOpen && <CartDrawer cart={cart} onClose={() => setCartOpen(false)} onUpdateQty={updateQty} onRemove={id => setCart(c => c.filter(i => i.id !== id))} />}
        {viewProduct && <ProductDetail product={viewProduct} onClose={() => setViewProduct(null)} onAddToCart={p => { addToCart(p); setViewProduct(null); }} />}
      </div>
    </>
  );
}
