import { MdEdit, MdDelete } from 'react-icons/md'
import { formatPKR, formatDateShort, formatTimeShort } from '../utils/calculations'
import CategoryBadge from './CategoryBadge'
import { HiOutlineCalendar } from 'react-icons/hi2'

export default function ExpenseCard({ expense, onEdit, onDelete, index }) {
  const dateStr = formatDateShort(expense.date)
  const timeStr = formatTimeShort(expense.date)

  return (
    <div className="card p-4 animate-fade-in-up" style={{ animationDelay: `${index * 40}ms` }}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Day as Title */}
          <p className="font-dm font-semibold text-gray-100 text-sm truncate">
            {expense.title}
          </p>
          {/* Date & Time below Title */}
          <div className="flex items-center gap-1.5 text-[11px] text-gray-400 mt-0.5">
            <HiOutlineCalendar className="w-3 h-3 text-emerald-400 shrink-0" />
            <span>{dateStr} · {timeStr}</span>
          </div>

          {expense.notes && (
            <p className="text-xs text-gray-500 mt-1 truncate">{expense.notes}</p>
          )}

          <div className="mt-2.5">
            <CategoryBadge categoryId={expense.category} />
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
