import json
from pathlib import Path
from django.conf import settings
from django.core.cache import cache
from datetime import datetime
from collections import defaultdict

# WHO-based pollutant limits (normalized units: µg/m³ for gases except CO in mg/m³)
POLLUTANT_LIMITS = {
    "no2_conc": "<=9.5",
    "so2_conc": "<=10",
    "o3_conc":  "<=50",
    "co_conc":  "<=4",
    "no_conc":  "<=1.5",
}

# English key → Greek display name
AREA_NAME_MAP = {
    "volvi":       "Δήμος Βόλβης",
    "delta":       "Δήμος Δέλτα",
    "thermaikos":  "Δήμος Θερμαϊκού",
    "thermi":      "Δήμος Θέρμης",
    "thessaloniki": "Δήμος Θεσσαλονίκης",
    "kalamaria":   "Δήμος Καλαμαριάς",
    "kordelio":    "Δήμος Κορδελιού - Ευόσμου",
    "lagkadas":    "Δήμος Λαγκαδά",
    "ampelokipoi": "Δήμος Αμπελοκήπων - Μενεμένης",
    "neapoli":     "Δήμος Νεάπολης - Συκεών",
    "oraiokastro": "Δήμος Ωραιοκάστρου",
    "pavlou_mela": "Δήμος Παύλου Μελά",
    "pulaia":      "Δήμος Πυλαίας - Χορτιάτη",
    "chalkidonos": "Δήμος Χαλκηδόνας",
}


def load_all_data(area=None, latest_year_only=False, year=None):
    cache.clear()

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
    pollutants = list(POLLUTANT_LIMITS.keys())
    totals, counts = defaultdict(float), defaultdict(int)
    for r in records:
        for p in pollutants:
            try:
                val = float(r.get(p, 0) or 0)
                totals[p] += val
                counts[p] += 1
            except (ValueError, TypeError):
                continue
    return {p: round(totals[p] / counts[p], 2) if counts[p] else 0.0 for p in pollutants}


def parse_timestamps(records):
    for r in records:
        try:
            r["parsed_time"] = datetime.strptime(r["time"], "%Y-%m-%d %H:%M:%S")
        except (ValueError, KeyError):
            continue
    return records


def normalize_co(records):
    """Convert CO from µg/m³ to mg/m³ on all records."""
    for r in records:
        co = r.get("co_conc")
        if co is not None:
            try:
                r["co_conc"] = co / 1000.0
            except (TypeError, ValueError):
                r["co_conc"] = None
    return records


def check_limit(value, spec):
    """Generic comparator for '<=', '<', '>=', '>' specs"""
    if spec.startswith("<="): return value <= float(spec[2:])
    if spec.startswith("<"):  return value <  float(spec[1:])
    if spec.startswith(">="): return value >= float(spec[2:])
    if spec.startswith(">"):  return value >  float(spec[1:])
    raise ValueError(f"Invalid limit spec: {spec}")


def get_greek_name(area_key):
    return AREA_NAME_MAP.get(area_key.lower(), area_key)


def group_by_month(records, year_filter=None):
    # unchanged
    result = defaultdict(list)
    for r in records:
        if year_filter is None or r["parsed_time"].year == year_filter:
            result[r["parsed_time"].month].append(r)
    return result


def group_by_year(records):
    # unchanged
    result = defaultdict(list)
    for r in records:
        result[r["parsed_time"].year].append(r)
    return result