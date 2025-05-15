import React, { useState, useMemo } from 'react';
import styles from './personyearlychart.module.css';
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

const PersonYearlyChart = ({ data }) => {

  // data.Yearly_Stats is an object keyed by year strings, e.g. { "2023": {...}, "2024": {...} }
  const years = useMemo(() => {
    return Object.keys(data.Yearly_Stats)
      .sort((a, b) => +b - +a); // descending, so newest first
  }, [data]);

  const [activeYear, setActiveYear] = useState(years[0]);

  // build chartData for the active year in month order
  const chartData = useMemo(() => {
    const stats = data.Yearly_Stats[activeYear]?.Detailed_Monthly_Data || {};
    return GREEK_MONTH_ORDER.map(m => ({
      month: m,
      value: stats[m] != null ? stats[m] : 0
    }));
  }, [activeYear, data]);

  return (
    <div className={styles.container}>
        <h4 className={styles.title}>ΜΟ Ανακύκλωσης σε kg/Κάτοικο</h4>

      {/* tabs */}
      <div className={styles.tabs}>
        {years.map(year => (
          <button
            key={year}
            className={`${styles.tab} ${year === activeYear ? styles.active : ''}`}
            onClick={() => setActiveYear(year)}
          >
            {year}
          </button>
        ))}
      </div>

      {/* chart */}
      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData} margin={{ top: 20, right: 20, left: -20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={val => val != null ? val.toFixed(2) : '–'} />
            <Legend verticalAlign="top" />
            <Line
              type="monotone"
              dataKey="value"
              name="kg/κάτοικο"
              stroke="#4CAF50"
              dot={{ r: 4 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PersonYearlyChart;
