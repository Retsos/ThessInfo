// src/Components/SmallComponents/RecycleCharts/OtaYearlyChart.jsx
import React, { useState, useMemo } from 'react';
import styles from './OtaYearlyChart.module.css';
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

const GREEK_MONTH_ORDER = [
  "Ιαν", "Φεβ", "Μαρ", "Απρ", "Μαϊ",
  "Ιουν", "Ιουλ", "Αυγ", "Σεπ", "Οκτ", "Νοε", "Δεκ"
];

const OtaYearlyChart = ({ data }) => {
  // βγάζουμε τα έτη από το data.Yearly_Stats
  const years = useMemo(
    () =>
      Object.keys(data.Yearly_Stats || {})
        .filter(k => /^\d{4}$/.test(k))
        .sort((a, b) => +b - +a), // newest first
    [data]
  );

  const [activeYear, setActiveYear] = useState(years[0]);

  // φτιάχνουμε το chartData στο order των μηνών
  const chartData = useMemo(() => {
    if (!activeYear) return [];
    const monthly = data.Yearly_Stats[activeYear]?.Detailed_Monthly_Data || {};
    return GREEK_MONTH_ORDER.map(m => ({
      month: m,
      value: monthly[m] != null ? monthly[m] : null
    }));
  }, [activeYear, data]);

  return (
    <div className={styles.container}>
      <h4 className={styles.title}>
        Ανακύκλωσιμα Υλικά Σε Κέντρο Διαλογής (kg/ΟΤΑ)
      </h4>

      {/* tabs */}
      <div className={styles.tabs}>
        {years.map(year => (
          <button
            key={year}
            className={`${styles.tab} ${
              year === activeYear ? styles.active : ''
            }`}
            onClick={() => setActiveYear(year)}
          >
            {year}
          </button>
        ))}
      </div>

      {/* chart */}
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 20, left: -20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis
              
            />
            <Tooltip
              formatter={val =>
                val != null ? val.toFixed(2) : 'Δεν υπάρχει μέτρηση'
              }
            />
            <Legend verticalAlign="top" />
            <Line
              type="monotone"
              dataKey="value"
              name="kg/ΟΤΑ"
              stroke="#4CAF50"
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
              connectNulls={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OtaYearlyChart;
