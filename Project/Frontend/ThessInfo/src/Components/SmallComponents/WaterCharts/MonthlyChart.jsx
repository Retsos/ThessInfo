import React, { useEffect, useMemo } from 'react';
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

const MonthlyChart = ({ waterData }) => {
  // Bootstrap tooltips
  useEffect(() => {
    if (waterData?.analysis) {
      Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        .forEach(el => window.bootstrap && new window.bootstrap.Tooltip(el));
    }
  }, [waterData]);

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

  return (
    <>

      {/* ——— Dual Axis Chart ——— */}
      <div style={{ width: '100%', height: 400, marginTop: 24 }}>
      <ResponsiveContainer>
        <ComposedChart data={chartData} margin={{ top: 5, right: 20, bottom: 90, left: 10 }}>
          <CartesianGrid stroke="#e0e0e0" strokeDasharray="3 3" />

          <XAxis
            dataKey="parameter"
            interval={0}
            angle={-45}
            textAnchor="end"
            height={60}
            tick={{ fill: "#444",
              fontSize: 12       
             }}
            axisLine={{ stroke: "#444" }}
          />

          <YAxis
            yAxisId="left"
            label={{ value: 'Τιμή', angle: -90, position: 'insideLeft', fill: 'blue' }}
            tick={{ fill: "#444" }}
            axisLine={{ stroke: "#444" }}
            domain={[0, 'dataMax']}
          />

          <YAxis
            yAxisId="right"
            orientation="right"
            label={{ value: 'Όριο', angle: 90, position: 'insideRight', fill: '#444' }}
            tick={{ fill: "#444" }}
            axisLine={false}
            tickLine={false}
            domain={[0, 'dataMax']}
          />

          <Tooltip 
            wrapperStyle={{ borderRadius: 4 }}
            contentStyle={{ backgroundColor: '#f9f9f9', borderColor: '#ddd' }}
          />

          <Legend verticalAlign="top" iconType="circle" />

          {/* εδώ άλλαξα το fill */}
          <Bar
            yAxisId="left"
            dataKey="value"
            name="Τιμή"
            barSize={24}
            fill="#5793f2"
          />

          {/* και το stroke+dot */}
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="limit"
            name="Όριο"
            stroke="#ff7300"
            strokeDasharray="5 5"
            dot={{ r: 4, fill: "#ff7300" }}
            connectNulls
          />
        </ComposedChart>
      </ResponsiveContainer>

      </div>
    </>
  );
};

export default MonthlyChart;
