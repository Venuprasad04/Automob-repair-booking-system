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