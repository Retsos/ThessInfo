import json
from pathlib import Path
from django.conf import settings
from django.core.cache import cache

def load_all_data(area=None, latest_year_only=False, year=None):
    if area and latest_year_only:
        cache_key = f'all_data_{area}_latest'
    elif area and year:
        cache_key = f'all_data_{area}_{year}'
    elif area:
        cache_key = f'all_data_{area}'
    elif latest_year_only:
        cache_key = 'all_data_latest'
    elif year:
        cache_key = f'all_data_{year}'
    else:
        cache_key = 'all_data'

    cached_data = cache.get(cache_key)
    if cached_data is not None:
        return cached_data

    data_dir = Path(settings.BASE_DIR) / 'airquality' / 'datasheets'
    all_data = []

    if latest_year_only or year:
        if year:
            target_year_dir = data_dir / str(year)
        else:
            year_dirs = [d for d in data_dir.iterdir() if d.is_dir() and d.name.isdigit()]
            if not year_dirs:
                return []
            target_year_dir = max(year_dirs, key=lambda d: int(d.name))

        if not target_year_dir.exists():
            return []

        for area_dir in target_year_dir.iterdir():
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
    else:
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

POLLUTANT_LIMITS = {
    "no2_conc": {"lower_limit": "<20", "upper_limit": ">40"},
    "so2_conc": {"lower_limit": "<10", "upper_limit": ">20"},
    "o3_conc": {"lower_limit": "<60", "upper_limit": ">100"},
    "co_conc": {"lower_limit": "<300", "upper_limit": ">600"},
    "no_conc": {"lower_limit": "<1", "upper_limit": ">3"},
}
