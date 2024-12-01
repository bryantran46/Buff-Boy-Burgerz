import { getCartFromStorage, getFieldFromStorage } from "./storage.js";
import * as data from './data.js';

data.setCart(getCartFromStorage());
data.setSubtotal(getFieldFromStorage("subtotal"));
data.setDiscounts(getFieldFromStorage("discounts"));
data.setTip(getFieldFromStorage("tip"));
data.setTotal(getFieldFromStorage("total"));

for (const foodItem in data.cart) {
    createRow(foodItem);
}
renderTotal();

function createRow(itemId: string) {
    const foodItem = data.cart[itemId];
    const receiptTableBody = document.getElementById("receipt-table-body")!;

    const newRow = document.createElement("tr");
    newRow.setAttribute("data-id", itemId);
    newRow.innerHTML = `
        <td class="receipt-cell">
            <div class="item-container">
                <img src="${foodItem.image}" alt="${foodItem.name}" class="food-image">
                <div class="item-quantity">Quantity: ${foodItem.quantity}</div>
                <div class="item-name">${foodItem.name}</div>
                <div class="item-price">$${(foodItem.price * foodItem.quantity).toFixed(2)}</div>
            </div>
        </td>
    `;
    receiptTableBody.appendChild(newRow);
}

function renderTotal() {
    document.getElementById("subtotal-field")!.innerText = `$${data.getSubtotal().toFixed(2)}`;
    document.getElementById("discounts-field")!.innerText = `$${data.getDiscounts().toFixed(2)}`;
    document.getElementById("tip-field")!.innerText = `$${data.getTip().toFixed(2)}`;
    document.getElementById("total-field")!.innerText = `$${data.getTotal().toFixed(2)}`;
}

document.querySelector(".back-button")!.addEventListener("click", ()=> {
    window.location.href = "./menu.html";
});

// Show the popup and disable main content
document.getElementById("venmo-card")?.addEventListener("click", () => {
    document.getElementById("venmo-popup")!.classList.remove("hidden");
    document.querySelector(".main-screen")!.classList.add("disabled");
});

document.getElementById("zelle-card")?.addEventListener("click", () => {
    document.getElementById("zelle-popup")!.classList.remove("hidden");
    document.querySelector(".main-screen")!.classList.add("disabled");
});

document.getElementById("cash-card")?.addEventListener("click", () => {
    document.getElementById("cash-popup")!.classList.remove("hidden");
    document.querySelector(".main-screen")!.classList.add("disabled");
});

// Hide the popup and re-enable main content
document.querySelector("#venmo-popup button")?.addEventListener("click", () => {
    document.getElementById("venmo-popup")!.classList.add("hidden");
    document.querySelector(".main-screen")!.classList.remove("disabled");
});

document.querySelector("#zelle-popup button")?.addEventListener("click", () => {
    document.getElementById("zelle-popup")!.classList.add("hidden");
    document.querySelector(".main-screen")!.classList.remove("disabled");
});

document.querySelector("#cash-popup button")?.addEventListener("click", () => {
    document.getElementById("cash-popup")!.classList.add("hidden");
    document.querySelector(".main-screen")!.classList.remove("disabled");
});