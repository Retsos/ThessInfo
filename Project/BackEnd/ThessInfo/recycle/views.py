from django.http import JsonResponse
from .utils import load_all_data
from django.shortcuts import render
from collections import defaultdict
import re
from django.views import View

def recycling_view(request):
    region = request.GET.get('region')

    if not region:
        return JsonResponse(
            {'error': 'Παρακαλώ δώστε το όνομα της περιοχής ως query parameter (region).'},
            status=400
        )

    all_data = load_all_data()

    # Φιλτράρισμα μόνο ανά περιοχή και τύπο
    filtered_data = [
        rec for rec in all_data
        if rec.get("ΠΕΡΙΟΧΗ", "").upper() == region.upper()
           and rec.get("ΤΥΠΟΣ") == "ΕΙΣΕΡΧΟΜΕΝΑ ΑΝΑΚΥΚΛΩΣΙΜΑ ΥΛΙΚΑ ΣΤΟ ΚΕΝΤΡΟ ΔΙΑΛΟΓΗΣ (kg/ΟΤΑ)"
    ]
    if not filtered_data:
        return JsonResponse(
            {'error': f'Δεν βρέθηκαν δεδομένα για την περιοχή {region}.'},
            status=404
        )

    # Συγχώνευση όλων των records για την περιοχή
    merged = defaultdict(str)
    for rec in filtered_data:
        for key, val in rec.items():
            if val:
                merged[key] = val

    months_order = {
        "Ιαν": 1, "Φεβ": 2, "Μαρ": 3, "Απρ": 4, "Μαϊ": 5, "Ιουν": 6,
        "Ιουλ": 7, "Αυγ": 8, "Σεπ": 9, "Οκτ": 10, "Νοε": 11, "Δεκ": 12
    }
    pattern = re.compile(r'^(?P<month>Ιαν|Φεβ|Μαρ|Απρ|Μαϊ|Ιουν|Ιουλ|Αυγ|Σεπ|Οκτ|Νοε|Δεκ)-(?P<year>\d{2,4})$')

    # Οργάνωση των δεδομένων ανά έτος → μήνα
    yearly_data = {}
    for key, raw in merged.items():
        m = pattern.match(key)
        if not m:
            continue
        month = m.group('month')
        yr = m.group('year')
        year = '20' + yr if len(yr) == 2 else yr
        try:
            num = float(raw.replace(',', '.'))
        except (ValueError, AttributeError):
            num = None
        yearly_data.setdefault(year, {})[month] = num

    # Δημιουργία τελικής δομής με στατιστικά ανά έτος
    stats = {}
    for year, months in yearly_data.items():
        vals = [v for v in months.values() if v is not None and v > 0]
        avg = sum(vals)/len(vals) if vals else None

        # πιο πρόσφατος μήνας εντός του έτους
        recent_month = None
        recent_val = None
        for mon, v in months.items():
            if v is None:
                continue
            if (recent_month is None or months_order[mon] > months_order[recent_month]):
                recent_month, recent_val = mon, v

        stats[year] = {
            f"Average_RECYCLING_for_year": avg,
            "Most_Recent_Month": recent_month,
            "Value_for_the_Most_Recent_Month": recent_val,
            "Detailed_Monthly_Data": months
        }

    return JsonResponse({
        "REGION": region,
        "TYPE": "ΕΙΣΕΡΧΟΜΕΝΑ ΑΝΑΚΥΚΛΩΣΙΜΑ ΥΛΙΚΑ ΣΤΟ ΚΕΝΤΡΟ ΔΙΑΛΟΓΗΣ (kg/ΟΤΑ)",
        "Yearly_Stats": stats
    })







def recycling_viewperperson(request):
    region = request.GET.get('region')
    # … (οι πρώτες γραμμές ίδιος έλεγχος/φιλτράρισμα) …
    year_param = request.GET.get('year')  # παραμένει αν θες φιλτράρισμα αλλά δεν το χρησιμοποιούμε

    if not region:
        return JsonResponse(
            {'error': 'Παρακαλώ δώστε το όνομα της περιοχής ως query parameter (region).'},
            status=400
        )

    all_data = load_all_data()

    # Φιλτράρισμα μόνο ανά περιοχή και τύπο kg/Κάτοικο
    filtered = [
        rec for rec in all_data
        if rec.get("ΠΕΡΙΟΧΗ", "").upper() == region.upper()
           and rec.get("ΤΥΠΟΣ") == "ΕΙΣΕΡΧΟΜΕΝΑ ΑΝΑΚΥΚΛΩΣΙΜΑ ΥΛΙΚΑ ΣΤΟ ΚΕΝΤΡΟ ΔΙΑΛΟΓΗΣ (kg/Κάτοικο)"
    ]
    if not filtered:
        return JsonResponse(
            {'error': f'Δεν βρέθηκαν δεδομένα για την περιοχή {region}.'},
            status=404
        )


    # Συγχώνευση όλων των records για την περιοχή
    merged = defaultdict(str)
    for rec in filtered:
        for key, val in rec.items():
            if val:
                merged[key] = val

    # Ταξινόμηση μηνών
    months_order = {
        "Ιαν": 1, "Φεβ": 2, "Μαρ": 3, "Απρ": 4, "Μαϊ": 5, "Ιουν": 6,
        "Ιουλ": 7, "Αυγ": 8, "Σεπ": 9, "Οκτ": 10, "Νοε": 11, "Δεκ": 12
    }
    # Πιάσιμο πεδίων μήνας-έτος (2 ή 4 ψηφία)
    pattern = re.compile(
        r'^(?P<month>Ιαν|Φεβ|Μαρ|Απρ|Μαϊ|Ιουν|Ιουλ|Αυγ|Σεπ|Οκτ|Νοε|Δεκ)-(?P<year>\d{2,4})$'
    )

    # Οργάνωση δεδομένων ανά έτος → μήνα, με drop των 0
    yearly = {}
    for key, raw in merged.items():
        m = pattern.match(key)
        if not m:
            continue
        month = m.group('month')
        yr = m.group('year')
        year = '20' + yr if len(yr) == 2 else yr

        try:
            num = float(raw.replace(',', '.'))
        except (ValueError, AttributeError):
            num = None

        # Αν η τιμή είναι ακριβώς 0, skip (δεν το αποθηκεύουμε)
        if num == 0:
            continue

        # Αποθήκευση: είτε θετικό αριθμό, είτε None
        yearly.setdefault(year, {})[month] = num

    # Δημιουργία στατιστικών ανά έτος
    stats = {}
    for year, months in yearly.items():
        vals = [v for v in months.values() if v is not None and v > 0]
        avg = sum(vals)/len(vals) if vals else None

        recent_month = None
        recent_val = None
        for mon, v in months.items():
            if v is None:
                continue
            if recent_month is None or months_order[mon] > months_order[recent_month]:
                recent_month, recent_val = mon, v

        stats[year] = {
            f"Average_RECYCLING_per_person_year_{year}": avg,
            "Most_Recent_Month": recent_month,
            "Value_for_the_Most_Recent_Month": recent_val,
            "Detailed_Monthly_Data": months
        }

    return JsonResponse({
        "REGION": region,
        "TYPE": "ΕΙΣΕΡΧΟΜΕΝΑ ΑΝΑΚΥΚΛΩΣΙΜΑ ΥΛΙΚΑ ΣΤΟ ΚΕΝΤΡΟ ΔΙΑΛΟΓΗΣ (kg/Κάτοικο)",
        "Yearly_Stats": stats
    })



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



class TopRegionsRecyclingViewgeneral(View):
    DISPLAY_NAMES2 = {
        'ΘΕΡΜΑΪΚΟΣ': 'Δήμος Θερμαϊκού',
        'ΘΕΡΜΗ': 'Δήμος Θέρμης',
        'ΠΥΛΑΙΑ-ΧΟΡΤΙΑΤΗΣ': 'Δήμος Πυλαίας - Χορτιάτη',
        'ΚΑΛΑΜΑΡΙΑ': 'Δήμος Καλαμαριάς',
        
        # βάλ’ κι άλλες όποιες θες…
    }
    def get(self, request):
        all_data = load_all_data()

        target_type = "ΕΙΣΕΡΧΟΜΕΝΑ ΑΝΑΚΥΚΛΩΣΙΜΑ ΥΛΙΚΑ ΣΤΟ ΚΕΝΤΡΟ ΔΙΑΛΟΓΗΣ (kg/Κάτοικο)"
        filtered = [
            rec for rec in all_data
            if rec.get("ΤΥΠΟΣ") == target_type
        ]

        pattern = re.compile(
            r'^(?P<month>Ιαν|Φεβ|Μαρ|Απρ|Μαϊ|Ιουν|Ιουλ|Αυγ|Σεπ|Οκτ|Νοε|Δεκ)-(?P<year>\d{2,4})$'
        )

        data_by_region = defaultdict(lambda: defaultdict(list))
        all_years = set()

        for rec in filtered:
            region = rec.get("ΠΕΡΙΟΧΗ", "")
            for key, raw in rec.items():
                m = pattern.match(key)
                if not m:
                    continue
                yr = m.group('year')
                year = '20'+yr if len(yr) == 2 else yr
                all_years.add(year)

                try:
                    num = float(raw.replace(',', '.'))
                except (ValueError, AttributeError):
                    continue
                if num == 0:
                    continue

                data_by_region[region][year].append(num)

        if not all_years:
            return JsonResponse({'error': 'Δεν βρέθηκαν δεδομένα για ανακύκλωση.'}, status=404)

        last_year = max(all_years)

        #display = self.DISPLAY_NAMES2.get(region, region)
        results = {}
        for region, years in data_by_region.items():
            vals = years.get(last_year, [])
            if not vals:
                continue
            avg = sum(vals) / len(vals)

            display = self.DISPLAY_NAMES2.get(region, region)
            # Βάζουμε το display name ως κλειδί
            results[display] = {
                'compliant_count': round(avg, 2)
            }


        return JsonResponse(results)
    

#DEDOMENA XARTI
class TopRegionsRecyclingView(View):


    def get(self, request):
        all_data = load_all_data()

        target_type = "ΕΙΣΕΡΧΟΜΕΝΑ ΑΝΑΚΥΚΛΩΣΙΜΑ ΥΛΙΚΑ ΣΤΟ ΚΕΝΤΡΟ ΔΙΑΛΟΓΗΣ (kg/Κάτοικο)"
        filtered = [
            rec for rec in all_data
            if rec.get("ΤΥΠΟΣ") == target_type
        ]

        pattern = re.compile(
            r'^(?P<month>Ιαν|Φεβ|Μαρ|Απρ|Μαϊ|Ιουν|Ιουλ|Αυγ|Σεπ|Οκτ|Νοε|Δεκ)-(?P<year>\d{2,4})$'
        )

        data_by_region = defaultdict(lambda: defaultdict(list))
        all_years = set()

        for rec in filtered:
            region = rec.get("ΠΕΡΙΟΧΗ", "")
            for key, raw in rec.items():
                m = pattern.match(key)
                if not m:
                    continue
                yr = m.group('year')
                year = '20'+yr if len(yr) == 2 else yr
                all_years.add(year)

                try:
                    num = float(raw.replace(',', '.'))
                except (ValueError, AttributeError):
                    continue
                if num == 0:
                    continue

                data_by_region[region][year].append(num)

        if not all_years:
            return JsonResponse({'error': 'Δεν βρέθηκαν δεδομένα για ανακύκλωση.'}, status=404)

        last_year = max(all_years)

        region_averages = {}
        for region, years in data_by_region.items():
            vals = years.get(last_year, [])
            if not vals:
                continue
            avg = sum(vals) / len(vals)
            region_averages[region] = round(avg, 2)

        if not region_averages:
            return JsonResponse({'error': 'Καμία περιοχή δεν έχει δεδομένα για το τελευταίο έτος.'}, status=404)

        # Εύρεση της περιοχής με το μεγαλύτερο μέσο όρο
        best_region = max(region_averages.items(), key=lambda x: x[1])



        return JsonResponse({
            'region': best_region[0],
            'average': best_region[1],
            'year': last_year
        })