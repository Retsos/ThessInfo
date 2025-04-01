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
    using only the data from the latest year folder.
    Example URL: /api/area/Pulaia/latest-measurements/
    """
    def get(self, request, area):
        # Load only data for the specified area from the latest year folder.
        data = load_all_data(area=area, latest_year_only=True)
        if not data:
            return JsonResponse({"error": f"No data found for area: {area}"}, status=404)

        # Convert the "time" field to a datetime object.
        for record in data:
            record["parsed_time"] = datetime.strptime(record["time"], "%Y-%m-%d %H:%M:%S")

        # Identify the latest record among this data.
        latest_record = max(data, key=lambda r: r["parsed_time"])
        latest_year = latest_record["parsed_time"].year
        latest_month = latest_record["parsed_time"].month

        # Filter records for the latest month.
        last_month_records = [
            r for r in data 
            if r["parsed_time"].year == latest_year and r["parsed_time"].month == latest_month
        ]

        averages = compute_averages(last_month_records)
        return JsonResponse(averages)

class AreaYearlyAnalysisView(View):
    """
    Returns the monthly averages for the latest year of a given area,
    using only the data from the latest year folder.
    Example URL: /api/area/Pulaia/group-by-year/
    """
    def get(self, request, area):
        # Load only data for the specified area from the latest year folder.
        data = load_all_data(area=area, latest_year_only=True)
        if not data:
            return JsonResponse({"error": f"No data found for area: {area}"}, status=404)

        # Convert the "time" field to datetime objects.
        for record in data:
            record["parsed_time"] = datetime.strptime(record["time"], "%Y-%m-%d %H:%M:%S")

        # Since data is loaded only from the latest year folder,
        # the latest year is the year of the latest record.
        latest_record = max(data, key=lambda r: r["parsed_time"])
        latest_year = latest_record["parsed_time"].year

        # Group records by month within that year.
        records_by_month = defaultdict(list)
        for r in data:
            if r["parsed_time"].year == latest_year:
                records_by_month[r["parsed_time"].month].append(r)

        yearly_averages = {}
        for month in range(1, 13):
            month_records = records_by_month.get(month, [])
            month_avg = compute_averages(month_records)
            yearly_averages[calendar.month_name[month]] = month_avg

        return JsonResponse(yearly_averages)
