/**
 * categories.js
 *
 * Central registry of expense categories.
 * Updated to 4 core personal categories:
 *  - Food
 *  - Shopping
 *  - Need
 *  - Others
 */
import {
  HiOutlineShoppingBag,
  HiOutlineShoppingCart,
  HiOutlineShieldCheck,
  HiOutlineEllipsisHorizontalCircle,
} from 'react-icons/hi2'

export const CATEGORIES = [
  {
    id: 'food',
    name: 'Food',
    icon: HiOutlineShoppingBag,
    hex: '#f97316',
    bg: 'bg-orange-500/15',
    text: 'text-orange-400',
    border: 'border-orange-500/30',
    ring: 'ring-orange-500/20',
  },
  {
    id: 'shopping',
    name: 'Shopping',
    icon: HiOutlineShoppingCart,
    hex: '#ec4899',
    bg: 'bg-pink-500/15',
    text: 'text-pink-400',
    border: 'border-pink-500/30',
    ring: 'ring-pink-500/20',
  },
  {
    id: 'need',
    name: 'Need',
    icon: HiOutlineShieldCheck,
    hex: '#10b981',
    bg: 'bg-emerald-500/15',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
    ring: 'ring-emerald-500/20',
  },
  {
    id: 'other',
    name: 'Others',
    icon: HiOutlineEllipsisHorizontalCircle,
    hex: '#6b7280',
    bg: 'bg-gray-500/15',
    text: 'text-gray-400',
    border: 'border-gray-500/30',
    ring: 'ring-gray-500/20',
  },
]

/**
 * getCategoryById — returns category object.
 * Maps legacy categories (transport, utilities, entertainment, health, education)
 * to 'need' or 'other' gracefully so past data never crashes.
 */
export function getCategoryById(id) {
  if (!id) return CATEGORIES[3] // others
  const found = CATEGORIES.find(c => c.id === id)
  if (found) return found

  // Backwards compatibility mapping for previous categories
  const legacyMap = {
    transport: 'need',
    utilities: 'need',
    health: 'need',
    education: 'need',
    entertainment: 'shopping',
    other: 'other',
    others: 'other',
  }

  const mappedId = legacyMap[id.toLowerCase()] || 'other'
  return CATEGORIES.find(c => c.id === mappedId) || CATEGORIES[3]
}
