import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import styles from './PersonOTAChart.module.css';

const PersonOTAChart = ({ personData, otaData }) => {
  // Updated helper to handle dynamic field names
  const makeData = (yearlyStats, getFieldName) => {
    const years = Object.keys(yearlyStats)
      .filter(k => /^\d{4}$/.test(k))
      .sort();
    return years.map(year => ({
      year,
      value: yearlyStats[year][getFieldName(year)] ?? 0
    }));
  };

  // For person data: dynamic field name based on year
  const personValues = useMemo(
    () => makeData(
      personData.Yearly_Stats, 
      (year) => `Average_RECYCLING_per_person_year_${year}`
    ),
    [personData]
  );

  // For OTA data: static field name
  const otaValues = useMemo(
    () => makeData(
      otaData.Yearly_Stats, 
      () => 'Average_RECYCLING_for_year'
    ),
    [otaData]
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.chartBox}>
        <h5 className={styles.title}>Μέσο Ανακύκλωσης (kg/κάτοικο)</h5>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={personValues}
            margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip formatter={val => `${val.toFixed(2)} kg`} />
            <Legend />
            <Bar dataKey="value" name="kg/κάτοικο" fill="#4CAF50" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className={styles.chartBox}>
        <h5 className={styles.title2}>Μέσο Ανακύκλωσης (kg/OTA)</h5>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={otaValues}
            margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip formatter={val => `${val.toFixed(2)} kg`} />
            <Legend />
            <Bar dataKey="value" name="kg/OTA" fill="#2196F3" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PersonOTAChart;