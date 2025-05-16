from django.http import JsonResponse
from django.views import View
from datetime import datetime
from collections import defaultdict
import calendar

from .utils import load_all_data, POLLUTANT_LIMITS

def compute_averages(records):
    pollutants = ["no2_conc", "o3_conc", "co_conc", "no_conc", "so2_conc"]
    totals = {p: 0.0 for p in pollutants}
    count = 0

    for r in records:
        try:
            values = {p: float(r.get(p, 0) or 0) for p in pollutants}
        except (ValueError, TypeError):
            continue

        for p in pollutants:
            totals[p] += values[p]
        count += 1

    return {p: round(totals[p] / count, 2) for p in pollutants} if count else {p: 0.0 for p in pollutants}


class AreaLatestAnalysisView(View):
    def get(self, request, area, year):
        data = load_all_data(area=area, year=year)
        if not data:
            return JsonResponse({"error": f"No data found for area: {area} in year {year}"}, status=404)

        for record in data:
            record["parsed_time"] = datetime.strptime(record["time"], "%Y-%m-%d %H:%M:%S")

        latest_record = max(data, key=lambda r: r["parsed_time"])
        latest_year = latest_record["parsed_time"].year
        latest_month = latest_record["parsed_time"].month

        last_month_records = [
            r for r in data
            if r["parsed_time"].year == latest_year and r["parsed_time"].month == latest_month
        ]

        averages = compute_averages(last_month_records)

        return JsonResponse({
            "area": area,
            "year": latest_year,
            "month": calendar.month_name[latest_month],
            "averages": averages,
            "limits": POLLUTANT_LIMITS
        })


class AreaYearlyAnalysisView(View):
    def get(self, request, area, year):
        data = load_all_data(area=area, year=year)
        if not data:
            return JsonResponse({"error": f"No data found for area: {area} in year {year}"}, status=404)

        for r in data:
            r["parsed_time"] = datetime.strptime(r["time"], "%Y-%m-%d %H:%M:%S")

        records_by_month = defaultdict(list)
        for r in data:
            if r["parsed_time"].year == year:
                records_by_month[r["parsed_time"].month].append(r)

        yearly_averages = {}
        for month in range(1, 13):
            month_records = records_by_month.get(month, [])
            month_avg = compute_averages(month_records) if month_records else {}
            yearly_averages[calendar.month_name[month]] = month_avg

        return JsonResponse({
            "area": area,
            "year": year,
            "monthly_averages": yearly_averages,
            "limits": POLLUTANT_LIMITS
        })


class AreaMonthlyAnalysisView(View):
    def get(self, request, area, year, month_name):
        month_name = month_name.capitalize()
        if month_name not in calendar.month_name:
            return JsonResponse({"error": f"Invalid month name: {month_name}"}, status=400)

        month = list(calendar.month_name).index(month_name)

        data = load_all_data(area=area, year=year)
        if not data:
            return JsonResponse({"error": f"No data found for area: {area} in year {year}"}, status=404)

        for r in data:
            r["parsed_time"] = datetime.strptime(r["time"], "%Y-%m-%d %H:%M:%S")

        month_records = [
            r for r in data
            if r["parsed_time"].year == year and r["parsed_time"].month == month
        ]

        if not month_records:
            return JsonResponse({"error": f"No data for {month_name} {year} in {area}"}, status=404)

        averages = compute_averages(month_records)

        return JsonResponse({
            "area": area,
            "year": year,
            "month": month_name,
            "averages": averages,
            "limits": POLLUTANT_LIMITS
        })


class BestAreasPerMonthView(View):
    def get(self, request, year):
        data = load_all_data(year=year)
        if not data:
            return JsonResponse({"error": f"No data found for year: {year}"}, status=404)

        for r in data:
            r["parsed_time"] = datetime.strptime(r["time"], "%Y-%m-%d %H:%M:%S")

        month_area_data = defaultdict(lambda: defaultdict(list))
        for r in data:
            if r["parsed_time"].year == year:
                month = r["parsed_time"].month
                area = r["area"]
                month_area_data[month][area].append(r)

        result = {}
        for month in range(1, 13):
            area_avgs = []
            for area, records in month_area_data[month].items():
                avg = compute_averages(records)
                area_avgs.append((area, avg.get("no2_conc", float("inf"))))

            top5 = sorted(area_avgs, key=lambda x: x[1])[:5]
            result[calendar.month_name[month]] = [
                {"area": area, "no2_avg": round(no2, 2)} for area, no2 in top5
            ]

        return JsonResponse({
            "year": year,
            "best_areas_per_month": result,
            "limits": POLLUTANT_LIMITS
        })
    
class AreaAnnualAverageView(View):
    def get(self, request, area, year):
        data = load_all_data(area=area, year=year)
        if not data:
            return JsonResponse({"error": f"No data found for area: {area} in year {year}"}, status=404)

        for r in data:
            r["parsed_time"] = datetime.strptime(r["time"], "%Y-%m-%d %H:%M:%S")

        # Filter just in case
        year_data = [r for r in data if r["parsed_time"].year == year]

        if not year_data:
            return JsonResponse({"error": f"No data available for {area} in {year}"}, status=404)

        annual_averages = compute_averages(year_data)

        return JsonResponse({
            "area": area,
            "year": year,
            "annual_averages": annual_averages,
            "limits": POLLUTANT_LIMITS
        })

class AreaYearlyGroupedView(View):
    def get(self, request, area, year):
        data = load_all_data(area=area, year=year)
        if not data:
            return JsonResponse({"error": f"No data found for area: {area} in year {year}"}, status=404)

        for r in data:
            r["parsed_time"] = datetime.strptime(r["time"], "%Y-%m-%d %H:%M:%S")

        # Group records by month
        records_by_month = defaultdict(list)
        for r in data:
            if r["parsed_time"].year == year:
                records_by_month[r["parsed_time"].month].append(r)

        # Create response format
        monthly_averages = {}
        for month in range(1, 13):
            records = records_by_month.get(month, [])
            monthly_averages[calendar.month_name[month]] = compute_averages(records) if records else {}

        response = {
            "area": area,
            str(year): {
                "monthly_averages": monthly_averages
            },
            "limits": POLLUTANT_LIMITS
        }

        return JsonResponse(response)

class AreaMultiYearAveragesView(View):
    def get(self, request, area):
        data = load_all_data(area=area)
        if not data:
            return JsonResponse({"error": f"No data found for area: {area}"}, status=404)

        for r in data:
            r["parsed_time"] = datetime.strptime(r["time"], "%Y-%m-%d %H:%M:%S")

        # Organize data by year and month
        year_month_records = defaultdict(lambda: defaultdict(list))
        for r in data:
            year = r["parsed_time"].year
            month = r["parsed_time"].month
            year_month_records[year][month].append(r)

        # Build response
        yearly_data = {}
        for year in sorted(year_month_records.keys()):
            monthly_averages = {}
            for month in range(1, 13):
                records = year_month_records[year].get(month, [])
                monthly_averages[calendar.month_name[month]] = compute_averages(records) if records else {}
            yearly_data[str(year)] = {
                "monthly_averages": monthly_averages
            }

        return JsonResponse({
            "area": area,
            **yearly_data,
            "limits": POLLUTANT_LIMITS
        })

