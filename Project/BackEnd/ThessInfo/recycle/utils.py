import json
import os
from pathlib import Path
from django.conf import settings
from django.core.cache import cache

def load_all_data():
    # Προσπάθησε να πάρεις τα δεδομένα από την cache
    cached_data = cache.get('all_data')
    if cached_data is not None:
        return cached_data

    data_dir = Path(settings.BASE_DIR) / 'recycle' / 'datasheets'
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
    cache.set('all_data', all_data, timeout=3)
    return all_data