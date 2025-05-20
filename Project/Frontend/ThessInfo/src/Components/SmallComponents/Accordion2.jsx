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
              Κάθε μήνα, μόλις κλείσει ο κύκλος των μετρήσεων, ανανεώνουμε τα νέα στοιχεία για το νερό, τον αέρα και τα απορρίμματα.
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

      </div>
    </div>
  )
}

export default Accordion
