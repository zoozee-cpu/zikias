import { useState } from 'react'

// Components
import TopBar        from './components/TopBar'
import BottomNav     from './components/BottomNav'
import WhatsAppFAB   from './components/WhatsAppFAB'
import CartDrawer    from './components/CartDrawer'
import ProductDetail from './components/ProductDetail'

// Pages
import HomePage    from './pages/HomePage'
import ShopPage    from './pages/ShopPage'
import FinderPage  from './pages/FinderPage'
import OffersPage  from './pages/OffersPage'
import AdminPage   from './pages/AdminPage'

// Hooks
import { useCart }   from './hooks/useCart'
import { useOffers } from './hooks/useOffers'

export default function App() {
  const [page,        setPage]        = useState('home')
  const [cartOpen,    setCartOpen]    = useState(false)
  const [viewProduct, setViewProduct] = useState(null)

  const { cart, addToCart, updateQty, removeItem, clearCart, cartCount, cartTotal } = useCart()
  const { offers, activeOffers, toggleOffer, addOffer, removeOffer }                = useOffers()

  const handleAddToCart = (product) => {
    addToCart(product)
    setCartOpen(true)
  }

  const handleViewProduct = (product) => {
    setViewProduct(product)
  }

  return (
    <div className="grain" style={{ maxWidth: 480, margin: '0 auto', minHeight: '100vh', position: 'relative' }}>

      {/* Top bar (sticky) */}
      <TopBar cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />

      {/* Page content */}
      <main>
        {page === 'home' && (
          <HomePage
            onShop={() => setPage('shop')}
            onFinder={() => setPage('finder')}
            onAddToCart={handleAddToCart}
            onViewProduct={handleViewProduct}
            activeOffers={activeOffers}
          />
        )}
        {page === 'shop' && (
          <ShopPage
            onAddToCart={handleAddToCart}
            onViewProduct={handleViewProduct}
          />
        )}
        {page === 'finder' && (
          <FinderPage onAddToCart={handleAddToCart} />
        )}
        {page === 'offers' && (
          <OffersPage activeOffers={activeOffers} />
        )}
        {page === 'admin' && (
          <AdminPage
            offers={offers}
            onToggle={toggleOffer}
            onAdd={addOffer}
            onRemove={removeOffer}
          />
        )}
      </main>

      {/* Bottom navigation */}
      <BottomNav page={page} setPage={setPage} />

      {/* WhatsApp floating button */}
      <WhatsAppFAB />

      {/* Cart drawer */}
      {cartOpen && (
        <CartDrawer
          cart={cart}
          cartTotal={cartTotal}
          onClose={() => setCartOpen(false)}
          onUpdateQty={updateQty}
          onRemove={removeItem}
        />
      )}

      {/* Product detail modal */}
      {viewProduct && (
        <ProductDetail
          product={viewProduct}
          onClose={() => setViewProduct(null)}
          onAddToCart={(p) => { handleAddToCart(p); setViewProduct(null) }}
        />
      )}
    </div>
  )
}
