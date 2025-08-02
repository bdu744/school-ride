// Show map with current location
window.onload = () => {
  const link = document.querySelector('.map-container a');
  const img = document.querySelector('.map-container img');

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude.toFixed(6);
      const lon = position.coords.longitude.toFixed(6);

      console.log("lat: " + lat + ", long: " + lon);

      const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lon}`;
      const yandexMapUrl = `https://static-maps.yandex.ru/1.x/?ll=${lon},${lat}&size=600,300&z=13&l=map&pt=${lon},${lat},pm2blm`;

      link.href = googleMapsUrl;
      img.src = yandexMapUrl;
      img.alt = `Current Location Map: ${lat}, ${lon}`;
    }, error => {
      console.error('Error getting location:', error);
    });
  } else {
    console.error('Geolocation is not supported by this browser.');
  }
};

// Booking form handling
const bookingForm = document.getElementById('booking-form');
const statusResult = document.getElementById('statusResult');

bookingForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const parentName = document.getElementById('parentName').value.trim();
  const studentName = document.getElementById('studentName').value.trim();
  const grade = document.getElementById('grade').value.trim();
  const pickupAddress = document.getElementById('pickupAddress').value.trim();
  const dropoffAddress = document.getElementById('dropoffAddress').value.trim();
  const schoolName = document.getElementById('schoolName').value;
  const pickupTime = document.getElementById('pickupTime').value;
  const emergencyContact = document.getElementById('emergencyContact').value.trim();
  const parentContact = document.getElementById('parentContact').value.trim();
  const email = document.getElementById('email').value.trim();
  const specialInstructions = document.getElementById('specialInstructions').value.trim() || "None";

  const daysChecked = Array.from(document.querySelectorAll('input[name="days"]:checked'))
    .map(checkbox => checkbox.value)
    .join(', ') || "None";

  const message = `*New School Transport Booking*%0A
Parent/Guardian Name: ${parentName}%0A
Student Name: ${studentName}%0A
Grade/Class: ${grade}%0A
Pickup Address: ${pickupAddress}%0A
Drop-off Address: ${dropoffAddress}%0A
School Name: ${schoolName}%0A
Pickup Time: ${pickupTime}%0A
Days of Service: ${daysChecked}%0A
Parent Contact Number: ${parentContact}%0A
Email Address: ${email}%0A
Emergency Contact: ${emergencyContact}%0A
Special Instructions: ${specialInstructions}`;

  const phoneNumber = "923369291002";
  const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  window.open(whatsappURL, '_blank');

  const storageKey = `${studentName.toLowerCase().replace(/\s+/g, '')}_${parentContact.replace(/\s+/g, '')}`;
  const bookingData = {
    parentName,
    studentName,
    grade,
    pickupAddress,
    dropoffAddress,
    schoolName,
    pickupTime,
    daysChecked,
    parentContact,
    email,
    emergencyContact,
    specialInstructions,
    status: "Submitted"
  };
  localStorage.setItem(storageKey, JSON.stringify(bookingData));
  bookingForm.reset();
  alert('Booking submitted and saved locally!');
});

// Check status by student name and parent contact
document.getElementById('checkStatusBtn').addEventListener('click', function () {
  const studentName = document.getElementById('checkStudentName').value.trim().toLowerCase().replace(/\s+/g, '');
  const parentContact = document.getElementById('checkParentContact').value.trim().replace(/\s+/g, '');
  const storageKey = `${studentName}_${parentContact}`;

  const bookingStr = localStorage.getItem(storageKey);
  if (bookingStr) {
    const booking = JSON.parse(bookingStr);
    statusResult.style.color = 'black';
    statusResult.innerHTML = `
      <strong>Booking Details:</strong><br/>
      Parent/Guardian Name: ${booking.parentName}<br/>
      Student Name: ${booking.studentName}<br/>
      Grade/Class: ${booking.grade}<br/>
      Pickup Address: ${booking.pickupAddress}<br/>
      Drop-off Address: ${booking.dropoffAddress}<br/>
      School Name: ${booking.schoolName}<br/>
      Pickup Time: ${booking.pickupTime}<br/>
      Days of Service: ${booking.daysChecked}<br/>
      Parent Contact Number: ${booking.parentContact}<br/>
      Email Address: ${booking.email}<br/>
      Emergency Contact: ${booking.emergencyContact}<br/>
      Special Instructions: ${booking.specialInstructions}<br/>
      Status: ${booking.status}
    `;
  } else {
    statusResult.style.color = 'red';
    statusResult.textContent = "No booking found for these details.";
  }
});

// Menu toggle for mobile navigation
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.querySelector('section nav ul');
menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('show');
});

// Contact form submission via WhatsApp
document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const form = e.target;
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();

  const phoneNumber = '923369291002';
  const whatsappMessage = `Contact Form Submission:\nName: ${name}\nEmail: ${email}\nMessage: ${message}`;
  const encodedMessage = encodeURIComponent(whatsappMessage);
  const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
  window.open(whatsappURL, '_blank');
});

// Check tour bookings
const checkForm = document.getElementById('check-form');
const resultsDiv = document.getElementById('check-results');

checkForm.addEventListener('submit', function (e) {
  e.preventDefault();
  const fullname = document.getElementById('check-fullname').value.trim().toLowerCase();
  const contact = document.getElementById('check-contact').value.trim();

  const bookings = JSON.parse(localStorage.getItem('bookings') || "[]");

  const matched = bookings.filter(b =>
    b.fullname.toLowerCase() === fullname && b.contact === contact
  );

  if (matched.length === 0) {
    resultsDiv.innerHTML = '<p>No booking found with that name and contact.</p>';
    return;
  }

  resultsDiv.innerHTML = matched.map(b => `
    <div class="booking-result" style="border:1px solid #ccc; padding:10px; margin-bottom:10px;">
      <strong>Booking Date:</strong> ${new Date(b.submittedAt).toLocaleString()}<br/>
      <strong>Full Name:</strong> ${b.fullname}<br/>
      <strong>Contact:</strong> ${b.contact}<br/>
      <strong>Email:</strong> ${b.email}<br/>
      <strong>Pickup Address:</strong> ${b.address}<br/>
      <strong>Date of Tour:</strong> ${b.date}<br/>
      <strong>Car Option:</strong> ${b.car}<br/>
      <strong>Passengers:</strong> ${b.people}<br/>
      <strong>Luggage Quantity:</strong> ${b.luggage}<br/>
      <strong>Tour Destination:</strong> ${b.destination}<br/>
      <strong>Tour Type:</strong> ${b.tourType}<br/>
      <strong>Pickup Time:</strong> ${b.startTime}<br/>
      <strong>Return Time:</strong> ${b.returnTime}<br/>
      <strong>Special Requirements:</strong> ${b.special}<br/>
      <strong>Additional Notes:</strong> ${b.notes}
    </div>
  `).join('');
});





























  const modal = document.getElementById('accessModal');
  const visitUserBtn = document.getElementById('visitUserBtn');
  const visitAdminBtn = document.getElementById('visitAdminBtn');

  const savedRole = localStorage.getItem("visitorRole");

  // Only show modal if no role saved
  if (savedRole !== "user") {
    modal.style.display = 'flex';
  } else {
    modal.style.display = 'none';
  }

  visitUserBtn.onclick = () => {
    localStorage.setItem("visitorRole", "user");
    modal.style.display = 'none';
  };

  visitAdminBtn.onclick = () => {
    const password = prompt("Enter admin password:");
    if (password === "yourAdminPassword") {  // <-- replace this
      localStorage.setItem("visitorRole", "admin"); // Optional: store role
      window.location.href = "admin.html";
    } else if (password !== null) {
      alert("Incorrect password.");
    }
  };

  // Function to open the modal manually later
  function openRoleModal() {
    modal.style.display = 'flex';
  }
