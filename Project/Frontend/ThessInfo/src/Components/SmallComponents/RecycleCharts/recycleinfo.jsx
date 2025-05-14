import React from 'react';
import RecycleCss from './RecycleInfo.module.css';
import { GrTooltip } from 'react-icons/gr';

// Greek month order mapping
const GREEK_MONTH_ORDER = {
  'Ιαν': 1, 'Φεβ': 2, 'Μαρ': 3, 'Απρ': 4, 'Μαϊ': 5,
  'Ιουν': 6, 'Ιουλ': 7, 'Αυγ': 8, 'Σεπ': 9, 'Οκτ': 10,
  'Νοε': 11, 'Δεκ': 12
};

// `recycleData` shape: { 'Μηνιαία Δεδομένα': {...} }
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

  // Determine latest month by Greek month order
  const sorted = months.sort((a, b) => (GREEK_MONTH_ORDER[a] || 0) - (GREEK_MONTH_ORDER[b] || 0));
  const latestMonth = sorted[sorted.length - 1];
  const latestData = monthlyData[latestMonth];

  return (
    <div className={RecycleCss.card}>
      <ul className={RecycleCss.list}>
        {Object.entries(latestData).map(([param, value]) => (
          <li key={param} className={RecycleCss.listItem}>
            <p>
                <strong>{param}</strong>: {value?.toLocaleString()}
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
