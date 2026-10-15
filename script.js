const form = document.getElementById("contactForm");
const customerName = document.getElementById("name");
const phone = document.getElementById("phone");
const email = document.getElementById("email");
const vehicle = document.getElementById("vehicle");
const service = document.getElementById("service");
const appointment = document.getElementById("appointmentDate");
const customerMessage = document.getElementById("message");
const formMessage = document.getElementById("formMessage");
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
form.addEventListener("submit",function(event){
    event.preventDefault();
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
    showSuccess(`Thank you ${nameValue}! Your appointment request has been submitted successfully`);
    console.log("MOTOR HOME BOOKING");
    console.log("Customer Name",nameValue);
    console.log("Phone:", phoneValue);
    console.log("Email:", emailValue);
    console.log("Vehicle:", vehicleValue);
    console.log("Service:", serviceValue);
    console.log("Appointment:",appointmentValue);
    console.log("Message:",messageValue);
    form.reset();
setMinimumAppointmentTime();
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

