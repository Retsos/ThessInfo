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
import styles from './YearlyChart.module.css'; // όποιο CSS έχεις

const COLORS = [
  '#8884d8',  // Θολότητα NTU
  '#82ca9d',  // Χρώμα
  '#ffc658',  // Αργίλιο
  '#ff7300',  // Χλωριούχα
  '#413ea0',  // Αγωγιμότητα
  '#00c49f',  // Συγκέντρωση ιόντων υδρογόνου
  '#ff8042'   // Υπολειμματικό χλώριο
];

const paramNames = {
  'Θολότητα NTU': 'Θολότητα NTU',
  'Χρώμα': 'Χρώμα',
  'Αργίλιο': 'Αργίλιο',
  'Χλωριούχα': 'Χλωριούχα',
  'Αγωγιμότητα': 'Αγωγιμότητα',
  'Συγκέντρωση ιόντων υδρογόνου': 'Συγκέντρωση ιόντων υδρογόνου',
  'Υπολειμματικό χλώριο': 'Υπολειμματικό χλώριο'
};

// Custom tooltip component with improved null handling
const CustomTooltip = ({ active, payload, label }) => {
  if (!active) return null;

  // Δημιουργούμε έναν πίνακα με όλες τις παραμέτρους
  const allEntries = Object.keys(paramNames).map((param, idx) => {
    // ψάχνουμε αν υπάρχει αυτή η παράμετρος στο payload
    const found = payload?.find(p => p.dataKey === param);
    return {
      dataKey: param,
      name:    param,
      stroke:  COLORS[idx % COLORS.length],
      // αν δεν υπάρχει, βάζουμε null
      value:   found?.value != null ? found.value : null
    };
  });

  // ταξινούμε κατά φθίνουσα value, βάζοντας τα null στο τέλος
  allEntries.sort((a, b) => {
    const va = a.value ?? -Infinity;
    const vb = b.value ?? -Infinity;
    return vb - va;
  });

  return (
    <div className="bg-white p-4 border border-gray-200 rounded shadow-md">
      <p className="font-bold text-lg mb-2">{label}</p>
      {allEntries.map((entry) => {
        const display = entry.value != null
          ? entry.value.toFixed(2)
          : 'Δεν υπάρχει μέτρηση';
        return (
          <p key={entry.dataKey} style={{ color: entry.stroke, margin: '2px 0' }}>
            <strong>{entry.name}:</strong> {display}
          </p>
        );
      })}
    </div>
  );
};

const YearlyChart = ({ yearlyData }) => {
  // 1. Get years
  const years = useMemo(() =>
    Object.keys(yearlyData)
      .filter(k => /^\d{4}$/.test(k))
      .sort((a, b) => +a - +b),
    [yearlyData]
  );

  // 2. Get all parameter names from all years
  const params = useMemo(() => {
    const all = new Set();
    Object.keys(yearlyData)
      .filter(k => /^\d{4}$/.test(k))
      .forEach(year => {
        Object.keys(yearlyData[year].parameters)
          .forEach(p => all.add(p));
      });
    return Array.from(all);
  }, [yearlyData]);

  // 3. Create chart data with proper null handling
  const chartData = useMemo(() => {
    return years.map(year => {
      const entry = { year };
      params.forEach(param => {
        // Always include the parameter even if null
        entry[param] = yearlyData[year]?.parameters[param]?.average ?? null;
      });
      return entry;
    });
  }, [years, params, yearlyData]);

  // Create a separate object to hold the latest year's values for display
  const latestYear = years[years.length - 1];
  const latestValues = {};
  
  if (latestYear && yearlyData[latestYear]) {
    params.forEach(param => {
      latestValues[param] = yearlyData[latestYear]?.parameters[param]?.average ?? null;
    });
  }

  if (!chartData.length) {
    return <p className="text-center p-4">Δεν υπάρχουν δεδομένα για αυτό το chart.</p>;
  }

  return (
    <div className="border rounded-lg shadow-lg p-4 bg-white">
      
      <div className="mb-6">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={chartData}
            margin={{ top: 16, right: 32, bottom: 32, left: 32 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="year"
              tick={{ fontSize: 14, fill: '#333' }}
              axisLine={{ stroke: '#333' }}
              label={{ value: 'Έτος', position: 'insideBottom', offset: -24 }}
            />
            <YAxis
              tick={{ fontSize: 14, fill: '#333' }}
              axisLine={{ stroke: '#333' }}
              label={{ value: 'Μέση Τιμή', angle: -90, position: 'insideLeft', offset: -8 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" wrapperStyle={{ paddingBottom: 16 }} />
            
            {params.map((param, idx) => (
              <Line
                key={param}
                type="monotone"
                dataKey={param}
                name={param}
                stroke={COLORS[idx % COLORS.length]}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
                connectNulls={false}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      
    </div>
  );
};

export default YearlyChart;