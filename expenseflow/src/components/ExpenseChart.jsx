/**
 * ExpenseChart.jsx
 *
 * Visualises daily expense usage with a dedicated Bar Chart:
 * Shows daily usage (day-by-day spend) rather than month-wise.
 */
import { useMemo } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from 'recharts'
import { getDailyUsageData, formatPKR } from '../utils/calculations'
import { HiOutlineChartBar } from 'react-icons/hi2'

/**
 * CustomTooltip — styled tooltip matching our theme.
 */
function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const data = payload[0].payload
  return (
    <div className="bg-gray-900/95 backdrop-blur-xl border border-gray-700/60 rounded-xl px-3.5 py-2.5 shadow-2xl">
      <p className="text-xs text-gray-400 font-dm mb-1">{data.fullDate || data.day}</p>
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400" />
        <p className="text-sm font-syne font-bold text-emerald-400">
          {formatPKR(payload[0].value)}
        </p>
      </div>
    </div>
  )
}

export default function ExpenseChart({ expenses, selectedMonth }) {
  const dailyData = useMemo(() => {
    return getDailyUsageData(expenses, selectedMonth)
  }, [expenses, selectedMonth])

  const totalPeriodSpend = useMemo(() => {
    return dailyData.reduce((sum, d) => sum + d.amount, 0)
  }, [dailyData])

  const activeDaysCount = useMemo(() => {
    return dailyData.filter(d => d.amount > 0).length
  }, [dailyData])

  // Empty state
  if (expenses.length === 0) {
    return (
      <div className="card p-8 text-center" id="chart-section">
        <div className="text-4xl mb-3">📊</div>
        <p className="text-sm text-gray-400 font-syne font-semibold mb-1">
          No Daily Spending Yet
        </p>
        <p className="text-xs text-gray-500 font-dm">
          Add an expense to view daily usage on the chart
        </p>
      </div>
    )
  }

  return (
    <div className="card overflow-hidden" id="chart-section">
      {/* Header — clean Bar Chart title only */}
      <div className="flex items-center justify-between border-b border-gray-800/80 px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-400/10 border border-emerald-400/20 flex items-center justify-center">
            <HiOutlineChartBar className="w-4 h-4 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-sm font-syne font-bold text-gray-100">
              Daily Usage
            </h3>
            <p className="text-[11px] text-gray-500 font-dm">
              Daily spending breakdown
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-gray-400 font-dm block">Total:</span>
          <span className="text-sm font-syne font-bold text-emerald-400">
            {formatPKR(totalPeriodSpend)}
          </span>
        </div>
      </div>

      {/* Bar Chart Area */}
      <div className="p-5">
        <div style={{ height: '260px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyData} barCategoryGap="15%">
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                interval={dailyData.length > 15 ? 1 : 0}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: '#9ca3af' }}
                tickFormatter={v => (v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v)}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(52, 211, 153, 0.08)' }} />
              <Bar
                dataKey="amount"
                fill="#34d399"
                radius={[6, 6, 0, 0]}
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="flex items-center justify-between text-[11px] text-gray-500 font-dm mt-3 pt-3 border-t border-gray-800/60">
          <span>{dailyData.length} days recorded this month</span>
          <span>{activeDaysCount} days with spending</span>
        </div>
      </div>
    </div>
  )
}
