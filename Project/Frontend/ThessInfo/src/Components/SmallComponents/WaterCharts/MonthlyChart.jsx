import React, { useState, useEffect, useMemo } from 'react';
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
const MonthlyChart = ({ waterData }) => {
  // Bootstrap tooltips
  useEffect(() => {
    if (waterData?.analysis) {
      Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        .forEach(el => window.bootstrap && new window.bootstrap.Tooltip(el));
    }
  }, [waterData]);
  const isMobile = useIsMobile(480);

  function useIsMobile(breakpoint = 480) {
    const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);
    useEffect(() => {
      const onResize = () => setIsMobile(window.innerWidth < breakpoint);
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    }, [breakpoint]);
    return isMobile;
  }
  // Προετοιμάζουμε το chartData και υπολογίζουμε maxValue, maxLimit
  const { chartData, maxValue, maxLimit } = useMemo(() => {
    if (!waterData?.analysis) {
      return { chartData: [], maxValue: 0, maxLimit: 0 };
    }

    let mv = 0, ml = 0;
    const cd = waterData.analysis.map(item => {
      // parse limit
      const parsedLimit = parseFloat(
        item.limit.toString().replace(',', '.').replace(/[^\d.-]/g, '')
      );
      const limitNum = isNaN(parsedLimit) ? null : parsedLimit;
      const valueNum = typeof item.value === 'number' ? item.value : 0;

      // track maxima
      if (valueNum > mv) mv = valueNum;
      if (limitNum != null && limitNum > ml) ml = limitNum;

      return {
        parameter: item.parameter,
        value: valueNum,
        limit: limitNum
      };
    });

    return {
      chartData: cd,
      maxValue: mv,
      maxLimit: ml
    };
  }, [waterData]);

  if (!chartData.length) {
    return <p>Δεν υπάρχουν δεδομένα για το chart.</p>;
  }
  // π.χ. στο MonthlyChart.jsx πάνω από το component
  const ABBREVS = {
    'Θολότητα NTU': 'Θολ.',
    'Χρώμα': 'Χρ.',
    'Αργίλιο': 'Αργ.',
    'Χλωριούχα': 'Χλωρ.',
    'Αγωγιμότητα': 'Αγωγ.',
    'Συγκέντρωση ιόντων υδρογόνου': 'pH',
    'Υπολειμματικό χλώριο': 'Υπλ.Χλ.'
  };

  return (
    <>

      {/* ——— Dual Axis Chart ——— */}
      <h4 className={styles.chartTitle}>{waterData.latest_data[0]?.Month || ''}({waterData.latest_data[0]?.Year || ''})</h4>
      <div style={{ width: '100%', height: 400, marginTop: 24 }}>
        <ResponsiveContainer width="100%" height={isMobile ? 350 : 400}>
          <ComposedChart
            data={chartData}
            margin={{
              top: 5,
              right: isMobile ? -20 : 20,
              bottom: isMobile ? -40 : -20,
              left: -20
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
              tickFormatter={param => ABBREVS[param] || param}  /* όπως πριν */
            />

            <YAxis
              yAxisId="left"
              label={isMobile ? null : { value: 'Τιμή', angle: -90, position: 'insideLeft', fill: 'blue' }}
              tick={{ fill: "#444", fontSize: isMobile ? 10 : 12 }}
              axisLine={{ stroke: "#444" }}
              domain={[0, 'dataMax']}
              tickCount={isMobile ? 4 : 8}         // λιγότερα επίπεδα
            />

            <YAxis
              yAxisId="right"
              orientation="right"
              label={isMobile ? null : { value: 'Όριο', angle: 90, position: 'insideRight', fill: '#ff7300' }}
              tick={{ fill: "#ff7300", fontSize: isMobile ? 10 : 12 }}
              axisLine={false}
              tickLine={false}
              domain={[0, 'dataMax']}
              tickCount={isMobile ? 4 : 8}
            />

            <Tooltip
              wrapperStyle={{ borderRadius: 4 }}
              contentStyle={{ backgroundColor: '#f9f9f9', borderColor: '#ddd' }}
            />

            {/* κρύβουμε τη Legend σε κινητά ή την κατεβάζουμε κάτω */}
            {!isMobile && <Legend verticalAlign="top" iconType="circle" />}
            {isMobile && <Legend verticalAlign="bottom" height={30} iconType="circle" />}

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
};

export default MonthlyChart;
