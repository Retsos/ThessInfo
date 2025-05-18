// src/Components/SmallComponents/AirYearlyChart.jsx
import React, { useMemo } from 'react';
import { useMediaQuery } from 'react-responsive';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import styles from './YearlyChart.module.css';

// Color palette
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#413ea0'];

// Parameter labels
const PARAM_LABELS = {
  co_conc: 'CO',
  no2_conc: 'NO₂',
  no_conc: 'NO',
  o3_conc: 'O₃',
  so2_conc: 'SO₂'
};

// Abbreviate large numbers
const abbreviate = v => (v >= 1000 ? `${(v/1000).toFixed(1)}k` : v);

// Custom tooltip: sort entries by value desc, nulls last
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload) return null;

  const entries = payload
    .map((p, i) => ({
      key: p.dataKey,
      label: PARAM_LABELS[p.dataKey] || p.dataKey,
      value: p.value,
      color: COLORS[i % COLORS.length]
    }))
    .sort((a, b) => {
      if (a.value == null) return 1;
      if (b.value == null) return -1;
      return b.value - a.value;
    });

  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipTitle}>{label}</div>
      {entries.map(e => (
        <div key={e.key} className={styles.tooltipRow}>
          <span
            className={styles.tooltipDot}
            style={{ backgroundColor: e.color }}
          />
          <span className={styles.tooltipName}>{e.label}:</span>
          <span className={styles.tooltipValue}>
            {e.value != null ? e.value.toFixed(2) : '–'}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function AirYearlyChart({ yearlyData = {} }) {
  // Responsive toggle
  const isNarrow = useMediaQuery({ query: '(max-width:400px)' });

  // Year keys
  const years = useMemo(
    () =>
      Object.keys(yearlyData)
        .filter(k => /^\d{4}$/.test(k))
        .sort((a, b) => +a - +b),
    [yearlyData]
  );

  // Parameter keys
  const params = useMemo(() => {
    const set = new Set();
    years.forEach(year => {
      const avg = yearlyData[year]?.averages || {};
      Object.keys(avg).forEach(p => set.add(p));
    });
    return Array.from(set);
  }, [years, yearlyData]);

  // Chart data
  const chartData = useMemo(
    () =>
      years.map(year => {
        const row = { year };
        const avg = yearlyData[year]?.averages || {};
        params.forEach(p => {
          row[p] = avg[p] != null ? avg[p] : null;
        });
        return row;
      }),
    [years, params, yearlyData]
  );

  if (!chartData.length) {
    return <p className={styles.empty}>Δεν υπάρχουν δεδομένα για το διάγραμμα.</p>;
  }

  return (
    <div className={styles.container}>
      {/* Νέος τίτλος */}
      <h4 className={styles.title}>
        Εξέλιξη Ρύπων ανά Έτος
      </h4>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={chartData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="year"
            tick={{ fill: '#333', fontSize: 12 }}
            axisLine={{ stroke: '#333' }}
            label={{ value: 'Έτος', position: 'insideBottom', offset: -5 }}
          />
          <YAxis
            hide={isNarrow}
            tickCount={5}
            tickFormatter={abbreviate}
            label={{
              value: 'Συγκέντρωση (μg/m³)',
              angle: -90,
              position: 'insideLeft',
              offset: 0
            }}
            tick={{ fill: '#333', fontSize: 12 }}
            axisLine={{ stroke: '#333' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: 5, fontSize: 13 }} />
          {params.map((p, idx) => (
            <Line
              key={p}
              dataKey={p}
              name={PARAM_LABELS[p] || p}
              stroke={COLORS[idx % COLORS.length]}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              connectNulls={false}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
