function goToRooms() {
    window.location.href = "rooms.html";
}

function calculate() {
    let price = 100;
    let nights = document.getElementById("nights").value;

    let total = price * nights;

    document.getElementById("result").innerHTML = "Total Price: $" + total;
}