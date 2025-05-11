import React, { useMemo } from 'react';
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

const YearlyChart = ({ yearlyData }) => {

  const chartData = useMemo(() => {
    if (!yearlyData) return [];

    const years = Object.keys(yearlyData).filter(key => /^\d{4}$/.test(key));

    const params = years.length
      ? Object.keys(yearlyData[years[0]].parameters)
      : [];

    return years.map(year => {
      const entry = { year };
      params.forEach(param => {
        const p = yearlyData[year].parameters[param];
        entry[param] = p?.average ?? null;
      });
      return entry;
    });
  }, [yearlyData]);

  const params = useMemo(() => {
    if (!chartData.length) return [];
    return Object.keys(chartData[0]).filter(key => key !== 'year');
  }, [chartData]);

  const colors = [
    '#8884d8',
    '#82ca9d',
    '#ffc658',
    '#ff7300',
    '#413ea0',
    '#00c49f',
    '#ff8042'
  ];

  if (!chartData.length) {
    return <p>Δεν υπάρχουν δεδομένα χρόνου για το chart.</p>;
  }

  return (
    <div style={{ width: '100%', height: 350 }}>
      <ResponsiveContainer>
        <LineChart
          data={chartData}
          margin={{ top: 24, right: 24, bottom: 24, left: 24 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <Tooltip />
          <Legend verticalAlign="top" height={36} />
          {params.map((param, idx) => (
            <Line
              key={param}
              type="monotone"
              dataKey={param}
              name={param}
              stroke={colors[idx % colors.length]}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default YearlyChart;
