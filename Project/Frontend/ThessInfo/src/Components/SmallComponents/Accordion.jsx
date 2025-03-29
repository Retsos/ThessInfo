import React from 'react'

const Accordion = () => {
  return (
    <div>
      <div className="accordion" id="accordionExample">
        {/* Ερώτηση 1 */}
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
              Πώς μπορώ να δω δεδομένα για την ποιότητα του αέρα στην περιοχή μου μέσω της εφαρμογής;
            </button>
          </h2>
          <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordionExample">
            <div className="accordion-body">
              Μπορείτε να δείτε τα δεδομένα ποιότητας του αέρα στην περιοχή σας μέσω του χάρτη στην αρχική σελίδα της εφαρμογής.
            </div>
          </div>
        </div>

        {/* Ερώτηση 2 */}
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
              Πώς ενημερώνεται η εφαρμογή σχετικά με τα επίπεδα θορύβου στην πόλη;
            </button>
          </h2>
          <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
            <div className="accordion-body">
              Τα δεδομένα θορύβου προέρχονται από αισθητήρες που βρίσκονται σε διάφορες τοποθεσίες και ενημερώνονται σε πραγματικό χρόνο.
            </div>
          </div>
        </div>

        {/* Ερώτηση 3 */}
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
              Ποιες πληροφορίες παρέχει η εφαρμογή σχετικά με την ποιότητα του πόσιμου νερού;
            </button>
          </h2>
          <div id="collapseThree" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
            <div className="accordion-body">
              Η εφαρμογή παρέχει πληροφορίες για το pH, την καθαρότητα και τυχόν μόλυνση του πόσιμου νερού.
            </div>
          </div>
        </div>

        {/* Ερώτηση 4 */}
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFour" aria-expanded="false" aria-controls="collapseFour">
              Πώς μπορώ να βρω σημεία ανακύκλωσης κοντά μου μέσω της εφαρμογής;
            </button>
          </h2>
          <div id="collapseFour" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
            <div className="accordion-body">
              Μπορείτε να δείτε τα πλησιέστερα σημεία ανακύκλωσης μέσα από τον διαδραστικό χάρτη της εφαρμογής.
            </div>
          </div>
        </div>

        {/* Ερώτηση 5 */}
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseFive" aria-expanded="false" aria-controls="collapseFive">
              Μπορώ να λαμβάνω ειδοποιήσεις όταν αλλάζει η ποιότητα του αέρα ή του νερού στην περιοχή μου;
            </button>
          </h2>
          <div id="collapseFive" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
            <div className="accordion-body">
              Ναι, μπορείτε να ενεργοποιήσετε ειδοποιήσεις μέσα από τις ρυθμίσεις της εφαρμογής.
            </div>
          </div>
        </div>

        {/* Ερώτηση 6 */}
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSix" aria-expanded="false" aria-controls="collapseSix">
              Πώς μπορώ να δω ιστορικά δεδομένα σχετικά με τον θόρυβο ή την ποιότητα του νερού στην περιοχή μου;
            </button>
          </h2>
          <div id="collapseSix" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
            <div className="accordion-body">
              Μπορείτε να δείτε ιστορικά δεδομένα επιλέγοντας το χρονικό διάστημα που σας ενδιαφέρει από τις ρυθμίσεις.
            </div>
          </div>
        </div>

        {/* Ερώτηση 7 */}
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSeven" aria-expanded="false" aria-controls="collapseSeven">
              Πώς διασφαλίζεται η προστασία των προσωπικών μου δεδομένων κατά τη χρήση της εφαρμογής;
            </button>
          </h2>
          <div id="collapseSeven" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
            <div className="accordion-body">
              Η εφαρμογή ακολουθεί τα πρότυπα ασφαλείας του GDPR, διασφαλίζοντας την προστασία των δεδομένων σας.
            </div>
          </div>
        </div>
        {/* Ερώτηση 8 */}
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseEight" aria-expanded="false" aria-controls="collapseEight">
              Πώς μπορώ να συγκρίνω τα επίπεδα θορύβου και ποιότητας αέρα σε διαφορετικές περιοχές;
            </button>
          </h2>
          <div id="collapseEight" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
            <div className="accordion-body">
              Μπορείτε να συγκρίνετε τα επίπεδα επιλέγοντας δύο ή περισσότερες περιοχές στον χάρτη της εφαρμογής και προβάλλοντας τις αντίστοιχες μετρήσεις.
            </div>
          </div>
        </div>

        {/* Ερώτηση 9 */}
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseNine" aria-expanded="false" aria-controls="collapseNine">
              Μπορώ να δω στατιστικά στοιχεία σχετικά με την ανακύκλωση στην περιοχή μου;
            </button>
          </h2>
          <div id="collapseNine" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
            <div className="accordion-body">
              Ναι, μπορείτε να δείτε ποσοστά και ποσότητες ανακυκλώσιμων υλικών από το μενού "Ανακύκλωση" της εφαρμογής.
            </div>
          </div>
        </div>

        {/* Ερώτηση 10 */}
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#collapseTen" aria-expanded="false" aria-controls="collapseTen">
              Τι πρέπει να κάνω αν παρατηρήσω προβλήματα με τα δεδομένα ή τη λειτουργία της εφαρμογής;
            </button>
          </h2>
          <div id="collapseTen" className="accordion-collapse collapse" data-bs-parent="#accordionExample">
            <div className="accordion-body">
              Μπορείτε να στείλετε αναφορά σφάλματος μέσω της επιλογής "Υποστήριξη" ή να επικοινωνήσετε με την ομάδα υποστήριξης της εφαρμογής.
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Accordion
