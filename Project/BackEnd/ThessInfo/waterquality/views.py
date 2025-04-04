from django.http import JsonResponse
from django.conf import settings
from django.views import View
from pathlib import Path
from .utils import load_all_data
import re

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
            grouped[category]['analysis'].append(self.analyze_entry(entry))
        
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

    
    def analyze_entry(self, entry):
        """
        Επιστρέφει ανάλυση για την εγγραφή:
          - Εξάγει την αριθμητική τιμή από το πεδίο "Τιμή".
          - Ελέγχει αν η τιμή πληροί το όριο στο "Παραμετρική τιμή1".
        """
        value = entry.get('Τιμή', '')
        limit = entry.get('Παραμετρική τιμή1', '')
        numeric_value = self.extract_numeric(value)
        is_compliant = self.is_within_limits(numeric_value, limit) if numeric_value is not None else None
        
        return {
            "parameter": entry.get('Φυσικοχημικές Παράμετροι', ''),
            "unit": entry.get('Μονάδα μέτρησης', ''),
            "value": numeric_value,
            "limit": limit,
            "is_compliant": is_compliant,
            "notes": "Μη αριθμητική τιμή" if numeric_value is None else None
        }
    

    @staticmethod
    def extract_numeric(value):
        try:
            # Αφαίρεση περιττών κενών
            value = value.strip()

            # Αν περιέχει γράμματα (π.χ. "ΔΠ^5"), επιστρέφουμε None
            if re.search(r'[Α-Ωα-ωA-Za-z]', value):
                return None

            # Αντικατάσταση όλων των ',' με '.' για σωστή μετατροπή σε float
            normalized_value = value.replace(',', '.')

            # Εντοπίζει τον πρώτο αριθμό που εμφανίζεται
            match = re.search(r'[\d]+(?:\.[\d]+)?', normalized_value)
            if match:
                return float(match.group())

            return None
        except Exception:
            return None

    def is_within_limits(self, numeric_value, limit_expression):
        try:
            if numeric_value is None:
                return True
            
            limit = limit_expression.lower().replace(" ", "")
            
            if 'και' in limit:
                lower, upper = limit.split('και')
                lower_bound = float(re.sub(r'[^0-9,\.]', '', lower).replace(',', '.'))
                upper_bound = float(re.sub(r'[^0-9,\.]', '', upper).replace(',', '.'))
                return lower_bound <= numeric_value <= upper_bound
            elif '≥' in limit:
                lower_bound = float(re.sub(r'[^0-9,\.]', '', limit).replace(',', '.'))
                return numeric_value >= lower_bound
            elif '≤' in limit:
                upper_bound = float(re.sub(r'[^0-9,\.]', '', limit).replace(',', '.'))
                return numeric_value <= upper_bound
            else:
                limit_value = float(re.sub(r'[^0-9,\.]', '', limit_expression).replace(',', '.'))
                return numeric_value <= limit_value
        except Exception:
            return True

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
            numeric_value = self.extract_numeric(entry.get('Τιμή', ''))
            limit = entry.get('Παραμετρική τιμή1', '')
            is_compliant = self.is_within_limits(numeric_value, limit) if numeric_value is not None else None

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
    
    @staticmethod
    def extract_numeric(value):
        try:
            # Αφαίρεση περιττών κενών
            value = value.strip()

            # Αν περιέχει γράμματα (π.χ. "ΔΠ^5"), επιστρέφουμε None
            if re.search(r'[Α-Ωα-ωA-Za-z]', value):
                return None

            # Αντικατάσταση όλων των ',' με '.' για σωστή μετατροπή σε float
            normalized_value = value.replace(',', '.')

            # Εντοπίζει τον πρώτο αριθμό που εμφανίζεται
            match = re.search(r'[\d]+(?:\.[\d]+)?', normalized_value)
            if match:
                return float(match.group())

            return None
        except Exception:
            return None

    def is_within_limits(self, numeric_value, limit_expression):
        """
        Ελέγχει αν η numeric_value είναι εντός των ορίων που περιγράφονται στο limit_expression.
        Υποστηρίζονται:
          - Όρια με κάτω και πάνω όριο (π.χ. "≥6,5 και ≤9,5")
          - Μόνο κάτω όριο (π.χ. "≥0,2^2")
          - Μόνο πάνω όριο (π.χ. "≤250")
          - Στατική τιμή (π.χ. "200")
        """
        try:
            if numeric_value is None:
                return True
            
            limit = limit_expression.lower().replace(" ", "")
            
            if 'και' in limit:
                lower, upper = limit.split('και')
                lower_bound = float(re.sub(r'[^0-9,\.]', '', lower).replace(',', '.'))
                upper_bound = float(re.sub(r'[^0-9,\.]', '', upper).replace(',', '.'))
                return lower_bound <= numeric_value <= upper_bound
            elif '≥' in limit:
                lower_bound = float(re.sub(r'[^0-9,\.]', '', limit).replace(',', '.'))
                return numeric_value >= lower_bound
            elif '≤' in limit:
                upper_bound = float(re.sub(r'[^0-9,\.]', '', limit).replace(',', '.'))
                return numeric_value <= upper_bound
            else:
                limit_value = float(re.sub(r'[^0-9,\.]', '', limit_expression).replace(',', '.'))
                return numeric_value <= limit_value
        except Exception:
            return True