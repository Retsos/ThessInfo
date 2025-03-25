from django.http import JsonResponse
from .utils import load_all_data


def recycling_view(request):
    # Λήψη των query parameters 'region' και 'year'
    region = request.GET.get('region')
    year = request.GET.get('year')
    
    if not region:
        return JsonResponse(
            {'error': 'Παρακαλώ δώστε το όνομα της περιοχής ως query parameter (region).'},
            status=400
        )
    
    if not year:
        return JsonResponse(
            {'error': 'Παρακαλώ δώστε το έτος ως query parameter (year).'},
            status=400
        )
    
    # Φόρτωση όλων των δεδομένων
    all_data = load_all_data()
    
    # Φιλτράρισμα για την επιλεγμένη περιοχή, συγκεκριμένο τύπο
    # και έλεγχο ότι το record έχει τουλάχιστον ένα πεδίο για το ζητούμενο έτος
    filtered_data = [
        record for record in all_data
        if record.get("ΠΕΡΙΟΧΗ", "").upper() == region.upper() and
           record.get("ΤΥΠΟΣ") == "ΕΙΣΕΡΧΟΜΕΝΑ ΑΝΑΚΥΚΛΩΣΙΜΑ ΥΛΙΚΑ ΣΤΟ ΚΕΝΤΡΟ ΔΙΑΛΟΓΗΣ (kg/ΟΤΑ)" and
           any(key.endswith('-' + year) for key in record.keys())
    ]
    
    if not filtered_data:
        return JsonResponse(
            {'error': f'Δεν βρέθηκαν δεδομένα για την περιοχή {region} με δεδομένα του έτους {year}.'},
            status=404
        )
    
    # Επιλέγουμε το πρώτο record που έχει δεδομένα για το ζητούμενο έτος
    record = filtered_data[0]
    total = 0.0
    count = 0
    
    # Επιλογή των πεδίων που ανήκουν στο δοσμένο έτος (π.χ. "Ιαν-23", "Φεβ-23", κ.ο.κ.)
    month_keys = [key for key in record.keys() 
                  if key not in ["ΤΥΠΟΣ", "ΠΕΡΙΟΧΗ"] and key.endswith('-' + year)]
    
    for key in month_keys:
        value = record.get(key, "").strip()
        if value:
            try:
                num = float(value.replace(",", "."))
                total += num
                count += 1
            except ValueError:
                continue
    average = total / count if count > 0 else 0
    
    results = {
        "ΠΕΡΙΟΧΗ": record.get("ΠΕΡΙΟΧΗ"),
        "ΤΥΠΟΣ": record.get("ΤΥΠΟΣ"),
        "Μέσος Όρος ΔΙΑΛΟΓΗΣ για το έτος " + year: average
    }
    
    return JsonResponse(results)
