/**
 * validation.js
 *
 * Centralised form-field validation.
 * WHY NOT VALIDATE INSIDE THE COMPONENT?
 * - Keeps the form component focused on rendering
 * - Easy to unit-test in isolation
 * - Same rules can be reused if we add a quick-add feature later
 *
 * Each validator returns an error string or '' (empty = valid).
 * validateExpense() runs all validators and returns { valid, errors }.
 */

/**
 * validateTitle — must be non-empty and at least 2 characters.
 * We trim to prevent whitespace-only titles.
 */
export function validateTitle(title) {
  const trimmed = (title || '').trim()
  if (!trimmed) return 'Title is required'
  if (trimmed.length < 2) return 'Title must be at least 2 characters'
  if (trimmed.length > 100) return 'Title must be under 100 characters'
  return ''
}

/**
 * validateAmount — must be a positive number.
 * We parse to float first, then check.
 * Zero is not allowed (an expense of Rs 0 makes no sense).
 */
export function validateAmount(amount) {
  if (amount === '' || amount === null || amount === undefined) return 'Amount is required'
  const num = Number(amount)
  if (isNaN(num)) return 'Amount must be a number'
  if (num <= 0) return 'Amount must be greater than zero'
  if (num > 10000000) return 'Amount seems too large'
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
 * We also reject future dates beyond today + 1 day
 * (small buffer for timezone differences).
 */
export function validateDate(date) {
  if (!date) return 'Date is required'
  const parsed = new Date(date)
  if (isNaN(parsed.getTime())) return 'Invalid date'
  
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  if (parsed > tomorrow) return 'Date cannot be in the future'
  return ''
}

/**
 * validateExpense — runs all field validators.
 * Returns { valid: boolean, errors: { title, amount, category, date } }
 *
 * Using an object of error messages allows the form to show
 * errors inline next to each field.
 */
export function validateExpense(expense) {
  const errors = {
    title: validateTitle(expense.title),
    amount: validateAmount(expense.amount),
    category: validateCategory(expense.category),
    date: validateDate(expense.date),
  }

  // Return the errors object directly so forms can display
  // field-level messages. Callers can derive `valid` if needed.
  return errors
}
