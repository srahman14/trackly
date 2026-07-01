"use client"

import { memo, useEffect, useState } from "react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

// Static mock — module scope so it isn't recreated on every render.
// Replace with a query grouped by week once the jobs API is wired up.
const data = [
  { period: "Week 1", applications: 4 },
  { period: "Week 2", applications: 7 },
  { period: "Week 3", applications: 5 },
  { period: "Week 4", applications: 8 },
]

type ChartType = "area" | "line" | "bar"

const CHART_TYPES: { value: ChartType; label: string }[] = [
  { value: "area", label: "Area" },
  { value: "line", label: "Line" },
  { value: "bar", label: "Bar" },
]

function useIsDarkMode() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    const update = () => setIsDark(root.classList.contains("dark"))
    update()

    const observer = new MutationObserver(update)
    observer.observe(root, { attributes: true, attributeFilter: ["class"] })
    return () => observer.disconnect()
  }, [])

  return isDark
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded border border-zinc-200 bg-white px-3 py-2 font-mono text-xs shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
      <p className="mb-1 text-[10px] uppercase tracking-wide text-zinc-400 dark:text-zinc-600">
        {label}
      </p>
      <p className="font-semibold text-zinc-800 dark:text-zinc-200">
        {payload[0].value} applications
      </p>
    </div>
  )
}

// Segmented control matching the document-theme buttons used elsewhere on the dashboard.
function ChartTypeSwitch({
  value,
  onChange,
}: {
  value: ChartType
  onChange: (v: ChartType) => void
}) {
  return (
    <div className="flex overflow-hidden rounded border border-zinc-300 dark:border-zinc-700">
      {CHART_TYPES.map((t, i) => (
        <button
          key={t.value}
          onClick={() => onChange(t.value)}
          className={`px-2 py-0.5 text-[10px] uppercase tracking-wide transition-colors ${
            i > 0 ? "border-l border-zinc-300 dark:border-zinc-700" : ""
          } ${
            value === t.value
              ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
              : "text-zinc-500 hover:bg-zinc-50 dark:text-zinc-500 dark:hover:bg-zinc-900"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}

function ApplicationsChartComponent() {
  const isDark = useIsDarkMode()
  const [chartType, setChartType] = useState<ChartType>("area")

  const gridColor = isDark ? "#27272a" : "#e4e4e7"
  const tickColor = isDark ? "#71717a" : "#a1a1aa"
  const lineColor = isDark ? "#60a5fa" : "#1d4ed8"
  const cursorFill = isDark ? "#18181b" : "#f4f4f5"

  const sharedAxisProps = {
    tickLine: false,
    axisLine: false,
    tick: { fill: tickColor, fontSize: 11, fontFamily: "monospace" },
  }

  return (
    <div className="flex h-full w-full flex-col gap-3">
      <div className="flex justify-end">
        {/* SWITCH - to change type of chart */}
        {/* <ChartTypeSwitch value={chartType} onChange={setChartType} /> */}
      </div>

      <div className="min-h-0 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "area" ? (
            <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="applicationsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={lineColor} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={lineColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="period" {...sharedAxisProps} />
              <YAxis allowDecimals={false} width={28} {...sharedAxisProps} />
              <Tooltip cursor={{ stroke: gridColor }} content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="applications"
                stroke={lineColor}
                strokeWidth={2}
                fill="url(#applicationsFill)"
                dot={{ r: 3, fill: lineColor, strokeWidth: 0 }}
                activeDot={{ r: 4 }}
              />
            </AreaChart>
          ) : chartType === "line" ? (
            <LineChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="period" {...sharedAxisProps} />
              <YAxis allowDecimals={false} width={28} {...sharedAxisProps} />
              <Tooltip cursor={{ stroke: gridColor }} content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="applications"
                stroke={lineColor}
                strokeWidth={2}
                dot={{ r: 3, fill: lineColor, strokeWidth: 0 }}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          ) : (
            <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
              <XAxis dataKey="period" {...sharedAxisProps} />
              <YAxis allowDecimals={false} width={28} {...sharedAxisProps} />
              <Tooltip cursor={{ fill: cursorFill }} content={<CustomTooltip />} />
              <Bar dataKey="applications" fill={lineColor} radius={[3, 3, 0, 0]} maxBarSize={36} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export const ApplicationsChart = memo(ApplicationsChartComponent)