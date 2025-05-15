import React from 'react';
import PropTypes from 'prop-types';
import { Card, CardContent, Typography } from '@mui/material';
import {
  BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import styles from './RecycleYearly.module.css';

const RecycleYearly = ({ recycleData = {} }) => {
  const averages = recycleData['Μέσοι ΌροΙ'] || recycleData['Μέσοι Όροι'] || {};
  const entries = Object.entries(averages);
  if (!entries.length) {
    return (
      <Typography align="center" sx={{ p: 2 }}>
        Δεν υπάρχουν δεδομένα μέσων όρων για εμφάνιση.
      </Typography>
    );
  }

  const data = entries.map(([name, value]) => ({ name, value }));
  const totalWaste = (averages['Αξιοποιήσιμα'] || 0) + (averages['Υπόλειμμα'] || 0);
  data.push({ name: 'Σύνολο Σκουπιδιών', value: totalWaste });

  const tooltipFormatter = (val, name, props) => [
    val.toLocaleString() + ' kg',
    props.payload.name === 'Σύνολο Σκουπιδιών'
      ? 'Ισχύει: Αξιοποιήσιμα + Υπόλειμμα'
      : name
  ];

  return (
    <Card variant="outlined" className={styles.chartCard}>
      <CardContent>
        <h4 className={styles.chartTitle}>
          Μέσοι Όροι Ανακύκλωσης (Έτος)
        </h4>
        <div style={{ width: '100%', height: 350 }}>
          <ResponsiveContainer>
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={tooltipFormatter} />
              <Legend />
              <Bar dataKey="value">
                {data.map((entry, idx) => (
                  <Cell
                    key={idx}
                    fill={
                      entry.name === 'Σύνολο Σκουπιδιών' ? '#FF4C4C' : '#00C49F'
                    }
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
