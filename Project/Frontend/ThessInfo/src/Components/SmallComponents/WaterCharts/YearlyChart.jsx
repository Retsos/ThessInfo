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
  'Συγκέντρωση ιόντων υδρογόνου': 'pH',
  'Υπολειμματικό χλώριο': 'Υπολ. Χλώριο'
};

// συντόμευση μεγάλων αριθμών
const abbreviate = v =>
  v >= 1000 ? (v/1000).toFixed(1) + 'k' : v;

// custom tooltip: ταξινόμηση κατά φθίνουσα τιμή, null τελευταίο
const CustomTooltip = ({ active, payload, label }) => {
  if (!active) return null;
  // χτίζω array { key, color, value }
  const entries = Object.keys(paramNames).map((key,i) => {
    const found = payload?.find(p => p.dataKey === key);
    return {
      key,
      color: COLORS[i % COLORS.length],
      value: found?.value ?? null
    };
  })
  .sort((a,b) => (b.value ?? -Infinity) - (a.value ?? -Infinity));

  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipTitle}>{label}</div>
      {entries.map(e => (
        <div key={e.key} className={styles.tooltipRow}>
          <span
            className={styles.tooltipDot}
            style={{ backgroundColor: e.color }}
          />
          <span className={styles.tooltipName}>
            {paramNames[e.key]}:
          </span>
          <span className={styles.tooltipValue}>
            {e.value != null
              ? e.value.toFixed(2)
              : '–'}
          </span>
        </div>
      ))}
    </div>
  );
};


export default function YearlyChart({ yearlyData }) {
  // responsive breakpoints
  const isNarrow = useMediaQuery({ query: '(max-width:480px)' });
  const hideLegend = useMediaQuery({ query: '(max-width:360px)' });

  // χρόνια
  const years = useMemo(() =>
    Object.keys(yearlyData)
      .filter(k => /^\d{4}$/.test(k))
      .sort((a,b) => +a - +b),
    [yearlyData]
  );

  // παράμετροι
  const params = useMemo(() => {
    const s = new Set();
    years.forEach(y =>
      Object.keys(yearlyData[y].parameters).forEach(p => s.add(p))
    );
    return Array.from(s);
  }, [years, yearlyData]);

  // data array
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
    return <p className={styles.empty}>Δεν υπάρχουν δεδομένα.</p>;
  }

  return (
    <div className={styles.wrapper}>
      {/* 1. Τίτλος */}
      <h3 className={styles.chartTitle}>
        Εξέλιξη Παραμέτρων ανά Έτος
      </h3>

      <ResponsiveContainer width="100%" height={isNarrow ? 250 : 350}>
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: isNarrow ? 5 : 20,
            bottom: isNarrow ? 20 : 10,
            left: isNarrow ? 5 : 15
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="year"
            tick={{ fill: '#333', fontSize: isNarrow ? 10 : 12 }}
            axisLine={{ stroke: '#333' }}
            label={
              isNarrow
                ? null
                : { value: 'Έτος', position:'insideBottom', offset:-5 }
            }
          />

          <YAxis
            hide={isNarrow}
            tickCount={5}
            tickFormatter={abbreviate}
            label={
              isNarrow
                ? null
                : {
                    value: 'Μέση Τιμή',
                    angle: -90,
                    position: 'insideLeft',
                    offset: -5
                  }
            }
            tick={{ fill:'#333', fontSize:12 }}
            axisLine={{ stroke:'#333' }}
          />

          <Tooltip content={<CustomTooltip />} />
          
          {!hideLegend && (
            <Legend
              verticalAlign="top"
              wrapperStyle={{ paddingBottom:4, fontSize:11 }}
            />
          )}

          {params.map((p,i) => (
            <Line
              key={p}
              dataKey={p}
              name={paramNames[p] || p}
              stroke={COLORS[i % COLORS.length]}
              dot={isNarrow ? false : { r: 3 }}
              activeDot={isNarrow ? false : { r: 5 }}
              connectNulls={false}
              isAnimationActive={false}
            />
          ))}

        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
