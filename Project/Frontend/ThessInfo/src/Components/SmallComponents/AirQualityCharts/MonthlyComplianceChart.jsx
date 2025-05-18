// src/Components/SmallComponents/MonthlyComplianceChart.jsx
import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

// Ελληνικές συντομογραφίες μηνών
const MONTH_MAP = {
  January: 'Ιαν', February: 'Φεβ', March: 'Μαρ', April: 'Απρ',
  May: 'Μαϊ', June: 'Ιουν', July: 'Ιουλ', August: 'Αυγ',
  September: 'Σεπ', October: 'Οκτ', November: 'Νοε', December: 'Δεκ'
};

export default function MonthlyComplianceChart({ airData = {} }) {
  const years = Object.keys(airData).filter(k => /^\d{4}$/.test(k));
  if (!years.length) return <p>Δεν υπάρχουν δεδομένα.</p>;
  const latestYear = String(Math.max(...years.map(y => +y)));
  const monthly = airData[latestYear]?.monthly_averages || {};

  // φτιάχνουμε το array με % συμμόρφωσης
  const data = useMemo(() => {
    return Object.entries(monthly)
      .map(([engM, { compliant_count = '' }]) => {
        const [num, den] = compliant_count.split('/').map(n => +n);
        const pct = den ? +(num / den * 100).toFixed(1) : 0;
        return {
          month: MONTH_MAP[engM] || engM,
          compliance: pct
        };
      })
      .sort((a, b) => {
        const order = Object.values(MONTH_MAP);
        return order.indexOf(a.month) - order.indexOf(b.month);
      });
  }, [monthly]);

  return (
    <div style={{ margin: '2rem 0' }}>
      <h4 style={{ textAlign: 'center',color: "#2992a2" }}>
        Ποσοστό Συμμόρφωσης ανά Μήνα — {latestYear}
      </h4>
      <div style={{ width: '100%', height: 250 }}>
        <ResponsiveContainer>
          <LineChart
            data={data}
            margin={{ top: 10, right: 20, bottom: 30, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis domain={[0, 100]} unit="%" />
            <Tooltip formatter={val => `${val}%`} />
            <Line
              type="monotone"
              dataKey="compliance"
              stroke="#4CAF50"
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
