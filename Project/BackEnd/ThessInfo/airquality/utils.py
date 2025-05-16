import json
from pathlib import Path
from django.conf import settings
from django.core.cache import cache
from datetime import datetime
from collections import defaultdict


POLLUTANT_LIMITS = {
    "no2_conc": "<=10",   # WHO annual mean ≤10 µg/m³
    "so2_conc": "<=40",   # WHO 24 h mean   ≤40 µg/m³
    "o3_conc":  "<=60",   # WHO peak-season ≤60 µg/m³
    "co_conc":  "<=300",    # WHO 24 h mean   ≤4 mg/m³
    "no_conc":  "<=1"     # proxy threshold
}



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

    def load_from_dir(target_dir):
        for area_dir in target_dir.iterdir():
            if area_dir.is_dir():
                if area and area_dir.name.lower() != area.lower():
                    continue
                for filename in sorted(area_dir.iterdir()):
                    if filename.suffix == '.json':
                        try:
                            with open(filename, 'r', encoding='utf-8') as f:
                                records = json.load(f)
                                for record in records:
                                    record["area"] = area_dir.name
                                all_data.extend(records)
                        except json.JSONDecodeError:
                            continue

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

        load_from_dir(target_year_dir)
    else:
        for year_dir in data_dir.iterdir():
            if year_dir.is_dir():
                load_from_dir(year_dir)

    cache.set(cache_key, all_data, timeout=3600)
    return all_data


def compute_averages(records):
    pollutants = ["no2_conc", "o3_conc", "co_conc", "no_conc", "so2_conc"]
    totals = defaultdict(float)
    counts = defaultdict(int)

    for r in records:
        for p in pollutants:
            try:
                val = float(r.get(p, 0) or 0)
                totals[p] += val
                counts[p] += 1
            except (ValueError, TypeError):
                continue

    return {
        p: round(totals[p] / counts[p], 2) if counts[p] else 0.0
        for p in pollutants
    }


def parse_timestamps(records):
    for r in records:
        try:
            r["parsed_time"] = datetime.strptime(r["time"], "%Y-%m-%d %H:%M:%S")
        except (ValueError, KeyError):
            continue
    return records


def group_by_month(records, year_filter=None):
    result = defaultdict(list)
    for r in records:
        if year_filter is None or r["parsed_time"].year == year_filter:
            result[r["parsed_time"].month].append(r)
    return result


def group_by_year(records):
    result = defaultdict(list)
    for r in records:
        result[r["parsed_time"].year].append(r)
    return result
