import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography } from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell
} from 'recharts';

/**
 * Component to display a bar chart of yearly average recycling metrics,
 * with an extra bar for total waste (Αξιοποιήσιμα + Υπόλειμμα).
 * Props:
 *  - recycleData: object containing 'Μέσοι Όροι' mapping category names to values
 */
const YearlyAveragesChart = ({ recycleData = {} }) => {
  const averages = recycleData['Μέσοι ΌροΙ'] || recycleData['Μέσοι Όροι'] || {};
  const entries = Object.entries(averages);

  if (!entries.length) {
    return (
      <Typography align="center" sx={{ p: 2 }}>
        Δεν υπάρχουν δεδομένα μέσων όρων για εμφάνιση.
      </Typography>
    );
  }

  // Prepare data and calculate total waste
  const data = entries.map(([name, value]) => ({ name, value }));
  const totalWaste = (averages['Αξιοποιήσιμα'] || 0) + (averages['Υπόλειμμα'] || 0);
  data.push({ name: 'Σύνολο Σκουπιδιών', value: totalWaste });

  // Custom tooltip formatter
  const tooltipFormatter = (value, name, props) => {
    const label = props.payload.name === 'Σύνολο Σκουπιδιών'
      ? 'Ισχύει: Αξιοποιήσιμα + Υπόλειμμα'
      : name;
    return [value.toLocaleString() + ' kg', label];
  };

  // Color mapping: default green, red for total
  const COLORS = {
    default: '#00C49F',
    total: '#FF4C4C'
  };

  return (
    <Card variant="outlined" sx={{ maxWidth: 650, mx: 'auto', mt: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Μέσοι Όροι Ανακύκλωσης (Έτος)
        </Typography>
        <div style={{ width: '100%', height: 350 }}>
          <ResponsiveContainer>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={tooltipFormatter} />
              <Legend />
              <Bar dataKey="value">
                {data.map((entry, idx) => (
                  <Cell
                    key={`cell-${idx}`}
                    fill={entry.name === 'Σύνολο Σκουπιδιών' ? COLORS.total : COLORS.default}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

YearlyAveragesChart.propTypes = {
  recycleData: PropTypes.object
};

export default YearlyAveragesChart;
