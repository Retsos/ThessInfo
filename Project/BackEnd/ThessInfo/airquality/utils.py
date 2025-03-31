import json
import os
from pathlib import Path
from django.conf import settings
from django.core.cache import cache

def load_all_data():
    # Attempt to get data from cache
    cached_data = cache.get('all_data')
    if cached_data is not None:
        return cached_data

    data_dir = Path(settings.BASE_DIR) / 'airquality' / 'datasheets'
    all_data = []
    
    # Iterate through all area directories
    for area_dir in data_dir.iterdir():
        if area_dir.is_dir():  # Ensure it's a directory
            for filename in sorted(area_dir.iterdir()):  # Ensure correct order
                if filename.suffix == '.json':
                    with open(filename, 'r', encoding='utf-8') as f:
                        try:
                            all_data.extend(json.load(f))
                        except json.JSONDecodeError:
                            continue

    # Store data in cache for 1 hour (3600 seconds)
    cache.set('all_data', all_data, timeout=3)
    return all_data