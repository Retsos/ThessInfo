from collections import defaultdict
from django.http import JsonResponse
from django.views import View
from calendar import month_name

from .utils import (
    load_all_data,
    compute_averages,
    parse_timestamps,
    normalize_co,
    group_by_month,
    group_by_year,
    POLLUTANT_LIMITS,
    check_limit,
    get_greek_name,
)


class AreaMixin:
    """Shared methods for area-based analysis views."""
    pollutant_limits = POLLUTANT_LIMITS

    def prepare_data(self, area, latest_year_only=False):
        raw = load_all_data(area=area, latest_year_only=latest_year_only)
        if not raw:
            return None
        data = parse_timestamps(raw)
        data = normalize_co(data)
        return data

    def build_base_response(self, area):
        return {
            "name": "airdata",
            # return Greek name for display
            "area": get_greek_name(area),
            "limits": self.pollutant_limits,
        }


class AreaLatestAnalysisView(AreaMixin, View):
    def get(self, request, area):
        data = self.prepare_data(area, latest_year_only=False)
        if data is None:
            return JsonResponse({"error": f"No data found for area: {area}"}, status=404)

        # find latest year/month
        latest = max(r["parsed_time"] for r in data)
        y0, m0 = latest.year, latest.month

        resp = self.build_base_response(area)
        total = len(self.pollutant_limits)

        for year in (y0, y0 - 1):
            recs = [r for r in data if r["parsed_time"].year == year and r["parsed_time"].month == m0]
            if not recs:
                continue
            avgs = compute_averages(recs)
            passed = sum(1 for p, spec in self.pollutant_limits.items() if p in avgs and check_limit(avgs[p], spec))
            resp[str(year)] = {"month": m0, "averages": avgs, "compliant_count": f"{passed}/{total}"}

        return JsonResponse(resp)


class AreaYearlyAnalysisView(AreaMixin, View):
    def get(self, request, area):
        data = self.prepare_data(area, latest_year_only=False)
        if data is None:
            return JsonResponse({"error": f"No data found for area: {area}"}, status=404)

        years = sorted({r["parsed_time"].year for r in data}, reverse=True)[:2]
        grouped = defaultdict(lambda: defaultdict(list))
        for r in data:
            y, m = r["parsed_time"].year, r["parsed_time"].month
            if y in years:
                grouped[y][m].append(r)

        resp = self.build_base_response(area)
        total = len(self.pollutant_limits)

        for y in years:
            monthly = {}
            for m in range(1, 13):
                recs = grouped[y].get(m, [])
                avgs = compute_averages(recs) if recs else {}
                passed = sum(1 for p, spec in self.pollutant_limits.items() if p in avgs and check_limit(avgs[p], spec))
                monthly[month_name[m]] = {"averages": avgs, "compliant_count": f"{passed}/{total}"}
            resp[str(y)] = {"monthly_averages": monthly}

        return JsonResponse(resp)


class BestAreaLatestYearComplianceView(AreaMixin, View):
    def get(self, request):
        data = self.prepare_data(area=None, latest_year_only=True)
        if data is None:
            return JsonResponse({"error": "No data found"}, status=404)

        records_by_area = defaultdict(list)
        for r in data:
            records_by_area[r["area"]].append(r)

        avgs_map = {a: compute_averages(rs) for a, rs in records_by_area.items()}
        best_area, best_avgs = min(avgs_map.items(), key=lambda kv: kv[1].get("no2_conc", float("inf")))

        total = len(self.pollutant_limits)
        passed = sum(1 for p, spec in self.pollutant_limits.items() if p in best_avgs and check_limit(best_avgs[p], spec))

        result = {
            "name": "airdata",
            "year": max(r["parsed_time"].year for r in data),
            "area": get_greek_name(best_area),
            "no2_avg": round(best_avgs.get("no2_conc", 0), 2),
            "compliant_count": f"{passed}/{total}",
        }
        return JsonResponse(result)


class MonthlyComplianceAverageView(AreaMixin, View):
    def get(self, request):
        data = self.prepare_data(area=None, latest_year_only=False)
        if data is None:
            return JsonResponse({"error": "No data found"}, status=404)

        by_area_month = defaultdict(lambda: defaultdict(list))
        for r in data:
            by_area_month[r["area"]][r["parsed_time"].month].append(r)

        result = {"name": "airdata"}
        total = len(self.pollutant_limits)

        for a, months in by_area_month.items():
            percents = []
            for recs in months.values():
                avgs = compute_averages(recs)
                passed = sum(1 for p, spec in self.pollutant_limits.items() if p in avgs and check_limit(avgs[p], spec))
                percents.append((passed / total) * 100)
            if percents:
                avg_pct = round(sum(percents) / len(percents), 2)
                result[get_greek_name(a)] = {"compliant_count": f"{avg_pct:.2f}"}


        return JsonResponse(result)


class WorstAreaComplianceView(AreaMixin, View):
    def get(self, request):
        data = self.prepare_data(area=None, latest_year_only=True)
        if data is None:
            return JsonResponse({"error": "No data found"}, status=404)

        # Determine the year
        year = max(r["parsed_time"].year for r in data)

        # Group records by area
        by_area = defaultdict(list)
        for r in data:
            by_area[r["area"]].append(r)

        # Find worst area by NO2 average
        worst_area = None
        worst_no2 = -float('inf')
        worst_compliance = None
        total = len(self.pollutant_limits)

        for area_key, recs in by_area.items():
            avgs = compute_averages(recs)
            no2 = avgs.get("no2_conc", 0)
            if no2 > worst_no2:
                # update worst
                worst_no2 = no2
                passed = sum(
                    1 for p, spec in self.pollutant_limits.items()
                    if p in avgs and check_limit(avgs[p], spec)
                )
                worst_area = area_key
                worst_compliance = f"{passed}/{total}"

        # Build response without leaking English key
        return JsonResponse({
            "name": "airdata",
            "year": year,
            "area": get_greek_name(worst_area),
            "no2_avg": round(worst_no2, 2),
            "compliant_count": worst_compliance,
        })





"""""
AYTA PERNOUN SAN PARAMETRO TO ETOS THA DOUME PIA THA VALOUME

class BestAreasPerYearComplianceView(View):
    For a given year, returns the top‑5 areas by lowest annual NO2 average,
    plus a compliant_count = “# pollutants within limit / 5”.
    Example URL: /api/best-areas/2023/
    POLLUTANT_LIMITS = {
        "no2_conc": "<=10",   # WHO annual mean ≤10 µg/m³
        "so2_conc": "<=40",   # WHO 24 h mean   ≤40 µg/m³
        "o3_conc":  "<=60",   # WHO peak-season ≤60 µg/m³
        "co_conc":  "<=4",    # WHO 24 h mean   ≤4 mg/m³
        "no_conc":  "<=1"     # proxy threshold
    }

    def get(self, request, year):
        target_year = int(year)
        # 1) Load all data (all years)
        data = load_all_data(latest_year_only=False)
        if not data:
            return JsonResponse({"error": f"No data found"}, status=404)

        # 2) Parse timestamps and filter to target_year
        data = parse_timestamps(data)
        year_records = [r for r in data if r["parsed_time"].year == target_year]
        if not year_records:
            return JsonResponse({"error": f"No data for year {target_year}"}, status=404)

        # 3) Group by area → records
        area_records = defaultdict(list)
        for r in year_records:
            area_records[r["area"]].append(r)

        # 4) Compute annual averages per area
        area_avgs = {
            area: compute_averages(recs)
            for area, recs in area_records.items()
        }

        # 5) Pick top‑5 by NO2 avg
        top5 = sorted(
            area_avgs.items(),
            key=lambda kv: kv[1].get("no2_conc", float("inf"))
        )[:5]

        # 6) Helper to check "<=value" specs
        def check_limit(val, spec):
            if spec.startswith("<="):
                return val <= float(spec[2:])
            if spec.startswith("<"):
                return val < float(spec[1:])
            raise ValueError(f"Unknown limit spec {spec}")

        total = len(self.POLLUTANT_LIMITS)

        # 7) Build response list
        result = []
        for area, avgs in top5:
            compliant = sum(
                1
                for pol, spec in self.POLLUTANT_LIMITS.items()
                if pol in avgs and check_limit(avgs[pol], spec)
            )
            result.append({
                "area": area,
                "no2_avg": round(avgs.get("no2_conc", 0), 2),
                "compliant_count": f"{compliant}/{total}"
            })

        return JsonResponse({
            "year": target_year,
            "best_areas": result,
            "limits": self.POLLUTANT_LIMITS
        })
class AreaLatestAnalysisView(View):
    
    Returns the averages for the latest month of a given area and year,
    plus compliant_count = "# pollutants within limit / 5".
    Example URL: /api/area/Pulaia/latest-measurements/2023/
    
    POLLUTANT_LIMITS = {
        "no2_conc": "<=10",   # WHO annual mean ≤10 µg/m³
        "so2_conc": "<=40",   # WHO 24 h mean   ≤40 µg/m³
        "o3_conc":  "<=60",   # WHO peak-season ≤60 µg/m³
        "co_conc":  "<=4",    # WHO 24 h mean   ≤4 mg/m³
        "no_conc":  "<=1"     # proxy threshold
    }

    def get(self, request, area, year):
        target_year = int(year)

        # 1) Load all data for area (all years)
        data = load_all_data(area=area, latest_year_only=False)
        if not data:
            return JsonResponse({"error": f"No data found for area: {area}"}, status=404)

        # 2) Parse timestamps and filter to target_year
        for r in data:
            r["parsed_time"] = datetime.strptime(r["time"], "%Y-%m-%d %H:%M:%S")
        year_records = [r for r in data if r["parsed_time"].year == target_year]
        if not year_records:
            return JsonResponse({"error": f"No data found for {area} in year {target_year}"}, status=404)

        # 3) Identify the latest month in that year
        latest_month = max(r["parsed_time"] for r in year_records).month
        month_recs = [r for r in year_records if r["parsed_time"].month == latest_month]

        # 4) Compute averages
        avgs = compute_averages(month_recs)

        # 5) Helper to check "<=value"
        def check_limit(val, spec):
            if spec.startswith("<="):
                return val <= float(spec[2:])
            if spec.startswith("<"):
                return val < float(spec[1:])
            raise ValueError(f"Unknown limit spec {spec}")

        total = len(self.POLLUTANT_LIMITS)
        compliant = sum(
            1
            for pol, spec in self.POLLUTANT_LIMITS.items()
            if pol in avgs and check_limit(avgs[pol], spec)
        )

        # 6) Build response
        response = {
            "area": area,
            "year": target_year,
            "month": latest_month,
            "limits": self.POLLUTANT_LIMITS,
            "averages": avgs,
            "compliant_count": f"{compliant}/{total}"
        }

        return JsonResponse(response)

        class AreaYearlyAnalysisView(View):
    
    Returns the monthly averages for a given year of an area,
    plus for each month a compliant_count = "# pollutants within limit / 5".
    Example URL: /api/area/Pulaia/group-by-year/2023/
    
    POLLUTANT_LIMITS = {
        "no2_conc": "<=10",  # WHO annual mean ≤10 µg/m³
        "so2_conc": "<=40",  # WHO 24 h mean   ≤40 µg/m³
        "o3_conc":  "<=60",  # WHO peak-season ≤60 µg/m³
        "co_conc":  "<=4",   # WHO 24 h mean   ≤4 mg/m³
        "no_conc":  "<=1"    # proxy threshold
    }

    def get(self, request, area, year):
        target_year = int(year)

        # Load all data for the area
        data = load_all_data(area=area, latest_year_only=False)
        if not data:
            return JsonResponse({"error": f"No data found for area: {area}"}, status=404)

        # Parse timestamps
        for r in data:
            r["parsed_time"] = datetime.strptime(r["time"], "%Y-%m-%d %H:%M:%S")

        # Group only the target year by month
        monthly_records = defaultdict(list)
        for r in data:
            if r["parsed_time"].year == target_year:
                monthly_records[r["parsed_time"].month].append(r)

        # Helper to test "<=value" specs
        def check_limit(value, spec):
            if spec.startswith("<="):
                return value <= float(spec[2:])
            if spec.startswith("<"):
                return value  < float(spec[1:])
            raise ValueError(f"Unknown limit spec {spec}")

        total = len(self.POLLUTANT_LIMITS)

        # Build response
        resp = {
            "area": area,
            "year": target_year,
            "limits": self.POLLUTANT_LIMITS,
            "monthly_averages": {}
        }

        for m in range(1, 13):
            recs = monthly_records.get(m, [])
            avgs = compute_averages(recs) if recs else {}

            # Count how many pollutants pass their limit
            passed = sum(
                1
                for pol, spec in self.POLLUTANT_LIMITS.items()
                if pol in avgs and check_limit(avgs[pol], spec)
            )

            resp["monthly_averages"][calendar.month_name[m]] = {
                "averages": avgs,
                "compliant_count": f"{passed}/{total}"
            }

        return JsonResponse(resp)


"""