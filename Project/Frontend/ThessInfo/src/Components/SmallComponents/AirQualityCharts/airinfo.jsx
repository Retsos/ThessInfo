import React, { useEffect } from 'react';
import AirCss from './airinfo.module.css';
import { GrTooltip } from 'react-icons/gr';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

// Χαρτογράφηση αγγλικών → ελληνικών μήνες
const MONTH_MAP = {
  January: 'Ιαν', February: 'Φεβ', March: 'Μαρ', April: 'Απρ',
  May: 'Μαϊ', June: 'Ιουν', July: 'Ιουλ', August: 'Αυγ',
  September: 'Σεπ', October: 'Οκτ', November: 'Νοε', December: 'Δεκ'
};

// tooltips για κάθε παράμετρο
const PARAM_TOOLTIPS = {
  no2_conc: 'Διοξείδιο του αζώτου (NO₂): προκύπτει κυρίως από την καύση οχημάτων και βιομηχανικών εγκαταστάσεων, ερεθιστικό για το αναπνευστικό.',
  o3_conc: 'Όζον (O₃): σχηματίζεται από χημικές αντιδράσεις NOₓ και πτητικών οργανικών ενώσεων υπό την ηλιακή ακτινοβολία.',
  co_conc: 'Μονοξείδιο του άνθρακα (CO): άοσμο, παράγεται από ατελή καύση, μειώνει την ικανότητα του αίματος να μεταφέρει οξυγόνο.',
  no_conc: 'Μονοξείδιο του αζώτου (NO): πρόδρομος του NO₂/όζοντος, τοξικό σε υψηλές συγκεντρώσεις.',
  so2_conc: 'Διοξείδιο του θείου (SO₂): από θειούχα καύσιμα, ερεθιστικό για το αναπνευστικό σύστημα και συμβάλλει στο σχηματισμό σωματιδίων.'
};

export default function AirLatest({ airData = {} }) {
  const { limits = {}, area, ...yearsData } = airData;

  // Φιλτράρουμε τα κλειδιά που είναι έτη
  const yearKeys = Object.keys(yearsData).filter(k => /^\d{4}$/.test(k));
  if (!yearKeys.length) {
    return <div className={AirCss.empty}>Δεν υπάρχουν δεδομένα αέρα.</div>;
  }

  // Βρίσκουμε το πιο πρόσφατο έτος
  const latestYear = String(Math.max(...yearKeys.map(y => parseInt(y, 10))));
  const yearEntry = yearsData[latestYear] || {};

  // Διαθέσιμα μήνες (αγγλικά)
  const months = Object.keys(yearEntry.monthly_averages || {});
  const validMonths = months.filter(m => MONTH_MAP[m]);
  // Φέρνουμε τελευταίο κατά αύξουσα σειρά του keys array
  validMonths.sort((a, b) => months.indexOf(a) - months.indexOf(b));

  const latestMonthKey = validMonths[validMonths.length - 1];
  const latestMonthLabel = MONTH_MAP[latestMonthKey];
  const latestDataObj = (yearEntry.monthly_averages || {})[latestMonthKey] || {};
  const averages = latestDataObj.averages || {};


  useEffect(() => {
    const tooltipTriggerList = Array.from(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    tooltipTriggerList.forEach(el => {
      if (window.bootstrap) {
        new window.bootstrap.Tooltip(el);
      }
    });
  }, [airData]);

  return (
    <div className={AirCss.card}>
      <h4 className={AirCss.cardTitle}>
        Συγκεντρώσεις Αέρα
        <span className={AirCss.subTitle}>
          ({latestMonthLabel} {latestYear})
        </span>
      </h4>

      <ul className={AirCss.list}>

        {Object.entries(averages).map(([param, value]) => {
          const label = param.replace('_conc', '').toUpperCase();
          const limitStr = limits[param] || '';
          const limitVal = parseFloat(limitStr.replace(/[^0-9.]/g, ''));
          const displayValue =
            value != null ? `${value.toFixed(2)} μg/m³` : '–';

          // Επιλογή status icon
          let statusIcon;
          if (value == null) {
            statusIcon = <span className={AirCss.noData}>–</span>;
          } else if (!isNaN(limitVal)) {
            statusIcon = value <= limitVal ? (
              <FaCheckCircle
                className={AirCss.statusIconGood}
                title="Εντός ορίου"
              />
            ) : (
              <FaTimesCircle
                className={AirCss.statusIconBad}
                title="Εκτός ορίου"
              />
            );
          } else {
            statusIcon = null;
          }

          return (
            <li key={param} className={AirCss.listItem}>

              <span className={AirCss.parameter}>
                <strong>{label}</strong>: {displayValue}
                <span title={`Όριο: ${limitStr}`}> ({limitStr})</span>
              </span>

              <div className={AirCss.listIcons}>

                {statusIcon}
                <span className={AirCss.tooltipIcon}
                  data-bs-toggle="tooltip"
                  data-bs-placement="right"
                  data-bs-trigger="hover focus click"
                  title={PARAM_TOOLTIPS[param] || ''}>
                  <GrTooltip
                  />
                </span>

              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}