/**
 * ConfirmModal.jsx
 *
 * A confirmation dialog shown before destructive actions (delete).
 * Uses a portal-like full-screen overlay to block interaction
 * with the rest of the page.
 *
 * WHY A SEPARATE MODAL?
 * - Prevents accidental data loss
 * - Clear UX pattern: ask before deleting
 * - Reusable for any future destructive actions
 *
 * Props:
 *   isOpen (boolean) — controls visibility
 *   title (string) — modal heading
 *   message (string) — description text
 *   onConfirm (function) — called when user confirms
 *   onCancel (function) — called when user cancels
 */
import { useEffect } from 'react'
import { HiOutlineExclamationTriangle } from 'react-icons/hi2'

export default function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {
  // Trap focus and prevent background scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Close on Escape key for accessibility
  useEffect(() => {
    function handleEsc(e) {
      if (e.key === 'Escape' && isOpen) onCancel()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, onCancel])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop"
      onClick={onCancel}
      id="confirm-modal-backdrop"
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal box */}
      <div
        className="relative w-full max-w-sm bg-gray-900 border border-gray-700/50
          rounded-2xl p-6 shadow-2xl modal-box"
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
      >
        {/* Warning icon */}
        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4
          bg-red-500/15 rounded-full border border-red-500/30">
          <HiOutlineExclamationTriangle className="w-6 h-6 text-red-400" />
        </div>

        <h3
          id="confirm-modal-title"
          className="text-lg font-syne font-bold text-gray-100 text-center mb-2"
        >
          {title}
        </h3>

        <p className="text-sm text-gray-400 text-center mb-6">
          {message}
        </p>

        {/* Action buttons */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 btn-secondary justify-center"
            id="confirm-modal-cancel"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-400
              border border-red-500/30 font-dm font-medium py-2 px-3
              rounded-lg text-sm transition-all duration-200
              flex items-center justify-center gap-1.5"
            id="confirm-modal-delete"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}
