import React from 'react'

const Accordion = () => {
  return (
    <div>
      <div className="accordion" id="accordionExample">
        {/* Ερώτηση 1 */}
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
              Τι είδους πληροφορίες μπορώ να βρω στην εφαρμογή;
            </button>
          </h2>
          <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
            <div className="accordion-body">
              Η εφαρμογή παρέχει δεδομένα για την ποιότητα του νερού, την ατμοσφαιρική ρύπανση και την πορεία της ανακύκλωσης σε κάθε περιοχή.
            </div>
          </div>
        </div>

        {/* Ερώτηση 2 */}
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
              Πώς ενημερώνονται τα δεδομένα;
            </button>
          </h2>
          <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
            <div className="accordion-body">
              Κάθε μήνα, μόλις κλείσει ο κύκλος των μετρήσεων, ανανεώνουμε τα νέα στοιχεία για το νερό, τον αέρα και τα απορρίμματα..
            </div>
          </div>
        </div>

        {/* Ερώτηση 3 */}
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
              Πώς μπορώ να έχω πρόσβαση στα δεδομένα;
            </button>
          </h2>
          <div id="collapseThree" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
            <div className="accordion-body">
              Επιλέγω τις "Υπηρεσίες" από το μενού. 
              Έπειτα, κάνω κλικ στο "Αναζήτηση Δήμου/Περιοχής". 
              Στη συνέχεια, διαλέγω από τη λίστα την περιοχή που με ενδιαφέρει. 
              Τέλος, εάν η περιοχή δεν βρίσκεται μέσα στη λίστα, πατάω στο "Οδηγό Περιοχών" το οποίο βρίσκεται κάτω από το "Αναζήτηση Δήμου/Περιοχής" και επιλεγώ από τον χάρτη την περιοχή.
            </div>
          </div>
        </div>

        {/* Ερώτηση 4 */}
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
              Τι δεδομένα παρέχονται για την ποιότητα του νερού;
            </button>
          </h2>
          <div id="collapseFour" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
            <div className="accordion-body">
              Τα δεδομένα που παρέχονται είναι η θολότητα NTU (Nephelometric Turbidity Unit / Μονάδα Nεφελομετρικής Θολότητας), το χρώμα, το αργίλιο, τα χλωριούχα, η αγωγιμότητα, η συγκέντρωση ιόντων υδρογόνου (pH) και το υπολειμματικό χλώριο.
            </div>
          </div>
        </div>

        {/* Ερώτηση 5 */}
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
              Τι μετρά η εφαρμογή για την ποιότητα του αέρα;
            </button>
          </h2>
          <div id="collapseFive" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
            <div className="accordion-body">
              Οι μετρήσεις κάνουν αναφορά για το διοξείδιο του αζώτου (NO₂), το μονοξείδιο του αζώτου (NO), το μονοξείδιο του άνθρακα (CO), το όζον (O₃) και το διοξείδιο του θείου (SO₂).
            </div>
          </div>
        </div>

        {/* Ερώτηση 6 */}
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSix" aria-expanded="false" aria-controls="collapseSix">
              Ποιες πληροφορίες υπάρχουν για την ανακύκλωση και τα απορρίμματα;
            </button>
          </h2>
          <div id="collapseSix" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
            <div className="accordion-body">
              Θα βρεις δεδομένα για τον όγκο των ανακυκλώσιμων, τα ογκώδη αντικείμενα, τα υλικά που αξιοποιούνται, τα υπολείμματα από ΚΔΑΥ (Κέντρο Διαλογής Ανακυκλώσιμων Υλικών) και γενικά σκουπίδια.
            </div>
          </div>
        </div>

        {/* Ερώτηση 7 */}
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSeven" aria-expanded="false" aria-controls="collapseSeven">
              Με ποιον τροπο παρουσιάζονται τα δεδομενα;
            </button>
          </h2>
          <div id="collapseSeven" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
            <div className="accordion-body">
              Τα δεδομένα παρουσιάζονται με πίνακες, γραφήματα (ράβδους, πίτες), χάρτες και διαγράμματα.
            </div>
          </div>
        </div>
        {/* Ερώτηση 8 */}
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseEight" aria-expanded="false" aria-controls="collapseEight">
              Τι σημαίνουν οι δείκτες που εμφανίζονται
            </button>
          </h2>
          <div id="collapseEight" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
            <div className="accordion-body">
              Ο κάθε δείκτης δείχνει κάτι διαφορετικό:
              -Για το νερό: καθαρότητα, ασφάλεια και ποιότητα.
              -Για τον αέρα: επίπεδα ρύπανσης και ποιότητα αναπνοής.
              -Για την ανακύκλωση: πόσο καλά διαχειρίζεται η περιοχή τα απορρίμματα.
            </div>
          </div>
        </div>

        {/* Ερώτηση 9 */}
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseNine" aria-expanded="false" aria-controls="collapseNine">
              Ποιά είναι τα πιο σημαντικά δεδομένα που πρέπει να προσέξω;
            </button>
          </h2>
          <div id="collapseNine" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
            <div className="accordion-body">
              Για το νερό: η θολότητα και το χρώμα νερού για αιωρούμενα σωματίδια και οργανικά, το pH και η αγωγιμότητα για την οξύτητα και τα συνολικά διαλυμένα άλατα.
              Για τον αέρα: τα NO₂, O₃, CO τα οποία είναι οι κυριότεροι ρύποι που επιβαρύνουν τους πνεύμονες.
              Για τα απορρίματα: η ανακύκλωση και τα υπολείμματα ΚΔΑΥ για το πόσο «παράγουμε» και πόσο ανακυκλώνουμε.
            </div>
          </div>
        </div>

        {/* Ερώτηση 10 */}
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTen" aria-expanded="false" aria-controls="collapseTen">
              Πώς μπορώ να επικοινωνήσω μαζί σας;
            </button>
          </h2>
          <div id="collapseTen" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
            <div className="accordion-body">
              Πήγαινε στην ενότητα "Επικοινωνία", γράψε το όνομά σου, το email σου και το μήνυμα που θέλεις να μας στείλεις. Θα σου απαντήσουμε το συντομότερο!
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Accordion
