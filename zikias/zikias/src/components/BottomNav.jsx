import Icon from './Icon'
import { theme } from '../styles/theme'

const NAV_ITEMS = [
  { id: 'home',   icon: 'home',    label: 'Home'   },
  { id: 'shop',   icon: 'shop',    label: 'Shop'   },
  { id: 'finder', icon: 'sparkle', label: 'Finder' },
  { id: 'offers', icon: 'tag',     label: 'Offers' },
  { id: 'admin',  icon: 'user',    label: 'Admin'  },
]

export default function BottomNav({ page, setPage }) {
  return (
    <nav className="bottom-nav">
      {NAV_ITEMS.map(n => (
        <button
          key={n.id}
          className={`nav-btn ${page === n.id ? 'active' : ''}`}
          onClick={() => setPage(n.id)}
          aria-label={n.label}
        >
          <Icon
            name={n.icon}
            size={20}
            color={page === n.id ? theme.gold : 'rgba(255,255,255,0.4)'}
          />
          {n.label}
        </button>
      ))}
    </nav>
  )
}
