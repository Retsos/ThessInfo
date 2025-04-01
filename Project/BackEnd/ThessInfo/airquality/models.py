from django.db import models

class AirQualityData(models.Model):
    spatial_ref = models.CharField(max_length=255)  # Area name
    time = models.DateTimeField()
    no2_conc = models.FloatField()
    o3_conc = models.FloatField()
    co_conc = models.FloatField()
    no_conc = models.FloatField()
    so2_conc = models.FloatField()

    def __str__(self):
        return f"{self.spatial_ref} - {self.time}"
