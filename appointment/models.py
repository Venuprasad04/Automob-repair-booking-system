from django.db import models
import uuid
class Appointment(models.Model):
    STATUS_CHOICES=[
        ("Pending","Pending"),
        ("Approved","Approved"),
        ("Rejected","Rejected"),
    ]
    name=models.CharField(max_length=100)
    phone=models.CharField(max_length=10)
    email=models.EmailField()
    vehicle=models.CharField(max_length=50)
    service=models.CharField(max_length=100)
    appointment_date=models.DateTimeField()
    message=models.TextField(blank=True)
    status=models.CharField(max_length=20, default="Pending....")
    tracking_token=models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        editable=False
    )
    created_at =models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"{self.name}-{self.service}"