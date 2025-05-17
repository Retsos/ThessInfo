// src/Components/SmallComponents/YearlyChart.jsx
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

const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658',
  '#ff7300', '#413ea0', '#00c49f', '#ff8042'
];

const paramNames = {
  'Θολότητα NTU': 'Θολότητα NTU',
  'Χρώμα': 'Χρώμα',
  'Αργίλιο': 'Αργίλιο',
  'Χλωριούχα': 'Χλωριούχα',
  'Αγωγιμότητα': 'Αγωγιμότητα',
  'Συγκέντρωση ιόντων υδρογόνου': 'Συγκέντρωση ιόντων υδρογόνου',
  'Υπολειμματικό χλώριο': 'Υπολειμματικό χλώριο'
};

// abbreviate >1000 to “k”
const abbreviate = v =>
  v >= 1000 ? (v/1000).toFixed(1) + ' k' : v;

// Sort tooltip entries by value desc, nulls last
const CustomTooltip = ({ active, payload, label }) => {
  if (!active) return null;

  const entries = Object.keys(paramNames).map((key, idx) => {
    const found = payload?.find(p => p.dataKey === key);
    return {
      key,
      color: COLORS[idx % COLORS.length],
      value: found?.value ?? null
    };
  })
  .sort((a,b) => (b.value ?? -Infinity) - (a.value ?? -Infinity));

  return (
    <div className={styles.tooltip}>
      <strong className={styles.tooltipTitle}>{label}</strong>
      {entries.map(e => (
        <div key={e.key} className={styles.tooltipRow}>
          <span
            className={styles.tooltipDot}
            style={{ background: e.color }}
          />
          <span className={styles.tooltipName}>{e.key}:</span>
          <span className={styles.tooltipValue}>
            {e.value != null
              ? e.value.toFixed(2)
              : 'Δεν υπάρχει μέτρηση'}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function YearlyChart({ yearlyData }) {
  // hide axes under 400px
  const isNarrow = useMediaQuery({ query: '(max-width:400px)' });

  const years = useMemo(() =>
    Object.keys(yearlyData)
      .filter(k => /^\d{4}$/.test(k))
      .sort((a,b) => +a - +b),
    [yearlyData]
  );

  const params = useMemo(() => {
    const s = new Set();
    years.forEach(y => {
      Object.keys(yearlyData[y].parameters).forEach(p => s.add(p));
    });
    return Array.from(s);
  }, [years, yearlyData]);

  const chartData = useMemo(() =>
    years.map(year => {
      const row = { year };
      params.forEach(p => {
        row[p] = yearlyData[year].parameters[p]?.average ?? null;
      });
      return row;
    }),
  [years, params, yearlyData]);

  if (!chartData.length) {
    return <p className={styles.empty}>Δεν υπάρχουν δεδομένα για το chart.</p>;
  }

  return (
    <div className={styles.container}>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={chartData} margin={{ top: -5, right:5, bottom:10, left:15 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="year"
            tick={{ fill:'#333', fontSize:12 }}
            axisLine={{ stroke:'#333' }}
            label={{ value:'Έτος', position:'insideBottom', offset:-10 }}
          />
          <YAxis
            hide={isNarrow}
            tickCount={5}
            tickFormatter={abbreviate}
            label={{
              value:'Μέση Τιμή',
              angle:-90,
              position:'insideLeft',
              offset:-5
            }}
            tick={{ fill:'#333', fontSize:12 }}
            axisLine={{ stroke:'#333' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: 5 ,fontSize:13 }} />
          {params.map((p, i) => (
            <Line
              key={p}
              dataKey={p}
              name={p}
              stroke={COLORS[i % COLORS.length]}
              dot={{ r:4 }}
              activeDot={{ r:6 }}
              connectNulls={false}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
