import json 
import re
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.utils import timezone
from django.utils.dateparse import parse_datetime
from .models import Appointment 
from django.shortcuts import render
def home(request):
    return render(request, "homepage.html")
from django.conf import settings
from django.http import FileResponse, Http404
import mimetypes

ALLOWED_FILES = {
    "static.css",
    "script.js",
    "MH.png",
    "MH_gallery.png",
    "MH_review.png",
}

def frontend_asset(request, filename):

    if filename not in ALLOWED_FILES:
        raise Http404("File not found")

    file_path = settings.BASE_DIR / filename

    if not file_path.is_file():
        raise Http404("File not found")

    content_type = mimetypes.guess_type(filename)[0]

    return FileResponse(
        open(file_path, "rb"),
        content_type=content_type or "application/octet-stream"
    )
@require_POST
def create_appointment(request):
    try:
        data=json.loads(request.body)
    except (json.JSONDecodeError,UnicodeDecodeError):
        return JsonResponse({"error:Invalid Request data"},status=400)
    if not isinstance(data,dict):
        return JsonResponse({"InvalidBooking information"},status=400)
    name=str(data.get("name")or "").strip()
    phone = str(data.get("phone") or "").strip()
    email = str(data.get("email") or "").strip()
    vehicle = str(data.get("vehicle") or "").strip()
    service = str(data.get("service") or "").strip()
    date_value = str(data.get("appointment_date") or "").strip()
    message = str(data.get("message") or "").strip()
    if len(name)<3 or len(name)>100:
        return JsonResponse({
            "error":"Enter the valid name"
        },status=400)
    if not re.fullmatch(r"[0-9]{10}",phone):
        return JsonResponse({"error":"Phone number must contain 10-digit"},status=400)
    try:
        validate_email(email)
    except ValidationError:
        return JsonResponse({
            "error":"Enter the valid email address"
        },status=400)
    if len(email)>254 or not vehicle or len(vehicle)>50:
        return JsonResponse({"error":"Entr the valid email and vehicle details"},status=400)
    valid_services = {
        "General Service",
        "Oil Change",
        "Brake Service",
        "Engine Repair",
        "Battery Service",
        "Tyre Service",
        "AC Service",
        "Other Service",
    }
    if service not in valid_services:
        return JsonResponse({"error":"Select a valid service"},status=400)
    try:
        appointment_date=parse_datetime(date_value)
    except ValueError:
        appointment_date=None
    if appointment_date is None:
        return JsonResponse({"error":"Select a valid appointment date"},status=400)
    if timezone.is_naive(appointment_date):
        appointment_date=timezone.make_aware(appointment_date,timezone.get_current_timezone())
    if appointment_date <= timezone.now():
        return JsonResponse(
            {"error": "Appointment must be in the future."},
            status=400)
    booking=Appointment.objects.create(
        name=name,
        phone=phone,
        email=email,
        vehicle=vehicle,
        service=service,
        appointment_date=appointment_date,
        message=message
    )
    return JsonResponse({
        "success":True,
        "message":"Appoointment request saved successfully",
        "booking_id":booking.id},status=201
    )