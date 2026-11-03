import { MdEdit, MdDelete } from 'react-icons/md'
import { formatPKR, getDayName, formatDateShort, formatTimeShort } from '../utils/calculations'
import CategoryBadge from './CategoryBadge'

export default function ExpenseCard({ expense, onEdit, onDelete, index }) {
  const dayName = getDayName(expense.date)
  const dateStr = formatDateShort(expense.date)
  const timeStr = formatTimeShort(expense.date)

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
            {/* Day name as primary, date below */}
            <div className="flex flex-col">
              <span className="text-xs font-dm font-semibold text-gray-300">{dayName}</span>
              <span className="text-[10px] text-gray-500">{dateStr} · {timeStr}</span>
            </div>
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
