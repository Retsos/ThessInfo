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
        key=lambda x: months_order.get(x.split('-')[0], 0)
    )
    
    monthly_data = {}  # Αποθήκευση όλων των μηνών
    
    most_recent_month = None
    most_recent_value = None
    
    for key in month_keys:
        value = record.get(key, "").strip()
        if value:
            try:
                num = float(value.replace(",", "."))
                month_name = key.split('-')[0]
                monthly_data[month_name] = num  # Αποθήκευση τιμής

                if num > 0:  # Μόνο θετικές τιμές λαμβάνονται υπόψη στον μέσο όρο
                    total += num
                    count += 1

                # Βρίσκουμε την πιο πρόσφατη τιμή
                most_recent_month = month_name
                most_recent_value = num
            except ValueError:
                monthly_data[month_name] = None  # Αν η τιμή δεν είναι αριθμός, αποθηκεύουμε `null`
    
    average = total / count if count > 0 else None

    results = {
    
        "REGION": record.get("ΠΕΡΙΟΧΗ"),
        "TYPE": record.get("ΤΥΠΟΣ"),
        f"Average_RECYCLING_for_the_year_{year}": average,
        "Most_Recent_Month": most_recent_month,
        "Value_for_the_Most_Recent_Month": most_recent_value,
        "Detailed_Monthly_Data": monthly_data  # All data per month, including `null`


    }
    
    return JsonResponse(results)



def recycling_viewperperson(request):
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
        key=lambda x: months_order.get(x.split('-')[0], 0)
    )
    
    monthly_values = {}
    valid_values = []
    most_recent_value = None
    most_recent_month = None
    
    for key in month_keys:
        month = key.split('-')[0]
        value = record.get(key, "").strip()
        
        if value:  # Αν η τιμή δεν είναι κενή
            try:
                num = float(value.replace(",", "."))
                if num > 0:
                    valid_values.append(num)
                    monthly_values[month] = num
                    most_recent_value = num
                    most_recent_month = month
                else:
                    monthly_values[month] = None  # Αν η τιμή είναι 0 ή αρνητική, αγνοείται
            except ValueError:
                monthly_values[month] = None  # Αν δεν μπορεί να μετατραπεί σε αριθμό
        else:
            monthly_values[month] = None  # Αν η τιμή είναι κενή ("")

    average = sum(valid_values) / len(valid_values) if valid_values else None

    results = {
        "REGION": record.get("ΠΕΡΙΟΧΗ"),
        "TYPE": record.get("ΤΥΠΟΣ"),
        f"Average RECYCLING for the year {year}": average,
        "Most Recent Month": most_recent_month,
        "Value for the Most Recent Month": most_recent_value,
        "Detailed Monthly Data": monthly_values  # All data per month, including `null`
}

    
    return JsonResponse(results)



def average_view(request):
    all_data = load_all_data()
    results = []

    for entry in all_data:
        if entry.get("ΤΥΠΟΣ") != "ΑΞΙΟΠΟΙΗΣΙΜΑ ΥΛΙΚΑ (kg)":
            continue

        monthly_data = {}
        for key, value in entry.items():
            if key in ["ΤΥΠΟΣ", "ΚΑΤΗΓΟΡΙΑ"]:
                continue
            if '-' in key and value.strip():
                month, year = map(str.strip, key.split('-'))
                try:
                    num = float(value.replace(',', ''))
                except ValueError:
                    continue
                if year not in monthly_data:
                    monthly_data[year] = {}
                monthly_data[year][month] = num
        
        results.append({
            'ΚΑΤΗΓΟΡΙΑ': entry['ΚΑΤΗΓΟΡΙΑ'],
            'Μηνιαία Δεδομένα': monthly_data
        })

    # Βρίσκουμε τους μήνες με δεδομένα (κοινούς για όλες τις κατηγορίες)
    grouped = {}
    for item in results:
        for year, months in item['Μηνιαία Δεδομένα'].items():
            if year not in grouped:
                # Αρχικοποίηση με μοναδικούς μήνες (από την πρώτη κατηγορία)
                grouped[year] = {
                    'Μέσοι Όροι': {},
                    'Πλήθος Μηνών': len(months),  # Μόνο ο αριθμός, π.χ. 5
                    'Μηνιαία Δεδομένα': {}
                }
                # Αποθήκευση όλων των μηνών (προαιρετικό)
                for month in months:
                    grouped[year]['Μηνιαία Δεδομένα'][month] = {}
            
            # Προσθήκη δεδομένων ανά κατηγορία
            for month, value in months.items():
                grouped[year]['Μηνιαία Δεδομένα'][month][item['ΚΑΤΗΓΟΡΙΑ']] = value
    
    # Υπολογισμός μέσου όρου ανά κατηγορία
    for year, data in grouped.items():
        for month, categories in data['Μηνιαία Δεδομένα'].items():
            for category, value in categories.items():
                if category not in data['Μέσοι Όροι']:
                    data['Μέσοι Όροι'][category] = []
                data['Μέσοι Όροι'][category].append(value)
        
        for category, values in data['Μέσοι Όροι'].items():
            data['Μέσοι Όροι'][category] = round(sum(values) / len(values), 2)

    return JsonResponse({'results': grouped})