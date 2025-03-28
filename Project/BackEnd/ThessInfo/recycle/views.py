from django.http import JsonResponse
from .utils import load_all_data
from django.shortcuts import render


def recycling_view(request):
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
    
    all_data = load_all_data()
    
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
    
    record = filtered_data[0]
    total = 0.0
    count = 0
    
    months_order = {
        "Ιαν": 1, "Φεβ": 2, "Μαρ": 3, "Απρ": 4, "Μαϊ": 5, "Ιουν": 6,
        "Ιουλ": 7, "Αυγ": 8, "Σεπ": 9, "Οκτ": 10, "Νοε": 11, "Δεκ": 12
    }
    
    month_keys = sorted(
        [key for key in record.keys() if key.endswith('-' + year)],
        key=lambda x: months_order.get(x.split('-')[0], 0),
        reverse=True
    )
    
    for key in month_keys:
        value = record.get(key, "").strip()
        if value:
            try:
                num = float(value.replace(",", "."))
                total += num
                count += 1
            except ValueError:
                continue
    
    average = total / count if count > 0 else None

    most_recent_value = None
    most_recent_month = None
    for key in month_keys:
        value = record.get(key, "").strip()
        if value:
            try:
                most_recent_value = float(value.replace(",", "."))
                most_recent_month = key.split('-')[0]
                break
            except ValueError:
                continue
    
    results = {
        "ΠΕΡΙΟΧΗ": record.get("ΠΕΡΙΟΧΗ"),
        "ΤΥΠΟΣ": record.get("ΤΥΠΟΣ"),
        f"Μέσος Όρος ΔΙΑΛΟΓΗΣ για το έτος {year}": average,
        "Πρόσφατος Μήνας": most_recent_month,
        "Τιμή για τον πιο πρόσφατο μήνα": most_recent_value
    }
    
    return JsonResponse(results)


def recycling_view2(request):
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
    
    all_data = load_all_data()
    
    filtered_data = [
        record for record in all_data
        if record.get("ΠΕΡΙΟΧΗ", "").upper() == region.upper() and
           record.get("ΤΥΠΟΣ") == "ΕΙΣΕΡΧΟΜΕΝΑ ΑΝΑΚΥΚΛΩΣΙΜΑ ΥΛΙΚΑ ΣΤΟ ΚΕΝΤΡΟ ΔΙΑΛΟΓΗΣ (kg/Κάτοικο)" and
           any(key.endswith('-' + year) for key in record.keys())
    ]
    
    if not filtered_data:
        return JsonResponse(
            {'error': f'Δεν βρέθηκαν δεδομένα για την περιοχή {region} με δεδομένα του έτους {year}.'},
            status=404
        )
    
    record = filtered_data[0]
    
    months_order = {
        "Ιαν": 1, "Φεβ": 2, "Μαρ": 3, "Απρ": 4, "Μαϊ": 5, "Ιουν": 6,
        "Ιουλ": 7, "Αυγ": 8, "Σεπ": 9, "Οκτ": 10, "Νοε": 11, "Δεκ": 12
    }
    
    month_keys = sorted(
        [key for key in record.keys() if key.endswith('-' + year)],
        key=lambda x: months_order.get(x.split('-')[0], 0),
        reverse=True
    )
    
    valid_values = []
    most_recent_value = None
    most_recent_month = None
    
    for key in month_keys:
        value = record.get(key, "").strip()
        if value:
            try:
                num = float(value.replace(",", "."))
                if num > 0:
                    valid_values.append(num)
                    if most_recent_value is None:  # Βρίσκουμε τον πιο πρόσφατο μήνα με τιμή
                        most_recent_value = num
                        most_recent_month = key.split('-')[0]
            except ValueError:
                continue
    
    average = sum(valid_values) / len(valid_values) if valid_values else None

    results = {
        "ΠΕΡΙΟΧΗ": record.get("ΠΕΡΙΟΧΗ"),
        "ΤΥΠΟΣ": record.get("ΤΥΠΟΣ"),
        f"Μέσος Όρος ΔΙΑΛΟΓΗΣ ανά κάτοικο για το έτος {year}": average,
        "Πρόσφατος Μήνας": most_recent_month,
        "Τιμή για τον πιο πρόσφατο μήνα": most_recent_value
    }
    
    return JsonResponse(results)




def average_view(request):
    all_data = load_all_data()  # Φόρτωση δεδομένων
    results = []  # Λίστα αποτελεσμάτων για κάθε υποκατηγορία

    for entry in all_data:
        # Φιλτράρουμε μόνο τα entries με τον επιθυμητό ΤΥΠΟΣ
        if entry.get("ΤΥΠΟΣ") != "ΑΞΙΟΠΟΙΗΣΙΜΑ ΥΛΙΚΑ (kg)":
            continue

        averages = {}
        for key, value in entry.items():
            # Παράβλεψη πεδίων που δεν αφορούν τιμές
            if key in ["ΤΥΠΟΣ", "ΚΑΤΗΓΟΡΙΑ"]:
                continue
            # Ελέγχουμε αν το key έχει το format "Μήνας-Έτος" και υπάρχει τιμή
            if '-' in key and value.strip():
                parts = key.split('-')
                if len(parts) == 2:
                    year = parts[1].strip()
                    try:
                        num = float(value.replace(',', ''))
                    except ValueError:
                        continue
                    averages.setdefault(year, []).append(num)
        
        # Υπολογισμός μέσου όρου για κάθε έτος της εγγραφής
        avg_by_year = {yr: round(sum(vals) / len(vals), 2) for yr, vals in averages.items() if vals}
        results.append({
            'ΚΑΤΗΓΟΡΙΑ': entry.get('ΚΑΤΗΓΟΡΙΑ'),
            'Μέσοι Όροι': avg_by_year
        })
    
    # Ομαδοποίηση αποτελεσμάτων κατά έτος
    grouped = {}
    for item in results:
        for year, avg in item['Μέσοι Όροι'].items():
            if year not in grouped:
                grouped[year] = {}
            grouped[year][item['ΚΑΤΗΓΟΡΙΑ']] = avg

    return JsonResponse({'results': grouped})