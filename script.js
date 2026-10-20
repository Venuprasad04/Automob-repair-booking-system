const form = document.getElementById("contactForm");
const customerName = document.getElementById("name");
const phone = document.getElementById("phone");
const email = document.getElementById("email");
const vehicle = document.getElementById("vehicle");
const service = document.getElementById("service");
const appointment = document.getElementById("appointmentDate");
const customerMessage = document.getElementById("message");
const formMessage = document.getElementById("formMessage");
 const submitButton = document.getElementById("submit-btn");
function setMinimumAppointmentTime(){
    const now=new Date();
    const year = now.getFullYear();
    const month=String(now.getMonth()+1).padStart(2,"0");
    const day=String(now.getDate()).padStart(2,"0");
    const hours=String(now.getHours()).padStart(2,"0");
    const minutes=String(now.getMinutes()).padStart(2,"0");
    const currentDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
    appointment.min = currentDateTime;
}
setMinimumAppointmentTime();
appointment.addEventListener("change", function () {
    const selectedTime = new Date(appointment.value);
    const now = new Date();
    if (selectedTime <= now) {

        alert("Past appointment time is not allowed.");
        appointment.value = "";
    }
});
phone.addEventListener("input",function(){
    phone.value=phone.value.replace(/\D/g,"");
});
form.addEventListener("submit",async function(event){
    event.preventDefault();
    if (submitButton.disabled) {
        return;
    }
    const nameValue=customerName.value.trim();
    const phoneValue=phone.value.trim();
    const emailValue=email.value.trim();
    const vehicleValue = vehicle.value.trim();
    const serviceValue = service.value;
    const appointmentValue = appointment.value;
    const messageValue = customerMessage.value.trim();
    if(nameValue.length<3){
        showError("Please enter a valid full name.");
        customerName.focus();
        return;

    }
    if(phoneValue.length!==10){
        showError("Phone number must contain 10 digit.");
        phone.focus();
        return;
    }
    if(vehicleValue===""){
        showError("Please enter your vehicle name");
        vehicle.focus();
        return;
    }
      if (serviceValue === "") {

        showError("Please select a service.");

        service.focus();

        return;
    }
       if (appointmentValue === "") {

        showError("Please select an appointment date and time.");

        appointment.focus();

        return;
    }
    

    // Frontend validation
    if (nameValue.length < 3) {
        showError("Enter a valid full name.");
        return;
    }

    if (!/^[0-9]{10}$/.test(phoneValue)) {
        showError("Enter a valid 10-digit phone number.");
        return;
    }

    if (!email.validity.valid || !emailValue) {
        showError("Enter a valid email.");
        return;
    }

    if (!vehicleValue) {
        showError("Enter your vehicle details.");
        return;
    }

    if (!serviceValue) {
        showError("Please select a service.");
        return;
    }

    if (!appointmentValue ||
        new Date(appointmentValue) <= new Date()) {
        showError("Choose a future appointment time.");
        return;
    }

    // Prepare the booking information
    const bookingData = {
        name: nameValue,
        phone: phoneValue,
        email: emailValue,
        vehicle: vehicleValue,
        service: serviceValue,
        appointment_date: appointmentValue,
        message: messageValue
    };
     const csrfInput = form.querySelector(
        "[name=csrfmiddlewaretoken]"
    );

    if (!csrfInput) {
        showError("Security token missing. Refresh the page.");
        return;
    }

    submitButton.disabled = true;
     submitButton.textContent = "Submitting...";
     formMessage.textContent = "";
    try {
        // Send booking data to Django
        const response = await fetch("/api/appointment/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": csrfInput.value
            },
            body: JSON.stringify(bookingData)
        });

        const result = await response.json();

        if (!response.ok) {
            showError(result.error || "Appointment could not be saved.");
            return;
        }
        const token=result.tracking_token;
     showSuccess(`Thank you ${nameValue}! Your appointment request has been submitted successfully and your booking ref is ${token}`);
     trackingToken.value=token;

        form.reset();
        setMinimumAppointmentTime();

    } catch (error) {
        showError("Unable to connect to the server. Please try again.");
        console.error("Booking request failed:", error);

    } finally {
        submitButton.disabled = false;
         submitButton.textContent = "🔧 Submit Service Request";
    }
});
function showSuccess(message) {
    formMessage.textContent = message;
    formMessage.style.color = "green";
}
function showError(message) {
    formMessage.textContent = message;
    formMessage.style.color = "red";
}
const navigationSections=document.querySelectorAll(".section");
    navigationSections.forEach(function (section){
        section.addEventListener("click", function(){
            const link=section.querySelector("a");
            if(link){
                const targetId=link.getAttribute("href");
                const target=document.querySelector(targetId);
            if(target){
                    target.scrollIntoView({
                        behavior:"smooth"
                    });
                }
            }

        });
    });
const trackingToken=document.getElementById("trackingToken");
const bookingStatus=document.getElementById("bookingStatus");
async function checkAppointmentStatus(){
    const token=trackingToken.value.trim();
    if(!token){
        bookingStatus.textContent="Please enter your booking reference";
        return;
    }
    try {
        const response=await fetch(`/api/appointment/status/${encodeURIComponent(token)}/` 
    );
    if (!response.ok){
        bookingStatus.textContent="Booking not found.Check your refernece";
        return;
    }
    const data=await response.json();
    bookingStatus.textContent=`Appointment Status:${data.status}`;
     if (data.status === "Approved") {
            bookingStatus.style.color = "green";
        } else if (data.status === "Rejected") {
            bookingStatus.style.color = "red";
        } else {
            bookingStatus.style.color = "orange";
        }

    }catch (error){
        bookingStatus.textContent="Unable to check status right now";
        console.error(error);

    }
}
checkStatusBtn.addEventListener("click",checkAppointmentStatus);

