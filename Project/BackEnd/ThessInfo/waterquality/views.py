from ast import parse
from django.http import JsonResponse
from django.conf import settings
from django.views import View
from pathlib import Path
from .utils import load_all_data,is_within_limits,extract_numeric,entry_year,analyze_entry
from datetime import datetime


class LatestAnalysisView(View):
    def get(self, request):
        region = request.GET.get('region')
        if not region:
            return JsonResponse({'error': 'Παρακαλώ δώστε το όνομα της περιοχής ως query parameter (region).'}, status=400)
        
        all_data = load_all_data()
        filtered_data = [entry for entry in all_data if entry.get('Category', '').lower() == region.lower()]
        if not filtered_data:
            return JsonResponse({'error': f'Δεν βρέθηκαν δεδομένα για την περιοχή "{region}".'}, status=404)
        
        month_order = {
            "Ιανουάριος": 1, "Φεβρουάριος": 2, "Μάρτιος": 3,
            "Απρίλιος": 4, "Μάιος": 5, "Ιούνιος": 6,
            "Ιούλιος": 7, "Αύγουστος": 8, "Σεπτέμβριος": 9,
            "Οκτώβριος": 10, "Νοέμβριος": 11, "Δεκέμβριος": 12
        }
        
        try:
            latest_year = max(
                int(entry['Year']) for entry in filtered_data 
                if isinstance(entry.get('Year'), (str, int)) and str(entry['Year']).isdigit()
            )
        except ValueError:
            return JsonResponse({"error": "Δεν υπάρχουν έγκυρα έτη στα δεδομένα."}, status=400)
        
        entries_latest_year = [entry for entry in filtered_data if int(entry['Year']) == latest_year]
        latest_month_order = max(month_order.get(entry['Month'], 0) for entry in entries_latest_year)
        latest_month_entries = [entry for entry in entries_latest_year if month_order.get(entry['Month'], 0) == latest_month_order]
        
        grouped = {}
        for entry in latest_month_entries:
            category = entry.get('Category', 'Άγνωστη Κατηγορία')
            if category not in grouped:
                grouped[category] = {
                    'latest_data': [],
                    'analysis': []
                }
            grouped[category]['latest_data'].append(entry)
            grouped[category]['analysis'].append(analyze_entry(entry))
        
        # Αν υπάρχει μόνο μία κατηγορία, επιστρέφουμε μόνο αυτήν
        if len(grouped) == 1:
            category, data = next(iter(grouped.items()))
            response = {
                "category": category,
                "latest_data": data["latest_data"],
                "analysis": data["analysis"],
                "year": latest_year,
                "month": latest_month_order,
                "compliantCount": f"{sum(1 for item in data['analysis'] if item.get('is_compliant') is True)} of {sum(1 for item in data['analysis'] if isinstance(item.get('is_compliant'), bool))}"
            }
        else:
            # Αν υπάρχουν πολλές κατηγορίες, επιστρέφουμε ένα αντικείμενο με κάθε κατηγορία ως κλειδί
            response = {
                category: {
                    "latest_data": data["latest_data"],
                    "analysis": data["analysis"],
                    "year": latest_year,
                    "month": latest_month_order,
                    "compliantCount": f"{sum(1 for item in data['analysis'] if item.get('is_compliant') is True)} of {sum(1 for item in data['analysis'] if isinstance(item.get('is_compliant'), bool))}"
                }
                for category, data in grouped.items()
            }

        return JsonResponse(response, safe=False)




class YearlyAnalysisView(View):
    def get(self, request):
        region = request.GET.get('region')
        if not region:
            return JsonResponse({'error': 'Παρακαλώ δώστε το όνομα της περιοχής ως query parameter (region).'}, status=400)
        
        # Φόρτωση όλων των δεδομένων και φιλτράρισμα με βάση την περιοχή (Category)
        all_data = load_all_data()
        filtered_data = [entry for entry in all_data if entry.get('Category', '').lower() == region.lower()]
        
        if not filtered_data:
            return JsonResponse({'error': f'Δεν βρέθηκαν δεδομένα για την περιοχή "{region}".'}, status=404)
        
        yearly_stats = {}
        
        for entry in filtered_data:
            year = entry.get('Year')
            if not year:
                continue

            if year not in yearly_stats:
                yearly_stats[year] = {
                    'parameters': {},
                    'total_measurements': 0,
                    'compliance_rate': 0
                }

            param_name = entry.get('Φυσικοχημικές Παράμετροι', 'Άγνωστη Παράμετρος')
            numeric_value = extract_numeric(entry.get('Τιμή', ''))
            limit = entry.get('Παραμετρική τιμή1', '')
            is_compliant = is_within_limits(numeric_value, limit) if numeric_value is not None else None

            if param_name not in yearly_stats[year]['parameters']:
                yearly_stats[year]['parameters'][param_name] = {
                    'values': [],
                    'compliant_count': 0,
                    'total_count': 0,
                    'average': None
                }

            yearly_stats[year]['parameters'][param_name]['total_count'] += 1
            if numeric_value is not None:
                yearly_stats[year]['parameters'][param_name]['values'].append(numeric_value)
                if is_compliant:
                    yearly_stats[year]['parameters'][param_name]['compliant_count'] += 1

            yearly_stats[year]['total_measurements'] += 1

        # Υπολογισμός μέσου όρου και compliance rate για κάθε έτος
        for year, data in yearly_stats.items():
            compliant_total = 0
            for param, stats in data['parameters'].items():
                if stats['values']:
                    stats['average'] = sum(stats['values']) / len(stats['values'])
                compliant_total += stats['compliant_count']
            if data['total_measurements'] > 0:
                data['compliance_rate'] = round((compliant_total / data['total_measurements']) * 100, 2)

        return JsonResponse(yearly_stats, safe=False)
    


 

class RegionsLatestCompliantCountView(View):
    def get(self, request):
        all_data = load_all_data()

        regions = {
            entry.get('Category', '').strip()
            for entry in all_data
            if entry.get('Category')
        }

        result = {}

        for region in regions:
            region_entries = [
                e for e in all_data
                if e.get('Category', '').strip().lower() == region.lower()
            ]

            years = sorted({
                e.get('Year')
                for e in region_entries
                if e.get('Year') is not None
            })
            if not years:
                continue

            last_year = years[-1]

            last_year_entries = [
                e for e in region_entries
                if e.get('Year') == last_year
            ]
            total_count = len(last_year_entries)
            
            valid_entries = []
            for entry in last_year_entries:
                num = extract_numeric(entry.get('Τιμή', ''))
                if num is not None:
                    valid_entries.append((entry, num))

            total_count = len(valid_entries)

            
            compliant_count = 0
            for entry in last_year_entries:
                num = extract_numeric(entry.get('Τιμή', ''))
                limit = entry.get('Παραμετρική τιμή1', '')
                if num is not None and is_within_limits(num, limit):
                    compliant_count += 1

            rate = (compliant_count / total_count * 100) if total_count > 0 else 0

            result[region] = {
                'compliant_count': f"{rate:.2f}"
            }

        return JsonResponse(result, safe=False)

        
class MunicipalityStatsView(View):
    REGION_GROUPS = {
        'Δήμος Θεσσαλονίκης': [
            '40 Εκκλησιές', 'ΔΕΘ-ΧΑΝΘ', 'Ανάληψη', 'Άνω Τούμπα', 'Κάτω Τούμπα',
            'Κέντρο πόλης', 'Νέα Παραλία', 'Ντεπώ', 'Ξηροκρήνη', 'Παναγία Φανερωμένη',
            'Πλατεία Δημοκρατίας', 'Χαριλάου', 'Τριανδρία', 'Σχολή Τυφλών', 'Σφαγεία', 'Άνω Πόλη'
        ],
        'Δήμος Καλαμαριάς': ['Καλαμαριά'],
        'Δήμος Πυλαίας - Χορτιάτη': ['Πυλαία', 'Πυλαία (ΙΚΕΑ)', 'Κωνσταντινουπολίτικα'],
        'Δήμος Παύλου Μελά': ['Ευκαρπία'],
        'Δήμος Νεάπολης - Συκεών': ['Άγιος Παύλος'],
        'Δήμος Ωραιοκάστρου': ['Ωραιόκαστρο'],
        'Δήμος Δέλτα': ['ΒΙΠΕΘ'],
        'Δήμος Κορδελιού - Ευόσμου': ['Εύοσμος'],
        'Δήμος Αμπελοκήπων - Μενεμένης': ['Αμπελόκηποι'],
    }

    def get(self, request):
        all_data = load_all_data()
        results = {}

        for group_name, areas in self.REGION_GROUPS.items():
            group_entries = [
                e for e in all_data
                if e.get('Category', '').strip() in areas
            ]

            years = sorted({
                int(e.get('Year'))
                for e in group_entries
                if e.get('Year') and str(e.get('Year')).isdigit()
            })
            if not years:
                continue

            last_year = years[-1]
            last_entries = [
                e for e in group_entries
                if str(e.get('Year')) == str(last_year)
            ]

            # φιλτράρουμε μόνο έγκυρα num
            valid = [
                (e, extract_numeric(e.get('Τιμή', '')))
                for e in last_entries
                if extract_numeric(e.get('Τιμή', '')) is not None
            ]
            total = len(valid)
            compliant = sum(
                1 for e, num in valid
                if is_within_limits(num, e.get('Παραμετρική τιμή1', ''))
            )

            rate = round((compliant / total * 100), 2) if total else 0

            results[group_name] = {
                'lastYear': last_year,
                'compliant_count': rate
            }

        return JsonResponse(results, safe=False)




class BestRegionView(View):
    def get(self, request):
        # Φορτώνουμε όλα τα δεδομένα
        all_data = load_all_data()
        if not all_data:
            return JsonResponse({'error': 'Δεν υπάρχουν διαθέσιμα δεδομένα.'}, status=404)

        # Ομαδοποίηση των εγγραφών ανά περιοχή (Category)
        regions = {}
        for entry in all_data:
            region = entry.get('Category', 'Άγνωστη Περιοχή')
            regions.setdefault(region, []).append(entry)

        # Υπολογισμός στατιστικών συμμόρφωσης για κάθε περιοχή
        region_stats = {}
        for region, entries in regions.items():
            compliant_count = 0
            total_count = 0
            for entry in entries:
                analysis = analyze_entry(entry)
                if isinstance(analysis.get('is_compliant'), bool):
                    total_count += 1
                    if analysis['is_compliant']:
                        compliant_count += 1
            region_stats[region] = {
                'compliantCount': compliant_count,
                'totalCount': total_count,
                'rate_percent': round((compliant_count / total_count * 100) if total_count > 0 else 0, 2)
            }

        # Εύρεση μέγιστου αριθμού compliant
        max_compliant = max(stats['compliantCount'] for stats in region_stats.values())
        # Επιλογή όλων των περιοχών με το μέγιστο compliantCount
        best_regions = [region for region, stats in region_stats.items() if stats['compliantCount'] == max_compliant]

        # Προετοιμασία απάντησης
        response = {
            'best_regions': best_regions,
            'compliant_count': max_compliant,
            'details': {region: region_stats[region] for region in best_regions},
            'year': entry_year(entry)
        }

        return JsonResponse(response)

        
