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

const tooltips = {
  "Ανακυκλώσιμα": "Αυτά είναι τα υλικά που συλλέχθηκαν, διαχωρίστηκαν και τελικά στάλθηκαν προς ανακύκλωση.",
  "Ανάκτηση Ογκωδών": "Αφορά μεγάλα σε όγκο απορρίμματα όπως έπιπλα, στρώματα, συσκευές, ξύλα κ.ά. Από αυτά ανακτήθηκαν υλικά που μπορούσαν να επαναχρησιμοποιηθούν ή να ανακυκλωθούν.",
  "Αξιοποιήσιμα": "Αυτός ο όρος συχνά περιλαμβάνει τα ανακυκλώσιμα και άλλα υλικά που έχουν κάποια εμπορική ή λειτουργική αξία. Π.χ. μπορεί να περιλαμβάνει και μεταχειρισμένα αντικείμενα που μπορούν να επαναχρησιμοποιηθούν ή να επισκευαστούν.",
  "Υπόλειμμα του ΚΔΑΥ": "Αυτά είναι τα υλικά που πέρασαν από το ΚΔΑΥ αλλά δεν ήταν δυνατό να ανακυκλωθούν ή να αξιοποιηθούν λόγω ρύπανσης, λάθος διαλογής, ακαταλληλότητας κ.λπ. Συνήθως καταλήγουν σε ΧΥΤΑ ή αποτέφρωση.",
  "Υπόλειμμα": "Αυτός ο όρος μπορεί να αφορά το συνολικό υπόλειμμα του συστήματος, όχι μόνο του ΚΔΑΥ. Περιλαμβάνει τα τελικά μη αξιοποιήσιμα απόβλητα.",
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
              tabIndex={0}
              role='button'
              title={tooltips[param] || "Δεν υπάρχουν πληροφορίες."}
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
