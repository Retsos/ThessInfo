import React  from 'react';

const WaterCard = ({ waterData }) => {

  // Έλεγχος για null ή undefined
  if (!waterData || !waterData.analysis) {
    return <p></p>;
  }

  return (
    <div className="card">
        <div className="dropdown-content">
          {waterData.analysis.length > 0 ? (
            <ul>
              {waterData.analysis.map((item, index) => (
                <li key={index}>
                  <strong>{item.parameter}</strong>: {item.value ?? "N/A"} {item.unit ?? ""} 
                  (Όριο: {item.limit ?? "Άγνωστο"}) – {item.is_compliant ? "Συμμορφώνεται ✅" : "Δεν συμμορφώνεται ❌"}
                </li>
              ))}
            </ul>
          ) : (
            <p>Δεν υπάρχουν διαθέσιμα δεδομένα για αυτο τον δημο.</p>
          )}
        </div>
    </div>
  );
};

export default WaterCard;
