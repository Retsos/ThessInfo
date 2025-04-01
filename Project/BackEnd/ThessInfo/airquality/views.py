from django.http import JsonResponse
from .utils import load_all_data
import numpy as np

pollutants = ["no2_conc", "o3_conc", "co_conc", "no_conc", "so2_conc"]

# Pollution harm ranking (modifiable if needed)
harm_levels = {
    "no2_conc": 4, "o3_conc": 3, "co_conc": 5, "no_conc": 2, "so2_conc": 1
}

def filter_data_by_area(data, area):
    """Filter data for a specific area."""
    return [entry for entry in data if entry.get("spatial_ref") == area]

def filter_data_by_time(data, start_month=None, end_month=None, start_day=None, end_day=None, start_hour=None, end_hour=None):
    """Filters data based on a time range."""
    filtered_data = []
    
    for entry in data:
        timestamp = entry['time']
        year, month, day, hour = map(int, timestamp.replace(":", "-").replace(" ", "-").split("-"))

        if start_month and end_month and not (start_month <= month <= end_month):
            continue
        if start_day and end_day and not (start_day <= day <= end_day):
            continue
        if start_hour and end_hour and not (start_hour <= hour <= end_hour):
            continue

        filtered_data.append(entry)
    
    return filtered_data

def calculate_best_hour(data):
    """Find the best hour in a given dataset."""
    return min(data, key=lambda x: sum(x[p] for p in pollutants))['time']

def calculate_best_day(data):
    """Find the best day in a given dataset."""
    daily_sums = {}
    for entry in data:
        day = entry['time'].split()[0]
        daily_sums.setdefault(day, []).append(sum(entry[p] for p in pollutants))
    
    return min(daily_sums, key=lambda k: np.mean(daily_sums[k]))

def calculate_best_month(data):
    """Find the best month in a given dataset."""
    monthly_sums = {}
    for entry in data:
        month = entry['time'][:7]  # YYYY-MM
        monthly_sums.setdefault(month, []).append(sum(entry[p] for p in pollutants))
    
    return min(monthly_sums, key=lambda k: np.mean(monthly_sums[k]))

def calculate_average(data, group_by):
    """Calculate the average pollutant levels grouped by time."""
    grouped_data = {}

    for entry in data:
        key = entry['time'][:group_by]
        if key not in grouped_data:
            grouped_data[key] = {p: [] for p in pollutants}
        
        for p in pollutants:
            grouped_data[key][p].append(entry[p])

    return {k: {p: np.mean(v) for p, v in values.items()} for k, values in grouped_data.items()}

def rank_pollutants_by_harm():
    """Rank pollutants from most harmful to least harmful."""
    return sorted(harm_levels, key=harm_levels.get, reverse=True)

def air_quality_view(request, area):
    """Returns general air quality data for an area."""
    all_data = load_all_data()
    area_data = filter_data_by_area(all_data, area)

    if not area_data:
        return JsonResponse({'error': 'No data found for the specified area.'}, status=404)

    avg_values = {p: np.mean([entry[p] for entry in area_data]) for p in pollutants}
    response_data = {
        'area': area,
        'averages': avg_values,
        'best_hour': calculate_best_hour(area_data),
        'best_day': calculate_best_day(area_data),
        'best_month': calculate_best_month(area_data),
        'pollutant_ranking': rank_pollutants_by_harm()
    }

    return JsonResponse(response_data)

def get_best_hour(request, area):
    all_data = load_all_data()
    area_data = filter_data_by_area(all_data, area)

    if not area_data:
        return JsonResponse({'error': 'No data found for the specified area.'}, status=404)

    best_hour = calculate_best_hour(area_data)
    return JsonResponse({'area': area, 'best_hour': best_hour})


def get_best_day(request, area, month):
    """Returns the best day of a specific month."""
    all_data = load_all_data()
    area_data = filter_data_by_area(all_data, area)
    month_data = [entry for entry in area_data if entry['time'][5:7] == month]

    return JsonResponse({'best_day': calculate_best_day(month_data)})

def get_best_month(request, area):
    """Returns the best month of the year for air quality."""
    all_data = load_all_data()
    area_data = filter_data_by_area(all_data, area)
    return JsonResponse({'best_month': calculate_best_month(area_data)})

def get_daily_data(request, area, month):
    """Returns daily averages for a given month."""
    all_data = load_all_data()
    area_data = filter_data_by_area(all_data, area)
    month_data = [entry for entry in area_data if entry['time'][5:7] == month]
    
    return JsonResponse({'daily_data': calculate_average(month_data, 10)})  # Group by day

def get_monthly_data(request, area):
    """Returns monthly averages for the year."""
    all_data = load_all_data()
    area_data = filter_data_by_area(all_data, area)
    return JsonResponse({'monthly_data': calculate_average(area_data, 7)})  # Group by month

def get_total_sum(request, area):
    """Returns the total average sum for the year."""
    all_data = load_all_data()
    area_data = filter_data_by_area(all_data, area)
    return JsonResponse({'total_sum': calculate_average(area_data, 4)})  # Group by year

def get_range_sum(request, area, start_month, end_month, start_day=None, end_day=None, start_hour=None, end_hour=None):
    """Returns the average pollutant levels for a specific time range."""
    all_data = load_all_data()
    area_data = filter_data_by_area(all_data, area)

    # Convert month names to numerical values if needed
    month_names = {
        "January": 1, "February": 2, "March": 3, "April": 4,
        "May": 5, "June": 6, "July": 7, "August": 8,
        "September": 9, "October": 10, "November": 11, "December": 12
    }

    start_month = month_names.get(start_month, start_month)
    end_month = month_names.get(end_month, end_month)

    filtered_data = filter_data_by_time(area_data, start_month, end_month, start_day, end_day, start_hour, end_hour)

    return JsonResponse({'range_sum': calculate_average(filtered_data, 7)})  # Group by month

def get_pollutant_ranking(request, area):
    """Returns the pollutant ranking based on their harm levels."""
    return JsonResponse({'pollutant_ranking': rank_pollutants_by_harm()})
