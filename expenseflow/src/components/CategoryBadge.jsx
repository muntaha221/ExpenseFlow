/**
 * CategoryBadge.jsx
 *
 * A small coloured pill that displays a category's icon + name.
 * Used in expense cards and table rows for instant visual recognition.
 *
 * WHY A SEPARATE COMPONENT?
 * - Reused in ExpenseCard, ExpenseList table rows, and SummarySection
 * - Centralises the look-up from category ID → visual representation
 * - If we change badge styling, it updates everywhere
 *
 * Props:
 *   categoryId (string) — the category's id (e.g., 'food')
 */
import { getCategoryById } from '../utils/categories'

export default function CategoryBadge({ categoryId }) {
  const category = getCategoryById(categoryId)
  const Icon = category.icon

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium
        ${category.bg} ${category.text} ${category.border} border`}
    >
      <Icon className="w-3.5 h-3.5" />
      {category.name}
    </span>
  )
}
