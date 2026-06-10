/**
 * Toast.jsx
 *
 * A small notification that slides in from the bottom-right
 * to confirm user actions (add, edit, delete).
 *
 * WHY NOT A LIBRARY?
 * - Our toast needs are simple: one message at a time, auto-dismiss
 * - A library like react-hot-toast adds ~10 KB for features we don't need
 * - Building it ourselves keeps the bundle lean
 *
 * Props:
 *   message (string) — text to display
 *   visible (boolean) — controls show/hide with animation
 */
import { HiOutlineCheckCircle } from 'react-icons/hi2'

export default function Toast({ message, visible }) {
  if (!message) return null

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5
        bg-gray-800/95 backdrop-blur-xl border border-gray-700/50
        text-gray-100 text-sm font-medium
        px-4 py-3 rounded-xl shadow-2xl shadow-black/30
        transition-all duration-300 ease-out
        ${visible
          ? 'translate-y-0 opacity-100'
          : 'translate-y-3 opacity-0 pointer-events-none'
        }`}
      role="status"
      aria-live="polite"
      id="toast-notification"
    >
      <HiOutlineCheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
      {message}
    </div>
  )
}
