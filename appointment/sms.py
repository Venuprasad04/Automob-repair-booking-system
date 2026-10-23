def send_appointment_sms(appointment):

    if appointment.status == "Approved":
        message = "Your Motors_Home appointment is approved."

    elif appointment.status == "Rejected":
        message = "Your Motors_Home appointment is declined."

    else:
        return "skipped"

    print("====== SMS TEST MODE ======")
    print("Booking ID:", appointment.id)
    print("Status:", appointment.status)
    print("Message:", message)
    print("===========================")

    return "simulated"