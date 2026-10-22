import logging
from django.contrib import admin, messages
from django.db import transaction
from django.urls import path, reverse
from django.shortcuts import get_object_or_404, redirect
from django.http import HttpResponseNotAllowed
from django.utils.html import format_html

from .models import Appointment
from .sms import send_appointment_sms


logger = logging.getLogger(__name__)


@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):

    actions = None

    list_display = (
        "name",
        "phone",
        "service",
        "appointment_date",
        "status",
        "approval_buttons",
    )

    list_filter = ("status",)
    search_fields = ("name", "phone")

    readonly_fields = ("status",)

    @admin.display(description="Action")
    def approval_buttons(self, obj):

        # Buttons appear only for pending appointments
        if obj.status != "Pending":
            return obj.status

        accept_url = reverse(
            "admin:appointment_decision",
            args=[obj.pk, "Approved"]
        )

        decline_url = reverse(
            "admin:appointment_decision",
            args=[obj.pk, "Rejected"]
        )

        return format_html(
            '<form method="post">'
            '<input type="hidden" name="csrfmiddlewaretoken" value="{}">'

            '<button type="submit" formaction="{}" '
            'style="background:green;color:white;padding:8px;'
            'border:0;border-radius:5px;cursor:pointer;">'
            'Accept</button> '

            '<button type="submit" formaction="{}" '
            'style="background:red;color:white;padding:8px;'
            'border:0;border-radius:5px;cursor:pointer;">'
            'Decline</button>'

            '</form>',

            self._csrf_token,
            accept_url,
            decline_url
        )

    def changelist_view(self, request, extra_context=None):
        from django.middleware.csrf import get_token

        self._csrf_token = get_token(request)

        return super().changelist_view(
            request,
            extra_context
        )

    def get_urls(self):

        custom_urls = [
            path(
                "<int:booking_id>/decision/<str:decision>/",
                self.admin_site.admin_view(
                    self.change_decision
                ),
                name="appointment_decision",
            ),
        ]

        return custom_urls + super().get_urls()

    def change_decision(
        self,
        request,
        booking_id,
        decision
    ):

        # Only POST requests are allowed
        if request.method != "POST":
            return HttpResponseNotAllowed(["POST"])

        # Check admin permission
        if not self.has_change_permission(request):
            from django.core.exceptions import PermissionDenied

            raise PermissionDenied

        # Only these two decisions are allowed
        if decision not in ("Approved", "Rejected"):
            from django.http import Http404

            raise Http404

        with transaction.atomic():

            booking = get_object_or_404(
                Appointment.objects.select_for_update(),
                pk=booking_id
            )

            # Prevent processing an appointment twice
            if booking.status != "Pending":

                self.message_user(
                    request,
                    "This appointment has already been processed.",
                    messages.WARNING
                )

            else:

                booking.status = decision

                booking.save(
                    update_fields=["status"]
                )

                booking_id_saved = booking.pk

                def notify_customer():

                    try:
                        saved_booking = Appointment.objects.get(
                            pk=booking_id_saved
                        )

                        send_appointment_sms(
                            saved_booking
                        )

                    except Exception:
                        logger.exception(
                            "SMS failed for booking %s",
                            booking_id_saved
                        )

                # Send SMS only after successful database commit
                transaction.on_commit(
                    notify_customer
                )

                self.message_user(
                    request,
                    f"Appointment {decision.lower()} successfully.",
                    messages.SUCCESS
                )

        return redirect(
            "admin:appointment_appointment_changelist"
        )
