// src/Components/WaterCard.jsx
import React, { useEffect } from 'react';
import WaterCss from './Waterinfo.module.css';
import { GrTooltip } from 'react-icons/gr';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { BsDashCircleFill } from 'react-icons/bs';

const tooltips = {
  "Θολότητα NTU": "Η θολότητα δείχνει το πόσο καθαρό είναι το νερό. Αποδεκτή τιμή: < 1.0 NTU.",
  "Χρώμα": "Το χρώμα μετράται σε Pt-Co και δείχνει αν το νερό είναι οπτικά καθαρό. Όριο: ≤ 15 mg/l Pt-Co.",
  "Αργίλιο": "Το αργίλιο μπορεί να προέρχεται από τη διαδικασία καθαρισμού. Όριο: ≤ 200 μg/l.",
  "Χλωριούχα": "Τα χλωριούχα δείχνουν την παρουσία αλάτων. Όριο: ≤ 250 mg/l.",
  "Αγωγιμότητα": "Δείχνει τη συγκέντρωση διαλυμένων αλάτων. Όριο: ≤ 2500 μS/cm.",
  "Συγκέντρωση ιόντων υδρογόνου": "Το pH δείχνει αν το νερό είναι όξινο ή αλκαλικό. Ιδανικό: 6.5 - 9.5.",
  "Υπολειμματικό χλώριο": "Δείχνει την ποσότητα χλωρίου που παραμένει μετά την απολύμανση. Όριο: ≥ 0.2 mg/l."
};

const WaterCard = ({ waterData }) => {
  useEffect(() => {
    const tooltipTriggerList = Array.from(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    tooltipTriggerList.forEach(el => window.bootstrap && new window.bootstrap.Tooltip(el));
  }, [waterData]);

  const analysis = waterData?.analysis || [];
  if (!analysis.length) return null;

  return (
    <div className={WaterCss.card}>
      <h4 className={WaterCss.chartTitle}>Λεπτομέρειες για: {waterData.latest_data[0]?.Month || ''}({waterData.latest_data[0]?.Year || ''})</h4>
      <ul className={WaterCss.list}>
        {analysis.map((item, idx) => {
          const { parameter, value, unit, limit, is_compliant } = item;
          const hasValue = value != null;
          const limitDisplay = limit ?? null;
          // pick status icon
          let status;
          if (!hasValue) status = <BsDashCircleFill className={WaterCss.statusNeutral} title='Δεν υπάρχει μέτρηση '/>;
          else if (is_compliant) status = <FaCheckCircle className={WaterCss.statusOk}title='Εντός Ορίου' />;
          else status = <FaTimesCircle className={WaterCss.statusFail}title='Εκτός Ορίου' />;

          return (
            <li key={idx} className={WaterCss.listItem}>
              
              <div className={WaterCss.parameter}>
                <strong>{parameter}</strong>: {hasValue ? value : '–'} {hasValue && unit}
                {limitDisplay && (
                  <span className={WaterCss.limit} title={`Όριο: ${limitDisplay}`}>
                    ({limitDisplay})
                  </span>
                )}
              </div>

              <div className={WaterCss.listIcons}>
                {status}
                <span
                  className={WaterCss.tooltipIcon}
                  data-bs-toggle="tooltip"
                  data-bs-placement="right"
                  title={tooltips[parameter]}
                >
                  <GrTooltip />
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default WaterCard;