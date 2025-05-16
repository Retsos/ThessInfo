from collections import defaultdict
from django.http import JsonResponse
from django.views import View
import calendar
from .utils import (
    load_all_data,
    compute_averages,
    parse_timestamps,
    group_by_month,
    group_by_year,
    POLLUTANT_LIMITS,
)

class BaseAnalysisView(View):
    def load_and_prepare(self, area=None, year=None):
        data = load_all_data(area=area, year=year)
        if not data:
            return None, JsonResponse(
                {"error": f"No data found for area: {area} in year {year}"}, status=404
            )
        return parse_timestamps(data), None


class AreaLatestAnalysisView(BaseAnalysisView):
    def get(self, request, area, year):
        data, error = self.load_and_prepare(area, year)
        if error: return error

        latest_record = max(data, key=lambda r: r["parsed_time"])
        latest_year, latest_month = latest_record["parsed_time"].year, latest_record["parsed_time"].month

        last_month_records = [r for r in data if r["parsed_time"].year == latest_year and r["parsed_time"].month == latest_month]
        averages = compute_averages(last_month_records)

        return JsonResponse({
            "area": area,
            "year": latest_year,
            "month": calendar.month_name[latest_month],
            "averages": averages,
            "limits": POLLUTANT_LIMITS
        })


class AreaYearlyAnalysisView(BaseAnalysisView):
    def get(self, request, area, year):
        data, error = self.load_and_prepare(area, year)
        if error: return error

        records_by_month = group_by_month(data, year)
        yearly_averages = {
            calendar.month_name[m]: compute_averages(records_by_month.get(m, []))
            for m in range(1, 13)
        }

        return JsonResponse({
            "area": area,
            "year": year,
            "monthly_averages": yearly_averages,
            "limits": POLLUTANT_LIMITS
        })


class AreaMonthlyAnalysisView(BaseAnalysisView):
    def get(self, request, area, year, month_name):
        month_name = month_name.capitalize()
        if month_name not in calendar.month_name:
            return JsonResponse({"error": f"Invalid month name: {month_name}"}, status=400)

        month = list(calendar.month_name).index(month_name)
        data, error = self.load_and_prepare(area, year)
        if error: return error

        month_records = [r for r in data if r["parsed_time"].month == month]
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

        data = parse_timestamps(data)
        month_area_data = defaultdict(lambda: defaultdict(list))
        for r in data:
            if r["parsed_time"].year == year:
                month_area_data[r["parsed_time"].month][r["area"]].append(r)

        result = {}
        for m in range(1, 13):
            area_avgs = [
                (area, compute_averages(records).get("no2_conc", float("inf")))
                for area, records in month_area_data[m].items()
            ]
            top5 = sorted(area_avgs, key=lambda x: x[1])[:5]
            result[calendar.month_name[m]] = [{"area": a, "no2_avg": round(v, 2)} for a, v in top5]

        return JsonResponse({
            "year": year,
            "best_areas_per_month": result,
            "limits": POLLUTANT_LIMITS
        })


class AreaAnnualAverageView(BaseAnalysisView):
    def get(self, request, area, year):
        data, error = self.load_and_prepare(area, year)
        if error: return error

        year_data = [r for r in data if r["parsed_time"].year == year]
        if not year_data:
            return JsonResponse({"error": f"No data available for {area} in {year}"}, status=404)

        return JsonResponse({
            "area": area,
            "year": year,
            "annual_averages": compute_averages(year_data),
            "limits": POLLUTANT_LIMITS
        })


class AreaYearlyGroupedView(BaseAnalysisView):
    def get(self, request, area, year):
        data, error = self.load_and_prepare(area, year)
        if error: return error

        records_by_month = group_by_month(data, year)
        monthly_averages = {
            calendar.month_name[m]: compute_averages(records_by_month.get(m, []))
            for m in range(1, 13)
        }

        return JsonResponse({
            "area": area,
            str(year): {"monthly_averages": monthly_averages},
            "limits": POLLUTANT_LIMITS
        })


class AreaMultiYearAveragesView(View):
    def get(self, request, area):
        data = load_all_data(area=area)
        if not data:
            return JsonResponse({"error": f"No data found for area: {area}"}, status=404)

        data = parse_timestamps(data)
        records_by_year = group_by_year(data)
        response = {
            "area": area,
            "limits": POLLUTANT_LIMITS
        }

        for year, records in sorted(records_by_year.items()):
            records_by_month = group_by_month(records)
            monthly_averages = {
                calendar.month_name[m]: compute_averages(records_by_month.get(m, []))
                for m in range(1, 13)
            }
            response[str(year)] = {"monthly_averages": monthly_averages}

        return JsonResponse(response)
