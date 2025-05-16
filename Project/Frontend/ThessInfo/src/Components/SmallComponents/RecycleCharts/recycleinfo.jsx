// RecycleLatest.jsx
import React from 'react';
import RecycleCss from './RecycleInfo.module.css';
import { GrTooltip } from 'react-icons/gr';

// Greek month order mapping
const GREEK_MONTH_ORDER = {
  'Ιαν': 1, 'Φεβ': 2, 'Μαρ': 3, 'Απρ': 4, 'Μαϊ': 5,
  'Ιουν': 6, 'Ιουλ': 7, 'Αυγ': 8, 'Σεπ': 9, 'Οκτ': 10,
  'Νοε': 11, 'Δεκ': 12
};

const RecycleLatest = ({ recycleData = {} }) => {
  const monthlyData = recycleData['Μηνιαία Δεδομένα'] || {};
  const months = Object.keys(monthlyData);
  if (!months.length) {
    return (
      <div className={RecycleCss.empty}>
        Δεν υπάρχουν μηνιαία δεδομένα ανακύκλωσης προς εμφάνιση.
      </div>
    );
  }

  // pick latest month
  const sorted = months.sort((a, b) => GREEK_MONTH_ORDER[a] - GREEK_MONTH_ORDER[b]);
  const latestMonth = sorted[sorted.length - 1];
  const latestData = monthlyData[latestMonth];

  return (
    <div className={RecycleCss.card}>
      {/* τίτλος */}
      <h4 className={RecycleCss.cardTitle}>
        Συνολικές Ποσότητες Ανακύκλωσης ({latestMonth})
      </h4>

      <ul className={RecycleCss.list}>
        {Object.entries(latestData).map(([param, value]) => (
          <li key={param} className={RecycleCss.listItem}>
            <p className={RecycleCss.paramName}>
              <strong>{param}</strong>: {value?.toLocaleString() || '–'}
            </p>
            <span
              className={RecycleCss.tooltipIcon}
              data-bs-toggle="tooltip"
              title={`Τιμή ${param} για τον μήνα ${latestMonth}`}
            >
              <GrTooltip />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecycleLatest;
