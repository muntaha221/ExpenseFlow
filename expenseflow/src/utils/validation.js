/**
 * validation.js
 *
 * Centralised form-field validation.
 * Optimized for personal fast expense entry:
 * - Title is now optional (auto-defaults to category name if left blank)
 * - Amount is required (> 0)
 * - Category is required
 * - Date is required
 */

/**
 * validateTitle — optional for quick adding. If provided, check length.
 */
export function validateTitle(title) {
  const trimmed = (title || '').trim()
  if (trimmed && trimmed.length > 100) return 'Title must be under 100 characters'
  return ''
}

/**
 * validateAmount — must be a positive number.
 */
export function validateAmount(amount) {
  if (amount === '' || amount === null || amount === undefined) return 'Amount is required'
  const num = Number(amount)
  if (isNaN(num)) return 'Amount must be a number'
  if (num <= 0) return 'Amount must be greater than zero'
  if (num > 100000000) return 'Amount seems too large'
  return ''
}

/**
 * validateCategory — must be a non-empty selection.
 */
export function validateCategory(category) {
  if (!category) return 'Please select a category'
  return ''
}

/**
 * validateDate — must be a valid date string.
 */
export function validateDate(date) {
  if (!date) return 'Date is required'
  const parsed = new Date(date)
  if (isNaN(parsed.getTime())) return 'Invalid date'
  return ''
}

/**
 * validateExpense — runs all field validators.
 */
export function validateExpense(expense) {
  const errors = {
    title: validateTitle(expense.title),
    amount: validateAmount(expense.amount),
    category: validateCategory(expense.category),
    date: validateDate(expense.date),
  }

  return errors
}
