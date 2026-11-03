/**
 * calculations.js
 *
 * Pure functions for deriving summary statistics from expense data.
 */
import { getCategoryById } from './categories'

/**
 * getTotalAmount — sums all expense amounts.
 */
export function getTotalAmount(expenses) {
  return expenses.reduce((sum, e) => sum + Number(e.amount), 0)
}

/**
 * getAverageAmount — total / count, or 0 if no expenses.
 */
export function getAverageAmount(expenses) {
  if (expenses.length === 0) return 0
  return getTotalAmount(expenses) / expenses.length
}

/**
 * getCategoryBreakdown — groups expenses by category.
 */
export function getCategoryBreakdown(expenses) {
  const map = new Map()

  expenses.forEach(e => {
    const current = map.get(e.category) || 0
    map.set(e.category, current + Number(e.amount))
  })

  return Array.from(map.entries())
    .map(([catId, total]) => {
      const cat = getCategoryById(catId)
      return { name: cat.name, value: total, hex: cat.hex, id: catId }
    })
    .sort((a, b) => b.value - a.value)
}

/**
 * getDailyUsageData — Daily spending usage for Bar Graph
 * 
 * Groups expenses by day for the active month.
 * Returns each day's label, date, and total amount.
 */
export function getDailyUsageData(expenses, selectedMonth) {
  const now = new Date()
  let year, month
  if (selectedMonth) {
    const parts = selectedMonth.split('-').map(Number)
    year = parts[0]
    month = parts[1] - 1
  } else {
    year = now.getFullYear()
    month = now.getMonth()
  }

  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const isCurrentMonth = selectedMonth === currentMonthKey || !selectedMonth

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const maxDay = isCurrentMonth ? Math.max(now.getDate(), 1) : daysInMonth

  // Map of dayNumber -> total spend
  const dayMap = new Map()
  expenses.forEach(e => {
    const d = new Date(e.date)
    if (d.getFullYear() === year && d.getMonth() === month) {
      const dayNum = d.getDate()
      dayMap.set(dayNum, (dayMap.get(dayNum) || 0) + Number(e.amount))
    }
  })

  // Build daily entries from day 1 to maxDay
  const data = []
  for (let dayNum = 1; dayNum <= maxDay; dayNum++) {
    const d = new Date(year, month, dayNum)
    const weekdayShort = d.toLocaleDateString('en-US', { weekday: 'short' })
    const monthShort = d.toLocaleDateString('en-US', { month: 'short' })
    const weekdayLong = d.toLocaleDateString('en-US', { weekday: 'long' })
    const amount = dayMap.get(dayNum) || 0

    data.push({
      day: `${weekdayShort} ${dayNum}`,
      fullDate: `${weekdayLong}, ${monthShort} ${dayNum}`,
      dayNum,
      amount,
    })
  }

  return data
}

/**
 * getTopCategory — finds the category with the highest total spending.
 */
export function getTopCategory(expenses) {
  if (expenses.length === 0) return null
  const breakdown = getCategoryBreakdown(expenses)
  if (breakdown.length === 0) return null
  return { name: breakdown[0].name, total: breakdown[0].value }
}

/**
 * getRolling7DayStats — Trailing 7-Day Dynamic Window
 */
export function getRolling7DayStats(expenses) {
  const now = new Date()
  const windowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6)
  windowStart.setHours(0, 0, 0, 0)
  
  const windowEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  windowEnd.setHours(23, 59, 59, 999)

  let total = 0
  let count = 0

  expenses.forEach(e => {
    const d = new Date(e.date)
    if (d >= windowStart && d <= windowEnd) {
      total += Number(e.amount)
      count += 1
    }
  })

  const dailyAvg = total / 7

  return { total, dailyAvg, count }
}

/**
 * getSmartMonthlyProjection — Dynamic Run-Rate Monthly Forecast
 */
export function getSmartMonthlyProjection(expenses, selectedMonth) {
  const now = new Date()
  
  let year, month
  if (selectedMonth) {
    const parts = selectedMonth.split('-').map(Number)
    year = parts[0]
    month = parts[1] - 1
  } else {
    year = now.getFullYear()
    month = now.getMonth()
  }
  
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  const isCurrentMonth = selectedMonth === currentMonthKey || !selectedMonth
  
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const currentDay = isCurrentMonth ? now.getDate() : daysInMonth
  const remainingDays = isCurrentMonth ? Math.max(0, daysInMonth - currentDay) : 0

  let mtdTotal = 0
  const dailyTotals = {}
  
  expenses.forEach(e => {
    const amt = Number(e.amount)
    mtdTotal += amt
    
    const d = new Date(e.date)
    const dayNum = d.getDate()
    dailyTotals[dayNum] = (dailyTotals[dayNum] || 0) + amt
  })

  // 4 weekly blocks
  const weeklyTotals = []
  const weeksCompleted = []
  
  for (let w = 0; w < 4; w++) {
    const weekStart = w * 7 + 1
    const weekEnd = w === 3 ? daysInMonth : (w + 1) * 7
    let weekTotal = 0
    let hasData = false
    
    for (let d = weekStart; d <= weekEnd; d++) {
      if (dailyTotals[d]) {
        weekTotal += dailyTotals[d]
        hasData = true
      }
    }
    
    const weekFullyPast = isCurrentMonth ? weekEnd < currentDay : true
    
    if (hasData) {
      weeklyTotals.push(weekTotal)
    }
    if (weekFullyPast && hasData) {
      weeksCompleted.push(weekTotal)
    }
  }
  
  const weeklyAvg = weeksCompleted.length > 0
    ? weeksCompleted.reduce((s, w) => s + w, 0) / weeksCompleted.length
    : (weeklyTotals.length > 0
      ? weeklyTotals.reduce((s, w) => s + w, 0) / weeklyTotals.length
      : 0)

  const daysWithData = Object.keys(dailyTotals).length
  let dailyBurnRate = 0
  
  if (daysWithData > 0) {
    const elapsedDays = isCurrentMonth ? currentDay : daysInMonth
    dailyBurnRate = mtdTotal / elapsedDays
  }
  
  let projectedTotal = mtdTotal
  if (isCurrentMonth && remainingDays > 0) {
    if (weeksCompleted.length >= 1) {
      const remainingWeeks = remainingDays / 7
      projectedTotal = Math.round(mtdTotal + (weeklyAvg * remainingWeeks))
    } else {
      projectedTotal = Math.round(mtdTotal + (dailyBurnRate * remainingDays))
    }
  }

  return {
    mtdTotal,
    daysInMonth,
    currentDay,
    remainingDays,
    dailyBurnRate: Math.round(dailyBurnRate),
    projectedTotal,
    weeklyAvg: Math.round(weeklyAvg),
  }
}

/**
 * formatPKR — formats a number as PKR currency without fractional digits.
 */
export function formatPKR(amount) {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency', currency: 'PKR',
    minimumFractionDigits: 0, maximumFractionDigits: 0,
  }).format(Number(amount))
}

/**
 * formatDateShort — short date (e.g. "Nov 3, 2026").
 */
export function formatDateShort(dateStr) {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    })
  } catch (e) {
    return dateStr
  }
}

/**
 * formatTimeShort — short time (e.g. "2:30 PM").
 */
export function formatTimeShort(dateStr) {
  try {
    return new Date(dateStr).toLocaleString('en-US', {
      hour: 'numeric', minute: '2-digit',
    })
  } catch (e) {
    return ''
  }
}

/**
 * getDayName — returns the full day name (e.g. "Monday", "Tuesday").
 */
export function getDayName(dateStr) {
  try {
    const d = dateStr ? new Date(dateStr) : new Date()
    if (isNaN(d.getTime())) return ''
    return d.toLocaleDateString('en-US', { weekday: 'long' })
  } catch (e) {
    return ''
  }
}
