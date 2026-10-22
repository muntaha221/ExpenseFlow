/**
 * BackupModal.jsx
 *
 * Professional Data Protection & Export/Import Suite:
 *  1. 📥 Download Full JSON Backup (safeguards your personal expense history)
 *  2. 📤 Restore from JSON Backup (recovers all data in 1 second)
 *  3. 📊 Export to CSV (open in Excel / Google Sheets)
 *  4. 💡 Pro Tips on preventing mobile data loss
 */

import { useRef, useState } from 'react'
import {
  HiOutlineArrowDownTray,
  HiOutlineArrowUpTray,
  HiOutlineDocumentChartBar,
  HiOutlineXMark,
  HiOutlineShieldCheck,
  HiOutlineDevicePhoneMobile,
} from 'react-icons/hi2'

export default function BackupModal({ isOpen, onClose, expenses, onRestoreExpenses, onShowToast }) {
  const fileInputRef = useRef(null)
  const [importStatus, setImportStatus] = useState(null)

  if (!isOpen) return null

  // 1. Export JSON
  function handleExportJSON() {
    try {
      const dataStr = JSON.stringify(expenses, null, 2)
      const blob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      const today = new Date().toISOString().slice(0, 10)
      a.href = url
      a.download = `ExpenseFlow_Backup_${today}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      onShowToast('✓ Backup downloaded successfully!')
    } catch (err) {
      onShowToast('❌ Failed to export backup')
    }
  }

  // 2. Export CSV
  function handleExportCSV() {
    try {
      if (expenses.length === 0) {
        onShowToast('No expenses to export')
        return
      }

      const headers = ['Date', 'Category', 'Title', 'Amount (PKR)', 'Notes']
      const rows = expenses.map(e => [
        `"${e.date}"`,
        `"${e.category}"`,
        `"${(e.title || '').replace(/"/g, '""')}"`,
        e.amount,
        `"${(e.notes || '').replace(/"/g, '""')}"`,
      ])

      const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n')
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      const today = new Date().toISOString().slice(0, 10)
      a.href = url
      a.download = `ExpenseFlow_${today}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      onShowToast('✓ CSV file downloaded!')
    } catch (err) {
      onShowToast('❌ Failed to export CSV')
    }
  }

  // 3. Import JSON
  function handleFileSelect(e) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result)
        if (!Array.isArray(parsed)) {
          throw new Error('Invalid format: Expected an array of expenses')
        }

        // Validate items roughly
        const valid = parsed.filter(item => item && item.amount !== undefined)
        onRestoreExpenses(valid)
        onShowToast(`✓ Restored ${valid.length} expenses successfully!`)
        setImportStatus(`Restored ${valid.length} records!`)
        setTimeout(() => {
          onClose()
        }, 1200)
      } catch (err) {
        setImportStatus('Error: Invalid JSON backup file')
        onShowToast('❌ Invalid backup file')
      }
    }
    reader.readAsText(file)
    e.target.value = '' // reset input
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="card max-w-lg w-full p-6 relative bg-gray-900 border border-white/10 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
        >
          <HiOutlineXMark className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <HiOutlineShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-syne font-bold text-gray-100">
              Data Safety & Backup Suite
            </h3>
            <p className="text-xs text-gray-400 font-dm">
              Keep your personal records 100% safe from mobile clearing
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mb-6">
          {/* Download JSON Backup */}
          <button
            onClick={handleExportJSON}
            className="w-full flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-emerald-500/30 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <HiOutlineArrowDownTray className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-sm font-dm font-semibold text-gray-200 group-hover:text-emerald-300">
                  Download Full Backup (.json)
                </p>
                <p className="text-[11px] text-gray-500">
                  Save all {expenses.length} records safely to your phone/Drive
                </p>
              </div>
            </div>
            <span className="text-xs font-dm text-emerald-400 font-medium">Export</span>
          </button>

          {/* Restore JSON Backup */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-cyan-500/30 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                <HiOutlineArrowUpTray className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-sm font-dm font-semibold text-gray-200 group-hover:text-cyan-300">
                  Restore from Backup (.json)
                </p>
                <p className="text-[11px] text-gray-500">
                  Upload a previously saved backup file
                </p>
              </div>
            </div>
            <span className="text-xs font-dm text-cyan-400 font-medium">Restore</span>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Export to CSV */}
          <button
            onClick={handleExportCSV}
            className="w-full flex items-center justify-between p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-pink-500/30 transition-all group"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-pink-500/10 text-pink-400 flex items-center justify-center">
                <HiOutlineDocumentChartBar className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-sm font-dm font-semibold text-gray-200 group-hover:text-pink-300">
                  Export to CSV (.csv)
                </p>
                <p className="text-[11px] text-gray-500">
                  Open your records in Microsoft Excel or Google Sheets
                </p>
              </div>
            </div>
            <span className="text-xs font-dm text-pink-400 font-medium">CSV</span>
          </button>
        </div>

        {importStatus && (
          <p className="text-xs text-center text-cyan-400 mb-4 font-dm font-medium">
            {importStatus}
          </p>
        )}

        {/* Pro Mobile Tip Box */}
        <div className="p-3.5 rounded-xl bg-emerald-500/[0.06] border border-emerald-500/20 text-xs font-dm">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-1">
            <HiOutlineDevicePhoneMobile className="w-4 h-4" />
            <span>Pro Guide: Never Lose Data on Mobile Chrome</span>
          </div>
          <p className="text-gray-400 leading-relaxed text-[11px]">
            1. In Chrome, open your Vercel URL and tap the 3 dots <strong className="text-gray-200">⋮</strong> &rarr; tap <strong className="text-emerald-300">"Install App"</strong> (not just "Add to Home screen"). This installs it as an isolated standalone PWA.
            <br />
            2. When clearing Chrome browsing history, uncheck <strong className="text-gray-200">"Site data / Cookies"</strong>, or download your 1-click JSON backup weekly to Google Drive/WhatsApp.
          </p>
        </div>
      </div>
    </div>
  )
}
