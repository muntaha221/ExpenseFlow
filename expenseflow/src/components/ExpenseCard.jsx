import { MdEdit, MdDelete } from 'react-icons/md'
import { formatPKR, formatDateTime } from '../utils/calculations'
import CategoryBadge from './CategoryBadge'

export default function ExpenseCard({ expense, onEdit, onDelete, index }) {
  return (
    <div className="card p-4 animate-fade-in-up" style={{ animationDelay: `${index * 40}ms` }}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-100 truncate">{expense.title}</p>
          {expense.notes && (
            <p className="text-xs text-gray-500 mt-0.5 truncate">{expense.notes}</p>
          )}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <CategoryBadge categoryId={expense.category} />
            <span className="text-xs text-gray-500">{formatDateTime(expense.date)}</span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="font-syne font-bold text-emerald-400">{formatPKR(expense.amount)}</p>
          <div className="flex gap-1.5 mt-2 justify-end">
            <button className="btn-edit" onClick={() => onEdit(expense)}>
              <MdEdit className="w-3 h-3" />
            </button>
            <button className="btn-delete" onClick={() => onDelete(expense.id)}>
              <MdDelete className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
