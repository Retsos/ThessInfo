from collections import defaultdict
from django.http import JsonResponse
from django.views import View
import calendar
from datetime import datetime
from .utils import (
    load_all_data,
    compute_averages,
    parse_timestamps,
    group_by_month,
    group_by_year,
    POLLUTANT_LIMITS,
)


class AreaLatestAnalysisView(View):
    """
    Returns the averages for the latest month of a given area,
    along with the same month in the previous year, grouped by year,
    and the compliant_count = "# pollutants within limit / 5".
    """
    # One limit per pollutant (WHO-based)
    POLLUTANT_LIMITS = {
        "no2_conc": "<=9.5",   # WHO annual mean ≤10 µg/m³
        "so2_conc": "<=10",   # WHO 24 h mean   ≤40 µg/m³
        "o3_conc":  "<=50",   # WHO peak-season ≤60 µg/m³
        "co_conc":  "<=4",    # WHO 24 h mean   ≤4 mg/m³
        "no_conc":  "<=1.5"     # proxy threshold
    }

    def get(self, request, area):
        # Load all available data
        data = load_all_data(area=area, latest_year_only=False)
        if not data:
            return JsonResponse({"error": f"No data found for area: {area}"}, status=404)

        # Parse timestamps
        for record in data:
            # 1) parse το timestamp
            record["parsed_time"] = datetime.strptime(record["time"], "%Y-%m-%d %H:%M:%S")
            # 2) διαιρώ το co_conc με 1000 (από µg/m³ → mg/m³)
            if "co_conc" in record and record["co_conc"] is not None:
                record["co_conc"] = record["co_conc"] / 1000.0

        # Find latest record's year/month
        latest_record = max(data, key=lambda r: r["parsed_time"])
        latest_year  = latest_record["parsed_time"].year
        latest_month = latest_record["parsed_time"].month

        # helper to check one limit string like "<=10"
        def check_limit(value, limit_str):
            if limit_str.startswith("<="):
                num = float(limit_str[2:])
                return value <= num
            if limit_str.startswith("<"):
                num = float(limit_str[1:])
                return value < num
            raise ValueError(f"Unknown operator in limit '{limit_str}'")

        total_pollutants = len(self.POLLUTANT_LIMITS)

        # Build response
        response_data = {
            "area": area,
            "limits": self.POLLUTANT_LIMITS
        }

        for year in (latest_year, latest_year - 1):
            # Filter records for that year/month
            recs = [
                r for r in data
                if r["parsed_time"].year  == year
                and r["parsed_time"].month == latest_month
            ]
            if not recs:
                continue

            avgs = compute_averages(recs)

            # Count how many pollutants pass their single limit
            compliant = 0
            for pol, limit_str in self.POLLUTANT_LIMITS.items():
                if pol in avgs and check_limit(avgs[pol], limit_str):
                    compliant += 1

            response_data[str(year)] = {
                "month": latest_month,
                "averages": avgs,
                "compliant_count": f"{compliant}/{total_pollutants}"
            }

        return JsonResponse(response_data)



class AreaYearlyAnalysisView(View):
    """
    Returns the monthly averages for the latest year and previous year of a given area,
    plus for each month a compliant_count = "# pollutants within limit / 5".
    Example URL: /api/area/Pulaia/group-by-year/
    """
    # Single WHO-based limit per pollutant
    POLLUTANT_LIMITS = {
        "no2_conc": "<=9.5",   # WHO annual mean ≤10 µg/m³
        "so2_conc": "<=10",   # WHO 24 h mean   ≤40 µg/m³
        "o3_conc":  "<=50",   # WHO peak-season ≤60 µg/m³
        "co_conc":  "<=4",    # WHO 24 h mean   ≤4 mg/m³
        "no_conc":  "<=1.5"     # proxy threshold
    }

    def get(self, request, area):
        data = load_all_data(area=area, latest_year_only=False)
        if not data:
            return JsonResponse({"error": f"No data found for area: {area}"}, status=404)

        # parse timestamps
        for r in data:
            # 1) parse timestamp
            r["parsed_time"] = datetime.strptime(r["time"], "%Y-%m-%d %H:%M:%S")
            # 2) normalize CO: from µg/m³ to mg/m³
            co = r.get("co_conc")
            if co is not None:
                try:
                    r["co_conc"] = co / 1000.0
                except (TypeError, ValueError):
                    # αν δεν είναι αριθμός, απλώς το αφήνουμε ως έχει ή το θέτουμε σε None
                    r["co_conc"] = None

        # figure out which years to include
        latest_year = max(r["parsed_time"] for r in data).year
        years = [latest_year, latest_year - 1]

        # group by year → month
        grouped = defaultdict(lambda: defaultdict(list))
        for r in data:
            y, m = r["parsed_time"].year, r["parsed_time"].month
            if y in years:
                grouped[y][m].append(r)

        # limit‐checker helper
        def check_limit(value, spec):
            if spec.startswith("<="):
                return value <= float(spec[2:])
            if spec.startswith("<"):
                return value  < float(spec[1:])
            raise ValueError(f"Unknown limit spec {spec}")

        total = len(self.POLLUTANT_LIMITS)

        # build response
        resp = {
            "area": area,
            "limits": self.POLLUTANT_LIMITS
        }

        for y in years:
            monthly = {}
            for m in range(1, 13):
                recs = grouped[y].get(m, [])
                avgs = compute_averages(recs) if recs else {}
                # count compliance
                passed = 0
                for pol, spec in self.POLLUTANT_LIMITS.items():
                    if pol in avgs and check_limit(avgs[pol], spec):
                        passed += 1

                monthly[calendar.month_name[m]] = {
                    "averages": avgs,
                    "compliant_count": f"{passed}/{total}"
                }

            resp[str(y)] = {
                "monthly_averages": monthly
            }

        return JsonResponse(resp)



class BestAreaLatestYearComplianceView(View):
    """
    Returns the best area (lowest annual NO2 average) for the most recent year,
    plus a compliant_count = “# pollutants within limit / 5”.
    """

    POLLUTANT_LIMITS = {
        "no2_conc": "<=9.5",
        "so2_conc": "<=10",
        "o3_conc":  "<=50",
        "co_conc":  "<=4",
        "no_conc":  "<=1.5"
    }

    def get(self, request):
        # 1) Load only latest year data
        data = load_all_data(latest_year_only=True)
        if not data:
            return JsonResponse({"error": "No data found"}, status=404)

        data = parse_timestamps(data)

        # 2) Group by area → records
        area_records = defaultdict(list)
        for r in data:
            if "parsed_time" not in r:
                r["parsed_time"] = datetime.strptime(r["time"], "%Y-%m-%d %H:%M:%S")

            co = r.get("co_conc")
            if co is not None:
                try:
                    r["co_conc"] = co / 1000.0
                except (TypeError, ValueError):
                    r["co_conc"] = None

            area = r["area"]
            area_records[area].append(r)

        # 3) Compute averages
        area_avgs = {
            area: compute_averages(recs)
            for area, recs in area_records.items()
        }

        # 4) Pick best area by NO2
        best = min(
            area_avgs.items(),
            key=lambda kv: kv[1].get("no2_conc", float("inf")),
            default=None
        )

        if not best:
            return JsonResponse({"error": "No valid data for NO₂ found"}, status=404)

        area, avgs = best
        compliant = 0
        total_pollutants = len(self.POLLUTANT_LIMITS)

        def check_limit(value, limit_str):
            if limit_str.startswith("<="):
                return value <= float(limit_str[2:])
            if limit_str.startswith("<"):
                return value < float(limit_str[1:])
            if limit_str.startswith(">="):
                return value >= float(limit_str[2:])
            if limit_str.startswith(">"):
                return value > float(limit_str[1:])
            raise ValueError(f"Invalid limit: {limit_str}")

        for pol, limit_str in self.POLLUTANT_LIMITS.items():
            if pol in avgs and check_limit(avgs[pol], limit_str):
                compliant += 1

        result = {
            "year": max(r["parsed_time"].year for r in data),
            "area": area,
            "no2_avg": round(avgs.get("no2_conc", 0), 2),
            "compliant_count": f"{compliant}/{total_pollutants}"
        }

        return JsonResponse(result)


class MonthlyComplianceAverageView(View):
    """
    Returns, for each area, the average monthly compliance percentage
    over all available months, wrapped under 'compliant_count'.
    """

    # WHO limits per pollutant (used for monthly compliance checks)
    POLLUTANT_LIMITS = {
        "no2_conc": "<=9.5",
        "so2_conc": "<=10",
        "o3_conc":  "<=50",
        "co_conc":  "<=4",
        "no_conc":  "<=1.5"
    }

    def get(self, request):
        # Load all available data (not limited to a specific year)
        data = load_all_data(latest_year_only=False)
        if not data:
            return JsonResponse({"error": "No data found"}, status=404)

        # Parse timestamp strings to datetime objects
        data = parse_timestamps(data)

        # Normalize CO: µg/m³ → mg/m³
        for r in data:
            co = r.get("co_conc")
            if co is not None:
                try:
                    r["co_conc"] = co / 1000.0
                except (TypeError, ValueError):
                    r["co_conc"] = None

        # Group records by area → month
        area_month_records = defaultdict(lambda: defaultdict(list))
        for r in data:
            area = r["area"]
            month = r["parsed_time"].month
            area_month_records[area][month].append(r)

        total_pollutants = len(self.POLLUTANT_LIMITS)

        # Helper function to compare a value against a limit string like "<=10"
        def check_limit(value, limit_str):
            if limit_str.startswith("<="):
                return value <= float(limit_str[2:])
            if limit_str.startswith("<"):
                return value < float(limit_str[1:])
            if limit_str.startswith(">="):
                return value >= float(limit_str[2:])
            if limit_str.startswith(">"):
                return value > float(limit_str[1:])
            raise ValueError(f"Invalid limit: {limit_str}")

        result = {}

        # For each area, calculate the average monthly compliance %
        for area, months in area_month_records.items():
            monthly_percents = []

            # For each month, compute average pollutant values and compliance %
            for records in months.values():
                avgs = compute_averages(records)
                compliant = 0
                for pol, limit_str in self.POLLUTANT_LIMITS.items():
                    if pol in avgs and check_limit(avgs[pol], limit_str):
                        compliant += 1
                percent = (compliant / total_pollutants) * 100
                monthly_percents.append(percent)

            # Calculate the average compliance percentage across all months
            if monthly_percents:
                avg_compliance = round(sum(monthly_percents) / len(monthly_percents), 2)
                result[area] = {
                    "compliant_count": avg_compliance
                }

        return JsonResponse(result)






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