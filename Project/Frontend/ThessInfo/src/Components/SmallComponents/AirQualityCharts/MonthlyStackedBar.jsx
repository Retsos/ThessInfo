// src/Components/SmallComponents/MonthlyStackedBar.jsx
import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

// Χρωματισμοί ανά ρύπο
const COLORS = {
  co_conc: '#8884d8',
  no2_conc: '#82ca9d',
  no_conc: '#ffc658',
  o3_conc: '#ff7300',
  so2_conc: '#413ea0'
};

// Αγγλικά → ελληνικά συντομογραφίες μηνών
const MONTH_MAP = {
  January: 'Ιαν', February: 'Φεβ', March: 'Μαρ', April: 'Απρ',
  May: 'Μαϊ', June: 'Ιουν', July: 'Ιουλ', August: 'Αυγ',
  September: 'Σεπ', October: 'Οκτ', November: 'Νοε', December: 'Δεκ'
};

export default function MonthlyStackedBar({ airData = {} }) {
  // βρίσκουμε όλα τα κλειδιά που είναι έτη
  const years = Object.keys(airData).filter(k => /^\d{4}$/.test(k));
  if (!years.length) return <p>Δεν υπάρχουν δεδομένα.</p>;

  // πιο πρόσφατο έτος
  const latestYear = String(Math.max(...years.map(y => +y)));
  const monthly = airData[latestYear]?.monthly_averages || {};

  // φτιάχνουμε το array για το chart
  const data = useMemo(() => {
    return Object.entries(monthly)
      .map(([engM, { averages = {} }]) => ({
        month: MONTH_MAP[engM] || engM,
        ...averages
      }))
      .sort((a, b) => {
        const order = Object.values(MONTH_MAP);
        return order.indexOf(a.month) - order.indexOf(b.month);
      });
  }, [monthly]);

  return (
    <div style={{ margin: '2rem 0' }}>
      <h4 style={{ textAlign: 'center',color: "#2992a2" }}>
        Συγκεντρώσεις Ρύπων ανά Μήνα — {latestYear}
      </h4>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart
            data={data}
            margin={{ top: 20, right: 20, bottom: 20, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend verticalAlign="top" />
            {Object.keys(COLORS).map(key => (
              <Bar key={key} dataKey={key} stackId="a" fill={COLORS[key]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}