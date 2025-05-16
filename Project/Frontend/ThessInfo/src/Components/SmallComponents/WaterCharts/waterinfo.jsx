  import React, { useEffect } from 'react';
  import WaterCss from './Waterinfo.module.css';
  import { GrTooltip } from "react-icons/gr";
  import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
  import { BsDashCircleFill } from "react-icons/bs";

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
    useEffect(() => {
      if (waterData && waterData.analysis) {
        const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.forEach(el => {
          if (window.bootstrap) {
            new window.bootstrap.Tooltip(el);
          }
        });
      }
    }, [waterData]);

    if (!waterData?.analysis) return null;

    return (
      <div className={WaterCss.card}>
        <div className={WaterCss.dropdownContent}>
          {waterData.analysis.length > 0 ? (
            <ul>
              {waterData.analysis.map((item, index) => {
                const hasValue = item.value != null;
                const isCompliant = item.is_compliant;

                return (
                  <li key={index} className={WaterCss.listItem}>
                    <div className={WaterCss.parameter}>
                      <strong>{item.parameter}</strong>: 
                      {hasValue ? <> {item.value} </> : <> N/A </>} 
                      {hasValue && ` ${item.unit ?? ''}`} 
                      (Όριο: {item.limit ?? <BsDashCircleFill className={WaterCss.iconNeutral} />})&nbsp;

                      {isCompliant === true ? (
                        <FaCheckCircle className={WaterCss.iconSuccess} />
                      ) : isCompliant === false ? (
                        <FaTimesCircle className={WaterCss.iconFail} />
                      ) : (
                        <BsDashCircleFill className={WaterCss.iconNeutral} />
                      )}
                    </div>

                    <span
                      className={WaterCss.tooltipIcon}
                      data-bs-toggle="tooltip"
                      data-bs-placement="right"
                      title={tooltips[item.parameter] || "Δεν υπάρχουν πληροφορίες."}
                    >
                      <GrTooltip />
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>Δεν υπάρχουν διαθέσιμα δεδομένα για αυτόν τον δήμο.</p>
          )}
        </div>
      </div>
    );
  };

  export default WaterCard;
