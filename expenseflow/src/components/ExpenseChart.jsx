/**
 * ExpenseChart.jsx
 *
 * Visualises expense data with two charts:
 *  1. Pie chart — category-wise breakdown (which categories eat the budget)
 *  2. Bar chart — monthly spending trend (is spending going up or down?)
 *
 * WHY TWO CHARTS?
 * - Pie shows composition ("where does money go?")
 * - Bar shows trend ("how does spending change over time?")
 * - Together they give a complete picture
 *
 * WHY RECHARTS?
 * - Lightweight, React-native charting library
 * - Declarative API matches React's paradigm
 * - Built-in responsive containers
 * - Specified in project requirements
 *
 * Props:
 *   expenses (Array) — all expense objects
 */
import { useMemo, useState } from 'react'
import {
  PieChart, Pie, Cell, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
} from 'recharts'
import { getCategoryBreakdown, getMonthlyBreakdown } from '../utils/calculations'
import { HiOutlineChartPie, HiOutlineChartBar } from 'react-icons/hi2'

/**
 * CustomTooltip — styled tooltip matching our dark theme.
 * Recharts allows passing a custom component for tooltips.
 */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-gray-800/95 backdrop-blur-xl border border-gray-700/50
      rounded-lg px-3 py-2 shadow-xl">
      <p className="text-xs text-gray-400 mb-0.5">{label || payload[0].name}</p>
      <p className="text-sm font-syne font-bold text-emerald-400">
        {new Intl.NumberFormat('en-PK', {
          style: 'currency', currency: 'PKR',
          minimumFractionDigits: 0, maximumFractionDigits: 0,
        }).format(payload[0].value)}
      </p>
    </div>
  )
}

/**
 * Custom label for pie chart slices.
 * Shows percentage on each slice for quick reading.
 */
function renderCustomLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }) {
  if (percent < 0.05) return null // Don't show label for tiny slices
  const RADIAN = Math.PI / 180
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)
  return (
    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central"
      fontSize={11} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export default function ExpenseChart({ expenses }) {
  const [activeTab, setActiveTab] = useState('pie')

  const categoryData = useMemo(() => getCategoryBreakdown(expenses), [expenses])
  const monthlyData = useMemo(() => getMonthlyBreakdown(expenses), [expenses])

  // Empty state
  if (expenses.length === 0) {
    return (
      <div className="card p-8 text-center" id="chart-section">
        <div className="text-4xl mb-3">📊</div>
        <p className="text-sm text-gray-500 font-dm">
          Add some expenses to see charts here
        </p>
      </div>
    )
  }

  return (
    <div className="card overflow-hidden" id="chart-section">
      {/* Tab switcher */}
      <div className="flex items-center border-b border-gray-800 px-5 pt-4">
        <button
          onClick={() => setActiveTab('pie')}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-dm font-medium
            border-b-2 transition-all duration-200 -mb-px
            ${activeTab === 'pie'
              ? 'border-emerald-400 text-emerald-400'
              : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          id="chart-tab-pie"
        >
          <HiOutlineChartPie className="w-4 h-4" />
          By Category
        </button>
        <button
          onClick={() => setActiveTab('bar')}
          className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-dm font-medium
            border-b-2 transition-all duration-200 -mb-px
            ${activeTab === 'bar'
              ? 'border-emerald-400 text-emerald-400'
              : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
          id="chart-tab-bar"
        >
          <HiOutlineChartBar className="w-4 h-4" />
          Monthly Trend
        </button>
      </div>

      <div className="p-5">
        {activeTab === 'pie' ? (
          /* ── PIE CHART ── */
          <div className="flex flex-col lg:flex-row items-center gap-6">
            <div className="w-full lg:w-1/2" style={{ height: '250px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={110}
                    paddingAngle={3}
                    dataKey="value"
                    labelLine={false}
                    label={renderCustomLabel}
                    stroke="none"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.hex} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend */}
            <div className="w-full lg:w-1/2 space-y-2">
              {categoryData.map(item => {
                const total = categoryData.reduce((s, d) => s + d.value, 0)
                const pct = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0
                return (
                  <div key={item.id} className="flex items-center gap-3 py-1.5">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.hex }}
                    />
                    <span className="text-sm text-gray-300 flex-1 truncate">{item.name}</span>
                    <span className="text-xs text-gray-500">{pct}%</span>
                    <span className="text-sm font-syne font-semibold text-gray-200 tabular-nums">
                      {new Intl.NumberFormat('en-PK', { style: 'currency', currency: 'PKR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(item.value)}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          /* ── BAR CHART ── */
          <div style={{ height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  tickFormatter={v => v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(52, 211, 153, 0.05)' }} />
                <Bar
                  dataKey="amount"
                  fill="#34d399"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={50}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}
