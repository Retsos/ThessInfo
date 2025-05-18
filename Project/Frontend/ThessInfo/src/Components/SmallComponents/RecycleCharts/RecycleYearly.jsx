import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography } from '@mui/material';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell
} from 'recharts';
import styles from './RecycleYearly.module.css';

// 1) Ορισμός χρωμάτων ανά παράμετρο
const COLOR_MAP = {
  'Αξιοποιήσιμα': '#00C49F',
  'Υπόλειμμα': '#00C49F',
  'Σύνολο Σκουπιδιών': '#FF4C4C',
  // Αν έχεις κι άλλες κατηγορίες, πρόσθεσέ τες εδώ
};

const RecycleYearly = ({ recycleData = {} }) => {
  const averages = recycleData['Μέσοι Όροι'] || {};
  const entries = Object.entries(averages);
  if (!entries.length) {
    return (
      <Typography align="center" sx={{ p: 2 }}>
        Δεν υπάρχουν δεδομένα μέσων όρων για εμφάνιση.
      </Typography>
    );
  }

  // 2) Προετοιμασία data και total
  const data = entries.map(([name, value]) => ({ name, value }));
  const totalWaste = (averages['Αξιοποιήσιμα'] || 0) + (averages['Υπόλειμμα'] || 0);
  data.push({ name: 'Σύνολο Σκουπιδιών', value: totalWaste });

  const tooltipFormatter = (val, name, props) => [
    val.toLocaleString() + ' kg',
    name === 'Σύνολο Σκουπιδιών'
      ? 'Ισχύει: Αξιοποιήσιμα + Υπόλειμμα'
      : name
  ];

  const SHORT_LABELS = {
    'Υπόλειμμα του ΚΔΑΥ': 'Υπόλ ΚΔΑΥ',
    'Ανακυκλώσιμα' : 'Ανάκ',
    'Ανάκτηση Ογκωδών' : 'Ανάκ Όγκ',
    'Αξιοποιήσιμα': 'Αξι.',
    'Υπόλειμμα': 'Υπόλ.',
    'Σύνολο Σκουπιδιών': 'Συν.Σκ.'
  };

  return (
    <Card  className={styles.chartCard} elevation={0}>
      <CardContent>
        <Typography variant="h6" align="center" gutterBottom>
          Μέσοι Όροι Ανακύκλωσης (Έτος)
        </Typography>

        {/* 3) Τα χρωματιστά badges */}
        <div className={styles.legendChips}>
          {data.map(({ name }) => (
            <span
              key={name}
              className={styles.chip}
              style={{ backgroundColor: COLOR_MAP[name] || '#ccc' }}
            >
              {name}
            </span>
          ))}
        </div>

        <div style={{ width: '100%', height: 350 }}>
          <ResponsiveContainer>
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 45 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tickFormatter={name => SHORT_LABELS[name] || name}
                tick={{ fontSize: 12 }}
                interval={0}
                angle={-30}
                textAnchor="end"
              />
              <YAxis />
              <Tooltip formatter={tooltipFormatter} />
              <Bar dataKey="value" name="kg">
                {data.map((entry, idx) => (
                  <Cell
                    key={`cell-${idx}`}
                    fill={COLOR_MAP[entry.name] || '#888'}
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

RecycleYearly.propTypes = {
  recycleData: PropTypes.object
};

export default RecycleYearly;
