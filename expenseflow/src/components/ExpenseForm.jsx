/**
 * ExpenseForm.jsx
 *
 * Super-fast personal expense entry form:
 *  1. Auto-defaults to Today (with day name, e.g. Thursday)
 *  2. Quick Date chips: [Today (Thursday)] and [Yesterday] for 1-tap logging
 *  3. Quick Category selection buttons (Food, Shopping, Need, Others)
 *  4. Blank title auto-names to selected Category ("Food", "Shopping", etc.)
 *  5. Full editing & custom date support for past records
 */

import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { validateExpense } from '../utils/validation'
import { CATEGORIES, getCategoryById } from '../utils/categories'
import { MdAdd, MdSave, MdCheck } from 'react-icons/md'
import { HiOutlineCalendar, HiOutlineClock, HiOutlineSparkles } from 'react-icons/hi2'

function getLocalDateTimeString(dateObj = new Date()) {
  const d = new Date(dateObj.getTime() - dateObj.getTimezoneOffset() * 60000)
  return d.toISOString().slice(0, 16)
}

function getDayLabel(dateStr) {
  try {
    const d = new Date(dateStr)
    const today = new Date()
    const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1)

    const isToday = d.toDateString() === today.toDateString()
    const isYesterday = d.toDateString() === yesterday.toDateString()

    const weekday = d.toLocaleDateString('en-US', { weekday: 'long' })
    const dateFormatted = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

    if (isToday) return `Today (${weekday}, ${dateFormatted})`
    if (isYesterday) return `Yesterday (${weekday}, ${dateFormatted})`
    return `${weekday}, ${dateFormatted}`
  } catch (e) {
    return dateStr
  }
}

export default function ExpenseForm({ onAdd, editingExpense, onUpdate, onCancelEdit }) {
  const getInitialForm = () => ({
    title: '',
    amount: '',
    category: 'food', // default to food for fastest 1-step logging
    date: getLocalDateTimeString(new Date()),
    notes: '',
  })

  const [values, setValues] = useState(getInitialForm)
  const [errors, setErrors] = useState({})
  const [showCustomDate, setShowCustomDate] = useState(false)

  // Populate when editing, reset when cancelled
  useEffect(() => {
    if (editingExpense) {
      setValues({
        title: editingExpense.title || '',
        amount: editingExpense.amount,
        category: editingExpense.category || 'food',
        date: editingExpense.date,
        notes: editingExpense.notes || '',
      })
      setShowCustomDate(true)
    } else {
      setValues(getInitialForm())
      setErrors({})
      setShowCustomDate(false)
    }
  }, [editingExpense])

  function handleChange(e) {
    const { name, value } = e.target
    setValues(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  function handleCategorySelect(catId) {
    setValues(prev => ({ ...prev, category: catId }))
    if (errors.category) setErrors(prev => ({ ...prev, category: '' }))
  }

  function handleSetToday() {
    setValues(prev => ({ ...prev, date: getLocalDateTimeString(new Date()) }))
    setShowCustomDate(false)
  }

  function handleSetYesterday() {
    const now = new Date()
    const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1, now.getHours(), now.getMinutes())
    setValues(prev => ({ ...prev, date: getLocalDateTimeString(yesterday) }))
    setShowCustomDate(false)
  }

  function handleSubmit(e) {
    e.preventDefault()

    // Auto-fill title with category name if left blank
    const selectedCat = getCategoryById(values.category || 'other')
    const finalTitle = values.title.trim() ? values.title.trim() : selectedCat.name

    const formToValidate = {
      ...values,
      title: finalTitle,
    }

    const errs = validateExpense(formToValidate)
    const hasErrors = Object.values(errs).some(v => v && v.length > 0)
    if (hasErrors) {
      setErrors(errs)
      return
    }

    if (editingExpense) {
      onUpdate({
        ...editingExpense,
        ...formToValidate,
        amount: parseFloat(values.amount),
      })
    } else {
      onAdd({
        ...formToValidate,
        amount: parseFloat(values.amount),
        id: uuidv4(),
      })
      // Reset form to fresh today's state
      setValues(getInitialForm())
      setShowCustomDate(false)
    }
    setErrors({})
  }

  const isEditing = Boolean(editingExpense)
  const todayDayName = new Date().toLocaleDateString('en-US', { weekday: 'short' })
  const yesterdayObj = new Date(Date.now() - 86400000)
  const yesterdayDayName = yesterdayObj.toLocaleDateString('en-US', { weekday: 'short' })

  // Check if current form date matches today or yesterday
  const formDateObj = new Date(values.date)
  const isSelectedToday = formDateObj.toDateString() === new Date().toDateString()
  const isSelectedYesterday = formDateObj.toDateString() === yesterdayObj.toDateString()

  return (
    <div className="card p-5 sm:p-6" id="expense-form-container">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399] animate-pulse" />
          <h2 className="font-syne font-bold text-base text-gray-100">
            {isEditing ? 'Edit Expense' : 'Quick Add Expense'}
          </h2>
        </div>
        <span className="text-[11px] font-dm px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          {getDayLabel(values.date)}
        </span>
      </div>

      <form onSubmit={handleSubmit} noValidate>

        {/* 1. Quick Category Chips (1-tap select) */}
        <div className="mb-4">
          <label className="block text-xs text-gray-400 font-dm uppercase tracking-wider mb-2">
            1. Select Category *
          </label>
          <div className="grid grid-cols-2 gap-2 sm:gap-2.5">
            {CATEGORIES.map(c => {
              const isSelected = values.category === c.id
              const IconComp = c.icon
              return (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => handleCategorySelect(c.id)}
                  style={{
                    borderColor: isSelected ? c.hex : 'rgba(255, 255, 255, 0.08)',
                    backgroundColor: isSelected ? `${c.hex}22` : 'rgba(255, 255, 255, 0.02)',
                    boxShadow: isSelected ? `0 0 12px ${c.hex}33` : 'none',
                  }}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-sm font-dm font-medium transition-all duration-150 active:scale-95 ${
                    isSelected ? 'text-white' : 'text-gray-400 hover:text-gray-200 hover:border-white/20'
                  }`}
                  id={`cat-btn-${c.id}`}
                >
                  <span className="flex items-center gap-2">
                    <IconComp className="w-4 h-4 shrink-0" style={{ color: c.hex }} />
                    <span>{c.name}</span>
                  </span>
                  {isSelected && (
                    <span
                      className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] text-white"
                      style={{ backgroundColor: c.hex }}
                    >
                      <MdCheck />
                    </span>
                  )}
                </button>
              )
            })}
          </div>
          {errors.category && <p className="text-red-400 text-xs mt-1">{errors.category}</p>}
        </div>

        {/* 2. Amount (PKR) */}
        <div className="mb-4">
          <label className="block text-xs text-gray-400 font-dm uppercase tracking-wider mb-1.5">
            2. Amount (PKR) *
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-syne font-bold text-gray-400">
              Rs
            </span>
            <input
              name="amount"
              type="number"
              value={values.amount}
              onChange={handleChange}
              placeholder="e.g. 850"
              min="0.01"
              step="any"
              autoFocus={!isEditing}
              className={`input-base pl-11 text-lg font-syne font-bold ${
                errors.amount ? 'input-error' : ''
              }`}
              id="amount-input"
            />
          </div>
          {errors.amount && <p className="text-red-400 text-xs mt-1">{errors.amount}</p>}
        </div>

        {/* 3. Date Selection & Quick Chips */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs text-gray-400 font-dm uppercase tracking-wider">
              3. Date & Time
            </label>
            <button
              type="button"
              onClick={() => setShowCustomDate(prev => !prev)}
              className="text-[11px] text-cyan-400 hover:text-cyan-300 font-dm flex items-center gap-1"
            >
              <HiOutlineClock className="w-3 h-3" />
              {showCustomDate ? 'Hide picker' : 'Custom time / past date'}
            </button>
          </div>

          {/* Quick Date Chips: Today vs Yesterday */}
          <div className="grid grid-cols-2 gap-2 mb-2">
            <button
              type="button"
              onClick={handleSetToday}
              className={`py-2 px-3 rounded-lg border text-xs font-dm font-medium flex items-center justify-center gap-1.5 transition-all ${
                isSelectedToday
                  ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-semibold shadow-[0_0_8px_rgba(52,211,153,0.15)]'
                  : 'bg-white/[0.02] border-white/10 text-gray-400 hover:text-gray-200'
              }`}
            >
              <HiOutlineCalendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>Today ({todayDayName})</span>
            </button>

            <button
              type="button"
              onClick={handleSetYesterday}
              className={`py-2 px-3 rounded-lg border text-xs font-dm font-medium flex items-center justify-center gap-1.5 transition-all ${
                isSelectedYesterday
                  ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 font-semibold shadow-[0_0_8px_rgba(245,158,11,0.15)]'
                  : 'bg-white/[0.02] border-white/10 text-gray-400 hover:text-gray-200'
              }`}
            >
              <span>⏪ Yesterday ({yesterdayDayName})</span>
            </button>
          </div>

          {/* Full datetime picker (shown when requested or editing) */}
          {showCustomDate && (
            <div className="mt-2 animate-fade-in-up">
              <input
                name="date"
                type="datetime-local"
                value={values.date}
                onChange={handleChange}
                className={`input-base text-xs ${errors.date ? 'input-error' : ''}`}
                id="date-input"
              />
              {errors.date && <p className="text-red-400 text-xs mt-1">{errors.date}</p>}
            </div>
          )}
        </div>

        {/* 4. Title (Optional — auto-defaults to category) */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs text-gray-400 font-dm uppercase tracking-wider">
              Title <span className="text-gray-600 font-normal lowercase">(optional)</span>
            </label>
            <span className="text-[11px] text-gray-500 flex items-center gap-1">
              <HiOutlineSparkles className="w-3 h-3 text-emerald-400" />
              Blank = "{getCategoryById(values.category).name}"
            </span>
          </div>
          <input
            name="title"
            value={values.title}
            onChange={handleChange}
            placeholder={`e.g. Lunch with team, or leave empty for "${getCategoryById(values.category).name}"`}
            maxLength={80}
            className={`input-base ${errors.title ? 'input-error' : ''}`}
            id="title-input"
          />
          {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
        </div>

        {/* 5. Notes (Optional) */}
        <div className="mb-5">
          <label className="block text-xs text-gray-400 font-dm uppercase tracking-wider mb-1.5">
            Notes <span className="text-gray-600 font-normal lowercase">(optional)</span>
          </label>
          <input
            name="notes"
            value={values.notes}
            onChange={handleChange}
            placeholder="Extra details or payment method…"
            className="input-base text-xs"
            id="notes-input"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="btn-primary w-full py-3 text-sm font-syne font-bold shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-transform"
          id="submit-expense-btn"
        >
          {isEditing ? (
            <>
              <MdSave className="w-4 h-4" /> Save Changes
            </>
          ) : (
            <>
              <MdAdd className="w-4 h-4" /> Add Expense
            </>
          )}
        </button>

        {/* Cancel edit button */}
        {isEditing && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="w-full mt-2.5 py-2 text-xs font-dm text-gray-400 hover:text-gray-200 bg-white/5 hover:bg-white/10 rounded-lg transition-colors duration-200"
            id="cancel-edit-btn"
          >
            Cancel Edit
          </button>
        )}
      </form>
    </div>
  )
}
