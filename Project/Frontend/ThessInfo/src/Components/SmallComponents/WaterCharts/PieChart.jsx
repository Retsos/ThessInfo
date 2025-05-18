// src/Components/SmallComponents/ConclusionChart.jsx
import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from 'recharts';
import styles from './PieChart.module.css'; // φτιάξε ένα ανάλογο CSS

const COLORS = ['#4CAF50', '#FF4C4C', '#CCCCCC'];

export default function ConclusionChart({ yearlyData }) {
  // 1) Βρίσκουμε το πιο πρόσφατο έτος
  const latestYear = useMemo(() => {
    if (!yearlyData) return null;
    const yrs = Object.keys(yearlyData)
      .filter(k => /^\d{4}$/.test(k))
      .map(Number)
      .sort((a, b) => b - a);
    return yrs.length ? String(yrs[0]) : null;
  }, [yearlyData]);

  if (!latestYear) {
    return <p className={styles.empty}>Δεν υπάρχουν δεδομένα για το έτος.</p>;
  }

  // 2) Παίρνουμε τις παραμέτρους του έτους
  const params = yearlyData[latestYear].parameters || {};

  // 3) Υπολογισμοί counts
  const {
    expectedEvents,
    recordedEvents,
    compliantCount,
    nonCompliantCount,
    missingCount
  } = useMemo(() => {
    let expected = 0, recorded = 0, compliant = 0;

    Object.values(params).forEach(p => {
      const tot = p.total_count || 0;
      const rec = Array.isArray(p.values) ? p.values.length : tot;
      const comp = p.compliant_count || 0;
      expected += tot;
      recorded += rec;
      compliant += comp;
    });

    const missing = expected - recorded;
    const nonCompliant = recorded - compliant;

    return {
      expectedEvents: expected,
      recordedEvents: recorded,
      compliantCount: compliant,
      nonCompliantCount: nonCompliant,
      missingCount: missing
    };
  }, [params]);

  // 4) Data για το Pie
  const pieData = [
    { name: 'Συμμορφώνεται',    value: compliantCount },
    { name: 'Μη συμμορφώνεται', value: nonCompliantCount },
    { name: 'Χωρίς δεδομένα',   value: missingCount }
  ];

  return (
    <div className={styles.container}>
      {/* ——— Νέος τίτλος ——— */}
      <h3 className={styles.chartTitle}>
        Σύνοψη Μετρήσεων {latestYear}
      </h3>

      <div className={styles.chartWrapper}>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              innerRadius="50%"
              outerRadius="80%"
              paddingAngle={2}
              label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
            >
              {pieData.map((entry, idx) => (
                <Cell key={entry.name} fill={COLORS[idx]} />
              ))}
            </Pie>
            <Tooltip formatter={(val, name) => [`${val}`, name]} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <ul className={styles.statsList}>
        <li><strong>Αναμενόμενες μετρήσεις:</strong> {expectedEvents}</li>
        <li><strong>Μετρήσεις με δεδομένα:</strong> {recordedEvents}</li>
        <li><strong>Συμμόρφωση:</strong> {compliantCount}</li>
        <li><strong>Αποτυχίες:</strong> {nonCompliantCount}</li>
        <li><strong>Χωρίς δεδομένα:</strong> {missingCount}</li>
      </ul>
    </div>
  );
}
