import React, { useState } from 'react';

const WaterCard = ({ waterData }) => {
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => setShowDetails(prev => !prev);

  // Έλεγχος για null ή undefined
  if (!waterData || !waterData.analysis) {
    return <p></p>;
  }

  return (
    <div className="card">
      <button onClick={toggleDetails}>
        {showDetails ? "Κλείσε τις λεπτομέρειες" : "Προβολή λεπτομερειών"}
      </button>

      {showDetails && (
        <div className="dropdown-content">
          {waterData.analysis.length > 0 ? (
            <ul>
              {waterData.analysis.map((item, index) => (
                <li key={index}>
                  <strong>{item.parameter}</strong>: {item.value ?? "N/A"} {item.unit ?? ""} 
                  (Όριο: {item.limit ?? "Άγνωστο"}) – {item.is_compliant ? "Συμμορφώνεται" : "Δεν συμμορφώνεται"}
                </li>
              ))}
            </ul>
          ) : (
            <p>Δεν υπάρχουν διαθέσιμα δεδομένα για αυτο τον δημο.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default WaterCard;
