import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from 'recharts';

const ConclusionChart = ({ yearlyData }) => {
  // 1) Πιο πρόσφατο έτος
  const latestYear = useMemo(() => {
    if (!yearlyData) return null;
    const years = Object.keys(yearlyData)
      .filter(k => /^\d{4}$/.test(k))
      .map(y => parseInt(y, 10))
      .sort((a, b) => b - a);
    return years[0] ? String(years[0]) : null;
  }, [yearlyData]);
  if (!latestYear) return <p>Δεν υπάρχουν δεδομένα για το έτος.</p>;

  // 2) Παίρνουμε τα πραγματικά counts
  const { parameters, compliance_rate } = yearlyData[latestYear];
  const totalMeasurements = Object.values(parameters)
    .reduce((sum, p) => sum + (p.total_count || 0), 0);
  const totalCompliant = Object.values(parameters)
    .reduce((sum, p) => sum + (p.compliant_count || 0), 0);
  const failed = Object.entries(parameters)
    .filter(([, p]) => p.compliant_count < p.total_count)
    .map(([param]) => param);

  // 3) Δεδομένα pie χωρίς στρογγυλοποιήσεις
  const pieData = [
    { name: 'Συμμορφώνεται', value: totalCompliant },
    { name: 'Μη συμμορφώνεται', value: totalMeasurements - totalCompliant }
  ];
  const COLORS = ['#4CAF50', '#FF4C4C'];

  // 4) Text rate από API (ή από πραγματικούς αριθμούς: totalCompliant/totalMeasurements*100)
  const rate = Number(((totalCompliant / totalMeasurements) * 100).toFixed(2));

  return (
    <div style={{ textAlign: 'center' }}>
      <h4>Σύνοψη Έτους {latestYear}</h4>
      <div style={{ width: 260, height: 200, margin: '0 auto' }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              innerRadius="50%"
              outerRadius="80%"
              paddingAngle={2}
              label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
            >
              {pieData.map((_, idx) => (
                <Cell key={idx} fill={COLORS[idx]} />
              ))}
            </Pie>
            <Tooltip formatter={(val, name) => [`${val}`, name]} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <p style={{ margin: '0.5rem 0' }}>
        <strong>Συμμόρφωση:</strong> {rate}% (από {totalMeasurements})
      </p>

      {failed.length > 0 ? (
        <>
          <h5>Παράμετροι εκτός ορίων:</h5>
          <ul style={{
            listStyle: 'disc',
            textAlign: 'left',
            display: 'inline-block',
            paddingLeft: '1.2rem'
          }}>
            {failed.map(p => <li key={p}>{p}</li>)}
          </ul>
          <p style={{ marginTop: '1rem', fontStyle: 'italic' }}>
            Συστήνεται επανέλεγχος των ανωτέρω σε 3–6 μήνες.
          </p>
        </>
      ) : (
        <p>Όλες οι παράμετροι συμμορφώθηκαν.</p>
      )}
    </div>
  );
};

export default ConclusionChart;
