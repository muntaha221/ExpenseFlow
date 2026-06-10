/**
 * categories.js
 *
 * Central registry of expense categories.
 * WHY A CENTRAL REGISTRY?
 * - Single source of truth for category colors, icons, and labels
 * - Charts, badges, and forms all pull from here
 * - Adding a new category = one line change, propagates everywhere
 */
import {
  HiOutlineShoppingBag,
  HiOutlineTruck,
  HiOutlineBolt,
  HiOutlineFilm,
  HiOutlineShoppingCart,
  HiOutlineHeart,
  HiOutlineAcademicCap,
  HiOutlineEllipsisHorizontalCircle,
} from 'react-icons/hi2'

export const CATEGORIES = [
  {
    id: 'food',
    name: 'Food & Dining',
    icon: HiOutlineShoppingBag,
    hex: '#f97316',
    bg: 'bg-orange-500/15',
    text: 'text-orange-400',
    border: 'border-orange-500/30',
    ring: 'ring-orange-500/20',
  },
  {
    id: 'transport',
    name: 'Transport',
    icon: HiOutlineTruck,
    hex: '#3b82f6',
    bg: 'bg-blue-500/15',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
    ring: 'ring-blue-500/20',
  },
  {
    id: 'utilities',
    name: 'Utilities',
    icon: HiOutlineBolt,
    hex: '#eab308',
    bg: 'bg-yellow-500/15',
    text: 'text-yellow-400',
    border: 'border-yellow-500/30',
    ring: 'ring-yellow-500/20',
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    icon: HiOutlineFilm,
    hex: '#a855f7',
    bg: 'bg-purple-500/15',
    text: 'text-purple-400',
    border: 'border-purple-500/30',
    ring: 'ring-purple-500/20',
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
    id: 'health',
    name: 'Health',
    icon: HiOutlineHeart,
    hex: '#22c55e',
    bg: 'bg-green-500/15',
    text: 'text-green-400',
    border: 'border-green-500/30',
    ring: 'ring-green-500/20',
  },
  {
    id: 'education',
    name: 'Education',
    icon: HiOutlineAcademicCap,
    hex: '#6366f1',
    bg: 'bg-indigo-500/15',
    text: 'text-indigo-400',
    border: 'border-indigo-500/30',
    ring: 'ring-indigo-500/20',
  },
  {
    id: 'other',
    name: 'Other',
    icon: HiOutlineEllipsisHorizontalCircle,
    hex: '#6b7280',
    bg: 'bg-gray-500/15',
    text: 'text-gray-400',
    border: 'border-gray-500/30',
    ring: 'ring-gray-500/20',
  },
]

/**
 * getCategoryById — O(n) lookup. Fine for 8 items.
 * We avoid a Map here for simplicity; the list is small.
 */
export function getCategoryById(id) {
  return CATEGORIES.find(c => c.id === id) || CATEGORIES[CATEGORIES.length - 1]
}
