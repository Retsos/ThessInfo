import React, { useEffect } from 'react';
import WaterCss from './Waterinfo.module.css';
import { GrTooltip } from "react-icons/gr";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

const tooltips = {
  "Θολότητα NTU": "Η θολότητα δείχνει το πόσο καθαρό είναι το νερό. Αποδεκτή τιμή: < 1.0 NTU.",
  "Χρώμα": "Το χρώμα μετράται σε Pt-Co και δείχνει αν το νερό είναι οπτικά καθαρό. Όριο: ≤ 5 mg/l Pt-Co.",
  "Αργίλιο": "Το αργίλιο μπορεί να προέρχεται από τη διαδικασία καθαρισμού. Όριο: ≤ 200 μg/l.",
  "Χλωριούχα": "Τα χλωριούχα δείχνουν την παρουσία αλάτων. Όριο: ≤ 250 mg/l.",
  "Αγωγιμότητα": "Δείχνει τη συγκέντρωση διαλυμένων αλάτων. Όριο: ≤ 2500 μS/cm.",
  "Συγκέντρωση ιόντων υδρογόνου": "Το pH δείχνει αν το νερό είναι όξινο ή αλκαλικό. Ιδανικό: 6.5 - 9.5.",
  "Υπολειμματικό χλώριο": "Δείχνει την ποσότητα χλωρίου που παραμένει μετά την απολύμανση. Όριο: ≤ 0.2 mg/l."
};

const WaterCard = ({ waterData }) => {
  // Αρχικοποίηση των Bootstrap tooltips όταν τα δεδομένα αλλάζουν
  useEffect(() => {
    if (waterData && waterData.analysis) {
      const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
      tooltipTriggerList.forEach((tooltipTriggerEl) => {
        // Ελέγχεις αν υπάρχει το window.bootstrap για να αποφύγεις errors αν δεν έχει φορτωθεί
        if(window.bootstrap) {
          new window.bootstrap.Tooltip(tooltipTriggerEl);
        }
      });
    }
  }, [waterData]);

  if (!waterData || !waterData.analysis) {
    return null;
  }

  return (
    <div className={WaterCss.card}>
      <div className={WaterCss.dropdownContent}>
        {waterData.analysis.length > 0 ? (
          <ul>
            {waterData.analysis.map((item, index) => (
              <li key={index} className={WaterCss.listItem}>
                <div className={WaterCss.parameter}>
                  <strong>{item.parameter}</strong>: {item.value ?? "N/A"} {item.unit ?? ""}
                  (Όριο: {item.limit ?? "Άγνωστο"}){" "}
                  {item.is_compliant ? (
                    <FaCheckCircle className={WaterCss.iconSuccess} />
                  ) : (
                    <FaTimesCircle className={WaterCss.iconFail} />
                  )}
                </div>
                
                <span
                  className={WaterCss.tooltipIcon}
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  title={tooltips[item.parameter] || "Δεν υπάρχουν πληροφορίες."}
                >
                  <GrTooltip />
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <>Δεν υπάρχουν διαθέσιμα δεδομένα για αυτόν τον δήμο.</>
        )}
      </div>
    </div>
  );
};

export default WaterCard;
