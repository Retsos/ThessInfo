from django.http import JsonResponse
from django.views import View
from datetime import datetime
from collections import defaultdict
import calendar
from .utils import load_all_data

def compute_averages(records):
    totals = {
        "no2_conc": 0,
        "o3_conc": 0,
        "co_conc": 0,
        "no_conc": 0,
        "so2_conc": 0,
    }
    count = len(records)
    if count == 0:
        return totals
    for r in records:
        totals["no2_conc"] += r.get("no2_conc", 0)
        totals["o3_conc"] += r.get("o3_conc", 0)
        totals["co_conc"] += r.get("co_conc", 0)
        totals["no_conc"] += r.get("no_conc", 0)
        totals["so2_conc"] += r.get("so2_conc", 0)
    return {k: round(v / count, 2) for k, v in totals.items()}



class AreaLatestAnalysisView(View):
    """
    Returns the averages for the latest month of a given area,
    along with the same month in the previous year, grouped by year.
    """
    def get(self, request, area):
        # Load all available data
        data = load_all_data(area=area, latest_year_only=False)
        if not data:
            return JsonResponse({"error": f"No data found for area: {area}"}, status=404)

        # Parse timestamps
        for record in data:
            record["parsed_time"] = datetime.strptime(record["time"], "%Y-%m-%d %H:%M:%S")

        # Find latest record's year/month
        latest_record = max(data, key=lambda r: r["parsed_time"])
        latest_year = latest_record["parsed_time"].year
        latest_month = latest_record["parsed_time"].month

        # Prepare year data
        response_data = {"area": area}

        for year in [latest_year, latest_year - 1]:
            year_records = [
                r for r in data
                if r["parsed_time"].year == year and r["parsed_time"].month == latest_month
            ]
            if year_records:
                response_data[str(year)] = {
                    "month": latest_month,
                    "averages": compute_averages(year_records)
                }

        return JsonResponse(response_data)




class AreaYearlyAnalysisView(View):
    """
    Returns the monthly averages for the latest year and previous year of a given area.
    Example URL: /api/area/Pulaia/group-by-year/
    """
    def get(self, request, area):
        # Load all data for the area
        data = load_all_data(area=area, latest_year_only=False)
        if not data:
            return JsonResponse({"error": f"No data found for area: {area}"}, status=404)

        # Parse the "time" field
        for record in data:
            record["parsed_time"] = datetime.strptime(record["time"], "%Y-%m-%d %H:%M:%S")

        # Find the latest year in the dataset
        latest_record = max(data, key=lambda r: r["parsed_time"])
        latest_year = latest_record["parsed_time"].year
        previous_year = latest_year - 1

        # Group data by year and month
        grouped_by_year_month = defaultdict(lambda: defaultdict(list))
        for r in data:
            year = r["parsed_time"].year
            month = r["parsed_time"].month
            if year in [latest_year, previous_year]:
                grouped_by_year_month[year][month].append(r)

        # Prepare response
        response_data = {
            "area": area
        }

        for year in [latest_year, previous_year]:
            monthly_averages = {}
            for month in range(1, 13):
                records = grouped_by_year_month[year].get(month, [])
                avg = compute_averages(records) if records else {}
                monthly_averages[calendar.month_name[month]] = avg

            response_data[str(year)] = {
                "monthly_averages": monthly_averages
            }

        return JsonResponse(response_data)
