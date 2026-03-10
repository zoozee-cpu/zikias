import { config } from '../data/config'

// ─── formatOrderMessage ───────────────────────────────────────────────────────
// Formats the WhatsApp order message from cart + customer details

export function formatOrderMessage(cart, customer) {
  const items = cart
    .map(i => `  • ${i.name} × ${i.qty}  =  ${config.currency} ${(i.price * i.qty).toLocaleString()}`)
    .join('\n')

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0)

  return (
`🌿 *New Order — Zikias*
━━━━━━━━━━━━━━━━━━
👤 *Name:* ${customer.name}
📞 *Phone:* ${customer.phone}
📍 *Address:* ${customer.address}
${customer.notes ? `📝 *Notes:* ${customer.notes}` : ''}
━━━━━━━━━━━━━━━━━━
*Items:*
${items}
━━━━━━━━━━━━━━━━━━
💰 *Total: ${config.currency} ${total.toLocaleString()}*
━━━━━━━━━━━━━━━━━━
_Order placed via Zikias App_`
  )
}

// ─── openWhatsApp ─────────────────────────────────────────────────────────────
// Opens WhatsApp with pre-filled order message

export function openWhatsApp(cart, customer) {
  const message = formatOrderMessage(cart, customer)
  const encoded = encodeURIComponent(message)
  window.open(`https://wa.me/${config.whatsappNumber}?text=${encoded}`, '_blank')
}

// ─── openWhatsAppDirect ───────────────────────────────────────────────────────
// Opens a direct WhatsApp chat with the owner (no pre-filled message)

export function openWhatsAppDirect(msg = '') {
  const encoded = encodeURIComponent(msg || `Hi Zikias! I'd like to know more about your fragrances.`)
  window.open(`https://wa.me/${config.whatsappNumber}?text=${encoded}`, '_blank')
}
