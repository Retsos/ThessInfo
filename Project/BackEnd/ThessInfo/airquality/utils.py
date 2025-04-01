import json
from pathlib import Path
from django.conf import settings
from django.core.cache import cache

def load_all_data(area=None, latest_year_only=False):
    # Create a cache key that reflects whether we're filtering by area and/or latest year
    if area and latest_year_only:
        cache_key = f'all_data_{area}_latest'
    elif area:
        cache_key = f'all_data_{area}'
    elif latest_year_only:
        cache_key = 'all_data_latest'
    else:
        cache_key = 'all_data'
        
    cached_data = cache.get(cache_key)
    if cached_data is not None:
        return cached_data

    data_dir = Path(settings.BASE_DIR) / 'airquality' / 'datasheets'
    all_data = []

    if latest_year_only:
        # Find all directories with a numeric name (year directories)
        year_dirs = [d for d in data_dir.iterdir() if d.is_dir() and d.name.isdigit()]
        if year_dirs:
            # Choose the directory with the highest year (e.g., "2025")
            latest_year_dir = max(year_dirs, key=lambda d: int(d.name))
            # Process only the latest year folder
            for area_dir in latest_year_dir.iterdir():
                if area_dir.is_dir():
                    # Skip if an area filter is provided and doesn't match
                    if area and area_dir.name.lower() != area.lower():
                        continue
                    for filename in sorted(area_dir.iterdir()):
                        if filename.suffix == '.json':
                            with open(filename, 'r', encoding='utf-8') as f:
                                try:
                                    records = json.load(f)
                                    # Tag each record with the area name from the folder
                                    for record in records:
                                        record["area"] = area_dir.name
                                    all_data.extend(records)
                                except json.JSONDecodeError:
                                    continue
    else:
        # Process all year directories
        for year_dir in data_dir.iterdir():
            if year_dir.is_dir():
                for area_dir in year_dir.iterdir():
                    if area_dir.is_dir():
                        if area and area_dir.name.lower() != area.lower():
                            continue
                        for filename in sorted(area_dir.iterdir()):
                            if filename.suffix == '.json':
                                with open(filename, 'r', encoding='utf-8') as f:
                                    try:
                                        records = json.load(f)
                                        for record in records:
                                            record["area"] = area_dir.name
                                        all_data.extend(records)
                                    except json.JSONDecodeError:
                                        continue

    cache.set(cache_key, all_data, timeout=3600)
    return all_data
