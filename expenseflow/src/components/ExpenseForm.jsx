/**
 * ExpenseForm.jsx
 *
 * Handles BOTH adding a new expense AND editing an existing one.
 *
 * HOW:
 * - If `editingExpense` prop is null → "Add" mode (form starts empty)
 * - If `editingExpense` is an object → "Edit" mode (form pre-filled)
 *
 * This avoids duplicating form UI for two very similar actions.
 *
 * Props:
 *   - onAdd(expenseData)     — called when a new expense is submitted
 *   - editingExpense         — expense object to edit, or null
 *   - onUpdate(expenseData)  — called when an edited expense is saved
 *   - onCancelEdit()         — cancels edit mode
 */

import { useState, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { validateExpense } from '../utils/validation'
import { CATEGORIES } from '../utils/categories'
import { MdAdd, MdSave } from 'react-icons/md'

const EMPTY_FORM = {
  title:    '',
  amount:   '',
  category: '',
  date:     new Date().toISOString().split('T')[0], // today as default
  notes:    '',
}

export default function ExpenseForm({ onAdd, editingExpense, onUpdate, onCancelEdit }) {
  const [values, setValues] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})

  /**
   * useEffect watches editingExpense.
   * When it changes to a real expense, we populate the form.
   * When it goes back to null (cancel/save), we reset.
   */
  useEffect(() => {
    if (editingExpense) {
      setValues({
        title:    editingExpense.title,
        amount:   editingExpense.amount,
        category: editingExpense.category,
        date:     editingExpense.date,
        notes:    editingExpense.notes || '',
      })
    } else {
      setValues(EMPTY_FORM)
      setErrors({})
    }
  }, [editingExpense])

  // Generic change handler — works for input, select, textarea
  // Uses computed property name [e.target.name] to update the right field
  function handleChange(e) {
    const { name, value } = e.target
    setValues(prev => ({ ...prev, [name]: value }))
    // Clear the error for this field as the user types
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  function handleSubmit(e) {
    e.preventDefault() // stop browser page reload

    // Run all validations
    const errs = validateExpense(values)
    const hasErrors = Object.values(errs).some(v => v && v.length > 0)
    if (hasErrors) {
      setErrors(errs)
      return // stop if there are errors
    }

    if (editingExpense) {
      // UPDATE: merge new values into the existing expense object
      onUpdate({ ...editingExpense, ...values, amount: parseFloat(values.amount) })
    } else {
      // ADD: create a new expense with a unique id
      onAdd({ ...values, amount: parseFloat(values.amount), id: uuidv4() })
      setValues(EMPTY_FORM) // reset form after adding
    }
    setErrors({})
  }

  const isEditing = Boolean(editingExpense)

  return (
    <div className="card p-6">
      {/* Panel title */}
      <div className="flex items-center gap-2 mb-6">
        <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#4ade80]" />
        <h2 className="font-syne font-bold text-base">
          {isEditing ? 'Edit Expense' : 'Add New Expense'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} noValidate>

        {/* Title */}
        <div className="mb-4">
          <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">
            Title *
          </label>
          <input
            name="title"
            value={values.title}
            onChange={handleChange}
            placeholder='e.g. Dinner with friends'
            maxLength={80}
            className={`input-base ${errors.title ? 'input-error' : ''}`}
          />
          {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
        </div>

        {/* Amount + Category in a 2-column row */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">
              Amount (PKR) *
            </label>
            <input
              name="amount"
              type="number"
              value={values.amount}
              onChange={handleChange}
              placeholder="0.00"
              min="0.01"
              step="0.01"
              className={`input-base ${errors.amount ? 'input-error' : ''}`}
            />
            {errors.amount && <p className="text-red-400 text-xs mt-1">{errors.amount}</p>}
          </div>
          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">
              Category *
            </label>
            <select
              name="category"
              value={values.category}
              onChange={handleChange}
              className={`input-base ${errors.category ? 'input-error' : ''}`}
            >
              <option value="">— Select —</option>
              {CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            {errors.category && <p className="text-red-400 text-xs mt-1">{errors.category}</p>}
          </div>
        </div>

        {/* Date */}
        <div className="mb-4">
          <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">
            Date *
          </label>
          <input
            name="date"
            type="date"
            value={values.date}
            onChange={handleChange}
            className={`input-base ${errors.date ? 'input-error' : ''}`}
          />
          {errors.date && <p className="text-red-400 text-xs mt-1">{errors.date}</p>}
        </div>

        {/* Notes */}
        <div className="mb-5">
          <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">
            Notes <span className="normal-case">(optional)</span>
          </label>
          <textarea
            name="notes"
            value={values.notes}
            onChange={handleChange}
            placeholder="Any extra details…"
            rows={3}
            className="input-base resize-none"
          />
        </div>

        {/* Submit */}
        <button type="submit" className="btn-primary">
          {isEditing
            ? <><MdSave className="w-4 h-4" /> Save Changes</>
            : <><MdAdd  className="w-4 h-4" /> Add Expense</>}
        </button>

        {/* Cancel edit */}
        {isEditing && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="w-full mt-2 py-2 text-sm text-gray-500 hover:text-gray-300
                       bg-gray-800/50 rounded-lg transition-colors duration-200"
          >
            Cancel
          </button>
        )}
      </form>
    </div>
  )
}
