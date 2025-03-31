from django.http import JsonResponse
import numpy as np
from datetime import datetime
from .utils import load_all_data

# List of pollutants we're working with
pollutants = ["no2_conc", "o3_conc", "co_conc", "no_conc", "so2_conc"]

# Helper function to filter data by area
def filter_data_by_area(data, area):
    return [entry for entry in data if entry.get("spatial_ref") == area]

# Helper function to find the best hour
def calculate_best_hour(data):
    data_array = np.array([entry[pollutants].values() for entry in data])
    sums = np.sum(data_array, axis=1)
    best_index = np.argmin(sums)
    return data[best_index]['time']

# Helper function to find the best day
def calculate_best_day(data):
    daily_avg = {}
    for entry in data:
        day = entry['time'].split()[0]
        if day not in daily_avg:
            daily_avg[day] = []
        daily_avg[day].append([entry[element] for element in pollutants])

    daily_sums = {day: np.mean(values, axis=0) for day, values in daily_avg.items()}
    day_with_best_sum = min(daily_sums, key=lambda k: np.sum(daily_sums[k]))
    return day_with_best_sum

# Helper function to find the best month
def calculate_best_month(data):
    monthly_avg = {}
    for entry in data:
        month = entry['time'][:7]  # "YYYY-MM"
        if month not in monthly_avg:
            monthly_avg[month] = []
        monthly_avg[month].append([entry[element] for element in pollutants])

    monthly_sums = {month: np.mean(values, axis=0) for month, values in monthly_avg.items()}
    month_with_best_sum = min(monthly_sums, key=lambda k: np.sum(monthly_sums[k]))
    return month_with_best_sum

# Helper function to calculate average for a given group
def calculate_average(data, group_by):
    grouped_data = {}
    for entry in data:
        key = entry['time'][:group_by]
        if key not in grouped_data:
            grouped_data[key] = {p: [] for p in pollutants}
        for p in pollutants:
            grouped_data[key][p].append(entry[p])

    averages = {
        k: {p: np.mean(v) for p, v in values.items()}
        for k, values in grouped_data.items()
    }
    return averages

# Helper function to rank pollutants based on their harm to humans
def rank_pollutants_by_harm():
    harm_levels = {
        "no2_conc": 4,
        "o3_conc": 3,
        "co_conc": 5,
        "no_conc": 2,
        "so2_conc": 1
    }
    return sorted(harm_levels, key=harm_levels.get, reverse=True)

# Main view function to fetch and return air quality data
def air_quality_view(request, area):
    # Load all data from the utils function
    all_data = load_all_data()
    
    # Filter data by area name
    area_data = filter_data_by_area(all_data, area)

    if not area_data:
        return JsonResponse({'error': 'No data found for the specified area.'}, status=404)

    # Convert to numpy array for efficient calculation
    data_array = np.array([[
        entry['no2_conc'], entry['o3_conc'], entry['co_conc'], entry['no_conc'], entry['so2_conc']] 
        for entry in area_data])

    # Calculate averages for each pollutant across all hours
    averages = np.mean(data_array, axis=0)
    avg_no2, avg_o3, avg_co, avg_no, avg_so2 = averages

    # Find the best hour, day, and month based on the pollutant sum
    best_hour = calculate_best_hour(area_data)
    best_day = calculate_best_day(area_data)
    best_month = calculate_best_month(area_data)

    # Rank pollutants by their harm to humans
    harm_ranking = rank_pollutants_by_harm()

    # Prepare the response data
    response_data = {
        'area': area,
        'avg_no2': avg_no2,
        'avg_o3': avg_o3,
        'avg_co': avg_co,
        'avg_no': avg_no,
        'avg_so2': avg_so2,
        'best_hour': best_hour,
        'best_day': best_day,
        'best_month': best_month,
        'harm_ranking': harm_ranking
    }

    # Return the data as a JSON response
    return JsonResponse(response_data)
