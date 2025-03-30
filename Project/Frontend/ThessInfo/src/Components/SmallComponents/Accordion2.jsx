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

      </div>
    </div>
  )
}

export default Accordion
