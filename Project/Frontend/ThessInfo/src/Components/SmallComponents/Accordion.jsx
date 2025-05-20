import React from 'react';
import styles from './Accordion.module.css';

const Accordion = () => {
  return (
    <div>
      <div className={`accordion ${styles.accordion}`} id="accordionExample">
        {/* Ερώτηση 1 */}
        <div className={`accordion-item ${styles.accordionItem}`}>
          <h2 className="accordion-header">
            <button
              className={`accordion-button ${styles.accordionButton}`}
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseOne"
              aria-expanded="true"
              aria-controls="collapseOne"
            >
              Τι είδους πληροφορίες μπορώ να βρω στην εφαρμογή;
            </button>
          </h2>
          <div
            id="collapseOne"
            className="accordion-collapse collapse show"
            data-bs-parent="#accordionExample"
          >
            <div className={`accordion-body ${styles.accordionBody}`}>
              Η εφαρμογή παρέχει δεδομένα για την ποιότητα του νερού, την ατμοσφαιρική ρύπανση και την πορεία της ανακύκλωσης σε κάθε περιοχή.
            </div>
          </div>
        </div>

        {/* Ερώτηση 2 */}
        <div className={`accordion-item ${styles.accordionItem}`}>
          <h2 className="accordion-header">
            <button
              className={`accordion-button collapsed ${styles.accordionButton}`}
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseTwo"
              aria-expanded="false"
              aria-controls="collapseTwo"
            >
              Πώς ενημερώνονται τα δεδομένα;
            </button>
          </h2>
          <div
            id="collapseTwo"
            className="accordion-collapse collapse"
            data-bs-parent="#accordionExample"
          >
            <div className={`accordion-body ${styles.accordionBody}`}>
              Κάθε μήνα, μόλις κλείσει ο κύκλος των μετρήσεων, ανανεώνουμε τα νέα στοιχεία για το νερό, τον αέρα και τα απορρίμματα.
            </div>
          </div>
        </div>

        {/* Ερώτηση 3 */}
        <div className={`accordion-item ${styles.accordionItem}`}>
          <h2 className="accordion-header">
            <button
              className={`accordion-button collapsed ${styles.accordionButton}`}
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseThree"
              aria-expanded="false"
              aria-controls="collapseThree"
            >
              Πώς μπορώ να έχω πρόσβαση στα δεδομένα;
            </button>
          </h2>
          <div
            id="collapseThree"
            className="accordion-collapse collapse"
            data-bs-parent="#accordionExample"
          >
            <div className={`accordion-body ${styles.accordionBody}`}>
              Επιλέγω τις "Υπηρεσίες" από το μενού. Έπειτα, κάνω κλικ στο "Αναζήτηση Δήμου/Περιοχής".
              Στη συνέχεια, διαλέγω από τη λίστα την περιοχή που με ενδιαφέρει. Τέλος, εάν η περιοχή δεν βρίσκεται μέσα στη λίστα,
              πατάω στο "Οδηγό Περιοχών" το οποίο βρίσκεται κάτω από το "Αναζήτηση Δήμου/Περιοχής" και επιλέγω από τον χάρτη την περιοχή.
              Επιπλέον, υπάρχουν εικονίδια δίπλα στις περιοχές, που απεικονίζουν οπτικά τα δεδομένα (νερό, αέρας, ανακύκλωση) που παρέχονται.            </div>
          </div>
        </div>

        {/* Ερώτηση 4 */}
        <div className={`accordion-item ${styles.accordionItem}`}>
          <h2 className="accordion-header">
            <button
              className={`accordion-button collapsed ${styles.accordionButton}`}
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseFour"
              aria-expanded="false"
              aria-controls="collapseFour"
            >
              Τι δεδομένα παρέχονται για την ποιότητα του νερού;
            </button>
          </h2>
          <div
            id="collapseFour"
            className="accordion-collapse collapse"
            data-bs-parent="#accordionExample"
          >
            <div className={`accordion-body ${styles.accordionBody}`}>
              Τα δεδομένα που παρέχονται είναι η θολότητα NTU (Nephelometric Turbidity Unit), το χρώμα, το αργίλιο, τα χλωριούχα, η αγωγιμότητα, η συγκέντρωση ιόντων υδρογόνου (pH) και το υπολειμματικό χλώριο.
            </div>
          </div>
        </div>

        {/* Ερώτηση 5 */}
        <div className={`accordion-item ${styles.accordionItem}`}>
          <h2 className="accordion-header">
            <button
              className={`accordion-button collapsed ${styles.accordionButton}`}
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseFive"
              aria-expanded="false"
              aria-controls="collapseFive"
            >
              Τι μετρά η εφαρμογή για την ποιότητα του αέρα;
            </button>
          </h2>
          <div
            id="collapseFive"
            className="accordion-collapse collapse"
            data-bs-parent="#accordionExample"
          >
            <div className={`accordion-body ${styles.accordionBody}`}>
              Οι μετρήσεις κάνουν αναφορά για το διοξείδιο του αζώτου (NO₂), το μονοξείδιο του αζώτου (NO), το μονοξείδιο του άνθρακα (CO), το όζον (O₃) και το διοξείδιο του θείου (SO₂).
            </div>
          </div>
        </div>

        {/* Ερώτηση 6 */}
        <div className={`accordion-item ${styles.accordionItem}`}>
          <h2 className="accordion-header">
            <button
              className={`accordion-button collapsed ${styles.accordionButton}`}
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseSix"
              aria-expanded="false"
              aria-controls="collapseSix"
            >
              Ποιες πληροφορίες υπάρχουν για την ανακύκλωση και τα απορρίμματα;
            </button>
          </h2>
          <div
            id="collapseSix"
            className="accordion-collapse collapse"
            data-bs-parent="#accordionExample"
          >
            <div className={`accordion-body ${styles.accordionBody}`}>
              Θα βρεις δεδομένα για τον όγκο των ανακυκλώσιμων, τα ογκώδη αντικείμενα, τα υλικά που αξιοποιούνται, τα υπολείμματα από ΚΔΑΥ (Κέντρο Διαλογής Ανακυκλώσιμων Υλικών) και γενικά σκουπίδια.
            </div>
          </div>
        </div>

        {/* Ερώτηση 7 */}
        <div className={`accordion-item ${styles.accordionItem}`}>
          <h2 className="accordion-header">
            <button
              className={`accordion-button collapsed ${styles.accordionButton}`}
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseSeven"
              aria-expanded="false"
              aria-controls="collapseSeven"
            >
              Με ποιον τρόπο παρουσιάζονται τα δεδομένα;
            </button>
          </h2>
          <div
            id="collapseSeven"
            className="accordion-collapse collapse"
            data-bs-parent="#accordionExample"
          >
            <div className={`accordion-body ${styles.accordionBody}`}>
              Τα δεδομένα παρουσιάζονται με πίνακες, γραφήματα (ράβδους, πίτες), χάρτες και διαγράμματα.
            </div>
          </div>
        </div>

        {/* Ερώτηση 8 */}
        <div className={`accordion-item ${styles.accordionItem}`}>
          <h2 className="accordion-header">
            <button
              className={`accordion-button collapsed ${styles.accordionButton}`}
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseEight"
              aria-expanded="false"
              aria-controls="collapseEight"
            >
              Τι σημαίνουν οι δείκτες που εμφανίζονται;
            </button>
          </h2>
          <div
            id="collapseEight"
            className="accordion-collapse collapse"
            data-bs-parent="#accordionExample"
          >
            <div className={`accordion-body ${styles.accordionBody}`}>
              Ο κάθε δείκτης δείχνει κάτι διαφορετικό:
              <ul>
                <li>Για το νερό: καθαρότητα, ασφάλεια και ποιότητα.</li>
                <li>Για τον αέρα: επίπεδα ρύπανσης και ποιότητα αναπνοής.</li>
                <li>Για την ανακύκλωση: πόσο καλά διαχειρίζεται η περιοχή τα απορρίμματα.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Ερώτηση 9 */}
        <div className={`accordion-item ${styles.accordionItem}`}>
          <h2 className="accordion-header">
            <button
              className={`accordion-button collapsed ${styles.accordionButton}`}
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseNine"
              aria-expanded="false"
              aria-controls="collapseNine"
            >
              Ποιά είναι τα πιο σημαντικά δεδομένα που πρέπει να προσέξω;
            </button>
          </h2>
          <div
            id="collapseNine"
            className="accordion-collapse collapse"
            data-bs-parent="#accordionExample"
          >
            <div className={`accordion-body ${styles.accordionBody}`}>
              <ul>
                <li>Νερό: θολότητα, χρώμα, pH, αγωγιμότητα.</li>
                <li>Αέρας: NO₂, O₃, CO.</li>
                <li>Απορρίμματα: ανακύκλωση, υπολείμματα ΚΔΑΥ.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Ερώτηση 10 */}
        <div className={`accordion-item ${styles.accordionItem}`}>
          <h2 className="accordion-header">
            <button
              className={`accordion-button collapsed ${styles.accordionButton}`}
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseTen"
              aria-expanded="false"
              aria-controls="collapseTen"
            >
              Πώς μπορώ να επικοινωνήσω μαζί σας;
            </button>
          </h2>
          <div
            id="collapseTen"
            className="accordion-collapse collapse"
            data-bs-parent="#accordionExample"
          >
            <div className={`accordion-body ${styles.accordionBody}`}>
              Πήγαινε στην ενότητα "Επικοινωνία", γράψε το όνομά σου, το email σου και το μήνυμα που θέλεις να μας στείλεις. Θα σου απαντήσουμε το συντομότερο!
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Accordion;