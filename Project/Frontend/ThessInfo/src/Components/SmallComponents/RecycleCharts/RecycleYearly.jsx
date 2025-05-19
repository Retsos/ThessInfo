import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography, useTheme, useMediaQuery } from '@mui/material';
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

// Χρώματα ανά παράμετρο
const COLOR_MAP = {
  'Αξιοποιήσιμα': '#00C49F',
  'Υπόλειμμα': '#00C49F',
  'Σύνολο Σκουπιδιών': '#FF4C4C'
};

const SHORT_LABELS = {
  'Υπόλειμμα του ΚΔΑΥ': 'Υπόλ ΚΔΑΥ',
  'Ανακυκλώσιμα': 'Ανάκ',
  'Ανάκτηση Ογκωδών': 'Ανάκ Όγκ',
  'Αξιοποιήσιμα': 'Αξι.',
  'Υπόλειμμα': 'Υπόλ.',
  'Σύνολο Σκουπιδιών': 'Συν.Σκ.'
};

const RecycleYearly = ({ recycleData = {} }) => {
  const theme = useTheme();
  const isSm = useMediaQuery(theme.breakpoints.down('sm')); // <600px

  // Μέσοι όροι
  const averages = recycleData['Μέσοι Όροι'] || {};
  const entries = Object.entries(averages);
  if (!entries.length) {
    return (
      <Typography align="center" sx={{ p: 2 }}>
        Δεν υπάρχουν δεδομένα μέσων όρων για εμφάνιση.
      </Typography>
    );
  }

  // Προετοιμασία δεδομένων
  const data = entries.map(([name, value]) => ({ name, value }));
  const total = (averages['Αξιοποιήσιμα'] || 0) + (averages['Υπόλειμμα'] || 0);
  data.push({ name: 'Σύνολο Σκουπιδιών', value: total });

  const tooltipFormatter = (val, name) => [
    val.toLocaleString() + ' kg',
    name === 'Σύνολο Σκουπιδιών'
      ? 'Ισχύει: Αξιοποιήσιμα + Υπόλειμμα'
      : name
  ];

  return (
    <Card className={styles.chartCard} elevation={0}>
      <CardContent>
        <Typography
          variant="h6"
          align="center"
          gutterBottom
          className={styles.chartTitle}
        >
          Μέσοι Όροι Ανακύκλωσης
        </Typography>

        <div className={styles.legendChips}>
          {data.map(({ name }) => (
            <span
              key={name}
              className={styles.chip}
              style={{ fontSize: isSm ? '0rem' : '0.9rem' }}
            >
              {name}
            </span>
          ))}
        </div>

        <div style={{ width: '100%', height: isSm ? 300 : 350 }}>
          <ResponsiveContainer>
            <BarChart
              data={data}
              margin={{ top: 0, right: isSm ? 0 : 30, left: -10, bottom: isSm ? 0 : 45 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                tickFormatter={name => SHORT_LABELS[name] || name}
                tick={{ fontSize: isSm ? 10 : 12 }}
                interval={0}
                angle={isSm ? -45 : -30}
                textAnchor="end"
                height={isSm ? 60 : 45}
              />
              <YAxis tick={{ fontSize: isSm ? 10 : 12 }} />
              <Tooltip formatter={tooltipFormatter} />
              <Legend
                verticalAlign="top"
                wrapperStyle={{ paddingBottom: isSm ? 0 : 5, fontSize: isSm ? 10 : 13 }}
              />
              <Bar dataKey="value" name="kg">
                {data.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLOR_MAP[entry.name] || '#888'} />
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
