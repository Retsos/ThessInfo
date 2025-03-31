from django.http import JsonResponse
from .utils import load_all_data
import numpy as np
from datetime import datetime


# List of pollutants we're working with
pollutants = ["no2_conc", "o3_conc", "co_conc", "no_conc", "so2_conc"]

# Helper function to filter data by area
def filter_data_by_area(data, area):
    return [entry for entry in data if entry.get("spatial_ref") == area]

# Helper function to find the best hour
def calculate_best_hour(data):
    return min(data, key=lambda x: sum(x[element] for element in pollutants))['time']

# Helper function to find the best day
def calculate_best_day(data):
    daily_avg = {}
    for entry in data:
        day = entry['time'].split()[0]
        if day not in daily_avg:
            daily_avg[day] = []
        daily_avg[day].append(sum(entry[element] for element in pollutants))
    return min(daily_avg, key=lambda k: np.mean(daily_avg[k]))

# Helper function to find the best month
def calculate_best_month(data):
    monthly_avg = {}
    for entry in data:
        month = entry['time'][:7]  # "YYYY-MM"
        if month not in monthly_avg:
            monthly_avg[month] = []
        monthly_avg[month].append(sum(entry[element] for element in pollutants))
    return min(monthly_avg, key=lambda k: np.mean(monthly_avg[k]))

# Helper function to calculate average for a given group
def calculate_average(data, group_by):
    grouped_data = {}
    for entry in data:
        key = entry['time'][:group_by]
        if key not in grouped_data:
            grouped_data[key] = {p: [] for p in pollutants}
        for p in pollutants:
            grouped_data[key][p].append(entry[p])

    return {k: {p: np.mean(v) for p, v in values.items()} for k, values in grouped_data.items()}

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
    area_data = [entry for entry in all_data if entry['spatial_ref'] == area]

    if not area_data:
        return JsonResponse({'error': 'No data found for the specified area.'}, status=404)

    # Compute the desired metrics based on the area data
    # Example: Average values of the elements (you can expand this logic as needed)
    avg_no2 = sum(entry['no2_conc'] for entry in area_data) / len(area_data)
    avg_o3 = sum(entry['o3_conc'] for entry in area_data) / len(area_data)
    avg_co = sum(entry['co_conc'] for entry in area_data) / len(area_data)
    avg_no = sum(entry['no_conc'] for entry in area_data) / len(area_data)
    avg_so2 = sum(entry['so2_conc'] for entry in area_data) / len(area_data)

    # Find the best hour, day, and month based on a custom metric (e.g., the hour with the lowest average)
    best_hour = min(area_data, key=lambda x: x['no2_conc'])  # Example: Min value of no2_conc for the best hour
    best_day = min(area_data, key=lambda x: x['o3_conc'])  # Example: Min value of o3_conc for the best day
    best_month = min(area_data, key=lambda x: x['co_conc'])  # Example: Min value of co_conc for the best month

    # You can expand the above logic to compute all the other metrics you want.

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
        # Add any other metrics as necessary
    }

    # Return the data as a JSON response
    return JsonResponse(response_data)
