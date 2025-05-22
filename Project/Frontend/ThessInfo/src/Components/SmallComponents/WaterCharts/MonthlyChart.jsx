// src/Components/SmallComponents/MonthlyChart.jsx
import React, { useEffect, useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  Line
} from 'recharts';
import styles from './MonthlyChart.module.css';

const ABBREVS = {
  'Θολότητα NTU': 'Θολ.',
  'Χρώμα': 'Χρ.',
  'Αργίλιο': 'Αργ.',
  'Χλωριούχα': 'Χλωρ.',
  'Αγωγιμότητα': 'Αγωγ.',
  'Συγκέντρωση ιόντων υδρογόνου': 'pH',
  'Υπολειμματικό χλώριο': 'Υπλ.Χλ.'
};

export default function MonthlyChart({ waterData }) {
  // bootstrap tooltips
  useEffect(() => {
    if (waterData?.analysis) {
      Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        .forEach(el => window.bootstrap && new window.bootstrap.Tooltip(el));
    }
  }, [waterData]);

  // responsive breakpoint hook
  const isMobile = useIsMobile(480);
  function useIsMobile(breakpoint = 480) {
    const [m, setM] = useState(window.innerWidth < breakpoint);
    useEffect(() => {
      const onResize = () => setM(window.innerWidth < breakpoint);
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }, [breakpoint]);
    return m;
  }

  // φτιάχνουμε chartData, αλλά και μαξ τιμές
  const { chartData, maxValue, maxLimit } = useMemo(() => {
    if (!waterData?.analysis) return { chartData: [], maxValue: 0, maxLimit: 0 };
    let mv = 0, ml = 0;
    const cd = waterData.analysis.map(item => {
      const parsed = parseFloat(item.limit.toString().replace(',', '.').replace(/[^\d.-]/g, ''));
      const limitNum = isNaN(parsed) ? 0 : parsed;
      const valNum = typeof item.value === 'number' ? item.value : 0;
      mv = Math.max(mv, valNum);
      ml = Math.max(ml, limitNum);
      return { parameter: item.parameter, value: valNum, limit: limitNum };
    });
    return {
      chartData: cd,
      maxValue: mv,
      maxLimit: ml
    };
  }, [waterData]);

  if (!chartData.length) return <p>Δεν υπάρχουν δεδομένα για το chart.</p>;

  return (
    <>
      <h4 className={styles.chartTitle}>
        Γράφημα για: {waterData.latest_data[0]?.Month} ({waterData.latest_data[0]?.Year})
      </h4>
      <div style={{ width: '100%', height: isMobile ? 350 : 400 }}>
        <ResponsiveContainer>
          <ComposedChart
            data={chartData}
            margin={{
              top: 5,
              right: isMobile ? 0 : 20,
              bottom: isMobile ? -30 : -20,
              left: 10
            }}
          >
            <CartesianGrid stroke="#e0e0e0" strokeDasharray="3 3" />

            <XAxis
              dataKey="parameter"
              interval={isMobile ? 1 : 0}
              angle={isMobile ? -30 : -45}
              textAnchor="end"
              height={isMobile ? 50 : 60}
              tick={{ fill: "#444", fontSize: isMobile ? 10 : 12 }}
              axisLine={{ stroke: "#444" }}
              tickFormatter={param => ABBREVS[param] || param}
            />

            {/* yAxis για τιμές, domain με λίγο padding */}
            <YAxis
              yAxisId="left"
              domain={[0, Math.ceil(maxValue * 1.1)]}
              tickCount={isMobile ? 4 : 8}
              label={isMobile ? null : { value: 'Τιμή', angle: -90, position: 'insideLeft', fill: 'blue' }}
              tick={{ fill: "#444", fontSize: isMobile ? 10 : 12 }}
              axisLine={{ stroke: "#444" }}
            />

            {/* yAxis για όρια, domain με λίγο padding */}
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, Math.ceil(maxLimit * 1.1)]}
              tickCount={isMobile ? 4 : 8}
              label={isMobile ? null : { value: 'Όριο', angle: 90, position: 'insideRight', fill: '#ff7300' }}
              tick={{ fill: "#ff7300", fontSize: isMobile ? 10 : 12 }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip wrapperStyle={{ borderRadius: 4 }} contentStyle={{ backgroundColor: '#f9f9f9', borderColor: '#ddd' }} />

            {!isMobile
              ? <Legend verticalAlign="top" iconType="circle" />
              : <Legend verticalAlign="bottom" height={30} iconType="circle" />
            }

            <Bar
              yAxisId="left"
              dataKey="value"
              name="Τιμή"
              barSize={isMobile ? 16 : 24}
              fill="#5793f2"
            />

            <Line
              yAxisId="right"
              type="monotone"
              dataKey="limit"
              name="Όριο"
              stroke="#ff7300"
              strokeDasharray="5 5"
              dot={{ r: isMobile ? 2 : 4, fill: "#ff7300" }}
              connectNulls
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
