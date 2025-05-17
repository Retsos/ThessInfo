import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip
} from 'recharts';

const ConclusionChart = ({ yearlyData }) => {
  // 1) Βρίσκουμε το πιο πρόσφατο έτος
  const latestYear = useMemo(() => {
    if (!yearlyData) return null;
    const years = Object.keys(yearlyData)
      .filter(k => /^\d{4}$/.test(k))
      .map(Number)
      .sort((a, b) => b - a);
    return years[0] ? String(years[0]) : null;
  }, [yearlyData]);
  if (!latestYear) return <p>Δεν υπάρχουν δεδομένα για το έτος.</p>;

  // 2) Παίρνουμε το object με παραμέτρους
  const params = yearlyData[latestYear].parameters || {};

  // 3) Υπολογίζουμε counts σε επίπεδο **events**

  //ΛΙΓΟ SUS O KΩΔΙΚΑΣ ΕΔΩ ΤΣΕΚΑΡΕ ΤΟ ΕΦΟΣΟΝ ΦΤΙΑΞΕΙΣ ΤΑ A/N
  const { expectedEvents, recordedEvents, compliantCount, nonCompliantCount, missingCount } =
    useMemo(() => {
        let expected = 0;
        let recorded = 0;
        let compliant = 0;

        Object.values(params).forEach(p => {
          const tot = p.total_count || 0; //Αν για κάποιο λόγο δεν υπάρχει (undefined ή null), με το || 0 βάζουμε 0 ως default
          const rec = Array.isArray(p.values) ? p.values.length : tot;
          const comp = p.compliant_count || 0; //πόσες από αυτές τις μετρήσεις συμμόρφωθούν στα όρια αν δεν υπάρχει, βάζουμε 0.

          

          expected += tot;      // άθροισμα των συνολικών αναμενόμενων events
          recorded += rec;      // όσα events όντως μετρήθηκαν
          compliant += comp;    // όσα από αυτά συμμορφώθηκαν
        });

        const missing = expected - recorded;           // events που δεν μετρήθηκαν
        const nonCompliant = recorded - compliant;     // events που απέτυχαν

      return {
        expectedEvents: expected,
        recordedEvents: recorded,
        compliantCount: compliant,
        nonCompliantCount: nonCompliant,
        missingCount: missing
      };
    }, [params]);

  // 4) Δεδομένα pie με τρία slices
  const pieData = [
    { name: 'Συμμορφώνεται',     value: compliantCount },
    { name: 'Μη συμμορφώνεται',  value: nonCompliantCount },
    { name: 'Χωρίς δεδομένα',    value: missingCount }
  ];

  const COLORS = ['#4CAF50', '#FF4C4C', '#CCCCCC'];

  return (
    <div style={{ textAlign: 'center' }}>

      <div style={{ width: 260, height: 200, margin: '0 auto' }}>
        <ResponsiveContainer width="100%" height="100%">
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

      <p style={{ margin: '0.5rem 0', lineHeight: 1.5 }}>
        <strong>Αναμενόμενες μετρήσεις:</strong> {expectedEvents}<br/>
        <strong>Μετρήσεις με δεδομένα:</strong> {recordedEvents}<br/>
        <strong>Συμμόρφωση:</strong> {compliantCount}<br/>
        <strong>Αποτυχίες:</strong> {nonCompliantCount}<br/>
        <strong>Χωρίς δεδομένα:</strong> {missingCount}
      </p>
    </div>
  );
};

export default ConclusionChart;
