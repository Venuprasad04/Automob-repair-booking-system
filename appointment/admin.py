from django.contrib import admin
from.models import Appointment
@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display=("name","phone","vehicle","service","appointment_date","status")
    list_filter=("status","service")
    search_fields=("name","phone","vehicle")