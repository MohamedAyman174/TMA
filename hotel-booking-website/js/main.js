// Static room data used by the rooms page and reservation calculator.
const rooms = [
  {
    id: "luxury-suite",
    name: "Luxury Suite",
    category: "luxury",
    categoryLabel: "Luxury Hotels",
    price: 260,
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=80",
    description: "A spacious premium suite with elegant furniture, city views, and private lounge comfort.",
    features: ["King bed", "City view", "Private lounge", "Breakfast included"]
  },
  {
    id: "business-room",
    name: "Business Room",
    category: "business",
    categoryLabel: "Business Hotels",
    price: 150,
    image: "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1000&q=80",
    description: "A quiet room designed for work trips with a desk, fast Wi-Fi, and easy meeting access.",
    features: ["Work desk", "Fast Wi-Fi", "Coffee station", "Late checkout option"]
  },
  {
    id: "family-room",
    name: "Family Room",
    category: "family",
    categoryLabel: "Family Hotels",
    price: 190,
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=80",
    description: "A comfortable family room with flexible sleeping space and practical amenities.",
    features: ["Two queen beds", "Sofa bed", "Mini fridge", "Kids activity corner"]
  },
  {
    id: "budget-room",
    name: "Budget Room",
    category: "budget",
    categoryLabel: "Budget Hotels",
    price: 90,
    image: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1000&q=80",
    description: "A clean and simple room for travelers who want comfort at an affordable price.",
    features: ["Queen bed", "Air conditioning", "Private bathroom", "Free Wi-Fi"]
  },
  {
    id: "beach-resort-room",
    name: "Beach Resort Room",
    category: "beach",
    categoryLabel: "Beach Resorts",
    price: 220,
    image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80",
    description: "A relaxing resort room with coastal styling, sea breeze, and easy pool access.",
    features: ["Sea view", "Balcony", "Pool access", "Resort breakfast"]
  }
];

const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function formatMoney(amount) {
  return moneyFormatter.format(amount);
}

function findRoom(roomId) {
  return rooms.find((room) => room.id === roomId);
}

function renderRoomsPage() {
  const roomsGrid = document.getElementById("roomsGrid");
  if (!roomsGrid) return;

  const selectedCategory = getQueryParam("category");
  const visibleRooms = selectedCategory
    ? rooms.filter((room) => room.category === selectedCategory)
    : rooms;

  const filterNotice = document.getElementById("filterNotice");
  if (filterNotice && selectedCategory) {
    const categoryRoom = rooms.find((room) => room.category === selectedCategory);
    filterNotice.innerHTML = categoryRoom
      ? `Showing rooms for <strong>${categoryRoom.categoryLabel}</strong>. <a href="rooms.html">View all rooms</a>.`
      : "";
  }

  roomsGrid.innerHTML = visibleRooms.map((room) => `
    <article class="room-card">
      <img src="${room.image}" alt="${room.name} room interior" />
      <div class="room-card-body">
        <span class="tag">${room.categoryLabel}</span>
        <h3>${room.name}</h3>
        <p>${room.description}</p>
        <ul>
          ${room.features.map((feature) => `<li>${feature}</li>`).join("")}
        </ul>
        <div class="room-card-footer">
          <strong>${formatMoney(room.price)} <span>/ night</span></strong>
          <a class="btn btn-primary" href="reservation.html?room=${room.id}">Reserve</a>
        </div>
      </div>
    </article>
  `).join("");
}

function populateRoomSelect() {
  const roomSelect = document.getElementById("roomSelect");
  if (!roomSelect) return;

  rooms.forEach((room) => {
    const option = document.createElement("option");
    option.value = room.id;
    option.textContent = `${room.name} - ${formatMoney(room.price)} / night`;
    roomSelect.appendChild(option);
  });

  const preselectedRoom = getQueryParam("room");
  if (preselectedRoom && findRoom(preselectedRoom)) {
    roomSelect.value = preselectedRoom;
  }
}

function calculateNights(checkInValue, checkOutValue) {
  if (!checkInValue || !checkOutValue) return 0;

  const checkInDate = new Date(`${checkInValue}T00:00:00`);
  const checkOutDate = new Date(`${checkOutValue}T00:00:00`);
  const difference = checkOutDate - checkInDate;
  const millisecondsPerDay = 1000 * 60 * 60 * 24;

  return difference > 0 ? Math.round(difference / millisecondsPerDay) : 0;
}

function updateReservationSummary() {
  const roomSelect = document.getElementById("roomSelect");
  const checkIn = document.getElementById("checkIn");
  const checkOut = document.getElementById("checkOut");
  if (!roomSelect || !checkIn || !checkOut) return;

  const selectedRoom = findRoom(roomSelect.value);
  const nights = calculateNights(checkIn.value, checkOut.value);
  const price = selectedRoom ? selectedRoom.price : 0;
  const total = price * nights;

  const selectedRoomBox = document.getElementById("selectedRoom");
  const summaryPrice = document.getElementById("summaryPrice");
  const summaryNights = document.getElementById("summaryNights");
  const summaryTotal = document.getElementById("summaryTotal");

  if (selectedRoomBox) {
    selectedRoomBox.innerHTML = selectedRoom
      ? `
        <img src="${selectedRoom.image}" alt="${selectedRoom.name} preview" />
        <div>
          <h3>${selectedRoom.name}</h3>
          <p>${selectedRoom.description}</p>
        </div>
      `
      : "<p>Select a room to view details and price.</p>";
  }

  if (summaryPrice) summaryPrice.textContent = formatMoney(price);
  if (summaryNights) summaryNights.textContent = String(nights);
  if (summaryTotal) summaryTotal.textContent = formatMoney(total);
}

function setError(fieldId, message) {
  const errorElement = document.getElementById(`${fieldId}Error`);
  const field = document.getElementById(fieldId);

  if (errorElement) errorElement.textContent = message;
  if (field) field.setAttribute("aria-invalid", message ? "true" : "false");
}

function validateReservationForm() {
  const roomSelect = document.getElementById("roomSelect");
  const guestName = document.getElementById("guestName");
  const guestEmail = document.getElementById("guestEmail");
  const checkIn = document.getElementById("checkIn");
  const checkOut = document.getElementById("checkOut");

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const nights = calculateNights(checkIn.value, checkOut.value);
  let isValid = true;

  setError("roomSelect", "");
  setError("guestName", "");
  setError("guestEmail", "");
  setError("checkIn", "");
  setError("checkOut", "");

  if (!roomSelect.value) {
    setError("roomSelect", "Please select a room.");
    isValid = false;
  }

  if (!guestName.value.trim()) {
    setError("guestName", "Guest name is required.");
    isValid = false;
  }

  if (!emailPattern.test(guestEmail.value.trim())) {
    setError("guestEmail", "Enter a valid email address.");
    isValid = false;
  }

  if (!checkIn.value) {
    setError("checkIn", "Choose a check-in date.");
    isValid = false;
  }

  if (!checkOut.value || nights === 0) {
    setError("checkOut", "Check-out date must be after check-in date.");
    isValid = false;
  }

  return isValid;
}

function setupReservationForm() {
  const reservationForm = document.getElementById("reservationForm");
  if (!reservationForm) return;

  populateRoomSelect();
  updateReservationSummary();

  ["roomSelect", "checkIn", "checkOut"].forEach((fieldId) => {
    const field = document.getElementById(fieldId);
    field.addEventListener("change", updateReservationSummary);
  });

  reservationForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const message = document.getElementById("reservationMessage");
    if (!validateReservationForm()) {
      if (message) {
        message.className = "form-message error";
        message.textContent = "Please correct the highlighted fields.";
      }
      return;
    }

    const selectedRoom = findRoom(document.getElementById("roomSelect").value);
    const nights = calculateNights(
      document.getElementById("checkIn").value,
      document.getElementById("checkOut").value
    );
    const total = selectedRoom.price * nights;

    if (message) {
      message.className = "form-message success";
      message.textContent = `Reservation confirmed on the front end for ${selectedRoom.name}. Total: ${formatMoney(total)}.`;
    }
  });
}

function setupContactForm() {
  const contactForm = document.getElementById("contactForm");
  if (!contactForm) return;

  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const status = document.getElementById("contactMessageStatus");
    if (status) {
      status.className = "form-message success";
      status.textContent = "Thank you. Your message was prepared on the front end only.";
    }
    contactForm.reset();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderRoomsPage();
  setupReservationForm();
  setupContactForm();
});
