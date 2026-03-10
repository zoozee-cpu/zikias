import { useState } from 'react'
import { DEFAULT_OFFERS } from '../data/offers'

// ─── useOffers ────────────────────────────────────────────────────────────────
// Manages offers state for the admin panel

export function useOffers() {
  const [offers, setOffers] = useState(DEFAULT_OFFERS)

  const toggleOffer = (id) => {
    setOffers(prev => prev.map(o => o.id === id ? { ...o, active: !o.active } : o))
  }

  const addOffer = (offer) => {
    setOffers(prev => [...prev, { id: Date.now(), active: true, color: '#C5A059', ...offer }])
  }

  const removeOffer = (id) => {
    setOffers(prev => prev.filter(o => o.id !== id))
  }

  const activeOffers = offers.filter(o => o.active)

  return { offers, activeOffers, toggleOffer, addOffer, removeOffer }
}
