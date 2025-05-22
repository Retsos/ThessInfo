from ast import parse
import json
import os
from pathlib import Path
from django.conf import settings
from django.core.cache import cache
import re

def load_all_data():
    cache.clear()
    # Προσπάθησε να πάρεις τα δεδομένα από την cache
    cached_data = cache.get('all_data')
    if cached_data is not None:
        return cached_data

    data_dir = Path(settings.BASE_DIR) / 'waterquality' / 'datasheet'
    all_data = []
    
    for filename in os.listdir(data_dir):
        if filename.endswith('.json'):
            file_path = data_dir / filename
            with open(file_path, 'r', encoding='utf-8') as f:
                try:
                    all_data.extend(json.load(f))
                except json.JSONDecodeError:
                    continue
    
    # Αποθήκευση των δεδομένων στην cache για 1 ώρα (timeout=3600 δευτερόλεπτα)
    cache.set('all_data', all_data, timeout=1)
    return all_data




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

def is_within_limits( numeric_value, limit_expression):
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



def analyze_entry(entry):
    """
    Επιστρέφει ανάλυση για την εγγραφή:
        - Εξάγει την αριθμητική τιμή από το πεδίο "Τιμή".
        - Ελέγχει αν η τιμή πληροί το όριο στο "Παραμετρική τιμή1".
    """
    value = entry.get('Τιμή', '')
    limit = entry.get('Παραμετρική τιμή1', '')
    numeric_value = extract_numeric(value)
    is_compliant = is_within_limits(numeric_value, limit) if numeric_value is not None else None
    
    return {
        "parameter": entry.get('Φυσικοχημικές Παράμετροι', ''),
        "unit": entry.get('Μονάδα μέτρησης', ''),
        "value": numeric_value,
        "limit": limit,
        "is_compliant": is_compliant,
        "notes": "Μη αριθμητική τιμή" if numeric_value is None else None
    }



def entry_year(entry):
    # Υποστηρικτικές μορφές ημερομηνίας: ISO, dd/mm/YYYY, YYYY και πεδίο Year
    date_str = entry.get('date') or entry.get('Έτος') or entry.get('Date') or entry.get('Year')
    if not date_str:
        return None
    try:
        # Χρήση dateutil.parser για ευέλικτη ανάλυση
        dt = parse(date_str, dayfirst=True, fuzzy=True)
        return dt.year
    except Exception:
        try:
            return int(re.search(r'\d{4}', date_str).group())
        except Exception:
            return None